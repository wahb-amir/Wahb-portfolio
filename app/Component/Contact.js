"use client";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { SiGithub } from "react-icons/si";
import { MdEmail } from "react-icons/md";

const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
  ssr: false,
  loading: () => null,
});

export default function ContactForm() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState("idle");
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const CONTACT_EMAIL = "wahbamir2010@gamil.com";

  useEffect(() => setHydrated(true), []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative w-full h-fit pb-12 py-16 px-6 flex flex-col items-center justify-center overflow-hidden bg-[#f9fafb] dark:bg-[#0f172a] bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88] text-black"
      aria-labelledby="contact-heading"
    >
      {hydrated && <LazyBackgroundEffect />}

      <motion.h2
        id="contact-heading"
        className="text-3xl sm:text-4xl font-extrabold mb-2 text-center dark:text-white"
        initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Let’s build something together 💡
      </motion.h2>

      <motion.p
        className="text-center text-sm sm:text-base text-gray-700 dark:text-slate-300 max-w-2xl mb-6"
        initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Prefer email or quick socials? Hit up the form below or use one of the links — I usually reply within 48 hours.
      </motion.p>

      <div className="z-10 flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="flex items-center gap-3 bg-white/30 dark:bg-slate-900/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 dark:border-slate-700">
          <MdEmail className={`w-5 h-5 ${isDark ? "text-cyan-300" : "text-cyan-600"}`} />
          <button
            onClick={copyEmail}
            className="text-sm font-medium text-gray-800 dark:text-gray-100 hover:underline"
            aria-label={`Copy email address ${CONTACT_EMAIL}`}
            title="Copy email"
          >
            {CONTACT_EMAIL}
          </button>
          <span className="ml-2 text-xs text-gray-500 dark:text-slate-400">
            {copied ? "Copied!" : "Click to copy"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <SocialIcon
            href="https://github.com/coder101-js"
            label="GitHub"
            ariaLabel="Open GitHub"
            icon={<SiGithub className="w-5 h-5" />}
            isDark={isDark}
          />
        </div>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-xl space-y-5 z-10"
        initial={reduceMotion ? {} : { opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <input
          name="name"
          type="text"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 dark:placeholder-gray-400 transition"
        />
        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 dark:placeholder-gray-400 transition"
        />
        <textarea
          name="message"
          rows={6}
          placeholder="Briefly tell me what you want to build"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 dark:placeholder-gray-400 transition"
        />

        <div className="relative h-14 overflow-hidden rounded-full">
          <button
            type="submit"
            disabled={status === "sending"}
            className={`w-full h-full py-3 rounded-full font-medium tracking-wide transition
              ${status === "sending"
                ? "bg-gray-200 cursor-not-allowed text-gray-900 dark:text-gray-100"
                : "bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white"
              }
              focus:outline-none focus:ring-2 focus:ring-cyan-500 relative`}
          >
            <AnimatePresence mode="wait">
              <motion.span key={status} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {status === "sending" ? "Sending..." : status === "error" ? "Error sending" : status === "sent" ? "✅ Sent!" : "Send message"}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.form>

      <div className="relative z-10 flex flex-row items-center justify-center gap-6 mt-8">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll Up" className="hover:scale-110 transition-transform">
          <ChevronUpIcon className={`w-8 h-8 ${isDark ? "text-cyan-300" : "text-cyan-600"}`} />
        </button>
        <button
          onClick={() => document.getElementById("hero-section")?.scrollIntoView({ behavior: "smooth" })}
          aria-label="Scroll Up"
          className="animate-pulse hover:scale-110 transition-transform"
        >
          <ChevronDownIcon className={`w-8 h-8 ${isDark ? "text-cyan-300" : "text-cyan-600"}`} />
        </button>
      </div>
    </section>
  );
}

function SocialIcon({ href, label, ariaLabel, icon, isDark }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      title={label}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition shadow-sm ${isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-gray-100"} border border-white/10`}
    >
      {icon}
    </a>
  );
}
