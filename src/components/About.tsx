import React, { useState } from "react";
import { GraduationCap, Award, Brain, BarChart3, Database, ShieldAlert, Cpu, Sparkles, Pause, Play } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const education = [
    {
      degree: "B.Tech in Computer Science and Engineering",
      institution: "Marri Laxman Reddy Institute of Technology and Management, Hyderabad",
      period: "Aug 2023 - May 2027",
      score: "CGPA: 8.32 / 10.0"
    },
    {
      degree: "Intermediate in MPC",
      institution: "Sri Chaitanya Junior Kalasala, Hyderabad",
      period: "June 2021 - May 2023",
      score: "Percentage: 88.9%"
    },
    {
      degree: "10th Class Secondary Education",
      institution: "Sri Chaitanya High School, Hyderabad",
      period: "June 2019 - May 2021",
      score: "CGPA: 10.0 / 10.0"
    }
  ];

  const skillCategories = [
    {
      category: "Languages",
      icon: <Brain className="w-4 h-4 text-orange-500" />,
      skills: ["Python", "JavaScript", "TypeScript", "Java", "SQL", "HTML / CSS"]
    },
    {
      category: "Generative AI & LLMs",
      icon: <Cpu className="w-4 h-4 text-yellow-500" />,
      skills: ["OpenAI API", "Gemini API", "Groq SDK (Llama 4)", "Hugging Face", "Prompt Engineering", "Agentic AI"]
    },
    {
      category: "Backend & Databases",
      icon: <Database className="w-4 h-4 text-amber-500" />,
      skills: ["Node.js", "Express.js", "REST APIs", "JWT Authentication", "MongoDB", "Supabase", "Firebase"]
    },
    {
      category: "Frontend & Data",
      icon: <BarChart3 className="w-4 h-4 text-emerald-500" />,
      skills: ["React.js", "Bootstrap", "Chart.js", "Power BI", "Scikit-learn", "OpenCV", "Predictive Analytics"]
    },
    {
      category: "Cloud & DevOps",
      icon: <ShieldAlert className="w-4 h-4 text-indigo-500" />,
      skills: ["AWS", "Git / GitHub", "CI/CD", "Vercel", "Render", "MongoDB Atlas", "Postman"]
    },
    {
      category: "AI Tools",
      icon: <Sparkles className="w-4 h-4 text-pink-500" />,
      skills: ["Google AI Studio", "Claude", "Antigravity", "Gemini", "ChatGPT", "Stich"]
    }
  ];

  const profiles = [
    { name: "GeeksforGeeks", count: "295+ Solved", color: "text-emerald-600 dark:text-emerald-400 border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/10 dark:border-emerald-500/20", url: "https://www.geeksforgeeks.org/profile/vvikaskumar1" },
    { name: "CodeChef", count: "65 Solved", color: "text-amber-600 dark:text-amber-400 border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10 dark:border-amber-500/20", url: "https://www.codechef.com/users/v_vikas_kumar" },
    { name: "LeetCode", count: "35 Solved", color: "text-orange-600 dark:text-orange-400 border-orange-500/25 bg-orange-500/5 hover:bg-orange-500/10 dark:border-orange-500/20", url: "https://leetcode.com/u/dKLlCe86Wt/" },
    { name: "HackerRank", count: "4★ Python, 4★ Java", color: "text-blue-600 dark:text-blue-400 border-blue-500/25 bg-blue-500/5 hover:bg-blue-500/10 dark:border-blue-500/20", url: "https://www.hackerrank.com/profile/v_vikaskumar2005" }
  ];

  const achievements = [
    { title: "2nd Prize — GEN-AI FORGE Hackathon (Inter-College Competition)", desc: "Awarded 2nd Place for architecting and shipping a production-ready Generative AI application at MLRITM & PACE. (Jan 2026)" },
    { title: "Top 10 Finalist — India-Japan Innovation Hackathon", desc: "Selected among top 10 finalist teams presenting hardware-software prototypes to Japanese delegates. (Oct 2026)" },
    { title: "Patent Application Filed — EchoShield", desc: "Filed 1 patent application for EchoShield, an acoustic-state-aware sensor fusion method. (Sep 2026)" },
    { title: "Top 20 Finalist — HackWithAI National Hackathon", desc: "Competed among 300+ teams and 1,500+ participants nationwide. (Feb 2026)" },
    { title: "Rank 270 (Top 400) — Google PromptWars Virtual Challenge 4", desc: "Recognized on the Top 400 global leaderboard by Google for Developers and H2S. (Aug 2026)" },
    { title: "Pearson Mepro Level 10 Certified (English Language Training)", desc: "Achieved Level 10 proficiency certification in English Language Training by Pearson. (Oct 2026)" }
  ];

  return (
    <section id="about" className="py-28 border-t border-neutral-200/30 dark:border-neutral-900/40 px-4 relative">
      <div className="max-w-5xl mx-auto space-y-20">
        
        {/* Profile Summary card with clean typography */}
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-200/50 dark:border-amber-500/10 bg-orange-50/30 dark:bg-amber-500/5 text-orange-600 dark:text-amber-400 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] shadow-sm">
            ABOUT MY PATH
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white pb-1 font-display">
            Skill & Academic Core
          </h2>
          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/65 backdrop-blur-md border border-neutral-200/60 dark:border-slate-800 leading-relaxed text-sm sm:text-base text-neutral-600 dark:text-slate-300 shadow-sm text-left">
            <span className="font-sans text-[10px] uppercase text-orange-600 dark:text-amber-400 font-bold block mb-2 tracking-[0.2em]">My Narrative</span>
            Final-year Computer Science undergraduate at Marri Laxman Reddy Institute of Technology and Management (MLRITM) specializing in generative AI, agentic workflows, and full-stack development with OpenAI, Gemini, and Groq. Winner of 2nd Prize at the GEN-AI FORGE Hackathon, Top 10 Finalist at the India-Japan Innovation Hackathon, and patent applicant for EchoShield—an acoustic-state-aware sensor fusion method. I also build custom full-stack and AI client solutions as a freelancer.
          </div>
        </div>

        {/* Technical Skills Bento Grid */}
        <div className="space-y-6">
          <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white pb-3 border-b border-neutral-200/30 dark:border-neutral-900/40 flex items-center gap-2 font-display">
            <Cpu className="w-5 h-5 text-orange-500 animate-pulse" /> Technical Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {skillCategories.map((cat, index) => (
              <div 
                key={index}
                className="p-6 rounded-3xl border border-neutral-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/45 backdrop-blur-sm hover:border-orange-500/40 dark:hover:border-amber-400/40 transition-all group designer-shadow-sm flex flex-col items-start text-left"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-neutral-100/50 dark:bg-neutral-900/60">
                    {cat.icon}
                  </div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 font-sans tracking-[0.14em] uppercase">
                    {cat.category}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill, i) => (
                    <span 
                      key={i}
                      className="text-xs px-3 py-1 rounded bg-white/80 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800 dark:text-neutral-300 text-neutral-600 hover:text-neutral-900 dark:hover:text-white font-sans transition-all cursor-default shadow-2xs group-hover:border-orange-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coding Profiles Tracker */}
        <div className="space-y-6">
          <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2 pb-3 border-b border-neutral-200/30 dark:border-neutral-900/40 font-display">
            <Brain className="w-5 h-5 text-orange-500" /> Competitive Coding Portals
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profiles.map((prof, index) => (
              <motion.a 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={prof.url} 
                target="_blank" 
                rel="noopener noreferrer"
                key={index}
                className={`p-5 rounded-3xl border text-center flex flex-col justify-center items-center gap-1 cursor-pointer transition-all ${prof.color} designer-shadow-sm`}
              >
                <span className="text-xs font-bold tracking-tight text-neutral-800 dark:text-neutral-100 font-sans">{prof.name}</span>
                <span className="text-[11px] font-sans tracking-wide opacity-80">{prof.count}</span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Education Timeline & Honors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Education Timeline */}
          <div className="space-y-6 text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2 text-neutral-900 dark:text-white pb-3 border-b border-neutral-200/30 dark:border-neutral-900/40 font-display">
              <GraduationCap className="w-5 h-5 text-orange-500 animate-bounce" /> Education
            </h3>
            <div className="relative border-l border-neutral-200 dark:border-slate-800 pl-5 space-y-8 py-2">
              {education.map((edu, index) => (
                <div key={index} className="relative group">
                  {/* Circle locator */}
                  <div className="absolute -left-[26px] p-1.5 rounded-full bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 group-hover:border-orange-500 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 group-hover:bg-orange-500 transition-colors" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-400 block font-medium">{edu.period}</span>
                    <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-orange-500 dark:group-hover:text-amber-400 transition-colors leading-snug">
                      {edu.degree}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">{edu.institution}</p>
                    <span className="inline-block mt-1 font-sans text-[11px] px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-amber-400 font-bold border border-orange-500/5">
                      {edu.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Honors & Patents Vertical Marquee */}
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/30 dark:border-neutral-900/40">
              <h3 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2 text-neutral-900 dark:text-white font-display">
                <Award className="w-5 h-5 text-orange-500" /> Honors & Patents
              </h3>
              <button
                type="button"
                onClick={() => setIsMarqueePaused((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-[11px] font-medium text-neutral-600 dark:text-neutral-300 hover:border-orange-500/40 hover:text-orange-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                aria-label={isMarqueePaused ? "Resume honors scroll" : "Pause honors scroll"}
                id="honors-marquee-toggle"
              >
                {isMarqueePaused ? (
                  <>
                    <Play className="w-3 h-3" /> Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3" /> Pause
                  </>
                )}
              </button>
            </div>

            <div className="vertical-marquee-container relative h-[440px] sm:h-[404px] overflow-hidden rounded-3xl">
              {/* Top & bottom fade masks */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#fbfcfa] dark:from-[#0b1121] to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#fbfcfa] dark:from-[#0b1121] to-transparent z-10 pointer-events-none" />

              <div
                className="animate-vertical-marquee flex flex-col"
                style={{ animationPlayState: isMarqueePaused ? "paused" : undefined }}
              >
                {[0, 1].map((dupIdx) => (
                  <div
                    key={dupIdx}
                    aria-hidden={dupIdx === 1}
                    className="flex flex-col gap-4 pb-4"
                  >
                    {achievements.map((ach, index) => (
                      <div
                        key={`${dupIdx}-${index}`}
                        className="h-[136px] sm:h-[124px] p-4 sm:p-5 rounded-3xl border border-neutral-200/50 dark:border-slate-800 bg-white/75 dark:bg-slate-900/55 backdrop-blur-md flex items-center gap-3.5 hover:border-orange-500/30 dark:hover:border-amber-400/30 transition-all designer-shadow-sm"
                      >
                        <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-neutral-900 flex-shrink-0 text-amber-500 flex items-center justify-center border border-orange-200/10">
                          <Award className="w-4 h-4 text-orange-500 dark:text-amber-400" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-[#f3f2f0] font-sans leading-snug line-clamp-2">
                            {ach.title}
                          </h4>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal font-normal line-clamp-2">
                            {ach.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
