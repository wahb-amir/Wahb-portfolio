"use client";
import React, { useEffect, useRef, useState } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import { SiGithub } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";

// Font configurations
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
});
const inter = Inter({ subsets: ["latin"] });

// Minimal SocialIcon component
const SocialIcon: React.FC<{
  href: string;
  ariaLabel?: string;
  icon: React.ReactNode;
  isDark: boolean;
  accent: string;
}> = ({ href, ariaLabel, icon, isDark, accent }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel}
    className="inline-flex items-center justify-center w-10 h-10 rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
    style={{
      borderColor: isDark ? "#0b1220" : "#e6eef6",
      background: isDark ? "transparent" : "white",
      color: accent,
    }}
  >
    {icon}
  </a>
);

const CONTACT_EMAIL = "wahbamir2010@gmail.com";
const CLIENT_PORTAL = "https://dashboard.wahb.space";
const CLIENT_QUOTE = `${CLIENT_PORTAL}#request-quote`;

const Contact: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const reduceMotion = useReducedMotion();

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    interest: "Full-Stack Web Application",
  });

  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => setHydrated(true), []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      if (!res.ok) throw new Error(data?.error || "Something went wrong");

      setStatus("sent");
      setFormData((prev) => ({ ...prev, email: "", message: "" }));
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

  // THEME / ACCENT
  const ACCENT_LIGHT = "#0ea5e9";
  const ACCENT_DARK = "#00bfff";
  const accent = isDark ? ACCENT_DARK : ACCENT_LIGHT;

  const isSubmitting = status === "sending";
  const isSent = status === "sent";
  const isBusy = isSubmitting;

  return (
    <section
      className={`${inter.className} min-h-screen flex flex-col items-center justify-center overflow-hidden relative bg-white text-black dark:bg-[#0b1220] dark:text-white bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]`}
    >
      {/* Background Ambient Glows (blue theme) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Mobile Title */}
      <div
        aria-hidden="true"
        className={`text-center w-full mt-5 mb-5 text-6xl sm:text-6xl font-bold z-30 ${playfair.className} pointer-events-none select-none text-black dark:text-white`}
      >
        Let's Talk
      </div>

      {/* --- TOOLBAR: email chip + CTAs + socials (responsive & aligned) --- */}
      <div className="w-full max-w-4xl px-4 mb-6 z-10">
        <div
          className="flex flex-col sm:flex-row items-center sm:justify-between gap-3"
          role="toolbar"
          aria-label="Contact actions"
        >
          {/* Left: email chip */}
          <div className="flex items-center gap-3">
            <button
              onClick={copyEmail}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") copyEmail();
              }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
              style={{
                background: isDark ? "rgba(15,23,42,0.45)" : "rgba(255,255,255,0.9)",
                borderColor: isDark ? "#0b1220" : "#e6eef6",
                color: isDark ? "#e6eef6" : "#0f172a",
              }}
              aria-label={`Copy email address ${CONTACT_EMAIL}`}
              type="button"
            >
              <MdEmail className="w-5 h-5" style={{ color: accent }} aria-hidden />
              <span className="text-sm font-medium">{CONTACT_EMAIL}</span>
              <span className="ml-2 text-xs" role="status" aria-live="polite">
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>
          </div>

          {/* Right: CTAs + Socials */}
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
            <a
              href={CLIENT_QUOTE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
              aria-label="Request a quote"
              style={{
                backgroundColor: accent,
                color: "#fff",
                boxShadow: `0 6px 18px ${accent}33`,
              }}
            >
              Request a quote
            </a>

        
            <SocialIcon
              href="https://github.com/wahb-amir"
              ariaLabel="Open GitHub"
              icon={<SiGithub className="w-5 h-5" aria-hidden="true" />}
              isDark={isDark}
              accent={accent}
            />
          </div>
        </div>
      </div>
      {/* --- end toolbar --- */}

      {/* Main Container */}
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10 w-full max-w-7xl">
        {/* Center Form Card */}
        <div className="w-full md:w-2/3 max-w-xl mx-4 relative">
          <div className="relative overflow-hidden group rounded-3xl p-8 md:p-12 border transition-all duration-500 shadow-2xl bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:shadow-sky-900/20">
            {/* Subtle Gradient Overlay on Card (blue) */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100/40 to-blue-100/30 pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-sky-400 p-[2px]">
                <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center text-xs font-bold text-black dark:text-white">
                  W.A
                </div>
              </div>
              <div>
                <p className="text-gray-500 dark:text-white/80 text-sm">I am Wahb</p>
                <p className="text-black dark:text-white font-medium">
                  Ready to turn your idea into a real product?
                </p>
              </div>
            </div>

            {/* Conversational Form */}
            {!isSent ? (
              <form
                onSubmit={handleSubmit}
                className="relative space-y-6 text-xl md:text-2xl leading-relaxed text-gray-700 dark:text-gray-100 z-10"
                aria-busy={isBusy}
              >
                <p>
                  Hi there! My name is
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mx-2 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-400 outline-none text-black dark:text-white placeholder-gray-700 dark:placeholder-gray-200 w-40 transition-colors rounded-2xl"
                  />
                  .
                </p>

                <p className="text-gray-700 dark:text-gray-200">
                  I'm looking for help with
                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                   className="mx-2 bg-transparent border-b-2 border-gray-600 focus:border-gray-300 dark:border-gray-400 outline-none text-gray-800 dark:text-white font-medium cursor-pointer transition-colors appearance-none"
                  >
                    <option value="Full-Stack Web Application">
                      Full-Stack Web Application
                    </option>
                    <option value="Backend Development">
                      Backend Development & APIs
                    </option>
                    <option value="SEO Optimization">
                      SEO & Performance Optimization
                    </option>
                    <option value="Custom Web Solution">Custom Web Solution</option>
                  </select>
                  .
                </p>

                <p>
                  You can reach me at
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="mx-2 bg-transparent border-b-2 border-gray-300 dark:border-gray-200 focus:border-blue-400 outline-none text-black dark:text-white placeholder-gray-800 dark:placeholder-gray-200 w-full sm:w-64 transition-colors rounded-2xl"
                  />
                  to discuss details.
                </p>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full py-4 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-xl overflow-hidden transition-all hover:scale-[1.02]"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-sky-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? "Sending..." : "Send Message"}
                      {!isSubmitting && (
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12 animate-fade-in z-10">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                  Message Received!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Thanks, {formData.name || "there"}. We'll be in touch shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm text-blue-500 hover:text-blue-400 underline"
                >
                  Send another?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
