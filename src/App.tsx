import React, { useState, useEffect } from "react";
import { API_BASE } from "./config";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import About from "./components/About";
import Contact from "./components/Contact";
import Admin from "./components/Admin";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, Terminal, CheckCircle, ArrowUp } from "lucide-react";

let isPageViewLoggedGlobal = false;

export default function App() {
  // Lighter theme is active by default to satisfy the developer design mandate!
  const [isDark, setIsDark] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<string>("home");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isBackendOffline, setIsBackendOffline] = useState<boolean>(false);

  // Secret admin entrance configurations
  const [showAdminPortal, setShowAdminPortal] = useState<boolean>(false);
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const [lastClickTime, setLastClickTime] = useState<number>(0);

  // Verify secret URL parameter (?admin=true) on initial load, and clear any previous session tokens to prevent persistence on refresh
  useEffect(() => {
    // Clear any leftover storage to prevent persistence across page refresh
    localStorage.removeItem("show_admin_portal");
    sessionStorage.removeItem("admin_token");

    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true" || params.get("manage") === "true" || params.get("secret") === "true") {
      setShowAdminPortal(true);
      // Strip secret query parameter from address bar dynamically
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  // Keyboard shortcut detector (Ctrl + Shift + A) as fallback trigger (transient state only)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setShowAdminPortal(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click gesture detector (Clicking the logo 5 times within 1.5 seconds) (transient state only)
  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 1500) {
      const clicks = logoClicks + 1;
      setLogoClicks(clicks);
      if (clicks >= 5) {
        setShowAdminPortal(prev => !prev);
        setLogoClicks(0);
      }
    } else {
      setLogoClicks(1);
    }
    setLastClickTime(now);
  };

  // Ping backend to determine online/offline status in real time
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(`${API_BASE}/api/health`, { 
          method: "GET",
          signal: controller.signal 
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          setIsBackendOffline(false);
        } else {
          setIsBackendOffline(true);
        }
      } catch (err) {
        setIsBackendOffline(true);
      }
    };

    // Initial check
    checkBackendHealth();

    // Check every 8 seconds
    const interval = setInterval(checkBackendHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  // Apply matching system css dark attribute class trigger
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  // Track scroll position to update progress bar percentage
  useEffect(() => {
    if (currentSection === "admin") {
      setScrollProgress(0);
      return;
    }

    const handleScrollProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScrollProgress);
    // Initial call to set state on mount
    handleScrollProgress();

    return () => window.removeEventListener("scroll", handleScrollProgress);
  }, [currentSection]);

  // Track scroll depth to show Scroll to Top button once scrolled past hero section
  useEffect(() => {
    const handleScrollTopButtonVisibility = () => {
      // Hero section height is roughly 500-600px on typical viewpoints, we'll use 450px as threshold
      if (window.scrollY > 450) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScrollTopButtonVisibility);
    handleScrollTopButtonVisibility();

    return () => window.removeEventListener("scroll", handleScrollTopButtonVisibility);
  }, []);

  // Log organic page-view event on secure backend database when main page first mounts
  useEffect(() => {
    if (isPageViewLoggedGlobal) return;
    isPageViewLoggedGlobal = true;

    const logPageView = async () => {
      try {
        await fetch(`${API_BASE}/api/analytics/view`, { method: "POST" });
      } catch (err) {
        console.warn("Analytics tracker network pause:", err);
      }
    };
    logPageView();
  }, []);

  // Track scroll activity to dynamically update navigation dot highlights in real-time
  useEffect(() => {
    if (currentSection === "admin") return;

    const sections = ["home", "projects", "experience", "about", "contact"];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for top header

      for (const sect of sections) {
        const el = document.getElementById(sect);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setCurrentSection(sect);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentSection]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentSection("home");
  };

  const handleTrackResumeDownload = async () => {
    try {
      await fetch(`${API_BASE}/api/resume/download`, { method: "POST" });
    } catch (err) {
      console.error("Resume tracker ping failed:", err);
    }
  };

  const marqueeKeywords = [
    "Available for Freelance Projects",
    "Full-Stack Web Architect",
    "LLM Prompt Engineer",
    "React.js & Node.js Developer",
    "Hire Me for Custom AI Integrations",
    "FastAPI & Python Systemic Code",
    "Open for Remote Work & Contracts",
    "HackWithAI National Finalist",
    "GEN-AI FORGE Hackathon 2nd Prize Winner",
    "MERN Stack Integration",
    "MongoDB Atlas & Express.js Datastores"
  ];

  return (
    <div className={`min-h-screen transition-colors duration-750 ease-in-out cursor-default ${
      isDark ? "text-neutral-100" : "text-neutral-900"
    }`}>
      
      {/* Dynamic Smooth Cross-Fade Background Layers */}
      <div className="fixed inset-0 -z-50 pointer-events-none">
        {/* Light Grid Background Layer */}
        <div 
          className={`absolute inset-0 bg-neutral-50/75 grid-bg-light transition-opacity duration-750 ease-in-out ${
            isDark ? "opacity-0" : "opacity-100"
          }`}
        />
        {/* Dark Grid Background Layer (Enhanced Rich Twilight Midnight Navy) */}
        <div 
          className={`absolute inset-0 bg-[#0b1121] grid-bg-dark transition-opacity duration-750 ease-in-out ${
            isDark ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      
      {/* Slim Scroll Progress Bar */}
      {currentSection !== "admin" && (
        <div 
          className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 z-[9999] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      )}
      
      {/* Dynamic Global Header Navigation */}
      <Navbar 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        currentSection={currentSection}
        setCurrentSection={(s) => {
          setCurrentSection(s);
          if (s !== "admin") {
            // Scroll to elements if needed
            setTimeout(() => {
              document.getElementById(s)?.scrollIntoView({ behavior: "smooth" });
            }, 60);
          }
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminClick={() => {
          if (currentSection === "admin") {
            setCurrentSection("home");
          } else {
            setCurrentSection("admin");
          }
        }}
        showAdminPortal={showAdminPortal}
        onLogoClick={handleLogoClick}
      />

      {/* Primary Orchestrator Stage viewport switcher */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {currentSection === "admin" && showAdminPortal ? (
            // Secure Admin View
            <motion.div
              key="admin-dashboard-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="pt-24 min-h-[90vh]"
            >
              <Admin 
                onBack={() => setCurrentSection("home")} 
                onLoginStateChange={(isLoggedIn) => setIsAdminLoggedIn(isLoggedIn)}
                isBackendOffline={isBackendOffline}
              />
            </motion.div>
          ) : (
            // Traditional Multi-Section Portfolio Stack View
            <motion.div
              key="portfolio-main-stack"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* 1. Hero / Intro View with floating card visual */}
              <Hero 
                onContactClick={() => {
                  setCurrentSection("contact");
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }} 
                onProjectsClick={() => {
                  setCurrentSection("projects");
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                trackDownload={handleTrackResumeDownload}
              />

              {/* 2. Seamless infinite scrolling marquee to catch visitor details */}
              <Marquee items={marqueeKeywords} direction="left" speed={30} />

              {/* 3. Projects Portfolio Showcase */}
              <Projects />

              {/* 4. Infinite reverse directions marquee to dynamically separate projects & experience */}
              <Marquee items={[...marqueeKeywords].reverse()} direction="right" speed={35} />

              {/* 5. Professional Experience Records */}
              <Experience />

              {/* 6. Skills, Portals & Academic Timelines */}
              <About />

              {/* 7. Contact Dispatch Portal */}
              <Contact />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Subtle Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && currentSection !== "admin" && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full border border-neutral-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/95 backdrop-blur-sm shadow-xl text-neutral-500 hover:text-orange-600 dark:text-slate-350 dark:hover:text-amber-450 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            title="Scroll back to top"
            id="scroll-to-top-btn"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Classic Clean Footer */}
      <footer className="py-12 border-t border-neutral-200/50 dark:border-slate-800 bg-white dark:bg-[#0b1121] font-mono text-2xs md:text-xs text-neutral-400 text-center select-none space-y-2">
        <p className="font-['Courier_New'] font-normal">© {new Date().getFullYear()} Vikas Kumar Velugubantla. All rights reserved.</p>
        <p className="opacity-80 text-[10px]">
          Engineered with React, Node Express, and Gemini Intelligence Core • Secured with RBAC Session Tokens
        </p>
      </footer>

    </div>
  );
}
