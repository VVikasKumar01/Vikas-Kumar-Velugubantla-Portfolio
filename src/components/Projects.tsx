import React, { useState, useEffect, useRef } from "react";
import { Project } from "../types";
import { ExternalLink, Github, Code, Sparkles, Filter, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import placeiqImg from "../assets/images/placeiq_mockup_1783150990994.jpg";
import vaidyaVaniImg from "../assets/images/vaidya_vani_mockup_1783151003411.jpg";
import treasureHuntImg from "../assets/images/Technical_Treasure_Hunt.png";
import valorousImg from "../assets/images/Valorous_2k26.png";
import plantBrainImg from "../assets/images/PlantBrain-ai.png";
import metlifeStadiumImg from "../assets/images/metlife_stadium_mockup_1785421341960.jpg";

const PROJECTS_DATA: Project[] = [
  {
    id: "metlife-stadium",
    title: "MetLife Stadium Fan Experience Co-Pilot",
    description: "End-to-end smart stadium operational dashboard and fan engagement platform built for mega-events (e.g., FIFA World Cup 2026), bridging real-time IoT telemetry, 3D stadium simulator, and AI accessibility tools.",
    category: "ai",
    url: "https://metlife-stadium-assistant.onrender.com/",
    githubUrl: "https://github.com/VVikasKumar01/MetLife_Stadium_Assistant.git",
    tags: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "Firebase", "Firestore", "3D Canvas", "IoT Telemetry", "Vitest", "Render"],
    date: "World Cup 2026 Edition",
    highlights: [
      "Architected a smart stadium Co-Pilot featuring a 3D digital twin of MetLife Stadium for operational management and fan navigation.",
      "Engineered real-time IoT sensor telemetry pipelines tracking crowd density, parking availability, and climate status.",
      "Integrated accessibility-first AI capabilities including custom voice assistant flows, sign-language visual avatars, and SOS alerts."
    ],
    image: metlifeStadiumImg
  },
  {
    id: "plantbrain-ai",
    title: "PlantBrain AI — Industrial Copilot & 3D Twin",
    description: "Enterprise-grade AI copilot for heavy industry built at the Economic Times ET Hackathon, integrating a 4-agent RAG system and 3D digital twin of Visakhapatnam Steel Plant.",
    category: "ai",
    url: "https://plantbrain-ai-vizagtwin.onrender.com",
    githubUrl: "https://github.com/VVikasKumar01/PlantBrain",
    tags: ["React", "TypeScript", "Three.js", "Express.js", "Google Gemini AI", "Groq LLM", "RAG", "D3.js", "Recharts", "Render"],
    date: "ET Hackathon 2026",
    highlights: [
      "Engineered a 4-agent RAG-powered conversational AI grounded in regulatory steel plant documents.",
      "Rendered an interactive Three.js 3D Digital Twin of Visakhapatnam Steel Plant (RINL) with real-time asset telemetry.",
      "Built a D3 Knowledge Graph visualizer and an autonomous SHA-256 deduplicated PDF ingestion engine."
    ],
    image: plantBrainImg
  },
  {
    id: "placeiq",
    title: "PlaceIQ - AI Campus Placement Platform",
    description: "Multi-agent AI campus placement intelligence platform with 3 role-based portals (student, institute, recruiter), automated resume parsing, simulated technical interviews, and placement probability roadmaps.",
    category: "ai",
    url: "https://github.com/VVikasKumar01/PlaceIQ.git",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Groq SDK", "Llama 4", "Chart.js", "JWT & RBAC"],
    date: "March 2026",
    highlights: [
      "Engineered a full-stack placement platform with 3 role-based portals (student, institute, recruiter) and JWT authentication.",
      "Integrated Llama 4 Scout via Groq SDK for practice assessments across 3 areas and simulated technical interviews parsed into structured JSON.",
      "Automated resume parsing and built 5 Chart.js dashboards with 3 placement tiers and personalized 3-month roadmaps."
    ],
    image: placeiqImg
  },
  {
    id: "vaidya-vaani",
    title: "Vaidya Vani - AI Prescription Parser",
    description: "Clinical AI companion utilizing OCR and the Gemini API to extract and interpret printed and handwritten prescriptions, paired with conversational Q&A and sub-3-second voice explanations.",
    category: "ai",
    url: "https://vaidya-vaani-clinical-ai-intelligen.vercel.app/",
    githubUrl: "https://github.com/VVikasKumar01/VaidyaVaani.git",
    tags: ["React", "TypeScript", "Node.js", "Gemini API", "OCR", "Voice TTS"],
    date: "February 2026",
    highlights: [
      "Achieved 92% text extraction accuracy and reduced prescription interpretation time by 70% using OCR and Gemini API.",
      "Added conversational Q&A grounded in extracted prescription text, improving response relevance by 40%.",
      "Optimized the inference pipeline to deliver voice-enabled explanations in under 3 seconds; Top 20 Finalist at HackWithAI."
    ],
    image: vaidyaVaniImg
  },
  {
    id: "tech-treasure-hunt",
    title: "Technical Treasure Hunt Platform",
    description: "Real-time, heavy-concurrency interactive treasure hunt platform featuring automated progresive clue validation and instant leaderboards.",
    category: "fullstack",
    url: "https://technical-treasure-hunt.vercel.app/",
    tags: ["ReactJS", "NodeJS", "Express.js", "MongoDB Atlas", "WebSockets", "Vercel & Render"],
    date: "March 2026",
    highlights: [
      "Designed robust, low-latency REST APIs to validate cryptographically obfuscated player clues.",
      "Scaled the real-time websocket server to support 50+ simultaneous competitive players with zero latency lag.",
      "Deployed frontend to Vercel and microservices backend to Render with cluster management."
    ],
    image: treasureHuntImg
  },
  {
    id: "valorous",
    title: "Valorous2k26 - TechFest Management Platform",
    description: "Tech-fest management platform featuring a searchable event catalog, department filters, 10 REST API endpoints, JWT 3-tier RBAC, and real-time enrollment reporting across 27 events.",
    category: "fullstack",
    url: "https://valorous2k26.vercel.app/",
    tags: ["MERN Stack", "REST APIs", "JWT Auth", "3-Tier RBAC", "MongoDB", "Chart.js"],
    date: "February 2026",
    highlights: [
      "Built a searchable event catalog and department registration system for 27 events across 9 departments.",
      "Developed 10 REST API endpoints over 2 MongoDB collections secured with JWT (24-hour expiry) and 3-tier RBAC.",
      "Created a real-time admin dashboard generating 3 report views for streamlined event enrollment monitoring."
    ],
    image: valorousImg
  }
];

export default function Projects() {
  const [filter, setFilter] = useState<'all' | 'fullstack' | 'ai'>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevActiveIdx, setPrevActiveIdx] = useState(activeIdx);
  useEffect(() => {
    setPrevActiveIdx(activeIdx);
  }, [activeIdx]);
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showAllView, setShowAllView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = PROJECTS_DATA.filter(project => {
    if (filter === 'all') return true;
    return project.category === filter;
  });

  // Construct slides list for the 3D Carousel, with a virtual "View All" trigger card at the end
  const slides = [
    ...filteredProjects,
    {
      id: "view-all-trigger",
      title: "Explore Full Catalog",
      description: "Access the complete collection of deployment links, deep code repositories, and structural breakdowns in an organized grid view.",
      category: "ai" as const,
      url: "",
      tags: ["Full Stack", "AI Integration", "Clonable Sources", "Demos"],
      date: "A-Z Catalog",
      highlights: [
        "Filter across all full-stack systems and AI portals.",
        "Access codebases, deploy instructions, and architecture diagrams.",
        "Interactive technical query console and search."
      ]
    }
  ];

  // Keep activeIdx in bounds when filter or slides count changes
  useEffect(() => {
    setActiveIdx(Math.floor(slides.length / 2));
  }, [filter, slides.length]);

  // Handle responsive check for 3D layout spacing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay / Infinite Loop logic
  useEffect(() => {
    if (!isPlaying || slides.length === 0 || showAllView) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 1000); // Shifting cards every 1.0s (as customized by user)
    return () => clearInterval(interval);
  }, [isPlaying, slides.length, showAllView]);

  // Scroll back to top of projects section when switching to "All Projects" page
  useEffect(() => {
    if (showAllView) {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showAllView]);

  // Filter logic for full catalogue list
  const catalogProjects = PROJECTS_DATA.filter(project => {
    const matchesCategory = filter === 'all' || project.category === filter;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (showAllView) {
    return (
      <section id="projects" className="py-28 border-t border-neutral-200/30 dark:border-neutral-900/40 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Navigation & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-neutral-200/30 dark:border-neutral-800/40">
            <button 
              onClick={() => {
                setShowAllView(false);
                setSearchQuery("");
              }}
              className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-neutral-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-xs font-semibold tracking-wider font-sans uppercase hover:bg-neutral-100 dark:hover:bg-slate-800 text-neutral-800 dark:text-neutral-200 transition-all shadow-sm cursor-pointer hover:-translate-x-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Carousel
            </button>

            <div className="flex items-center gap-2 self-start font-mono text-[10px] uppercase text-neutral-450 dark:text-neutral-500">
              <span>INDEX PATH: /projects/all</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            </div>
          </div>

          {/* Brand & Introduction */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-200/50 dark:border-amber-500/10 bg-orange-50/30 dark:bg-amber-500/5 text-orange-600 dark:text-amber-400 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] shadow-sm">
              ARCHIVE DIRECTORY
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-display">
              Comprehensive Catalog
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
              A structured repository detailing development stack compositions, database frameworks, vision intelligence interfaces, and production links.
            </p>
          </div>

          {/* Dynamic Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center pt-2">
            {/* Search Console */}
            <div className="lg:col-span-2 relative">
              <input
                type="text"
                placeholder="Query catalog by keyword, library, feature or stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl border border-neutral-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/90 text-sm font-sans placeholder-neutral-400 dark:placeholder-neutral-550 focus:outline-none focus:border-orange-500 dark:focus:border-amber-500 transition-all shadow-xs text-neutral-850 dark:text-neutral-100"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs font-semibold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Categories filter */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 py-3 px-3 rounded-xl text-[9px] font-sans font-extrabold tracking-widest uppercase cursor-pointer transition-all ${
                  filter === 'all'
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-sm"
                    : "bg-white dark:bg-slate-900 border border-neutral-200/50 dark:border-slate-800 text-neutral-500 dark:text-neutral-450 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                All ({PROJECTS_DATA.length})
              </button>
              <button
                onClick={() => setFilter('ai')}
                className={`flex-1 py-3 px-3 rounded-xl text-[9px] font-sans font-extrabold tracking-widest uppercase cursor-pointer transition-all ${
                  filter === 'ai'
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-sm"
                    : "bg-white dark:bg-slate-900 border border-neutral-200/50 dark:border-slate-800 text-neutral-500 dark:text-neutral-450 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                AI ({PROJECTS_DATA.filter(p => p.category === 'ai').length})
              </button>
              <button
                onClick={() => setFilter('fullstack')}
                className={`flex-1 py-3 px-3 rounded-xl text-[9px] font-sans font-extrabold tracking-widest uppercase cursor-pointer transition-all ${
                  filter === 'fullstack'
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-sm"
                    : "bg-white dark:bg-slate-900 border border-neutral-200/50 dark:border-slate-800 text-neutral-500 dark:text-neutral-450 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                Stack ({PROJECTS_DATA.filter(p => p.category === 'fullstack').length})
              </button>
            </div>
          </div>

          {/* Grid Display */}
          <div className="pt-4">
            {catalogProjects.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed border-neutral-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm space-y-4">
                <p className="text-neutral-500 dark:text-neutral-400 font-sans text-sm">
                  No archived ventures matched your search query "<span className="font-semibold">{searchQuery}</span>".
                </p>
                <button 
                  onClick={() => { setSearchQuery(""); setFilter("all"); }}
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold text-xs font-sans tracking-wider uppercase hover:bg-orange-600 transition-colors cursor-pointer shadow-sm"
                >
                  Reset Search Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                  {catalogProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4 }}
                      className="group relative rounded-3xl border border-neutral-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/65 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between overflow-hidden designer-shadow-md hover:border-orange-500/25 dark:hover:border-amber-500/25 transition-all duration-300"
                    >
                      {/* Visual Radial Glow Accent */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-tr from-orange-500/10 to-amber-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500" />

                      <div className="space-y-5">
                        {/* Luxury Project Mockup Image Cover */}
                        {project.image && (
                          <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-slate-950/80 border border-neutral-250/30 dark:border-slate-800/40 relative transition-all duration-500 group-hover:border-amber-500/20 shadow-sm">
                            <img 
                              src={project.image} 
                              alt={project.title} 
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 select-none pointer-events-none" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        
                        {/* Category Indicator */}
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-sans font-bold tracking-wider ${
                            project.category === "ai"
                              ? "bg-amber-100/60 text-amber-805 dark:bg-amber-950/30 dark:text-amber-405"
                              : "bg-orange-100/60 text-orange-850 dark:bg-orange-950/30 dark:text-orange-405"
                          }`}>
                            {project.category === "ai" ? "★ AI System" : "⚙ Full Stack"}
                          </span>
                          <span className="text-[10px] font-sans tracking-wide text-neutral-400 dark:text-neutral-550">{project.date}</span>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-2 text-left">
                          <h3 className="text-xl font-bold text-neutral-900 dark:text-white font-display group-hover:text-orange-600 dark:group-hover:text-amber-400 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                            {project.description}
                          </p>
                        </div>

                        {/* Highlights/Bullet Points */}
                        <ul className="space-y-2 pt-4 border-t border-neutral-200/40 dark:border-neutral-900/60 text-left">
                          {project.highlights.map((hlt, i) => (
                            <li key={i} className="text-xs text-neutral-655 dark:text-neutral-350 flex items-start gap-2 leading-relaxed">
                              <span className="text-orange-500 dark:text-amber-400 mt-1 font-bold select-none">•</span>
                              <span>{hlt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tags & Action Links */}
                      <div className="space-y-5 pt-5 mt-6 border-t border-neutral-200/35 dark:border-neutral-900/60">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag, i) => (
                            <span 
                              key={i} 
                              className="text-[9px] font-sans font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 px-2.5 py-0.5 bg-neutral-100/50 dark:bg-neutral-900/70 border border-neutral-200/25 dark:border-neutral-800/40 rounded hover:bg-neutral-150 dark:hover:bg-neutral-850 transition-colors uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2.5 pt-1 select-none">
                          <motion.a
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 dark:bg-white dark:hover:bg-neutral-50 dark:text-neutral-950 text-white font-bold text-[10px] sm:text-[11px] font-sans tracking-[0.18em] uppercase flex items-center justify-center gap-2 transition-all shadow-sm"
                          >
                            {project.url.endsWith(".git") ? (
                              <>
                                <Github className="w-3.5 h-3.5" /> View Repo
                              </>
                            ) : (
                              <>
                                <ExternalLink className="w-3.5 h-3.5" /> Launch Live
                              </>
                            )}
                          </motion.a>

                          {project.githubUrl ? (
                            <motion.a
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2.5 px-4 rounded-xl border border-neutral-255 dark:border-neutral-800 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50/60 dark:hover:bg-neutral-900/30 font-bold text-[10px] sm:text-[11px] font-sans tracking-[0.18em] flex items-center gap-1.5 transition-all uppercase"
                            >
                              <Github className="w-3.5 h-3.5" /> Code
                            </motion.a>
                          ) : !project.url.endsWith(".git") && project.id !== "tech-treasure-hunt" && project.id !== "valorous" ? (
                            <motion.a
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              href="https://github.com/VVikasKumar01/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2.5 px-4 rounded-xl border border-neutral-255 dark:border-neutral-800 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50/60 dark:hover:bg-neutral-900/30 font-bold text-[10px] sm:text-[11px] font-sans tracking-[0.18em] flex items-center gap-1.5 transition-all uppercase"
                            >
                              <Github className="w-3.5 h-3.5" /> Code
                            </motion.a>
                          ) : project.url.endsWith(".git") ? (
                            <span className="text-[10px] font-sans tracking-wide text-neutral-400 dark:text-neutral-520 italic max-w-[120px] text-right truncate">
                              AI-Integrated Src
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-28 border-t border-neutral-200/30 dark:border-neutral-900/40 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header with Designer Typography */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-200/50 dark:border-amber-500/10 bg-orange-50/30 dark:bg-amber-500/5 text-orange-600 dark:text-amber-400 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] shadow-sm">
            PROVEN BENCHMARKS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-display">
            Core Ventures & Platforms
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            A curated showcase of deployed full-stack web architectures and responsive artificial intelligence companion services.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-[10px] font-sans font-semibold tracking-[0.15em] uppercase flex items-center gap-1.5 cursor-pointer transition-all ${
              filter === 'all'
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-sm"
                : "bg-white dark:bg-slate-900 border border-neutral-200/50 dark:border-slate-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 hover:bg-neutral-50 dark:hover:bg-slate-800"
            }`}
            id="filter-projects-all"
          >
            <Layers className="w-3.5 h-3.5" /> All Work ({PROJECTS_DATA.length})
          </button>
          
          <button
            onClick={() => setFilter('fullstack')}
            className={`px-4 py-2 rounded-full text-[10px] font-sans font-semibold tracking-[0.15em] uppercase flex items-center gap-1.5 cursor-pointer transition-all ${
              filter === 'fullstack'
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-sm"
                : "bg-white dark:bg-slate-900 border border-neutral-200/50 dark:border-slate-800 text-neutral-500 dark:text-neutral-450 hover:text-neutral-800 dark:hover:bg-slate-800"
            }`}
            id="filter-projects-fullstack"
          >
            <Code className="w-3.5 h-3.5" /> Full-Stack ({PROJECTS_DATA.filter(p => p.category === 'fullstack').length})
          </button>
          
          <button
            onClick={() => setFilter('ai')}
            className={`px-4 py-2 rounded-full text-[10px] font-sans font-semibold tracking-[0.15em] uppercase flex items-center gap-1.5 cursor-pointer transition-all ${
              filter === 'ai'
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-sm"
                : "bg-white dark:bg-slate-900 border border-neutral-200/50 dark:border-slate-800 text-neutral-500 dark:text-neutral-450 hover:text-neutral-800 dark:hover:bg-slate-800"
            }`}
            id="filter-projects-ai"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Engine ({PROJECTS_DATA.filter(p => p.category === 'ai').length})
          </button>
        </div>

        {/* 3D Cover Flow Carousel Container */}
        <div 
          className="relative h-[530px] xs:h-[580px] sm:h-[730px] w-full flex flex-col items-center justify-center overflow-visible animate-fade-in"
          style={{ perspective: "1600px" }}
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          <div 
            className="relative w-full h-[470px] xs:h-[510px] sm:h-[650px] flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <AnimatePresence mode="popLayout">
              {slides.map((project, index) => {
                const N = slides.length;
                let offset = index - activeIdx;
                if (offset > N / 2) {
                  offset -= N;
                } else if (offset < -N / 2) {
                  offset += N;
                }
                const absOffset = Math.abs(offset);
                const isCenter = offset === 0;

                // Previous offset calculation to detect wrap-around
                let prevOffset = index - prevActiveIdx;
                if (prevOffset > N / 2) {
                  prevOffset -= N;
                } else if (prevOffset < -N / 2) {
                  prevOffset += N;
                }
                const isWrapping = Math.abs(offset - prevOffset) > 1.5;

                // Rotated card calculation matching the design
                const rotateY = offset * (isMobile ? -20 : -40);
                const translateX = offset * (isMobile ? 95 : 230) + (offset > 0 ? (isMobile ? 15 : 60) : offset < 0 ? (isMobile ? -15 : -60) : 0);
                const translateZ = absOffset * (isMobile ? -80 : -180);
                const scale = isCenter ? 1 : 1 - absOffset * (isMobile ? 0.07 : 0.12);
                const opacity = isWrapping ? 0 : Math.max(0.35, 1 - absOffset * 0.35);

                const isViewAllCard = project.id === "view-all-trigger";

                if (isViewAllCard) {
                  return (
                    <motion.div
                      key={project.id}
                      style={{
                        transformStyle: "preserve-3d",
                        zIndex: 100 - absOffset,
                      }}
                      initial={{ opacity: 0, scale: 0.8, rotateY: 0, z: -300 }}
                      animate={{
                        opacity: opacity,
                        scale: scale,
                        rotateY: rotateY,
                        x: translateX,
                        z: translateZ,
                      }}
                      exit={{ opacity: 0, scale: 0.8, z: -300 }}
                      transition={
                        isWrapping
                          ? { duration: 0 }
                          : {
                              type: "spring",
                              stiffness: 240,
                              damping: 24,
                            }
                      }
                      onClick={() => {
                        if (!isCenter) {
                          setActiveIdx(index);
                        } else {
                          setShowAllView(true);
                        }
                      }}
                      className={`absolute w-full max-w-[240px] xs:max-w-[270px] sm:max-w-[420px] origin-center ${
                        isCenter 
                          ? "pointer-events-auto cursor-pointer" 
                          : "pointer-events-auto cursor-pointer hover:opacity-90"
                      }`}
                      id={`project-card-${project.id}`}
                    >
                      <div className="group/card relative rounded-3xl border border-orange-500/20 dark:border-amber-400/20 bg-[#0f1422] dark:bg-[#070b14] p-3.5 xs:p-5 sm:p-7 flex flex-col justify-between overflow-hidden designer-shadow-lg hover-premium-lift min-h-[385px] xs:min-h-[430px] sm:min-h-[500px] h-full text-white transition-all duration-300">
                        {/* Glowing background */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 via-amber-500/10 to-transparent pointer-events-none" />
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
                        
                        <div className="space-y-3.5 xs:space-y-6 flex-1 flex flex-col justify-center text-center px-2 xs:px-4">
                          {/* Concentric glowing rings */}
                          <div className="relative w-14 h-14 xs:w-20 xs:h-20 mx-auto flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-orange-500/10 animate-ping" />
                            <div className="absolute -inset-2 rounded-full border border-dashed border-orange-500/30 animate-[spin_20s_linear_infinite]" />
                            <div className="w-11 h-11 xs:w-16 xs:h-16 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                              <Layers className="w-5 h-5 xs:w-8 xs:h-8 text-white" />
                            </div>
                          </div>

                          <div className="space-y-1 xs:space-y-2">
                            <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-orange-400 font-bold">
                              DIRECTORY ACCESS
                            </span>
                            <h3 className="text-base xs:text-xl sm:text-2xl font-extrabold font-display text-white tracking-tight">
                              Explore All Work
                            </h3>
                            <p className="text-[11px] xs:text-xs text-slate-355 leading-relaxed max-w-xs mx-auto line-clamp-2 xs:line-clamp-none">
                              Navigate the complete portfolio index with interactive search, technology filter logs, and source repository code.
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1 justify-center">
                            <span className="px-2 py-0.5 rounded-full text-[8px] xs:text-[9px] uppercase font-mono font-bold tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/20">
                              ★ {PROJECTS_DATA.filter(p => p.category === 'ai').length}x AI Systems
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[8px] xs:text-[9px] uppercase font-mono font-bold tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/20">
                              ⚙ {PROJECTS_DATA.filter(p => p.category === 'fullstack').length}x Full-Stack
                            </span>
                          </div>
                        </div>

                        <div className="pt-4 sm:pt-6 border-t border-slate-800/60 mt-2 xs:mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAllView(true);
                            }}
                            className="w-full py-2 xs:py-3 px-3 xs:px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-[10px] sm:text-[11px] font-sans tracking-[0.15em] xs:tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 xs:gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                          >
                            Launch Catalog <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={project.id}
                    style={{
                      transformStyle: "preserve-3d",
                      zIndex: 100 - absOffset,
                    }}
                    initial={{ opacity: 0, scale: 0.8, rotateY: 0, z: -300 }}
                    animate={{
                      opacity: opacity,
                      scale: scale,
                      rotateY: rotateY,
                      x: translateX,
                      z: translateZ,
                    }}
                    exit={{ opacity: 0, scale: 0.8, z: -300 }}
                    transition={
                      isWrapping
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 240,
                            damping: 24,
                          }
                    }
                    onMouseEnter={() => isCenter && setHoveredId(project.id)}
                    onMouseLeave={() => isCenter && setHoveredId(null)}
                    onClick={() => {
                      if (!isCenter) {
                        setActiveIdx(index);
                      }
                    }}
                    className={`absolute w-full max-w-[240px] xs:max-w-[270px] sm:max-w-[420px] origin-center ${
                      isCenter 
                        ? "pointer-events-auto cursor-default" 
                        : "pointer-events-auto cursor-pointer hover:opacity-90"
                    }`}
                    id={`project-card-${project.id}`}
                  >
                    <div className="group/card relative rounded-3xl border border-neutral-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/65 backdrop-blur-md p-3.5 xs:p-5 sm:p-7 flex flex-col justify-between overflow-hidden designer-shadow-md hover-premium-lift min-h-[385px] xs:min-h-[430px] sm:min-h-[500px] transition-all duration-300">
                      {/* Visual Radial Glow Accent */}
                      <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-tr from-orange-500/10 to-amber-500/5 rounded-full blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none duration-500" />

                      <div className="space-y-3 xs:space-y-4">
                        
                        {/* Luxury Project Mockup Image Cover */}
                        {project.image && (
                          <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-slate-950/80 border border-neutral-250/30 dark:border-slate-800/40 relative transition-all duration-500 group-hover/card:border-amber-500/20 shadow-sm">
                            <img 
                              src={project.image} 
                              alt={project.title} 
                              className="w-full h-full object-cover group-hover/card:scale-[1.03] transition-transform duration-700 select-none pointer-events-none" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        
                        {/* Category Indicator */}
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] xs:text-[9px] uppercase font-sans font-bold tracking-wider ${
                            project.category === "ai"
                              ? "bg-amber-100/60 text-amber-805 dark:bg-amber-950/30 dark:text-amber-405"
                              : "bg-orange-100/60 text-orange-850 dark:bg-orange-950/30 dark:text-orange-405"
                          }`}>
                            {project.category === "ai" ? "★ AI System" : "⚙ Full Stack"}
                          </span>
                          <span className="text-[9px] xs:text-[10px] font-sans tracking-wide text-neutral-400 dark:text-neutral-500">{project.date}</span>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-1 text-left">
                          <h3 className="text-sm xs:text-base sm:text-lg font-bold text-neutral-900 dark:text-white font-display group-hover/card:text-orange-600 dark:group-hover/card:text-amber-400 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-[11px] xs:text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal line-clamp-2">
                            {project.description}
                          </p>
                        </div>

                      </div>

                      {/* Tags & Action Links */}
                      <div className="space-y-3 xs:space-y-4 pt-3 xs:pt-4 mt-3 xs:mt-4 border-t border-neutral-200/35 dark:border-neutral-900/60">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, isMobile ? 3 : 6).map((tag, i) => (
                            <span 
                              key={i} 
                              className="text-[8px] xs:text-[9px] font-sans font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 px-1.5 xs:px-2 py-0.5 bg-neutral-100/50 dark:bg-neutral-900/70 border border-neutral-200/25 dark:border-neutral-800/40 rounded hover:bg-neutral-150 dark:hover:bg-neutral-800 transition-colors uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > (isMobile ? 3 : 6) && (
                            <span className="text-[8px] xs:text-[9px] font-sans font-semibold tracking-wider text-neutral-400 px-1.5 xs:px-2 py-0.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/20 rounded">
                              +{project.tags.length - (isMobile ? 3 : 6)}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 xs:gap-2 pt-0.5 select-none">
                          <motion.a
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-1.5 xs:py-2 px-2.5 xs:px-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 dark:bg-white dark:hover:bg-neutral-50 dark:text-neutral-950 text-white font-bold text-[9px] xs:text-[10px] sm:text-[11px] font-sans tracking-[0.12em] xs:tracking-[0.18em] uppercase flex items-center justify-center gap-1.5 xs:gap-2 transition-all shadow-sm"
                            id={`project-btn-primary-${project.id}`}
                          >
                            {project.url.endsWith(".git") ? (
                              <>
                                <Github className="w-3 h-3 xs:w-3.5 xs:h-3.5" /> View Repo
                              </>
                            ) : (
                              <>
                                <ExternalLink className="w-3 h-3 xs:w-3.5 xs:h-3.5" /> Launch Live
                              </>
                            )}
                          </motion.a>

                          {project.githubUrl ? (
                            <motion.a
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-1.5 xs:py-2 px-2.5 xs:px-3 rounded-xl border border-neutral-255 dark:border-neutral-800 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50/60 dark:hover:bg-neutral-900/30 font-bold text-[9px] xs:text-[10px] sm:text-[11px] font-sans tracking-[0.12em] xs:tracking-[0.18em] flex items-center gap-1 xs:gap-1.5 transition-all uppercase"
                              id={`project-btn-secondary-${project.id}`}
                            >
                              <Github className="w-3 h-3 xs:w-3.5 xs:h-3.5" /> Code
                            </motion.a>
                          ) : !project.url.endsWith(".git") && project.id !== "tech-treasure-hunt" && project.id !== "valorous" ? (
                            <motion.a
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              href="https://github.com/VVikasKumar01/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-1.5 xs:py-2 px-2.5 xs:px-3 rounded-xl border border-neutral-255 dark:border-neutral-800 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50/60 dark:hover:bg-neutral-900/30 font-bold text-[9px] xs:text-[10px] sm:text-[11px] font-sans tracking-[0.12em] xs:tracking-[0.18em] flex items-center gap-1 xs:gap-1.5 transition-all uppercase"
                              id={`project-btn-secondary-${project.id}`}
                            >
                              <Github className="w-3 h-3 xs:w-3.5 xs:h-3.5" /> Code
                            </motion.a>
                          ) : project.url.endsWith(".git") ? (
                            <span className="text-[9px] xs:text-[10px] font-sans tracking-wide text-neutral-400 dark:text-neutral-520 italic max-w-[120px] text-right truncate">
                              AI-Integrated Src
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-5 mt-4 relative z-20">
            <button
              onClick={() => setActiveIdx((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
              className="p-2.5 rounded-2xl border border-neutral-200/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-neutral-800 dark:text-neutral-200 shadow-md transition-all hover:bg-neutral-100 dark:hover:bg-slate-800 cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Previous Project"
              id="projects-carousel-prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots Indicator */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIdx
                      ? "w-8 bg-gradient-to-r from-orange-500 to-amber-500"
                      : "w-2.5 bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-400 dark:hover:bg-neutral-700"
                  }`}
                  aria-label={`Go to project slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveIdx((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
              className="p-2.5 rounded-2xl border border-neutral-200/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-neutral-800 dark:text-neutral-200 shadow-md transition-all hover:bg-neutral-100 dark:hover:bg-slate-800 cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Next Project"
              id="projects-carousel-next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
