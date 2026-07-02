import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, Lock, ArrowLeft, RefreshCw, BarChart2, MessageSquare, 
  Trash2, LogOut, CheckCircle, Smartphone, Download, Eye, Calendar, Sparkles, AlertTriangle
} from "lucide-react";
import { motion } from "motion/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  category?: string;
  sentiment?: string;
}

interface Analytics {
  resumeDownloads: number;
  pageViews: number;
  messageCount: number;
  analysis?: {
    daily: Array<{ label: string; views: number; downloads: number; messages: number }>;
    weekly: Array<{ label: string; views: number; downloads: number; messages: number }>;
    monthly: Array<{ label: string; views: number; downloads: number; messages: number }>;
    yearly: Array<{ label: string; views: number; downloads: number; messages: number }>;
  };
}

interface AdminProps {
  onBack: () => void;
  onLoginStateChange: (isLoggedIn: boolean) => void;
  isBackendOffline?: boolean;
}

const StatCardSkeleton = () => (
  <div className="p-6 rounded-2xl border border-neutral-200/60 dark:border-slate-800 bg-white dark:bg-neutral-950/40 space-y-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-3 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
      <div className="h-4 w-4 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
    </div>
    <div className="h-10 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg mt-1" />
    <div className="h-3.5 w-40 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
  </div>
);

const CategoryCardSkeleton = () => (
  <div className="p-3.5 rounded-xl border-2 border-dashed border-neutral-200/60 dark:border-slate-800 bg-white dark:bg-neutral-950/40 flex flex-col justify-between h-20 animate-pulse">
    <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
    <div className="h-6 w-10 bg-neutral-200 dark:bg-neutral-800 rounded-md mt-2" />
  </div>
);

const MessageCardSkeleton = () => (
  <div className="p-5 sm:p-6 rounded-2xl border border-neutral-200 dark:border-slate-800 bg-white dark:bg-neutral-950/40 space-y-4 animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-neutral-100 dark:border-neutral-900 pb-3">
      <div className="space-y-2">
        <div className="h-4 w-36 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
        <div className="h-3 w-52 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
      </div>
      <div className="h-5 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-800 rounded-md" />
      <div className="h-3 w-[92%] bg-neutral-200 dark:bg-neutral-800 rounded-md" />
      <div className="h-3 w-[80%] bg-neutral-200 dark:bg-neutral-800 rounded-md" />
    </div>
    <div className="flex items-center justify-between pt-2">
      <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
      <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
    </div>
  </div>
);

export default function Admin({ onBack, onLoginStateChange, isBackendOffline = false }: AdminProps) {
  const [passcode, setPasscode] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics>({ resumeDownloads: 0, pageViews: 0, messageCount: 0 });
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'messages'>('stats');
  const [analysisPeriod, setAnalysisPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [msgFilter, setMsgFilter] = useState<'All' | 'Job Opportunity' | 'Collaboration' | 'General Inquiry' | 'Feedback' | 'Spam' | 'Achievement'>('All');
  const [aiSettings, setAiSettings] = useState<{ useGeminiForContact: boolean }>({ useGeminiForContact: true });

  // Passcode change states
  const [currentPasscode, setCurrentPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmNewPasscode, setConfirmNewPasscode] = useState("");
  const [passcodeSuccess, setPasscodeSuccess] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [passcodeLoading, setPasscodeLoading] = useState(false);

  // Action confirmation states
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Load session from dynamic local storage on mount
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      setLoggedIn(true);
      onLoginStateChange(true);
      loadDashboardData(token);
    }
  }, []);

  // Real-time dynamic messages retrieval poller
  useEffect(() => {
    if (!loggedIn) return;
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;

    // Polling every 15 seconds to sync incoming submissions immediately
    const interval = setInterval(() => {
      loadDashboardData(token, true);
    }, 15000);

    return () => clearInterval(interval);
  }, [loggedIn]);

  const loadDashboardData = async (token: string, silent = false) => {
    if (!silent) setLoading(true);
    try {
      // 1. Fetch Analytics
      const r1 = await fetch("/api/admin/analytics", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const d1 = await r1.json();
      
      // 2. Fetch Messages
      const r2 = await fetch("/api/admin/messages", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const d2 = await r2.json();

      if (r1.ok && d1.success && d1.data) {
        setAnalytics(d1.data);
        if (d1.data.aiSettings) {
          setAiSettings(d1.data.aiSettings);
        }
      }
      if (r2.ok && d2.success && d2.data) {
        setMessages(d2.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleToggleGeminiSetting = async () => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;

    const newValue = !aiSettings.useGeminiForContact;
    
    // Optimistic update
    setAiSettings({ useGeminiForContact: newValue });

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ useGeminiForContact: newValue })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        // Revert on failure
        setAiSettings({ useGeminiForContact: !newValue });
        setNotification({ message: "Failed to update AI settings on server.", type: "error" });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      console.error("Failed to update AI setting:", err);
      // Revert on failure
      setAiSettings({ useGeminiForContact: !newValue });
    }
  };

  const handleChangePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError("");
    setPasscodeSuccess("");

    if (!currentPasscode || !newPasscode || !confirmNewPasscode) {
      setPasscodeError("All passcode fields are required.");
      return;
    }

    if (newPasscode !== confirmNewPasscode) {
      setPasscodeError("New passcodes do not match.");
      return;
    }

    if (newPasscode.length < 4) {
      setPasscodeError("New passcode must be at least 4 characters long.");
      return;
    }

    const token = sessionStorage.getItem("admin_token");
    if (!token) {
      setPasscodeError("Authentication session not found.");
      return;
    }

    setPasscodeLoading(true);
    try {
      const response = await fetch("/api/admin/change-passcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPasscode, newPasscode })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setPasscodeSuccess("Passcode updated successfully!");
        setCurrentPasscode("");
        setNewPasscode("");
        setConfirmNewPasscode("");
        
        // Clear success message after 4s
        setTimeout(() => {
          setPasscodeSuccess("");
        }, 4000);
      } else {
        setPasscodeError(data.error || "Failed to update passcode.");
      }
    } catch (err) {
      console.error("Change passcode error:", err);
      setPasscodeError("Failed to communicate with security server.");
    } finally {
      setPasscodeLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode })
      });
      const data = await response.json();

      if (response.ok && data.success && data.token) {
        sessionStorage.setItem("admin_token", data.token);
        setLoggedIn(true);
        onLoginStateChange(true);
        setPasscode("");
        await loadDashboardData(data.token);
      } else {
        setError(data.error || "Invalid credentials. Attempt rejected.");
      }
    } catch (err) {
      console.error("Login connection error:", err);
      setError("Cannot talk to server. Double-check backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      try {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Logout request failure:", err);
      }
    }
    sessionStorage.removeItem("admin_token");
    setLoggedIn(false);
    onLoginStateChange(false);
    setMessages([]);
    setAnalytics({ resumeDownloads: 0, pageViews: 0, messageCount: 0 });
  };

  const handleDeleteMessage = (id: string) => {
    setDeletingMessageId(id);
  };

  const executeDeleteMessage = async (id: string) => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Optimistically remove from list
        setMessages(prev => prev.filter(m => m.id !== id));
        // Reload analytics summary
        loadDashboardData(token);
        setDeletingMessageId(null);
        setNotification({ message: "Message purged successfully.", type: "success" });
        setTimeout(() => setNotification(null), 4000);
      } else {
        setNotification({ message: data.error || "Failed to delete message", type: "error" });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      console.error("Delete call aborted:", err);
      setNotification({ message: "Failed to communicate with security server.", type: "error" });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleResetAnalytics = async () => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;

    try {
      const res = await fetch("/api/admin/analytics/reset", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        loadDashboardData(token);
        setShowResetConfirm(false);
        setNotification({ message: "Analytical baselines reset successfully.", type: "success" });
        setTimeout(() => setNotification(null), 4000);
      } else {
        setNotification({ message: "Failed to reset analytical counts.", type: "error" });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      console.error("Reset metrics failed:", err);
      setNotification({ message: "Failed to communicate with security server.", type: "error" });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Filter messages based on search criteria
  const filteredMessages = messages.filter(msg => {
    if (msgFilter === 'All') return true;
    return msg.category === msgFilter;
  });

  return (
    <div className="min-h-[85vh] py-12 px-4 max-w-4xl mx-auto flex flex-col justify-center">
      {!loggedIn ? (
        // Access Protection Login Form
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto p-8 sm:p-10 rounded-3xl border border-neutral-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl text-center space-y-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/15 bg-amber-500/5 text-amber-650 dark:text-amber-400 font-sans text-[10px] font-bold uppercase tracking-[0.2em] mx-auto shadow-xs">
            <Lock className="w-3.5 h-3.5" /> SECURITY GATEWAY
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-display">
              Admin Access Chamber
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans leading-relaxed">
              This terminal is safeguarded with role-based restrictions. Enter the passcode to authenticate.
            </p>
          </div>

          {isBackendOffline && (
            <div className="p-3 text-xs text-rose-600 dark:text-rose-400 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/15 dark:border-rose-500/25 rounded-xl flex items-center justify-center gap-2 font-sans font-medium animate-pulse">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>Security Gateway Offline. Reconnecting...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-sans font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.18em] block">
                Passcode Credentials
              </label>
              <input
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder={isBackendOffline ? "Server Offline..." : "••••••••"}
                required
                disabled={isBackendOffline || loading}
                className={`w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-800 bg-neutral-50 dark:bg-slate-900/70 focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm font-mono text-center dark:text-white ${
                  isBackendOffline ? "opacity-50 cursor-not-allowed border-rose-500/20" : ""
                }`}
                id="admin-passcode-input"
              />
            </div>

            {error && (
              <div className="p-3 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center gap-2 font-sans font-medium">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 animate-bounce" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
              >
                Back Home
              </button>
              <button
                type="submit"
                disabled={loading || isBackendOffline}
                className="flex-1 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-850 dark:bg-white dark:hover:bg-neutral-50 text-white dark:text-neutral-950 font-sans text-[10px] font-bold uppercase tracking-[0.15em] transition-all cursor-pointer disabled:opacity-50"
                id="admin-login-submit"
              >
                {isBackendOffline ? "Connection Lost" : loading ? "Decrypting..." : "Access Console"}
              </button>
            </div>
          </form>

          <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 pt-3 border-t border-neutral-100 dark:border-neutral-900/60 uppercase tracking-widest leading-relaxed">
            Authorized admin credentials check: Vikas Kumar • Sec_API_V3
          </p>
        </motion.div>
      ) : (
        // Authenticated Dashboard Layout
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Header Dashboard HUD */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800/80">
            <div className="space-y-2.5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-bold font-sans uppercase tracking-[0.18em] shadow-xs ${
                  isBackendOffline 
                    ? "border-rose-500/15 bg-rose-500/5 text-rose-600 dark:text-rose-400 animate-pulse animate-duration-1000" 
                    : "border-emerald-500/10 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isBackendOffline ? "bg-rose-500 animate-ping" : "bg-emerald-500 animate-pulse"}`} /> 
                  {isBackendOffline ? "Secure Connection Offline" : "Secure Connection Active"}
                </div>
                {loading && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/10 bg-amber-500/5 text-[9px] font-bold font-sans uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400 shadow-xs">
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-500" /> Syncing...
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-display">
                Admin Console
              </h2>
              <p className="h-[48px] text-[16px] not-italic font-normal no-underline font-mono leading-[24px] text-left text-neutral-400 dark:text-neutral-500 uppercase tracking-tight flex items-center">
                OPERATOR: v.vikaskumar2005@gmail.com • ROOT_OWNER
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => loadDashboardData(sessionStorage.getItem("admin_token") || "")}
                className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-650 dark:text-neutral-300 transition-all flex items-center gap-1.5 text-[9px] font-sans font-bold uppercase tracking-[0.15em] cursor-pointer"
                title="Refresh metrics panel"
              >
                <RefreshCw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Reload</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl border border-rose-500/15 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 transition-all flex items-center gap-1.5 text-[9px] font-sans font-bold uppercase tracking-[0.15em] cursor-pointer"
                title="Revoke session tokens"
                id="admin-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" /> <span>Sign Out</span>
              </button>
            </div>
          </div>

          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-xl border text-xs font-sans font-medium flex items-center gap-2 ${
                notification.type === "success" 
                  ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-600 dark:text-emerald-400" 
                  : "bg-rose-500/5 border-rose-500/15 text-rose-500"
              }`}
            >
              {notification.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <ShieldAlert className="w-4 h-4 flex-shrink-0" />}
              <span>{notification.message}</span>
            </motion.div>
          )}

          {/* Quick HUD Navigation tabs */}
          <div className="flex border-b border-neutral-100 dark:border-neutral-900/60 font-sans">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-3 border-b-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'stats' 
                  ? "border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold" 
                  : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" /> Real-time Analytics
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-3 border-b-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] transition-all flex items-center gap-2 cursor-pointer relative ${
                activeTab === 'messages' 
                  ? "border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold" 
                  : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Message History
              {messages.length > 0 && (
                <span className="absolute top-1.5 -right-1 px-1.5 py-0.2 rounded bg-orange-600 text-white text-[9px] font-bold tracking-tight">
                  {messages.length}
                </span>
              )}
            </button>
          </div>

          <div className="space-y-6">
              
              {/* TAB 1: Real-time Analytics */}
              {activeTab === 'stats' && (
                <div className="space-y-6 text-left animate-fadeIn">
                  {loading ? (
                    <div className="space-y-6">
                      {/* Big stats grid skeleton */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                      </div>

                      {/* Message Categories Distribution report skeleton */}
                      <div className="p-6 rounded-2xl border border-neutral-150 dark:border-slate-800 bg-white/20 dark:bg-neutral-900/10 space-y-4">
                        <div className="h-3.5 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          <CategoryCardSkeleton />
                          <CategoryCardSkeleton />
                          <CategoryCardSkeleton />
                          <CategoryCardSkeleton />
                          <CategoryCardSkeleton />
                        </div>
                      </div>

                      {/* AI settings panel skeleton */}
                      <div className="p-5 sm:p-6 rounded-2xl border border-neutral-200/60 dark:border-slate-800 bg-white dark:bg-neutral-950/40 space-y-3 animate-pulse">
                        <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-800 rounded" />
                        <div className="h-3.5 w-72 bg-neutral-200 dark:bg-neutral-800 rounded" />
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Big stats grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Page Views metrics */}
                    <div className="p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-2 hover:border-amber-500/20 transition-all shadow-sm">
                      <div className="flex items-center justify-between text-neutral-400 dark:text-neutral-500">
                        <span className="text-[9px] font-sans font-extrabold tracking-[0.16em] uppercase">Total Page Visits</span>
                        <Eye className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-white font-sans tracking-tight leading-none">
                        {analytics.pageViews}
                      </p>
                      <p className="text-[10px] font-sans text-neutral-400 dark:text-neutral-500 leading-normal">Tracked organically on view mount</p>
                    </div>

                    {/* Resume download tracker */}
                    <div className="p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-2 hover:border-amber-500/20 transition-all shadow-sm">
                      <div className="flex items-center justify-between text-neutral-400 dark:text-neutral-500">
                        <span className="text-[9px] font-sans font-extrabold tracking-[0.16em] uppercase">Resume Downloads</span>
                        <Download className="w-4 h-4 text-amber-500" />
                      </div>
                      <p className="text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-white font-sans tracking-tight leading-none">
                        {analytics.resumeDownloads}
                      </p>
                      <p className="text-[10px] font-sans text-neutral-400 dark:text-neutral-500 leading-normal">Log download interaction triggers</p>
                    </div>

                    {/* Message counter */}
                    <div className="p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-2 hover:border-amber-500/20 transition-all shadow-sm">
                      <div className="flex items-center justify-between text-neutral-400 dark:text-neutral-500">
                        <span className="text-[9px] font-sans font-extrabold tracking-[0.16em] uppercase">Messages Logged</span>
                        <MessageSquare className="w-4 h-4 text-indigo-500" />
                      </div>
                      <p className="text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-white font-sans tracking-tight leading-none">
                        {messages.length}
                      </p>
                      <p className="text-[10px] font-sans text-neutral-400 dark:text-neutral-500 leading-normal">Processed & categorized dynamically</p>
                    </div>

                  </div>

                  {/* Historical Performance Analysis Chart */}
                  <div className="p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-6 shadow-sm text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-sans font-extrabold uppercase tracking-[0.15em] text-neutral-900 dark:text-white flex items-center gap-1.5 leading-none">
                          <BarChart2 className="w-4 h-4 text-amber-500" /> Historical Performance Analysis
                        </h4>
                        <p className="text-xs font-sans text-neutral-500 dark:text-neutral-450 leading-relaxed pt-0.5">
                          Analyze page visits, resume downloads, and message trends.
                        </p>
                      </div>

                      {/* Segment Selectors (Chart Type + Period) */}
                      <div className="flex flex-col sm:flex-row gap-2.5 self-start sm:self-auto shrink-0 font-sans text-xs">
                        {/* Chart Style Selector */}
                        <div className="flex p-0.5 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200/40 dark:border-neutral-800/60">
                          {(['area', 'bar'] as const).map((type) => (
                            <button
                              key={type}
                              onClick={() => setChartType(type)}
                              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer capitalize ${
                                chartType === type
                                  ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs font-semibold"
                                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-850 dark:hover:text-neutral-200"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>

                        {/* Period Selector */}
                        <div className="flex p-0.5 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200/40 dark:border-neutral-800/60">
                          {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((period) => (
                            <button
                              key={period}
                              onClick={() => setAnalysisPeriod(period)}
                              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer capitalize ${
                                analysisPeriod === period
                                  ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs font-semibold"
                                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-850 dark:hover:text-neutral-200"
                              }`}
                            >
                              {period}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Chart Container */}
                    <div className="h-72 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'area' ? (
                          <AreaChart
                            data={analytics.analysis ? analytics.analysis[analysisPeriod] : []}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-neutral-100 dark:text-neutral-900" />
                            <XAxis 
                              dataKey="label" 
                              stroke="currentColor" 
                              className="text-neutral-400 dark:text-neutral-500 text-[10px] font-mono"
                              tickLine={false}
                            />
                            <YAxis 
                              stroke="currentColor" 
                              className="text-neutral-400 dark:text-neutral-500 text-[10px] font-mono"
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg space-y-1.5 font-sans">
                                      <p className="text-[10px] font-mono font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-wider">{label}</p>
                                      <div className="space-y-1 text-xs">
                                        <div className="flex items-center justify-between gap-8">
                                          <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Page Visits
                                          </span>
                                          <span className="font-mono font-bold text-neutral-950 dark:text-white">{payload[0]?.value}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-8">
                                          <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Downloads
                                          </span>
                                          <span className="font-mono font-bold text-neutral-950 dark:text-white">{payload[1]?.value}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-8">
                                          <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Messages
                                          </span>
                                          <span className="font-mono font-bold text-neutral-950 dark:text-white">{payload[2]?.value}</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Legend 
                              verticalAlign="top" 
                              height={36} 
                              iconType="circle"
                              iconSize={8}
                              wrapperStyle={{ fontSize: '11px', fontFamily: 'Inter, sans-serif' }}
                            />
                            <Area 
                              type="monotone" 
                              name="Page Visits" 
                              dataKey="views" 
                              stroke="#10b981" 
                              strokeWidth={2} 
                              fillOpacity={1} 
                              fill="url(#colorViews)" 
                            />
                            <Area 
                              type="monotone" 
                              name="Resume Downloads" 
                              dataKey="downloads" 
                              stroke="#f59e0b" 
                              strokeWidth={2} 
                              fillOpacity={1} 
                              fill="url(#colorDownloads)" 
                            />
                            <Area 
                              type="monotone" 
                              name="Messages Logged" 
                              dataKey="messages" 
                              stroke="#6366f1" 
                              strokeWidth={2} 
                              fillOpacity={1} 
                              fill="url(#colorMessages)" 
                            />
                          </AreaChart>
                        ) : (
                          <BarChart
                            data={analytics.analysis ? analytics.analysis[analysisPeriod] : []}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-neutral-100 dark:text-neutral-900" />
                            <XAxis 
                              dataKey="label" 
                              stroke="currentColor" 
                              className="text-neutral-400 dark:text-neutral-500 text-[10px] font-mono"
                              tickLine={false}
                            />
                            <YAxis 
                              stroke="currentColor" 
                              className="text-neutral-400 dark:text-neutral-500 text-[10px] font-mono"
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg space-y-1.5 font-sans">
                                      <p className="text-[10px] font-mono font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-wider">{label}</p>
                                      <div className="space-y-1 text-xs">
                                        <div className="flex items-center justify-between gap-8">
                                          <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Page Visits
                                          </span>
                                          <span className="font-mono font-bold text-neutral-950 dark:text-white">{payload[0]?.value}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-8">
                                          <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Downloads
                                          </span>
                                          <span className="font-mono font-bold text-neutral-950 dark:text-white">{payload[1]?.value}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-8">
                                          <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Messages
                                          </span>
                                          <span className="font-mono font-bold text-neutral-950 dark:text-white">{payload[2]?.value}</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Legend 
                              verticalAlign="top" 
                              height={36} 
                              iconType="circle"
                              iconSize={8}
                              wrapperStyle={{ fontSize: '11px', fontFamily: 'Inter, sans-serif' }}
                            />
                            <Bar 
                              name="Page Visits" 
                              dataKey="views" 
                              fill="#10b981" 
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar 
                              name="Resume Downloads" 
                              dataKey="downloads" 
                              fill="#f59e0b" 
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar 
                              name="Messages Logged" 
                              dataKey="messages" 
                              fill="#6366f1" 
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Message Categories Distribution report on stats */}
                  <div className="p-6 rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/10 space-y-4">
                    <h4 className="text-[9px] font-sans font-bold tracking-[0.18em] uppercase text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5 leading-none">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Deep Learning AI Categories Insight
                    </h4>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {['Job Opportunity', 'Collaboration', 'General Inquiry', 'Feedback', 'Spam'].map(category => {
                        const count = messages.filter(m => m.category === category).length;
                        return (
                          <div key={category} className="p-3.5 rounded-xl border-2 border-[groove] border-neutral-205 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col justify-between">
                            <span className="text-[9px] font-sans font-bold tracking-wider text-neutral-450 dark:text-neutral-400 uppercase leading-normal">
                              {category}
                            </span>
                            <span className="text-xl font-bold font-sans text-neutral-950 dark:text-white mt-1">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* AI & Automation System Settings */}
                  <div className="p-5 sm:p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm text-left">
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-sans font-extrabold uppercase tracking-[0.15em] text-neutral-900 dark:text-white flex items-center gap-1.5 leading-none">
                        <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> AI Message Enrichment
                      </h4>
                      <p className="text-xs font-sans text-neutral-500 dark:text-neutral-450 max-w-lg leading-relaxed pt-0.5">
                        Process new submissions in the background with Gemini AI to generate insights. Failsafe asynchronous processing ensures 100% reliable contact forms regardless of API congestion.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto shrink-0 select-none">
                      <span className="text-[9px] font-sans font-bold uppercase tracking-[0.15em] text-neutral-450 dark:text-neutral-400">
                        {aiSettings.useGeminiForContact ? "Active Intel" : "Local Heuristics Only"}
                      </span>
                      <button
                        type="button"
                        onClick={handleToggleGeminiSetting}
                        className={`w-11 h-6 rounded-full p-1 transition-colors relative cursor-pointer outline-none focus:ring-1 focus:ring-amber-500/50 ${
                          aiSettings.useGeminiForContact ? "bg-amber-500 animate-pulse" : "bg-neutral-200 dark:bg-neutral-800"
                        }`}
                        aria-label="Toggle Gemini AI Analysis"
                        id="toggle-ai-enrichment"
                      >
                        <motion.div
                          layout
                          className="w-4 h-4 rounded-full bg-white shadow-xs"
                          animate={{ x: aiSettings.useGeminiForContact ? 20 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Admin Passcode Security */}
                  <div className="p-5 sm:p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4 shadow-sm text-left">
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-sans font-extrabold uppercase tracking-[0.15em] text-neutral-900 dark:text-white flex items-center gap-1.5 leading-none">
                        <Lock className="w-4 h-4 text-amber-500" /> Admin Passcode Security
                      </h4>
                      <p className="text-xs font-sans text-neutral-500 dark:text-neutral-455 leading-relaxed pt-0.5">
                        Change the admin entry passcode. Choose a strong, memorable combination to safeguard access to your analytics dashboard and messages.
                      </p>
                    </div>

                    <form onSubmit={handleChangePasscode} className="space-y-3 max-w-md pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-sans font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-wider block">
                            Current Passcode
                          </label>
                          <input
                            type="password"
                            value={currentPasscode}
                            onChange={e => setCurrentPasscode(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-slate-800 bg-neutral-50/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-xs font-mono dark:text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-sans font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-wider block">
                            New Passcode
                          </label>
                          <input
                            type="password"
                            value={newPasscode}
                            onChange={e => setNewPasscode(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-slate-800 bg-neutral-50/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-xs font-mono dark:text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-sans font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-wider block">
                            Confirm New
                          </label>
                          <input
                            type="password"
                            value={confirmNewPasscode}
                            onChange={e => setConfirmNewPasscode(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-slate-800 bg-neutral-50/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-xs font-mono dark:text-white"
                          />
                        </div>
                      </div>

                      {passcodeError && (
                        <div className="text-[11px] text-rose-500 bg-rose-500/5 border border-rose-500/10 rounded-lg p-2.5 flex items-center gap-1.5 font-medium">
                          <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{passcodeError}</span>
                        </div>
                      )}

                      {passcodeSuccess && (
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2.5 flex items-center gap-1.5 font-medium">
                          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 animate-bounce" />
                          <span>{passcodeSuccess}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={passcodeLoading}
                        className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 rounded-lg text-[9px] font-sans tracking-[0.15em] uppercase font-bold cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {passcodeLoading ? "Updating..." : "Update Passcode"}
                      </button>
                    </form>
                  </div>

                  {/* Reset/Maintenance Actions */}
                  <div className="p-5 sm:p-6 rounded-2xl border border-orange-500/10 bg-orange-500/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-sans font-extrabold uppercase tracking-[0.15em] text-neutral-900 dark:text-white flex items-center gap-1.5 leading-none">
                        <AlertTriangle className="w-4 h-4 text-orange-500" /> Clean Analytical Baselines
                      </h4>
                      <p className="text-xs font-sans text-neutral-455 dark:text-neutral-400 leading-normal pt-0.5">
                        Reset resume and view counts for new periods or tracking sprints. Message database remains safe.
                      </p>
                    </div>

                    {showResetConfirm ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-orange-650 dark:text-orange-400 font-sans font-medium">Are you sure?</span>
                        <button
                          onClick={handleResetAnalytics}
                          className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[9px] font-sans font-bold uppercase cursor-pointer transition-all shadow-xs"
                        >
                          Yes, Reset
                        </button>
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-[9px] font-sans font-bold uppercase cursor-pointer transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="px-4 py-2.5 border border-orange-500/30 hover:border-orange-500/50 bg-orange-500/5 hover:bg-orange-500/10 text-orange-650 dark:text-orange-400 rounded-lg text-[9px] font-sans tracking-[0.15em] uppercase font-bold cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
                      >
                        Reset Counters
                      </button>
                    )}
                  </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 2: Message History Log */}
              {activeTab === 'messages' && (
                <div className="space-y-6 text-left animate-fadeIn">
                  {loading ? (
                    <div className="space-y-6">
                      {/* Horizontal filter skeleton */}
                      <div className="flex flex-wrap items-center gap-1.5 pb-2 animate-pulse">
                        <div className="h-7 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                        <div className="h-7 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                        <div className="h-7 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                        <div className="h-7 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                      </div>

                      {/* Log stream skeletons */}
                      <div className="space-y-4">
                        <MessageCardSkeleton />
                        <MessageCardSkeleton />
                        <MessageCardSkeleton />
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Horizontal Categories Filter */}
                      <div className="flex flex-wrap items-center gap-1.5 pb-2 font-sans">
                    {['All', 'Job Opportunity', 'Collaboration', 'General Inquiry', 'Feedback', 'Spam', 'Achievement'].map(col => (
                      <button
                        key={col}
                        onClick={() => setMsgFilter(col as any)}
                        className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.15em] uppercase transition-all cursor-pointer ${
                          msgFilter === col 
                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold" 
                            : "bg-neutral-50 dark:bg-neutral-900 text-neutral-450 hover:bg-neutral-100"
                        }`}
                      >
                        {col} ({col === 'All' ? messages.length : messages.filter(m => m.category === col).length})
                      </button>
                    ))}
                  </div>

                  {/* Log stream */}
                  <div className="space-y-4">
                    {filteredMessages.length === 0 ? (
                      <div className="p-12 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-neutral-400 text-xs font-sans tracking-wide select-none uppercase font-semibold">
                        No submissions match this categorization filter yet
                      </div>
                    ) : (
                      filteredMessages.map((msg) => (
                        <div 
                          key={msg.id}
                          className="p-5 sm:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group relative"
                        >
                          {/* Top row info */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-50 dark:border-neutral-900/60 pb-3">
                            <div className="text-left space-y-0.5">
                              <h5 className="text-sm font-extrabold text-neutral-950 dark:text-white font-sans tracking-tight">
                                {msg.name}
                              </h5>
                              <a 
                                href={`mailto:${msg.email}`} 
                                className="text-2xs text-neutral-400 dark:text-neutral-500 hover:text-orange-600 dark:hover:text-amber-400 font-mono tracking-tight transition-colors"
                              >
                                {msg.email}
                              </a>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                              <span className="text-[10px] text-neutral-400/90 dark:text-neutral-500 font-sans font-bold uppercase tracking-wider flex items-center gap-1 mr-2">
                                <Calendar className="w-3 h-3" /> {new Date(msg.timestamp).toLocaleDateString()}
                              </span>

                              {/* AI parsed flags */}
                              {msg.category && (
                                <span className={`px-2 py-0.5 rounded text-[9px] font-sans font-bold uppercase tracking-wider ${
                                  msg.category === "Job Opportunity" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                                  msg.category === "Collaboration" ? "bg-amber-500/10 text-amber-500 border border-amber-500/10" :
                                  msg.category === "Spam" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" :
                                  "bg-neutral-100 dark:bg-neutral-900 text-neutral-500"
                                }`}>
                                  {msg.category}
                                </span>
                              )}

                              {msg.sentiment && (
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-sans tracking-[0.15em] uppercase font-bold ${
                                  msg.sentiment === "Positive" ? "text-emerald-505" :
                                  msg.sentiment === "Negative" ? "text-rose-505" :
                                  "text-neutral-400"
                                }`}>
                                  {msg.sentiment}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Message Body */}
                          <p className="text-xs sm:text-sm text-neutral-750 dark:text-neutral-300 leading-relaxed font-sans whitespace-pre-wrap">
                            {msg.message}
                          </p>

                          {/* Quick details */}
                          <div className="pt-3 border-t border-neutral-50 dark:border-neutral-900/40 flex items-center justify-between">
                            <span className="text-[9px] font-mono text-neutral-300 dark:text-neutral-600 uppercase tracking-tight select-none font-bold">
                              ID: {msg.id}
                            </span>
                            
                            {deletingMessageId === msg.id ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-rose-500 font-sans font-medium">Delete forever?</span>
                                <button
                                  onClick={() => executeDeleteMessage(msg.id)}
                                  className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-sans font-bold uppercase cursor-pointer transition-all"
                                >
                                  Yes, Purge
                                </button>
                                <button
                                  onClick={() => setDeletingMessageId(null)}
                                  className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-650 dark:text-neutral-300 text-[9px] font-sans font-bold uppercase cursor-pointer transition-all"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="p-1 px-2.5 rounded bg-rose-500/5 sm:opacity-0 group-hover:opacity-100 hover:bg-rose-500/15 text-rose-500 text-[9px] font-sans font-bold tracking-[0.16em] uppercase flex items-center gap-1 cursor-pointer transition-all"
                                title="Delete permanently from ledger"
                              >
                                <Trash2 className="w-3 h-3" /> Purge Record
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                    </>
                  )}
                </div>
              )}

            </div>

        </motion.div>
      )}

      {/* footer action spacer */}
      {loggedIn && (
        <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900 text-left">
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-200 text-[10px] font-sans font-bold uppercase tracking-[0.16em] cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Portfolio Main
          </button>
        </div>
      )}
    </div>
  );
}
