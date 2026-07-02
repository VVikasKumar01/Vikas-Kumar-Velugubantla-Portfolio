import React from "react";
import { Briefcase, Calendar, Star, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function Experience() {
  const bulletPoints = [
    "Completed a 10-week structured internship with an Outstanding (O) grade, focusing on applied AI and large language model integrations.",
    "Designed and refined prompt pipelines for production-grade AI applications, improving output accuracy and consistency across diverse use cases.",
    "Integrated OpenAI, Gemini, and Groq APIs — handled authentication, parameter tuning, and response parsing to build automated, intelligent workflows.",
    "Conducted AI quality assurance by evaluating model outputs against business requirements, iterating for precision and measurable accuracy improvements."
  ];

  return (
    <section id="experience" className="py-28 border-t border-neutral-200/20 dark:border-neutral-900/40 px-4 relative">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Title */}
        <div className="text-center md:text-left space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-200/50 dark:border-amber-500/10 bg-orange-50/30 dark:bg-amber-500/5 text-orange-600 dark:text-amber-400 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] shadow-sm">
            WORK HISTORY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-display">
            Professional Experience
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-xl md:mx-0">
            A chronological timeline of my work in AI engineering, software development, and quality assurance.
          </p>
        </div>

        {/* Timeline wrapper card */}
        <div className="relative group">
          {/* Backing accent line decoration */}
          <div className="absolute top-0 bottom-0 left-0 sm:left-4 w-[1px] bg-neutral-200 dark:bg-neutral-800" />
          
          {/* Experience Item */}
          <div className="relative pl-6 sm:pl-12 flex flex-col gap-4">
            
            {/* Left Locator icon */}
            <div className="absolute top-2.5 left-[-8.5px] sm:left-1 p-2 rounded-full bg-white dark:bg-slate-900 border border-orange-500 dark:border-amber-400 shadow-sm z-10 scale-110">
              <Briefcase className="w-3.5 h-3.5 text-orange-500" />
            </div>

            {/* Content card */}
            <motion.div 
              whileHover={{ y: -3 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 sm:p-8 rounded-3xl border border-neutral-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/65 backdrop-blur-md shadow-sm hover:shadow-md transition-all group relative designer-shadow-md hover-premium-lift"
            >
              {/* Corner Outstanding Badge decoration */}
              <div className="relative top-0 right-0 mb-4 inline-flex w-fit sm:absolute sm:mb-0 sm:top-5 sm:right-8 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-sans tracking-[0.15em] uppercase font-bold rounded-full items-center gap-1.5 border border-amber-550/10">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Grade: Outstanding (O)
              </div>

              {/* Title, Team & Dates banner */}
              <div className="space-y-2 max-w-full sm:max-w-[70%] text-left">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
                  Virtual Intern - Prompt Engineering for AI
                </h3>
                
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400 font-sans tracking-wide">
                  <span className="font-bold text-orange-600 dark:text-amber-400">EduSkills Academy & AICTE</span>
                  <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">|</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Jan 2026 - Mar 2026
                  </span>
                </div>
              </div>

              {/* bullets */}
              <div className="mt-8 space-y-4">
                {bulletPoints.map((bullet, idx) => (
                  <div key={idx} className="flex gap-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed text-left font-sans">
                    <div className="text-orange-500 dark:text-amber-400 mt-0.5 flex-shrink-0 select-none">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic highlights summary footer */}
              <div className="mt-8 pt-5 border-t border-neutral-200/40 dark:border-neutral-900/60 flex flex-wrap gap-2">
                <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.12em] px-3 py-1 bg-neutral-100/60 dark:bg-neutral-900 border border-neutral-200/25 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 rounded">#PromptPipelines</span>
                <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.12em] px-3 py-1 bg-neutral-100/60 dark:bg-neutral-900 border border-neutral-200/25 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 rounded">#APIsIntegration</span>
                <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.12em] px-3 py-1 bg-neutral-100/60 dark:bg-neutral-900 border border-neutral-200/25 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 rounded">#ModelQA</span>
                <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.12em] px-3 py-1 bg-neutral-100/60 dark:bg-neutral-900 border border-neutral-200/25 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 rounded">#AICTE</span>
              </div>

            </motion.div>
          </div>
          
        </div>

      </div>
    </section>
  );
}
