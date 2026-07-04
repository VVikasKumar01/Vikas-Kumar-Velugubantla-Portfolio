// Global configuration for the frontend
const getApiBase = () => {
  // If explicitly provided via env
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Get current hostname
  const hostname = window.location.hostname;
  
  // If running on localhost or local network, use relative path (same origin / proxy)
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.includes("192.168.")) {
    return "";
  }
  
  // If running on Render, use relative path (same origin)
  if (hostname.includes("onrender.com")) {
    return "";
  }

  // If running inside the AI Studio development or preview environment, use relative path
  if (hostname.includes("ais-dev") || hostname.includes("ais-pre") || hostname.includes("run.app")) {
    return "";
  }

  // Default fallback: point external static sites (like Azure Static Web Apps or GitHub Pages)
  // to the live production backend hosted on Render
  return "https://vikas-kumar-velugubantla-portfolio.onrender.com";
};

export const API_BASE = getApiBase();
