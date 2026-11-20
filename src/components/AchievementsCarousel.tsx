import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import indiaJapanImg from "../assets/images/india_japan_hackathon.jpeg";
import genAiForgeCert from "../assets/images/cert_genai_forge.png";
import promptWarsCert from "../assets/images/cert_promptwars.png";

interface AchievementSlide {
  id: string;
  image: string;
  title: string;
  kicker: string;
  date: string;
  organization: string;
  description: string;
  isCertificate: boolean;
}

const SLIDES: AchievementSlide[] = [
  {
    id: "india-japan-hackathon",
    image: indiaJapanImg,
    title: "Top 10 Finalists — India-Japan Innovation Hackathon",
    kicker: "International Hackathon Showcase",
    date: "Oct 2026",
    organization: "St. Peter's Engineering College · India-Japan Collaboration",
    description:
      "Demonstrated our live hardware-software prototype directly to Japanese industry delegates and earned Top 10 Finalist recognition among competing innovation teams.",
    isCertificate: false,
  },
  {
    id: "genai-forge-2nd-prize",
    image: genAiForgeCert,
    title: "2nd Prize Winner — GEN-AI FORGE Hackathon 2026",
    kicker: "Inter-College AI Competition",
    date: "Jan 2026",
    organization: "MLRITM & PACE · College Level",
    description:
      "Awarded 2nd Place for architecting and shipping a production-ready Generative AI application during the intensive 2-day GEN-AI FORGE Hackathon.",
    isCertificate: true,
  },
  {
    id: "google-promptwars-challenge-4",
    image: promptWarsCert,
    title: "Rank 270 (Top 400) — Google PromptWars Virtual Challenge 4",
    kicker: "Build with AI Global Leaderboard",
    date: "Aug 2026",
    organization: "Google for Developers & Hack2Skill · ID: 2026H2S07PWVCHL4-AT00179",
    description:
      "Secured Rank 270 on the Top 400 global leaderboard in Challenge 4 for building functional, value-driven Generative AI applications.",
    isCertificate: true,
  },
];

export default function AchievementsCarousel() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const totalSlides = SLIDES.length;

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-scroll carousel unless hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(goNext, 5500);
    return () => clearInterval(timer);
  }, [isHovered, goNext]);

  const currentSlide = SLIDES[activeIndex];

  return (
    <section
      id="achievements"
      className="py-24 sm:py-28 border-t border-neutral-200/30 dark:border-neutral-900/40 px-4 relative"
    >
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-200/50 dark:border-amber-500/10 bg-orange-50/30 dark:bg-amber-500/5 text-orange-600 dark:text-amber-400 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] shadow-sm">
              VERIFIED MILESTONES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-display">
              Achievements & Certificates
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto md:mx-0">
              Highlights from national and international hackathons, innovation showcases, and verified technical credentials.
            </p>
          </div>

          {/* Carousel Controls Bar */}
          <div className="flex items-center justify-center md:justify-end gap-2 shrink-0">
            <span className="font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400 mr-2">
              {String(activeIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
            </span>

            <button
              type="button"
              onClick={goPrev}
              className="p-2.5 rounded-full border border-neutral-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-neutral-700 dark:text-neutral-200 hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
              aria-label="Previous achievement"
              id="achievements-prev-btn"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={goNext}
              className="p-2.5 rounded-full border border-neutral-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-neutral-700 dark:text-neutral-200 hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
              aria-label="Next achievement"
              id="achievements-next-btn"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Image & Overlay Stage */}
        <div
          className="relative rounded-3xl overflow-hidden border border-neutral-200/70 dark:border-slate-800 bg-neutral-950 shadow-xl group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] overflow-hidden bg-neutral-950">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full ${
                    currentSlide.isCertificate
                      ? "object-contain bg-neutral-950 p-3 sm:p-6 pb-36 sm:pb-40"
                      : "object-cover object-center"
                  }`}
                />
              </motion.div>
            </AnimatePresence>

            {/* Measured Contrast Scrim for Overlaid Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent pointer-events-none" />

            {/* Left & Right Floating Arrows on Stage */}
            <button
              type="button"
              onClick={goPrev}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/55 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/55 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Overlaid Text Content on Top of Image */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8 md:p-10 text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id + "-text"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-3xl space-y-2"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300 font-medium">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{currentSlide.kicker}</span>
                    <span aria-hidden="true" className="text-white/40">·</span>
                    <span className="text-neutral-200">{currentSlide.date}</span>
                    <span aria-hidden="true" className="text-white/40 hidden sm:inline">·</span>
                    <span className="text-neutral-300 hidden sm:inline">{currentSlide.organization}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-display leading-snug tracking-tight">
                    {currentSlide.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed max-w-2xl">
                    {currentSlide.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
