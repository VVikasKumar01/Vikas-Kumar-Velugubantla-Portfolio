import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setErrorMessage("Please fill out all fields before submitting.");
      return;
    }

    setSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || "A submission error occurred.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmitStatus('error');
      setErrorMessage("Cannot connect to server. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-28 border-t border-neutral-200/30 dark:border-neutral-900/40 px-4 relative overflow-hidden">
      {/* Background Decorator Orbs */}
      <div className="absolute bottom-[-150px] left-[-150px] w-96 h-96 rounded-full bg-orange-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-16 relative">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-200/50 dark:border-amber-500/10 bg-orange-50/30 dark:bg-amber-500/5 text-orange-600 dark:text-amber-400 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] shadow-sm">
            DISPATCH INBOX
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-display">
            Get In Touch
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Have a project, job role, or collaboration request? Send a secure message directly to my inbox.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Quick Contact Info Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/65 backdrop-blur-md border border-neutral-200/60 dark:border-slate-800 space-y-8 text-left designer-shadow-md">
              <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 font-display uppercase tracking-wider">Contact Information</h3>
              
              <div className="space-y-5">
                {/* Email link */}
                <motion.a 
                  whileHover={{ x: 2 }}
                  href="mailto:v.vikaskumar2005@gmail.com"
                  className="flex items-center gap-4 text-neutral-600 dark:text-neutral-350 hover:text-orange-600 dark:hover:text-amber-450 transition-all cursor-pointer group"
                  id="contact-info-email"
                >
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-neutral-200/50 dark:border-slate-800 text-orange-500 dark:text-amber-400 shadow-sm">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-sans uppercase text-neutral-400 dark:text-neutral-400 font-bold tracking-wider">Direct Mail</p>
                    <p className="text-xs sm:text-sm font-semibold font-sans tracking-wide">v.vikaskumar2005@gmail.com</p>
                  </div>
                </motion.a>

                {/* Telephone */}
                <motion.a 
                  whileHover={{ x: 2 }}
                  href="tel:+917674020722"
                  className="flex items-center gap-4 text-neutral-600 dark:text-neutral-350 hover:text-orange-600 dark:hover:text-amber-450 transition-all cursor-pointer group"
                  id="contact-info-phone"
                >
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-neutral-200/50 dark:border-slate-800 text-orange-500 dark:text-amber-400 shadow-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-sans uppercase text-neutral-400 dark:text-neutral-400 font-bold tracking-wider">Call / WhatsApp</p>
                    <p className="text-xs sm:text-sm font-semibold font-sans tracking-wide">+91 7674020722</p>
                  </div>
                </motion.a>

                {/* Map location */}
                <div 
                  className="flex items-center gap-4 text-neutral-600 dark:text-neutral-350 group"
                >
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-neutral-200/50 dark:border-slate-800 text-orange-500 dark:text-amber-400 shadow-sm">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-sans uppercase text-neutral-400 dark:text-neutral-400 font-bold tracking-wider">Location</p>
                    <p className="text-xs sm:text-sm font-bold font-sans">Hyderabad, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Freelance Availability Info */}
            <div className="p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.02] text-neutral-600 dark:text-neutral-350 text-xs sm:text-sm leading-relaxed text-left space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for Freelance</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-450 leading-relaxed">
                I am actively taking on freelance projects! Whether you need a custom full-stack web application, 
                an AI-powered system, a polished responsive landing page, or dynamic analytics dashboards, feel free to hire me. 
                Let's work together to turn your ideas into functional digital reality!
              </p>
            </div>

          </div>

          {/* Contact form panel */}
          <div className="md:col-span-3">
            <form 
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-3xl border border-neutral-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/65 backdrop-blur-md space-y-5 text-left designer-shadow-md"
              id="contact-form"
            >
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-800 bg-neutral-50/50 dark:bg-slate-950/60 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 dark:text-white text-neutral-900 text-xs sm:text-sm outline-none transition-all shadow-2xs"
                  id="contact-input-name"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-800 bg-neutral-50/50 dark:bg-slate-950/60 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 dark:text-white text-neutral-900 text-xs sm:text-sm outline-none transition-all shadow-2xs"
                  id="contact-input-email"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Detailed Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Hi Vikas, we would love to collaborate..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-slate-800 bg-neutral-50/50 dark:bg-slate-950/60 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 dark:text-white text-neutral-900 text-xs sm:text-sm outline-none transition-all resize-none shadow-2xs"
                  id="contact-input-message"
                />
              </div>

              {/* Error indicator */}
              {submitStatus === 'error' && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-start gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success indicator */}
              {submitStatus === 'success' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-650 dark:text-emerald-400 flex items-start gap-3 text-xs">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                  <div className="text-left">
                    <p className="font-bold font-sans">Message Dispatched!</p>
                    <p className="text-neutral-500 dark:text-neutral-440 mt-0.5">Your secure transmission has been parsed, logged, and proxied. Thank you!</p>
                  </div>
                </div>
              )}

              {/* Submit button */}
              <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 via-orange-550 to-amber-500 text-white font-semibold text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 transition-all select-none disabled:opacity-50"
                id="contact-submit-btn"
              >
                {submitting ? (
                  <>Transmitting Securely...</>
                ) : (
                  <>
                    Send Secure Message <Send className="w-4 h-4 text-white" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
