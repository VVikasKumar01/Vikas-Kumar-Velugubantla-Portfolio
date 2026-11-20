// Global configuration for the frontend
const getApiBase = () => {
  // Get current hostname
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  
  // If running on localhost or local network, always use relative path (same origin / proxy)
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.includes("192.168.")) {
    return "";
  }
  
  // If running inside the AI Studio development or preview environment, always use relative path
  if (hostname.includes("ais-dev") || hostname.includes("ais-pre") || hostname.includes("run.app")) {
    return "";
  }

  // If running on Render, use relative path (same origin)
  if (hostname.includes("onrender.com")) {
    return "";
  }

  let base = "";

  // If explicitly provided via env (e.g. for external production static deployments like GitHub Pages or Azure)
  if (import.meta.env.VITE_API_URL) {
    base = import.meta.env.VITE_API_URL;
  } else {
    // Default fallback: point external static sites to the live production backend hosted on Render
    base = "https://vikas-kumar-velugubantla-portfolio.onrender.com";
  }

  // Safely strip any trailing slash to prevent double-slash API request issues
  if (base.endsWith("/")) {
    base = base.slice(0, -1);
  }
  return base;
};

export const API_BASE = getApiBase();
