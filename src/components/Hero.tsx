import React, { useState } from "react";
import { ArrowDown, Download, Mail, ArrowRight, Github, Linkedin, Award, Play } from "lucide-react";
import { motion } from "motion/react";
import { jsPDF } from "jspdf";
import avatarImage from "../assets/images/profile_avatar_3D_1.png";

interface HeroProps {
  onContactClick: () => void;
  onProjectsClick: () => void;
  trackDownload: () => Promise<void>;
}

export default function Hero({ onContactClick, onProjectsClick, trackDownload }: HeroProps) {
  const [downloading, setDownloading] = useState(false);

  // Generate a beautiful, professionally formatted PDF Resume
  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Trigger analytics call
      await trackDownload();

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      let y = 12; // starting vertical position in mm

      // Colors matching the portfolio theme
      const primaryColor = [234, 88, 12]; // Orange (Hex #ea580c)
      const secondaryColor = [17, 24, 39]; // Charcoal/Dark Gray (Hex #111827)
      const bodyColor = [55, 65, 81]; // Medium Gray (Hex #374151)
      const lightGray = [107, 114, 128]; // Muted Gray (Hex #6b7280)

      // 1. HEADER
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("VIKAS KUMAR VELUGUBANTLA", 105, y, { align: "center" });
      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text("Computer Science & Engineering Undergraduate (Class of 2027)", 105, y, { align: "center" });
      y += 4.5;

      doc.setFontSize(8);
      doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);
      doc.text("Hyderabad, India  |  v.vikaskumar2005@gmail.com  |  +91 7674020722", 105, y, { align: "center" });
      y += 4;

      doc.text("Portfolio: vikas-kumar-velugubantla-portfolio.onrender.com", 105, y, { align: "center" });
      y += 4;

      doc.text("GitHub: github.com/VVikasKumar01  |  LinkedIn: linkedin.com/in/vikas-kumar-velugubantla", 105, y, { align: "center" });
      y += 5;

      // Draw primary horizontal divider line
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(15, y, 195, y);
      y += 6;

      // Helper function to render section title and divider line
      const renderSectionTitle = (title: string) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(title, 15, y);
        y += 1.5;
        
        // Underline section title with thin divider
        doc.setDrawColor(229, 231, 235); // Light grey line (Hex #e5e7eb)
        doc.setLineWidth(0.2);
        doc.line(15, y, 195, y);
        y += 4.5;
      };

      // 2. PROFILE SUMMARY
      renderSectionTitle("PROFILE SUMMARY");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);
      
      const profileText = "Highly motivated Computer Science student specializing in full-stack web development, artificial intelligence integrations, and data analytics. Proven track record of building production-grade web applications using the MERN stack, FastAPI, and LLMs (Gemini, Groq, Llama). Recognized hackathon finalist (Top 20 of 1,500+ participants nationwide).";
      const profileLines = doc.splitTextToSize(profileText, 180);
      profileLines.forEach((line: string) => {
        doc.text(line, 15, y);
        y += 3.8;
      });
      y += 2.5;

      // 3. EDUCATION
      renderSectionTitle("EDUCATION");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text("Marri Laxman Reddy Institute of Technology and Management, Hyderabad", 15, y);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.text("Aug 2023 - May 2027", 195, y, { align: "right" });
      y += 3.8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);
      doc.text("B.Tech in Computer Science and Engineering  |  CGPA: 8.32 / 10.0", 15, y);
      y += 5.5;

      // 4. TECHNICAL SKILLS
      renderSectionTitle("TECHNICAL SKILLS");
      
      const skills = [
        { category: "Languages", list: "Python, JavaScript, Java, SQL, HTML / CSS" },
        { category: "Frameworks & DBs", list: "ReactJS, NodeJS, ExpressJS, FastAPI, MongoDB, Bootstrap" },
        { category: "Analytics & BI", list: "Power BI, Chart.js, Dashboarding, Predictive Analytics, Scikit-learn" },
        { category: "AI & LLMs", list: "Groq SDK, Gemini Vision API, OpenAI API, Prompt Engineering, Huggingface LLMs" },
        { category: "AI Tools", list: "Google AI Studio, Antigravity, Gemini, Claude, ChatGPT" },
        { category: "DevOps & Tools", list: "GitHub, Vercel, Render, Postman, MongoDB Atlas" }
      ];

      skills.forEach((skill) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.text(`${skill.category}: `, 15, y);
        
        const offset = doc.getTextWidth(`${skill.category}: `);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);
        doc.text(skill.list, 15 + offset, y);
        y += 3.8;
      });
      y += 2.5;

      // 5. EXPERIENCE
      renderSectionTitle("EXPERIENCE");

      // Experience 1: Freelance
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text("Apple Tree Play School (Client Project)", 15, y);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.text("May 2026 - June 2026", 195, y, { align: "right" });
      y += 3.8;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);
      doc.text("Freelance Full-Stack Developer", 15, y);
      y += 4;

      const freelanceBullets = [
        "Designed and engineered a custom School Management System ERP to digitize student admissions, fee tracking, and administrative records.",
        "Implemented role-based secure access control (RBAC) to segment panels for administrators, teachers, and parents."
      ];

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      freelanceBullets.forEach((bullet) => {
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("•", 18, y);
        doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);
        
        const bulletLines = doc.splitTextToSize(bullet, 172);
        bulletLines.forEach((line: string) => {
          doc.text(line, 22, y);
          y += 3.8;
        });
      });
      y += 2.5;

      // Experience 2: EduSkills
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text("Virtual Intern - Prompt Engineering for AI", 15, y);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.text("Jan 2026 - Mar 2026", 195, y, { align: "right" });
      y += 3.8;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);
      doc.text("EduSkills Academy & AICTE", 15, y);
      y += 4;

      // Bullets
      const expBullets = [
        "Completed a 10-week structured internship with an Outstanding (O) grade.",
        "Designed and refined prompt pipelines that improved AI response accuracy by 15% across 3 applications, ensuring consistent, reliable outputs across OpenAI, Gemini, and Groq integrations."
      ];

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      expBullets.forEach((bullet) => {
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("•", 18, y);
        doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);
        
        const bulletLines = doc.splitTextToSize(bullet, 172);
        bulletLines.forEach((line: string) => {
          doc.text(line, 22, y);
          y += 3.8;
        });
      });
      y += 1.5;

      // 6. SELECTED PROJECTS
      renderSectionTitle("PROJECTS");

      const projects = [
        {
          title: "PlaceIQ - AI Campus Placement Platform",
          date: "Mar 2026",
          desc: "Multi-agent AI platform using Groq SDK (Llama 4) for review parsing and mock interviews. Built custom recruiter analytics dashboards using Chart.js."
        },
        {
          title: "Vaidya Vani - Intelligent Prescription Parser",
          date: "Feb 2026",
          desc: "Uses Gemini Vision API to parse handwritten prescriptions and deliver audio feedback. Named a Top 20 Finalist out of 1500+ participants at HackWithAI National Hackathon."
        },
        {
          title: "Technical Treasure Hunt Platform",
          date: "Mar 2026",
          desc: "Real-time MERN application that hosted an interactive treasure hunt with 50+ concurrent players and zero latency issues that validate player submissions and progressively reveal clues, with full deployment on Vercel, Render, and MongoDB Atlas."
        },
        {
          title: "Valorous2k26 - College Event Management Platform",
          date: "Feb 2026",
          desc: "An enterprise-grade college festival management and booking hub with analytics dashboards and role-based access controls to simplify event booking and scheduling."
        }
      ];

      projects.forEach((proj) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.text(proj.title, 15, y);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.text(proj.date, 195, y, { align: "right" });
        y += 3.8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);
        const projLines = doc.splitTextToSize(proj.desc, 180);
        projLines.forEach((line: string) => {
          doc.text(line, 15, y);
          y += 3.8;
        });
        y += 1.5;
      });
      y += 1.5;

      // 7. ACHIEVEMENTS
      renderSectionTitle("ACHIEVEMENTS");
      
      const achievements = [
        "2nd Prize - GEN-AI FORGE Hackathon 2026",
        "Top 20 Finalist - HackWithAI National Hackathon"
      ];

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      achievements.forEach((ach) => {
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("•", 18, y);
        doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);
        doc.text(ach, 22, y);
        y += 3.8;
      });
      y += 2.5;

      // 8. CERTIFICATIONS
      renderSectionTitle("CERTIFICATIONS");

      const certifications = [
        "Data Structures & Algorithms GeeksforGeeks Certification",
        "Python HackerRank Certifications",
        "SQL(DBMS) NXT Wave Certification",
        "Responsive Web Developer NXT Wave Certification",
        "Prompt Engineering for AI - EduSkills / AICTE"
      ];

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      certifications.forEach((cert) => {
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("•", 18, y);
        doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);
        doc.text(cert, 22, y);
        y += 3.8;
      });
      y += 2.5;

      // 9. PROGRAMMING PORTFOLIOS
      renderSectionTitle("PROGRAMMING PORTFOLIOS");

      const portfolios = [
        "HackerRank: Python (4-star), Java (4-star)",
        "295+ GeeksforGeeks problems | 35+ LeetCode problems | 65+ CodeChef problems solved"
      ];

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      portfolios.forEach((port) => {
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("•", 18, y);
        doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);
        doc.text(port, 22, y);
        y += 3.8;
      });
      y += 2.5;

      // 10. SOFT SKILLS
      renderSectionTitle("SOFT SKILLS");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(bodyColor[0], bodyColor[1], bodyColor[2]);
      doc.text("Problem Solving · Analytical Thinking · Adaptability · Fast Learner · Team Collaboration · Self-Motivation & Initiative", 105, y, { align: "center" });

      // Save document
      doc.save("Vikas_Kumar_Velugubantla_Resume.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="home" className="min-h-screen pt-32 pb-16 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Designer Background Gradient Pools */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-orange-500/5 to-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-12 sm:gap-16 z-10">
        
        {/* Left Side: Professional Headline and Actions */}
        <div className="flex-1 text-center md:text-left space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-wrap gap-2.5 justify-center md:justify-start"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-200/40 dark:border-amber-500/10 bg-orange-50/20 dark:bg-amber-500/5 text-orange-600 dark:text-amber-400 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-orange-500 dark:bg-amber-400 animate-pulse" />
              Class of 2027 • B.Tech CSE Student
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-200/50 dark:border-emerald-500/10 bg-emerald-50/20 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available for Freelance Projects
            </div>
          </motion.div>

          <div className="space-y-3">
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-sans text-[10px] text-neutral-400 dark:text-neutral-400 uppercase tracking-[0.25em] font-semibold"
            >
              Hi, my name is
            </motion.p>
            
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.08] font-display"
            >
              Vikas Kumar <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-550 to-amber-500 dark:from-amber-400 dark:to-orange-500">
                Velugubantla
              </span>
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed mx-auto md:mx-0 font-normal"
          >
            I am a full-stack developer and AI systems engineer. I design and build production-ready 
            web applications, integrate large language models, and deliver data-driven analytical solutions. 
            I also work as a freelancer and am always open to taking on exciting new freelance projects!
          </motion.p>

          {/* Core accomplishments / Tags */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-[11px] font-sans tracking-wide"
          >
            <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-neutral-200/50 dark:border-slate-800 text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 hover:border-amber-400/40 transition-colors shadow-sm cursor-default">
              <Award className="w-3.5 h-3.5 text-amber-500" /> Hackathon Finalist
            </span>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-neutral-200/50 dark:border-slate-800 text-neutral-500 dark:text-neutral-400 hover:border-amber-400/40 shadow-sm transition-colors cursor-default">
              CGPA: 8.32/10.0
            </span>
            
          </motion.div>

          {/* Actions with Spring Lift Motion */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onProjectsClick}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-600 via-orange-550 to-amber-500 text-white font-semibold text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 transition-all"
              id="hero-cta-projects"
            >
              View Projects <ArrowRight className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              disabled={downloading}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-neutral-250 dark:border-neutral-800 dark:text-neutral-200 text-neutral-700 font-semibold text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all"
              id="hero-cta-resume"
            >
              {downloading ? (
                <>Tracking...</>
              ) : (
                <>
                  Download Resume <Download className="w-4 h-4 text-orange-500" />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Socials shortcut with fine micro-scaling */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center md:justify-start gap-5 pt-6 border-t border-neutral-200/50 dark:border-neutral-900 w-fit mx-auto md:mx-0"
          >
            <motion.a 
              whileHover={{ scale: 1.15, y: -1.5 }}
              href="https://github.com/VVikasKumar01" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-orange-500 dark:hover:text-amber-400 transition-colors"
              title="GitHub Profile"
              id="hero-social-github"
            >
              <Github className="w-5 h-5" />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.15, y: -1.5 }}
              href="https://linkedin.com/in/vikas-kumar-velugubantla" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-orange-500 dark:hover:text-amber-400 transition-colors"
              title="LinkedIn Profile"
              id="hero-social-linkedin"
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.15, y: -1.5 }}
              href="mailto:v.vikaskumar2005@gmail.com"
              className="text-neutral-400 hover:text-orange-500 dark:hover:text-amber-400 transition-colors"
              title="Send Direct Email"
              id="hero-social-email"
            >
              <Mail className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>

        {/* Right Side: Exquisite Minimal Portrait Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-64 h-64 sm:w-[320px] sm:h-[320px] flex-shrink-0 flex items-center justify-center"
        >
          {/* Glass & Border Accents */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-600/10 to-amber-500/10 blur-[20px] animate-pulse pointer-events-none" />
          <div 
            id="hero-avatar-border-ring"
            className="absolute -inset-2.5 rounded-full border border-dashed border-orange-500/20 dark:border-amber-400/10 bg-gradient-to-tr from-orange-600/15 via-amber-500/5 to-transparent dark:from-orange-600/25 dark:via-amber-500/10 dark:to-transparent animate-[spin_65s_linear_infinite]" 
          />
          
          {/* Main Badge Container with Premium Styling */}
          <div 
            className="w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border border-black/[0.1] dark:border-white/[0.1] shadow-2xl bg-neutral-100 dark:bg-slate-900 flex items-center justify-center group relative cursor-pointer"
          >
            
            {/* Visual 3D doll avatar image */}
            <div className="absolute inset-0 w-full h-full select-none bg-neutral-100 dark:bg-slate-900">
              <img 
                src={avatarImage} 
                alt="Vikas Kumar Velugubantla 3D Avatar" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>

          </div>
        </motion.div>

      </div>

      <motion.div 
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="mt-16 sm:mt-24 text-neutral-400 dark:text-neutral-500 flex flex-col items-center gap-1.5 select-none pointer-events-none"
      >
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">Scroll To Explore</span>
        <ArrowDown className="w-3.5 h-3.5 text-orange-500" />
      </motion.div>
    </section>
  );
}
