import React, { useState } from "react";
import { Moon, Sun, ShieldCheck, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  currentSection: string;
  setCurrentSection: (section: string) => void;
  isAdminLoggedIn: boolean;
  onAdminClick: () => void;
  showAdminPortal?: boolean;
  onLogoClick?: () => void;
}

export default function Navbar({
  isDark,
  toggleTheme,
  currentSection,
  setCurrentSection,
  isAdminLoggedIn,
  onAdminClick,
  showAdminPortal = false,
  onLogoClick
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "about", label: "Skills & Edu" },
    { id: "contact", label: "Contact" }
  ];

  return (
    <header className="fixed top-5 left-0 right-0 z-50 px-4 max-w-5xl mx-auto">
      <motion.div 
        initial={{ y: -45, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full border border-neutral-200/50 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none"
      >
        {/* Brand / Logo */}
        <button 
          onClick={() => {
            setCurrentSection("home");
            document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
            if (onLogoClick) onLogoClick();
          }}
          className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight cursor-pointer text-neutral-900 dark:text-neutral-50 group"
          id="nav-brand"
        >
          <motion.div 
            whileHover={{ scale: 1.08 }}
            className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm"
          >
            VK
          </motion.div>
          <span className="hidden md:inline font-sans text-xs font-bold tracking-tight text-neutral-800 dark:text-neutral-200 group-hover:text-orange-500 dark:group-hover:text-amber-400 transition-colors">Vikas Kumar V.</span>
        </button>

        {/* Navigation links (Desktop) */}
        <nav className="hidden md:flex items-center gap-0.5 sm:gap-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentSection(item.id);
                // Scroll to element seamlessly if on main page
                const el = document.getElementById(item.id);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={`relative px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] font-medium font-sans tracking-wide transition-colors cursor-pointer ${
                currentSection === item.id 
                  ? "text-neutral-950 dark:text-white font-semibold" 
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
              id={`nav-link-${item.id}`}
            >
              {currentSection === item.id && (
                <motion.span
                  layoutId="activeNavBackground"
                  className="absolute inset-0 rounded-full bg-neutral-100/80 dark:bg-neutral-800/80 -z-10 shadow-inner"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Theme + Mobile Burger + Admin Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Dark Mode toggle button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-full border border-neutral-200/50 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-all cursor-pointer"
            title="Toggle theme mode"
            id="theme-toggle"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-neutral-700" />}
            </motion.div>
          </motion.button>

          {/* Secure Admin route button */}
          {showAdminPortal && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAdminClick}
              className={`p-2 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
                isAdminLoggedIn 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 shadow-sm shadow-emerald-500/10" 
                  : currentSection === "admin"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                  : "border-neutral-200/50 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-905/60"
              }`}
              title={isAdminLoggedIn ? "Manage Analytics (Admin Active)" : "Admin Portal"}
              id="admin-portal-toggle"
            >
              {isAdminLoggedIn ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            </motion.button>
          )}

          {/* Hamburger menu button for mobile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full border border-neutral-200/50 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-all cursor-pointer"
            title={isOpen ? "Close menu" : "Open menu"}
            id="mobile-menu-burger"
          >
            <div className="flex items-center justify-center">
              {isOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Floating Menu Drawer for mobile (frosted-glass matching style) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden mt-2 border border-neutral-200/50 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg rounded-3xl p-3 flex flex-col gap-1 z-40"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentSection(item.id);
                  setIsOpen(false);
                  setTimeout(() => {
                    const el = document.getElementById(item.id);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }, 80);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-2xl text-[11px] font-semibold font-sans tracking-wide transition-colors cursor-pointer ${
                  currentSection === item.id 
                    ? "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-950 dark:text-white" 
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40 hover:text-neutral-950 dark:hover:text-neutral-100"
                }`}
                id={`mobile-nav-link-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
