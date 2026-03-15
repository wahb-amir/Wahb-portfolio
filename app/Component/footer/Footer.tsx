"use client";

/**
 * Footer.tsx
 * Same CSS custom-property pattern as Contact.tsx — all design tokens
 * live in .footer-root / .dark .footer-root, inline style values are
 * static strings like "var(--ft-accent)" that are identical on server
 * and client. Zero isDark branching = zero hydration mismatch.
 */

import React, { useEffect, useRef, useState } from "react";
import { Playfair_Display, DM_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  SiGithub,
  SiNextdotjs,
  SiTailwindcss,
  SiMongodb,
} from "react-icons/si";
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
  { ssr: false, loading: () => null },
);

const NAV_LINKS = [
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "project-section" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
  { label: "FAQ", id: "faq" },
];

const EXT_LINKS = [
  { label: "GitHub", href: "https://github.com/wahb-amir", icon: SiGithub },
  {
    label: "Client Portal",
    href: "https://dashboard.wahb.space",
    icon: ExternalLink,
  },
];

const STACK = [
  { label: "Next.js", icon: SiNextdotjs },
  { label: "Tailwind", icon: SiTailwindcss },
  { label: "MongoDB", icon: SiMongodb },
  { label: "Framer", icon: Zap },
];

const STATUS_LINES = [
  "Currently open for new projects",
  "Building something cool right now",
  "Available for freelance work",
  "Always happy to chat about ideas",
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [statusIdx, setStatusIdx] = useState(0);
  const [year] = useState(() => new Date().getFullYear());

  useEffect(() => {
    const id = setInterval(
      () => setStatusIdx((i) => (i + 1) % STATUS_LINES.length),
      3500,
    );
    return () => clearInterval(id);
  }, []);

  const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.55, delay, ease },
  });

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className={`footer-root ${dmSans.className} relative w-full overflow-hidden
        bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
        dark:from-[#00bfff18] dark:to-[#0078aa2e]
        text-black dark:text-white`}
      role="contentinfo"
      aria-label="Site footer"
    >
      <style>{`
        /* ─── Light tokens ─────────────────────────────────────── */
        .footer-root {
          --ft-accent:         #024f80;
          --ft-text-primary:   #0a1628;
          --ft-text-muted:     #1e3a52;
          --ft-text-subtle:    #2c4a63;
          --ft-divider:        rgba(10,22,40,0.18);
          --ft-status-bg:      rgba(2,79,128,0.1);
          --ft-status-border:  rgba(2,79,128,0.28);
          --ft-pill-bg:        rgba(255,255,255,0.55);
          --ft-pill-border:    rgba(10,22,40,0.2);
          --ft-pill-text:      #1e3a52;
          --ft-logo-grad:      linear-gradient(135deg, #024f80, #013a5e);
          --ft-logo-shadow:    rgba(2,79,128,0.3);
          --ft-shimmer:        linear-gradient(90deg, transparent 0%, #024f80 30%, #0369a1 70%, transparent 100%);
          --ft-shimmer-opacity: 0.4;
          --ft-glow-bg:        radial-gradient(ellipse, rgba(0,80,140,0.06) 0%, transparent 70%);
          --ft-watermark:      rgba(10,22,40,0.28);
          --ft-back-top-border: rgba(2,79,128,0.3);
          --ft-back-top-bg:    rgba(2,79,128,0.1);
          --ft-coffee:         #78350f;
        }

        /* ─── Dark tokens ──────────────────────────────────────── */
        .dark .footer-root,
        :is(.dark) .footer-root {
          --ft-accent:         #38bdf8;
          --ft-text-primary:   #f0f9ff;
          --ft-text-muted:     #94a3b8;
          --ft-text-subtle:    #ffffff;
          --ft-divider:        rgba(255,255,255,0.09);
          --ft-status-bg:      rgba(56,189,248,0.12);
          --ft-status-border:  rgba(56,189,248,0.22);
          --ft-pill-bg:        rgba(56,189,248,0.1);
          --ft-pill-border:    rgba(56,189,248,0.18);
          --ft-pill-text:      #94a3b8;
          --ft-logo-grad:      linear-gradient(135deg, #0ea5e9, #0284c7);
          --ft-logo-shadow:    rgba(14,165,233,0.35);
          --ft-shimmer:        linear-gradient(90deg, transparent 0%, #0ea5e9 30%, #38bdf8 70%, transparent 100%);
          --ft-shimmer-opacity: 0.5;
          --ft-glow-bg:        radial-gradient(ellipse, rgba(14,165,233,0.07) 0%, transparent 70%);
          --ft-watermark:      rgba(255,255,255,0.12);
          --ft-back-top-border: rgba(56,189,248,0.35);
          --ft-back-top-bg:    rgba(56,189,248,0.1);
          --ft-coffee:         #92400e;
        }

        /* ─── Utility classes ──────────────────────────────────── */
        .ft-accent-text   { color: var(--ft-accent); }
        .ft-text-primary  { color: var(--ft-text-primary); }
        .ft-text-muted    { color: var(--ft-text-muted); }
        .ft-text-subtle   { color: var(--ft-text-subtle); }
      `}</style>

      {/* Background effect */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <LazyBackgroundEffect />
      </div>

      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }}
      />

      {/* Top shimmer border — CSS-var driven, no JS */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "var(--ft-shimmer)",
          opacity: "var(--ft-shimmer-opacity)" as never,
        }}
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 280,
          borderRadius: "50%",
          background: "var(--ft-glow-bg)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-8">
        {/* ══ TOP GRID ══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Col 1: Brand */}
          <motion.div
            {...fade(0)}
            className="md:col-span-1 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm select-none"
                style={{
                  background: "var(--ft-logo-grad)",
                  color: "#fff",
                  boxShadow: "0 4px 14px var(--ft-logo-shadow)",
                }}
              >
                W
              </div>
              <span
                className={`${playfair.className} text-xl font-bold ft-text-primary`}
              >
                Wahb Amir
              </span>
            </div>

            <p className="ft-text-muted text-sm leading-relaxed max-w-xs font-medium">
              Full-stack engineer crafting fast, maintainable web products —
              from landing pages to production SaaS.
            </p>

            <div className="ft-text-muted flex items-center gap-1.5 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 ft-accent-text" />
              Based anywhere with good Wi-Fi
            </div>

            {/* Status ticker */}
            <div
              className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs font-semibold border ft-accent-text"
              style={{
                background: "var(--ft-status-bg)",
                borderColor: "var(--ft-status-border)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse ft-accent-text"
                style={{
                  background: "var(--ft-accent)",
                  boxShadow: "0 0 5px var(--ft-accent)",
                }}
              />
              <AnimatePresence mode="wait">
                <motion.span
                  key={statusIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28 }}
                  className="whitespace-nowrap"
                >
                  {STATUS_LINES[statusIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Col 2: Nav */}
          <motion.div {...fade(0.1)} className="flex flex-col gap-3">
            <p className="ft-accent-text text-[10px] font-bold uppercase tracking-[0.22em] mb-1">
              Navigation
            </p>
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                type="button"
                onClick={() =>
                  document
                    .getElementById(id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="ft-text-muted group flex items-center gap-2 text-sm font-medium w-fit transition-colors duration-150 hover:ft-accent-text"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--ft-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--ft-text-muted)")
                }
              >
                <span
                  className="h-px transition-all duration-200 group-hover:w-5"
                  style={{
                    width: "14px",
                    background: "var(--ft-accent)",
                    display: "block",
                    flexShrink: 0,
                  }}
                />
                {label}
              </button>
            ))}
          </motion.div>

          {/* Col 3: External + Stack */}
          <motion.div {...fade(0.2)} className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="ft-accent-text text-[10px] font-bold uppercase tracking-[0.22em] mb-1">
                Find me online
              </p>
              {EXT_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ft-text-muted group inline-flex items-center gap-2 text-sm font-medium w-fit"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--ft-accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--ft-text-muted)")
                  }
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0 ft-accent-text" />
                  {label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 ft-accent-text" />
                </a>
              ))}
            </div>

            {/* Stack badges */}
            <div>
              <p className="ft-accent-text text-[10px] font-bold uppercase tracking-[0.22em] mb-3">
                Built with
              </p>
              <div className="flex flex-wrap gap-2">
                {STACK.map(({ label, icon: SIcon }, i) => (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.07 }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border"
                    style={{
                      background: "var(--ft-pill-bg)",
                      borderColor: "var(--ft-pill-border)",
                      color: "var(--ft-pill-text)",
                    }}
                  >
                    <SIcon className="w-3 h-3 ft-accent-text" />
                    {label}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ══ DIVIDER ══ */}
        <div
          className="w-full h-px mb-6"
          style={{ background: "var(--ft-divider)" }}
        />

        {/* ══ BOTTOM BAR ══ */}
        <motion.div
          {...fade(0.3)}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          {/* Copyright */}
          <p className="ft-text-subtle flex items-center gap-1.5 flex-wrap justify-center sm:justify-start text-xs font-medium">
            <Code2 className="w-3.5 h-3.5 ft-accent-text" />
            <span>© {year} Wahb Amir.</span>
            <span>Designed &amp; built by me, for me.</span>
          </p>

          {/* Sign-off */}
          <p className="ft-text-subtle flex items-center gap-1.5 text-xs font-medium">
            Made with
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.5 }}
              className="inline-flex"
            >
              <Heart
                className="w-3.5 h-3.5"
                style={{ color: "#e11d48", fill: "#e11d48" }}
              />
            </motion.span>
            &amp;
            {/* Coffee icon colour is a fixed amber — same in both themes, no branching needed */}
            <Coffee
              className="w-3.5 h-3.5"
              style={{ color: "var(--ft-coffee)" }}
            />
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
            className="ft-accent-text group inline-flex items-center gap-1.5 text-xs font-bold transition-all duration-200 hover:scale-105"
          >
            Back to top
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-200 group-hover:-translate-y-0.5"
              style={{
                borderColor: "var(--ft-back-top-border)",
                background: "var(--ft-back-top-bg)",
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

        <p
          className="mt-6 text-center text-[10px] select-none font-medium"
          style={{ color: "var(--ft-watermark)" }}
        >
          wahb.space · v2.0 · {year}
        </p>
      </div>
    </motion.footer>
  );
}
