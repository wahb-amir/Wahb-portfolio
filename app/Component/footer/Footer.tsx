"use client";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { useTheme } from "next-themes";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { SiGithub, SiNextdotjs, SiTailwindcss, SiMongodb } from "react-icons/si";
import {
  ArrowUpRight,
  ExternalLink,
  Heart,
  MapPin,
  Coffee,
  Code2,
  Zap,
} from "lucide-react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});
const dmSans = DM_Sans({ subsets: ["latin"] });

const LazyBackgroundEffect = dynamic(
  () => import("../effects/BackgroundEffect"),
  { ssr: false, loading: () => null }
);

/* ── internal nav links ── */
const NAV_LINKS = [
  { label: "Skills",    id: "skills"         },
  { label: "Projects",  id: "project-section" },
  { label: "About",     id: "about"           },
  { label: "Contact",   id: "contact"         },
  { label: "FAQ",       id: "faq"             },
];

/* ── external links ── */
const EXT_LINKS = [
  {
    label: "GitHub",
    href:  "https://github.com/wahb-amir",
    icon:  SiGithub,
  },
  {
    label: "Client Portal",
    href:  "https://dashboard.wahb.space",
    icon:  ExternalLink,
  },
];

/* ── stack pills ── */
const STACK = [
  { label: "Next.js",   icon: SiNextdotjs   },
  { label: "Tailwind",  icon: SiTailwindcss  },
  { label: "MongoDB",   icon: SiMongodb      },
  { label: "Framer",    icon: Zap            },
];

/* ── rotating status messages ── */
const STATUS_LINES = [
  "Currently open for new projects",
  "Building something cool right now",
  "Available for freelance work",
  "Always happy to chat about ideas",
];

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [statusIdx, setStatusIdx] = useState(0);
  const [year] = useState(() => new Date().getFullYear());

  useEffect(() => {
    const id = setInterval(
      () => setStatusIdx((i) => (i + 1) % STATUS_LINES.length),
      3500
    );
    return () => clearInterval(id);
  }, []);

  /* design tokens */
  const accent      = isDark ? "#38bdf8"                : "#0284c7";
  const accentMuted = isDark ? "rgba(56,189,248,0.12)"  : "rgba(2,132,199,0.08)";
  const textPrimary = isDark ? "#f0f9ff"                : "#0c1a2e";
  const textMuted   = isDark ? "rgba(186,230,255,0.55)" : "#4a6280";
  const divider     = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const cardBg      = isDark ? "rgba(8,18,36,0.5)"      : "rgba(255,255,255,0.65)";

  const fade = (delay = 0) => ({
    initial:    { opacity: 0, y: 20 },
    animate:    inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  });

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className={`
        ${dmSans.className}
        relative w-full overflow-hidden
        bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
        dark:from-[#00bfff18] dark:to-[#0078aa2e]
        text-black dark:text-white
      `}
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Background effect */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <LazyBackgroundEffect />
      </div>

      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }}
      />

      {/* Top shimmer border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #0ea5e9 30%, #38bdf8 70%, transparent 100%)",
          opacity: 0.5,
        }}
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "0", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 300,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(ellipse, rgba(14,165,233,0.06) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(14,165,233,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-8">

        {/* ══════════ TOP SECTION ══════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* ── Col 1: Brand + status ── */}
          <motion.div {...fade(0)} className="md:col-span-1 flex flex-col gap-4">

            {/* Logo mark */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
                style={{
                  background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                  color: "#fff",
                  boxShadow: "0 4px 14px rgba(14,165,233,0.35)",
                }}
              >
                W
              </div>
              <span
                className={`${playfair.className} text-xl font-bold`}
                style={{ color: textPrimary }}
              >
                Wahb Amir
              </span>
            </div>

            {/* Tagline */}
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: textMuted }}>
              Full-stack engineer crafting fast, maintainable web products — from
              landing pages to production SaaS.
            </p>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs" style={{ color: textMuted }}>
              <MapPin className="w-3.5 h-3.5" style={{ color: accent }} />
              Based anywhere with good Wi-Fi
            </div>

            {/* Live status ticker */}
            <div
              className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs font-medium border"
              style={{
                background:   accentMuted,
                borderColor:  isDark ? "rgba(56,189,248,0.18)" : "rgba(2,132,199,0.15)",
                color: accent,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
                style={{ background: accent, boxShadow: `0 0 5px ${accent}` }}
              />
              <AnimatePresence mode="wait">
                <motion.span
                  key={statusIdx}
                  initial={{ opacity: 0, y: 6  }}
                  animate={{ opacity: 1, y: 0  }}
                  exit={{   opacity: 0, y: -6  }}
                  transition={{ duration: 0.3 }}
                >
                  {STATUS_LINES[statusIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Col 2: Site nav ── */}
          <motion.div {...fade(0.1)} className="flex flex-col gap-3">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1"
              style={{ color: accent }}
            >
              Navigation
            </p>
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                type="button"
                onClick={() =>
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="group flex items-center gap-2 text-sm w-fit transition-all duration-200"
                style={{ color: textMuted }}
              >
                <span
                  className="w-4 h-px transition-all duration-200 group-hover:w-6"
                  style={{ background: accent }}
                />
                <span
                  className="transition-colors duration-200 group-hover:translate-x-0.5"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
                >
                  {label}
                </span>
              </button>
            ))}
          </motion.div>

          {/* ── Col 3: External + Built with ── */}
          <motion.div {...fade(0.2)} className="flex flex-col gap-6">

            {/* External links */}
            <div className="flex flex-col gap-3">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1"
                style={{ color: accent }}
              >
                Find me online
              </p>
              {EXT_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm w-fit transition-all duration-200"
                  style={{ color: textMuted }}
                >
                  <Icon className="w-3.5 h-3.5 transition-colors duration-200 group-hover:text-current" style={{ color: accent }} />
                  <span
                    className="transition-colors duration-200"
                    onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
                  >
                    {label}
                  </span>
                  <ArrowUpRight
                    className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
                    style={{ color: accent }}
                  />
                </a>
              ))}
            </div>

            {/* Built-with stack */}
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                style={{ color: accent }}
              >
                Built with
              </p>
              <div className="flex flex-wrap gap-2">
                {STACK.map(({ label, icon: SIcon }, i) => (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.06 }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border"
                    style={{
                      background:  accentMuted,
                      borderColor: isDark ? "rgba(56,189,248,0.15)" : "rgba(2,132,199,0.12)",
                      color:       isDark ? "rgba(186,230,255,0.75)" : "#334e68",
                    }}
                  >
                    <SIcon className="w-3 h-3" style={{ color: accent }} />
                    {label}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ══════════ DIVIDER ══════════ */}
        <div className="w-full h-px mb-6" style={{ background: divider }} />

        {/* ══════════ BOTTOM BAR ══════════ */}
        <motion.div
          {...fade(0.3)}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ color: textMuted }}
        >
          {/* Copyright */}
          <p className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <Code2 className="w-3.5 h-3.5" style={{ color: accent }} />
            <span>© {year} Wahb Amir.</span>
            <span>Designed &amp; built by me, for me.</span>
          </p>

          {/* Personal sign-off */}
          <p className="flex items-center gap-1.5">
            Made with
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
              className="inline-flex"
            >
              <Heart className="w-3.5 h-3.5" style={{ color: "#f43f5e", fill: "#f43f5e" }} />
            </motion.span>
            &amp;
            <Coffee className="w-3.5 h-3.5" style={{ color: "#a16207" }} />
            in the late hours
          </p>

          {/* Back to top */}
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("hero-section")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="group inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105"
            style={{ color: accent }}
          >
            Back to top
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-200 group-hover:-translate-y-0.5"
              style={{
                borderColor: isDark ? "rgba(56,189,248,0.3)" : "rgba(2,132,199,0.25)",
                background:   accentMuted,
              }}
            >
              <svg
                className="w-2.5 h-2.5"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 8V2M2 5l3-3 3 3" />
              </svg>
            </span>
          </button>
        </motion.div>

        {/* Easter-egg tiny watermark */}
        <p
          className="mt-6 text-center text-[10px] select-none"
          style={{ color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
        >
          wahb.space · v2.0 · {year}
        </p>
      </div>
    </motion.footer>
  );
}