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

  const CONTACT_EMAIL = "wahbamir2010@gmail.com";

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

  // client platform links (kept for "request quote" & portal open — login removed)
  const CLIENT_PORTAL = "https://projects.buttnetworks.com";
  const CLIENT_QUOTE = `${CLIENT_PORTAL}#request-quote`;

  // ------- THEME / ACCENT: update these hexes to match your brand colors -------
  const ACCENT_LIGHT = "#0ea5e9"; // change to your light-theme accent
  const ACCENT_DARK = "#00bfff";  // change to your dark-theme accent
  const accent = isDark ? ACCENT_DARK : ACCENT_LIGHT;
  // ---------------------------------------------------------------------------

  return (
    <section
      id="contact"
      ref={ref}
      aria-labelledby="contact-heading"
      // expose accent as css var for possible custom styling in nested elements
      style={{ ['--accent']: accent }}
      className={`relative flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden z-10  bg-[#f9fafb] dark:bg-[#0f172a]
    bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
    text-black dark:text-white`}
    >
      {hydrated && <LazyBackgroundEffect />}

      <motion.h2
        id="contact-heading"
        className="text-3xl sm:text-4xl font-extrabold mb-3 text-center z-10"
        initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Let’s build something together 💡
      </motion.h2>

      <motion.p
        className="text-center text-sm sm:text-base max-w-2xl mb-6 z-10 text-gray-700 dark:text-slate-300"
        initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Prefer email or quick socials? Use the form below — portal users get progress tracking and direct dev chat.
      </motion.p>

      {/* CLIENT BANNER — moved under heading, cleaned up design, LOGIN REMOVED */}
      <div className="w-full max-w-4xl mb-6 z-20 flex justify-center">
        <div
          className="rounded-xl p-6 flex flex-col items-center text-center gap-4
               backdrop-blur-md bg-white/80 dark:bg-slate-900/60 border shadow-sm"
          style={{
            borderColor: `${isDark ? "#0b1220" : "#e6eef6"}`,
          }}
        >
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Client portal is live — manage projects & request quotes ✨
            </h3>
            <p className="text-xs text-gray-600 dark:text-slate-300 mt-2 max-w-lg mx-auto">
              If you’re a client, you can request a quote or open the portal for tracking. This form still works for quick messages.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <a
              href={CLIENT_QUOTE}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm rounded-md font-medium shadow-sm"
              aria-label="Request a quote"
              style={{
                backgroundColor: accent,
                color: "#fff",
                boxShadow: `0 6px 18px ${accent}33`,
              }}
            >
              Request a quote
            </a>

            <a
              href={CLIENT_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm rounded-md font-medium border"
              aria-label="Open client portal"
              style={{
                borderColor: isDark ? "#172031" : "#e6eef6",
                backgroundColor: isDark ? "transparent" : "white",
              }}
            >
              Open portal
            </a>
          </div>
        </div>
      </div>


      <div className="z-10 flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-full border shadow-sm"
          style={{
            background: isDark ? "rgba(15,23,42,0.45)" : "rgba(255,255,255,0.85)",
            borderColor: isDark ? "#0b1220" : "#e6eef6",
          }}
        >
          <MdEmail className="w-5 h-5" style={{ color: accent }} />
          <button
            onClick={copyEmail}
            className="text-sm font-medium hover:underline"
            aria-label={`Copy email address ${CONTACT_EMAIL}`}
            title="Copy email"
            style={{ color: isDark ? "#e6eef6" : "#0f172a" }}
          >
            {CONTACT_EMAIL}
          </button>
          <span className="ml-2 text-xs" style={{ color: isDark ? "#94a3b8" : "#6b7280" }}>
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
            accent={accent}
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
          className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 dark:bg-slate-800 dark:border-slate-700 focus:outline-none transition"
        />
        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 dark:bg-slate-800 dark:border-slate-700 focus:outline-none transition"
        />
        <textarea
          name="message"
          rows={6}
          placeholder="Briefly tell me what you want to build"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 dark:bg-slate-800 dark:border-slate-700 focus:outline-none transition"
        />

        <div className="relative h-14 overflow-hidden rounded-full">
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full h-full py-3 rounded-full font-medium tracking-wide transition relative"
            style={{
              backgroundColor: status === "sending" ? "#cbd5e1" : accent,
              color: status === "sending" ? (isDark ? "#0b1220" : "#111827") : "#fff",
              boxShadow: status === "sending" ? "none" : `0 8px 30px ${accent}33`,
            }}
            aria-live="polite"
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
          <ChevronUpIcon className="w-8 h-8" style={{ color: accent }} />
        </button>
        <button
          onClick={() => document.getElementById("hero-section")?.scrollIntoView({ behavior: "smooth" })}
          aria-label="Scroll Down"
          className="animate-pulse hover:scale-110 transition-transform"
        >
          <ChevronDownIcon className="w-8 h-8" style={{ color: accent }} />
        </button>
      </div>
    </section>
  );
}

function SocialIcon({ href, label, ariaLabel, icon, isDark, accent }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      title={label}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition shadow-sm border`}
      style={{
        background: isDark ? "rgba(255,255,255,0.03)" : "#fff",
        borderColor: isDark ? "rgba(255,255,255,0.04)" : "#e6eef6",
        color: accent,
      }}
    >
      {icon}
    </a>
  );
}
