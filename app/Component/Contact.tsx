"use client";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
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
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const CONTACT_EMAIL = "wahbamir2010@gmail.com";

  useEffect(() => setHydrated(true), []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
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
      // fallback to mailto
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  // client platform links (kept for "request quote" & portal open)
  const CLIENT_PORTAL = "https://dashboard.wahb.space";
  const CLIENT_QUOTE = `${CLIENT_PORTAL}#request-quote`;

  // THEME / ACCENT
  const ACCENT_LIGHT = "#0ea5e9";
  const ACCENT_DARK = "#00bfff";
  const accent = isDark ? ACCENT_DARK : ACCENT_LIGHT;

  // small helper so screen readers know when the form is busy
  const isBusy = status === "sending";

  return (
    <section
      id="contact"
      ref={ref}
      aria-labelledby="contact-heading"
      role="region"
      data-keywords="contact,form,email,client-portal,quote"
      style={{ ["--accent"]: String(accent) } as React.CSSProperties}
      className={`relative flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden z-10 bg-[#f9fafb] dark:bg-[#0f172a]
        bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88] text-black dark:text-white`}
    >
      {/* background effect purely decorative */}
      {hydrated && <LazyBackgroundEffect aria-hidden="true" />}

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
        Prefer email or quick socials? Use the form below — portal users get
        progress tracking and direct dev chat.
      </motion.p>

      {/* CLIENT BANNER */}
      <div className="w-full max-w-4xl mb-6 z-20 flex justify-center">
        <div
          className="rounded-xl p-6 flex flex-col items-center text-center gap-4 backdrop-blur-md bg-white/80 dark:bg-slate-900/60 border shadow-sm"
          style={{ borderColor: `${isDark ? "#0b1220" : "#e6eef6"}` }}
          role="note"
          aria-label="Client portal information"
          data-keywords="client-portal,banner,quote"
        >
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Client portal is live — manage projects & request quotes ✨
            </h3>
            <p className="text-xs text-gray-600 dark:text-slate-300 mt-2 max-w-lg mx-auto">
              If you’re a client, you can request a quote or open the portal for
              tracking. This form still works for quick messages.
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
              data-keywords="request-quote,cta"
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
              data-keywords="open-portal,cta"
            >
              Open portal
            </a>
          </div>
        </div>
      </div>

      {/* contact & social row */}
      <div
        className="z-10 flex flex-col sm:flex-row items-center gap-4 mb-6"
        aria-hidden={false}
      >
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-full border shadow-sm cursor-pointer select-none"
          style={{
            background: isDark
              ? "rgba(15,23,42,0.45)"
              : "rgba(255,255,255,0.85)",
            borderColor: isDark ? "#0b1220" : "#e6eef6",
          }}
          onClick={copyEmail}
          role="button"
          aria-label={`Copy email address ${CONTACT_EMAIL}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") copyEmail();
          }}
          data-keywords="email,contact,copy"
        >
          <MdEmail
            className="w-5 h-5"
            style={{ color: accent }}
            aria-hidden="true"
          />
          <span
            className="text-sm font-medium hover:underline"
            style={{ color: isDark ? "#e6eef6" : "#0f172a" }}
          >
            {CONTACT_EMAIL}
          </span>
          <span
            className="ml-2 text-xs"
            style={{ color: isDark ? "#94a3b8" : "#6b7280" }}
            role="status"
            aria-live="polite"
          >
            {copied ? "Copied!" : "Click to copy"}
          </span>
        </div>

        <div className="flex items-center gap-3" data-keywords="socials,github">
          <SocialIcon
            href="https://github.com/wahb-amir"
            label="GitHub"
            ariaLabel="Open GitHub"
            icon={<SiGithub className="w-5 h-5" aria-hidden="true" />}
            isDark={isDark}
            accent={accent}
          />
        </div>
      </div>

      {/* Contact form */}
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-xl space-y-5 z-10"
        initial={reduceMotion ? {} : { opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        role="form"
        aria-label="Contact form"
        aria-describedby="contact-form-desc"
        data-keywords="contact-form,lead,message"
      >
        <p id="contact-form-desc" className="sr-only">
          Use this form to contact Wahb. All fields are required.
        </p>

        {/* Visible labels for screen readers (placeholder preserved for visual users) */}
        <label htmlFor="contact-name" className="sr-only">
          Full name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 dark:bg-slate-800 dark:border-slate-700 focus:outline-none transition"
        />

        <label htmlFor="contact-email" className="sr-only">
          Email address
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 dark:bg-slate-800 dark:border-slate-700 focus:outline-none transition"
        />

        <label htmlFor="contact-message" className="sr-only">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          placeholder="Briefly tell me what you want to build"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 dark:bg-slate-800 dark:border-slate-700 focus:outline-none transition"
        />

        <div
          className="relative h-14 overflow-hidden rounded-full"
          aria-live="polite"
        >
          <button
            type="submit"
            disabled={isBusy}
            className="w-full h-full py-3 rounded-full font-medium tracking-wide transition relative"
            style={{
              backgroundColor: isBusy ? "#cbd5e1" : accent,
              color: isBusy ? (isDark ? "#0b1220" : "#111827") : "#fff",
              boxShadow: isBusy ? "none" : `0 8px 30px ${accent}33`,
            }}
            aria-busy={isBusy}
            aria-disabled={isBusy}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={status}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-block"
                aria-live="polite"
                role="status"
              >
                {status === "sending"
                  ? "Sending..."
                  : status === "error"
                  ? "Error sending"
                  : status === "sent"
                  ? "✅ Sent!"
                  : "Send message"}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.form>

      <div className="relative z-10 flex flex-row items-center justify-center gap-6 mt-8">
        <button
          onClick={() =>
            document
              .getElementById("hero-section")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          aria-label="Scroll Up"
          className="hover:scale-110 transition-transform p-2 bg-white/10 rounded-full"
        >
          <ChevronUpIcon
            className="w-8 h-8"
            style={{ color: accent }}
            aria-hidden="true"
          />
        </button>
      </div>
    </section>
  );
}
type SocialIconProps = {
  href: string;
  label: string;
  ariaLabel: string;
  icon: React.ReactNode;
  isDark: boolean;
  accent: string;
};
function SocialIcon({
  href,
  label,
  ariaLabel,
  icon,
  isDark,
  accent,
}: SocialIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      title={label}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full transition shadow-sm border"
      style={{
        background: isDark ? "rgba(255,255,255,0.03)" : "#fff",
        borderColor: isDark ? "rgba(255,255,255,0.04)" : "#e6eef6",
        color: accent,
      }}
      data-keywords={`social,${label.toLowerCase()}`}
    >
      {icon}
    </a>
  );
}
