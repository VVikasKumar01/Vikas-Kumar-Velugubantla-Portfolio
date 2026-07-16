import express from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables. Prefer .env, fallback to .env.example
const envPath = fs.existsSync(path.join(process.cwd(), ".env")) 
  ? path.join(process.cwd(), ".env") 
  : path.join(process.cwd(), ".env.example");
dotenv.config({ path: envPath });

// Interface for db structure
interface DB {
  adminPasscode?: string;
  resumeDownloads: number;
  pageViews: number;
  contactSubmissions?: number;
  messages: Array<{
    id: string;
    name: string;
    email: string;
    message: string;
    timestamp: string;
    category?: string; // AI generated
    sentiment?: string; // AI generated
  }>;
  aiSettings?: {
    useGeminiForContact?: boolean;
  };
  events?: Array<{
    type: 'view' | 'download' | 'message';
    timestamp: string;
  }>;
}

const DB_FILE = path.join(process.cwd(), "db.json");

// In-memory local cache with starter baseline data
let dbInMemory: DB = {
  resumeDownloads: 0,
  pageViews: 0,
  messages: []
};

// Firestore connection initialization
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs, getDocFromServer } from "firebase/firestore";

let firestoreDb: any = null;

try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const firebaseApp = initializeApp(firebaseConfig);
    firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    console.log("[Firestore] Connection initialized successfully with ID:", firebaseConfig.firestoreDatabaseId);
    
    // Validate connection to Firestore immediately on boot using an allowed collection/doc
    (async () => {
      try {
        await getDocFromServer(doc(firestoreDb, 'analytics', 'metrics'));
        console.log("[Firestore] Connection validation check succeeded.");
      } catch (error: any) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("[Firestore] Validation error: the client is offline. Check Firebase configuration.");
        } else {
          console.log("[Firestore] Connected and authenticated successfully.");
        }
      }
    })();
  } else {
    console.warn("[Firestore] firebase-applet-config.json not found. Falling back to local db.json/in-memory.");
  }
} catch (e) {
  console.error("[Firestore] Initialization failed:", e);
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null
    },
    operationType,
    path
  };
  console.error("[Firestore Error]", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Background sync helpers
async function syncToFirestore() {
  if (!firestoreDb) return;
  try {
    await setDoc(doc(firestoreDb, "analytics", "metrics"), {
      pageViews: dbInMemory.pageViews,
      resumeDownloads: dbInMemory.resumeDownloads,
      events: dbInMemory.events || []
    });
    await setDoc(doc(firestoreDb, "settings", "admin"), {
      adminPasscode: getAdminPasscode(dbInMemory),
      aiSettings: dbInMemory.aiSettings || { useGeminiForContact: true }
    });
  } catch (err) {
    console.error("[Firestore] Error syncing state to Firestore:", err);
    try {
      handleFirestoreError(err, OperationType.WRITE, "analytics/metrics");
    } catch (_) {}
  }
}

async function syncMessagesToFirestore() {
  if (!firestoreDb) return;
  try {
    for (const msg of dbInMemory.messages) {
      await setDoc(doc(firestoreDb, "messages", msg.id), msg);
    }
  } catch (err) {
    console.error("[Firestore] Error syncing messages to Firestore:", err);
    try {
      handleFirestoreError(err, OperationType.WRITE, "messages");
    } catch (_) {}
  }
}

async function deleteMessageFromFirestore(id: string) {
  if (!firestoreDb) return;
  try {
    await deleteDoc(doc(firestoreDb, "messages", id));
  } catch (err) {
    console.error(`[Firestore] Error deleting message ${id}:`, err);
    try {
      handleFirestoreError(err, OperationType.DELETE, `messages/${id}`);
    } catch (_) {}
  }
}

// Helper to read database
function readDB(): DB {
  return dbInMemory;
}

// Helper to seed events historically if they are missing
function seedEventsIfNeeded(db: DB): DB {
  if (!db.events) {
    db.events = [];
  }
  return db;
}

// Helper to aggregate events into Daily, Weekly, Monthly, Yearly buckets
function getAnalysisData(events: Array<{ type: 'view' | 'download' | 'message'; timestamp: string }> = []) {
  const dailyMap: Record<string, { views: number; downloads: number; messages: number }> = {};
  const weeklyMap: Record<string, { views: number; downloads: number; messages: number }> = {};
  const monthlyMap: Record<string, { views: number; downloads: number; messages: number }> = {};
  const yearlyMap: Record<string, { views: number; downloads: number; messages: number }> = {};

  const now = new Date();

  // Helper to get week number string label, e.g., "W25 (Jun)" or "W4 (Jan)"
  const getWeekLabel = (d: Date) => {
    const oneJan = new Date(d.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((d.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((d.getDay() + 1 + numberOfDays) / 7);
    const monthShort = d.toLocaleString('en-US', { month: 'short' });
    return `W${weekNumber} (${monthShort})`;
  };

  // Helper to get Month label: "Jun 26"
  const getMonthLabel = (d: Date) => {
    return d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
  };

  // 1. Pre-initialize intervals to ensure empty slots are populated
  // Last 14 days
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split('T')[0]; // YYYY-MM-DD
    dailyMap[key] = { views: 0, downloads: 0, messages: 0 };
  }

  // Last 12 weeks
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const key = getWeekLabel(d);
    weeklyMap[key] = { views: 0, downloads: 0, messages: 0 };
  }

  // Last 12 months
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = getMonthLabel(d);
    monthlyMap[key] = { views: 0, downloads: 0, messages: 0 };
  }

  // Last 5 years
  for (let i = 4; i >= 0; i--) {
    const key = String(now.getFullYear() - i);
    yearlyMap[key] = { views: 0, downloads: 0, messages: 0 };
  }

  // 2. Populate from events
  events.forEach(event => {
    const d = new Date(event.timestamp);
    if (isNaN(d.getTime())) return;

    const type = event.type === 'view' ? 'views' : event.type === 'download' ? 'downloads' : event.type === 'message' ? 'messages' : null;
    if (!type) return;

    // Daily
    const dailyKey = d.toISOString().split('T')[0];
    if (dailyMap[dailyKey] !== undefined) {
      dailyMap[dailyKey][type]++;
    }

    // Weekly
    const weeklyKey = getWeekLabel(d);
    if (weeklyMap[weeklyKey] !== undefined) {
      weeklyMap[weeklyKey][type]++;
    }

    // Monthly
    const monthlyKey = getMonthLabel(d);
    if (monthlyMap[monthlyKey] !== undefined) {
      monthlyMap[monthlyKey][type]++;
    }

    // Yearly
    const yearlyKey = String(d.getFullYear());
    if (yearlyMap[yearlyKey] !== undefined) {
      yearlyMap[yearlyKey][type]++;
    }
  });

  // Convert map to ordered arrays for charting
  return {
    daily: Object.entries(dailyMap).map(([dateStr, stats]) => {
      const parts = dateStr.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return {
        label: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        ...stats
      };
    }),
    weekly: Object.entries(weeklyMap).map(([week, stats]) => ({
      label: week,
      ...stats
    })),
    monthly: Object.entries(monthlyMap).map(([month, stats]) => ({
      label: month,
      ...stats
    })),
    yearly: Object.entries(yearlyMap).map(([year, stats]) => ({
      label: year,
      ...stats
    }))
  };
}

// Helper to write database
function writeDB(data: DB) {
  dbInMemory = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local db.json backup:", err);
  }
  syncToFirestore();
  syncMessagesToFirestore();
}

// Boot synchronization sequence
async function bootSync() {
  console.log("[Boot Sync] Initializing database state...");
  
  // 1. Try reading from local db.json fallback first
  if (fs.existsSync(DB_FILE)) {
    try {
      dbInMemory = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      console.log("[Boot Sync] Loaded local db.json backup file.");
    } catch (e) {
      console.error("[Boot Sync] Failed to read local db.json:", e);
    }
  }

  // Seed events locally if not seeded yet
  dbInMemory = seedEventsIfNeeded(dbInMemory);

  if (!firestoreDb) {
    console.warn("[Boot Sync] Firestore is not connected. Relying on local backup.");
    return;
  }

  try {
    // 2. Fetch metrics
    const metricsDoc = await getDoc(doc(firestoreDb, "analytics", "metrics"));
    if (metricsDoc.exists()) {
      const data = metricsDoc.data();
      // If Firestore contains the old high baseline values, purge them to start real-time organic tracking
      if (data.pageViews >= 840 || data.resumeDownloads >= 140) {
        console.log("[Boot Sync] Purging temporary legacy analytics from Firestore...");
        dbInMemory.pageViews = 0;
        dbInMemory.resumeDownloads = 0;
        dbInMemory.events = [];
        await setDoc(doc(firestoreDb, "analytics", "metrics"), {
          pageViews: 0,
          resumeDownloads: 0,
          events: []
        });
      } else {
        dbInMemory.pageViews = data.pageViews ?? dbInMemory.pageViews;
        dbInMemory.resumeDownloads = data.resumeDownloads ?? dbInMemory.resumeDownloads;
        dbInMemory.events = data.events ?? dbInMemory.events;
      }
      console.log("[Boot Sync] Restored analytics and events from Firestore.");
    } else {
      console.log("[Boot Sync] Seeding analytics to Firestore...");
      await setDoc(doc(firestoreDb, "analytics", "metrics"), {
        pageViews: dbInMemory.pageViews,
        resumeDownloads: dbInMemory.resumeDownloads,
        events: dbInMemory.events || []
      });
    }

    // 3. Fetch settings
    const adminDoc = await getDoc(doc(firestoreDb, "settings", "admin"));
    if (adminDoc.exists()) {
      const data = adminDoc.data();
      dbInMemory.adminPasscode = data.adminPasscode ?? dbInMemory.adminPasscode;
      dbInMemory.aiSettings = data.aiSettings ?? dbInMemory.aiSettings;
      console.log("[Boot Sync] Restored configuration from Firestore.");
    } else {
      console.log("[Boot Sync] Seeding settings to Firestore...");
      await setDoc(doc(firestoreDb, "settings", "admin"), {
        adminPasscode: getAdminPasscode(dbInMemory),
        aiSettings: dbInMemory.aiSettings || { useGeminiForContact: true }
      });
    }

    // 4. Fetch messages
    const msgQuery = await getDocs(collection(firestoreDb, "messages"));
    if (!msgQuery.empty) {
      const msgs: any[] = [];
      for (const d of msgQuery.docs) {
        const msg = d.data();
        if (msg.id === "msg_init_1" || msg.id === "msg_init_2" || msg.id.startsWith("msg_init_") || msg.name === "HI") {
          console.log(`[Boot Sync] Purging temporary/test message ${msg.id} from Firestore...`);
          try {
            await deleteDoc(doc(firestoreDb, "messages", msg.id));
          } catch (e) {
            console.error(`Failed to delete temporary message ${msg.id}:`, e);
          }
        } else {
          msgs.push(msg);
        }
      }
      msgs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      dbInMemory.messages = msgs;
      console.log(`[Boot Sync] Restored ${msgs.length} messages from Firestore.`);
    } else {
      console.log("[Boot Sync] Seeding initial messages to Firestore...");
      for (const msg of dbInMemory.messages) {
        await setDoc(doc(firestoreDb, "messages", msg.id), msg);
      }
    }

    // Update local file backup to keep in sync
    fs.writeFileSync(DB_FILE, JSON.stringify(dbInMemory, null, 2), "utf-8");
  } catch (err) {
    console.error("[Boot Sync] Error syncing during boot, using local cache:", err);
  }
}

// Helper to resolve the correct admin passcode, avoiding common placeholder env values
function cleanEnvValue(val: string | undefined): string | undefined {
  if (!val) return val;
  let cleaned = val.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  } else if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
    cleaned = cleaned.slice(1, -1);
  }
  return cleaned.trim();
}

let generatedPasscodeCache: string | null = null;

function getAdminPasscode(db: DB): string {
  if (db.adminPasscode) {
    return db.adminPasscode;
  }
  const envPasscode = cleanEnvValue(process.env.ADMIN_PASSCODE);
  if (envPasscode && 
      envPasscode !== "MY_ADMIN_PASSCODE" && 
      envPasscode !== "YOUR_ADMIN_PASSCODE" && 
      envPasscode !== "ADMIN_PASSCODE" && 
      envPasscode !== "") {
    return envPasscode;
  }
  if (generatedPasscodeCache) {
    return generatedPasscodeCache;
  }
  generatedPasscodeCache = crypto.randomBytes(4).toString("hex");
  console.warn("\n============================================================");
  console.warn("[SECURITY WARNING] No secure ADMIN_PASSCODE environment variable set.");
  console.warn(`A secure, random temporary passcode has been generated: ${generatedPasscodeCache}`);
  console.warn("Please set ADMIN_PASSCODE in your environment variables for production.");
  console.warn("============================================================\n");
  
  db.adminPasscode = generatedPasscodeCache;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist dynamically generated passcode to db.json:", err);
  }
  
  return generatedPasscodeCache;
}

// Lazy init for Gemini API
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = cleanEnvValue(process.env.GEMINI_API_KEY);
    if (key && key !== "MY_GEMINI_API_KEY" && key !== "") {
      try {
        aiClient = new GoogleGenAI({ 
          apiKey: key,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      } catch (e) {
        console.error("Failed to initialize Gemini AI client:", e);
      }
    }
  }
  return aiClient;
}

// Session store for Admin UI
interface AdminSession {
  email: string;
  role: string;
  expiresAt: number;
}
const activeSessions = new Map<string, AdminSession>();

// Initialize database with default file if it doesn't exist, without overwriting Firestore on boot
if (!fs.existsSync(DB_FILE)) {
    dbInMemory = {
        resumeDownloads: 0,
        pageViews: 0,
        messages: []
    };
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(dbInMemory, null, 2), "utf-8");
    } catch (err) {
        console.error("Error creating initial local db.json backup:", err);
    }
}

// Helper to execute content generation with a list of models and exponential retries
async function generateContentWithFallback(client: any, prompt: string, config: any): Promise<string> {
  const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.5-pro"];
  let lastError: any = null;

  for (const model of models) {
    let attempts = 3;
    let delay = 1000;
    while (attempts > 0) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: prompt,
          config,
        });
        if (response && response.text) {
          return response.text;
        }
        throw new Error(`Empty response received from model ${model}`);
      } catch (err: any) {
        lastError = err;
        const status = err?.status || err?.statusCode || (err?.message && err.message.includes("503") ? 503 : null);
        const isTransient = status === 503 || status === 429 || (err?.message && (
          err.message.toLowerCase().includes("demand") || 
          err.message.toLowerCase().includes("temporary") || 
          err.message.toLowerCase().includes("rate limit") || 
          err.message.toLowerCase().includes("resource exhausted") ||
          err.message.toLowerCase().includes("unavailable")
        ));
        
        if (isTransient && attempts > 1) {
          attempts--;
          console.log(`Gemini API returned transient error (status: ${status}) for model ${model}. Retrying in ${delay}ms... (${attempts} attempts left)`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // exponential backoff
        } else {
          break; // break and try the next fallback model
        }
      }
    }
    console.log(`Fallback: Model ${model} is currently busy or unavailable. Trying next model...`);
  }
  throw lastError || new Error("All model fallback attempts exhausted");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Custom CORS middleware to allow cross-origin requests from Azure Static Web Apps (or anywhere in production)
  app.use((req, res, next) => {
    // Normalize double-slashes in URL paths
    if (req.url && req.url.includes("//")) {
      req.url = req.url.replace(/\/{2,}/g, "/");
    }
    
    const origin = req.headers.origin;
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    
    // Respond to preflight OPTIONS request instantly
    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.use(express.json());
  app.use(express.static(path.join(process.cwd(), "public")));

  // API Routes
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ success: true, status: "online", version: "4.0.0" });
  });

  // 1. Submit contact form and process with Gemini AI (server-side) if key available
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
         res.status(400).json({ error: "All fields are required" });
         return;
      }

      const db = readDB();

      // Implement Instant Local Heuristics Fallback First
      let category = "General Inquiry";
      let sentiment = "Neutral";

      const text = message.toLowerCase();
      
      // Simple heuristic cataloging
      if (text.includes("job") || text.includes("recruit") || text.includes("hire") || text.includes("interview") || text.includes("salary") || text.includes("position") || text.includes("vacancy") || text.includes("resume") || text.includes("cv")) {
        category = "Job Opportunity";
      } else if (text.includes("collab") || text.includes("partner") || text.includes("project") || text.includes("build") || text.includes("develop") || text.includes("freelance")) {
        category = "Collaboration";
      } else if (text.includes("spam") || text.includes("seo") || text.includes("invest") || text.includes("crypto") || text.includes("marketing") || text.includes("advertising")) {
        category = "Spam";
      } else if (text.includes("feedback") || text.includes("awesome") || text.includes("great") || text.includes("perfect") || text.includes("love") || text.includes("nice") || text.includes("excellent")) {
        category = "Feedback";
      }

      // Simple heuristic sentiment
      const positiveWords = ["love", "great", "excellent", "perfect", "good", "nice", "awesome", "hiring", "impressed", "wonderful", "amazing"];
      const negativeWords = ["bad", "worst", "hate", "terrible", "spam", "annoying", "rubbish", "crap", "scam", "broken"];
      
      let posCount = 0;
      let negCount = 0;
      positiveWords.forEach(w => { if (text.includes(w)) posCount++; });
      negativeWords.forEach(w => { if (text.includes(w)) negCount++; });

      if (posCount > negCount) {
        sentiment = "Positive";
      } else if (negCount > posCount) {
        sentiment = "Negative";
      }

      const newMessageId = "msg_" + crypto.randomUUID();
      const newMessage = {
        id: newMessageId,
        name,
        email,
        message,
        timestamp: new Date().toISOString(),
        category,
        sentiment
      };

      db.messages.unshift(newMessage);
      db.contactSubmissions = (db.contactSubmissions || 0) + 1; // Increment total contacts count
      if (!db.events) db.events = [];
      db.events.push({
        type: 'message',
        timestamp: newMessage.timestamp
      });
      writeDB(db);

      console.log(`Received contact form from ${name} (<${email}>) - Saved immediately with fallback heuristics.`);

      // Send immediate response so client gets instant success and never encounters timeouts!
      res.status(201).json({ 
        success: true, 
        message: "Message received successfully. Thank you!",
        data: newMessage 
      });

      // Run Gemini API in background without blocking the response
      const client = getAIClient();
      const shouldAIAnalyze = db.aiSettings?.useGeminiForContact !== false;
      
      if (client && shouldAIAnalyze) {
        // Fire-and-forget background analytics enrichment
        (async () => {
          try {
            console.log(`[Background AI] Starting analysis for message ${newMessageId}...`);
            const prompt = `Analyze the following message from a portfolio contact form. 
Categorize it into exactly one of: "Job Opportunity", "Collaboration", "General Inquiry", "Spam", or "Feedback".
Analyze the sentiment as: "Positive", "Neutral", or "Negative".
Provide the response strictly as valid JSON with keys "category" and "sentiment". 

Message:
From: "${name}" <${email}>
Content: "${message}"`;

            const responseText = await generateContentWithFallback(client, prompt, {
              responseMimeType: "application/json"
            });

            if (responseText) {
              const parsed = JSON.parse(responseText.trim());
              const updatedCategory = parsed.category || category;
              const updatedSentiment = parsed.sentiment || sentiment;

              // Read and update DB safely to avoid race conditions
              const freshDb = readDB();
              const targetMsg = freshDb.messages.find(m => m.id === newMessageId);
              if (targetMsg) {
                targetMsg.category = updatedCategory;
                targetMsg.sentiment = updatedSentiment;
                writeDB(freshDb);
                console.log(`[Background AI] Successfully enriched message ${newMessageId}: ${updatedCategory} (${updatedSentiment})`);
              }
            }
          } catch (bgError: any) {
            console.warn(`[Background AI] Analysis failed for message ${newMessageId} (Using heuristic backup). Detail:`, bgError?.message || bgError);
          }
        })();
      }
    } catch (e) {
      console.error("Error processing contact form:", e);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal server error occurred." });
      }
    }
  });

  // 2. Resume download tracker trigger
  app.post("/api/resume/download", (req, res) => {
    try {
      const db = readDB();
      db.resumeDownloads++;
      if (!db.events) db.events = [];
      db.events.push({
        type: 'download',
        timestamp: new Date().toISOString()
      });
      writeDB(db);
      res.json({ success: true, count: db.resumeDownloads });
    } catch (e) {
      res.status(500).json({ error: "Failed to increment download counter" });
    }
  });

  // 3. Page views tracker trigger
  app.post("/api/analytics/view", (req, res) => {
    try {
      const db = readDB();
      db.pageViews++;
      if (!db.events) db.events = [];
      db.events.push({
        type: 'view',
        timestamp: new Date().toISOString()
      });
      writeDB(db);
      res.json({ success: true, count: db.pageViews });
    } catch (e) {
      res.status(500).json({ error: "Failed to increment page view counter" });
    }
  });

  // 4. Admin login authentication
  app.post("/api/admin/login", (req, res) => {
    const { passcode } = req.body;
    
    const db = readDB();
    const CORRECT_PASSCODE = getAdminPasscode(db);
    
    if (passcode === CORRECT_PASSCODE) {
      const token = crypto.randomBytes(24).toString("hex");
      const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hour duration
      
      activeSessions.set(token, {
        email: "v.vikaskumar2005@gmail.com",
        role: "admin",
        expiresAt
      });
      
      res.json({ 
        success: true, 
        token, 
        user: { email: "v.vikaskumar2005@gmail.com", role: "admin" } 
      });
    } else {
      res.status(401).json({ success: false, error: "Invalid passcode. Access Denied." });
    }
  });

  // Server-side Middleware for Admin RBAC (Role-Based Access Control)
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
       res.status(401).json({ error: "Access Denied. Authorization token required." });
       return;
    }

    const token = authHeader.split(" ")[1];
    const session = activeSessions.get(token);

    if (!session) {
       res.status(401).json({ error: "Session expired or invalid. Please log in again." });
       return;
    }

    if (session.expiresAt < Date.now()) {
      activeSessions.delete(token);
       res.status(401).json({ error: "Session timed out." });
       return;
    }

    if (session.role !== "admin") {
       res.status(403).json({ error: "Permission Denied. Admin privileges required." });
       return;
    }

    // Pass valid session info down
    (req as any).userSession = session;
    next();
  };

  // Admin Change Passcode (protected)
  app.post("/api/admin/change-passcode", requireAdmin, (req, res) => {
    const { currentPasscode, newPasscode } = req.body;
    
    if (!currentPasscode || !newPasscode) {
       res.status(400).json({ error: "Current and new passcodes are required." });
       return;
    }
    
    if (newPasscode.length < 4) {
       res.status(400).json({ error: "Passcode must be at least 4 characters long." });
       return;
    }

    const db = readDB();
    const CORRECT_PASSCODE = getAdminPasscode(db);

    if (currentPasscode !== CORRECT_PASSCODE) {
       res.status(401).json({ error: "Current passcode is incorrect." });
       return;
    }

    db.adminPasscode = newPasscode;
    writeDB(db);
    res.json({ success: true, message: "Passcode updated successfully." });
  });

  // 5. Admin analytics fetch (protected)
  app.get("/api/admin/analytics", requireAdmin, (req, res) => {
    const db = readDB();
    const analysis = getAnalysisData(db.events || []);
    res.json({
      success: true,
      data: {
        resumeDownloads: db.resumeDownloads,
        pageViews: db.pageViews,
        messageCount: db.messages.length,
        aiSettings: db.aiSettings || { useGeminiForContact: true },
        analysis
      }
    });
  });

  // 10. Admin modify system settings (protected)
  app.post("/api/admin/settings", requireAdmin, (req, res) => {
    const { useGeminiForContact } = req.body;
    const db = readDB();
    db.aiSettings = {
      ...(db.aiSettings || {}),
      useGeminiForContact: useGeminiForContact === undefined ? true : !!useGeminiForContact
    };
    writeDB(db);
    res.json({ success: true, aiSettings: db.aiSettings });
  });

  // 6. Admin message history fetch (protected)
  app.get("/api/admin/messages", requireAdmin, (req, res) => {
    const db = readDB();
    res.json({
      success: true,
      data: db.messages
    });
  });

  // 7. Admin delete message endpoint (protected)
  app.delete("/api/admin/messages/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.messages.findIndex(m => m.id === id);
    if (index !== -1) {
      db.messages.splice(index, 1);
      writeDB(db);
      deleteMessageFromFirestore(id);
      res.json({ success: true, message: "Message deleted successfully" });
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  });

  // 8. Admin reset analytics (protected)
  app.post("/api/admin/analytics/reset", requireAdmin, (req, res) => {
    const db = readDB();
    db.resumeDownloads = 0;
    db.pageViews = 0;
    writeDB(db);
    res.json({ success: true, message: "Analytics counts reset to zero" });
  });

  // 9. Admin logout
  app.post("/api/admin/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      activeSessions.delete(token);
    }
    res.json({ success: true, message: "Logged out successfully" });
  });

  // Vite middleware setup or production static file handler
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Fallback static files serving if the frontend requests assets with a subfolder path prefix
    app.use("/Vikas-Kumar-Velugubantla-Portfolio", express.static(distPath));
    
    // Serve index.html for base-prefix SPA route requests
    app.get("/Vikas-Kumar-Velugubantla-Portfolio*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on port ${PORT}...`);
    console.log(`Listening on http://0.0.0.0:${PORT}`);
    // Run bootSync sequence to populate local cache from Firestore in the background
    bootSync();
  });
}

startServer();
