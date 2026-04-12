"use client";

/**
 * Footer.tsx
 * All theming via Tailwind dark: variants — no CSS custom properties.
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
import { faGithub, faLinkedin, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

const EXT_LINKS: { label: string; href: string; icon: any; isFA?: boolean }[] = [
  { label: "GitHub", href: "https://github.com/wahb-amir", icon: SiGithub },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/wahb-amir",
    icon: faLinkedin,
    isFA: true,
  },
  {
    label: "X / Twitter",
    href: "https://x.com/wahbdev",
    icon: faXTwitter,
    isFA: true,
  },
  {
    label: "Client Portal",
    href: "https://dashboard.wahb.space",
    icon: ExternalLink,
    isFA: false,
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
      className={`${dmSans.className} relative w-full overflow-hidden
        bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
        dark:from-[#00bfff18] dark:to-[#0078aa2e]
        text-black dark:text-white`}
      role="contentinfo"
      aria-label="Site footer"
    >
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

      {/* Top shimmer border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-40 dark:opacity-50" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] rounded-full bg-sky-500/5 dark:bg-sky-500/7 blur-[40px]" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-8">
        {/* ══ TOP GRID ══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Col 1: Brand */}
          <motion.div {...fade(0)} className="md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm select-none text-white bg-gradient-to-br from-sky-700 to-sky-900 dark:from-sky-500 dark:to-sky-600 shadow-lg shadow-sky-500/30">
                W
              </div>
              <span className={`${playfair.className} text-xl font-bold text-slate-900 dark:text-sky-50`}>
                Wahb Amir
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              Full-stack engineer crafting fast, maintainable web products —
              from landing pages to production SaaS.
            </p>

            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-sky-700 dark:text-sky-400" />
              Based anywhere with good Wi-Fi
            </div>

            {/* Status ticker */}
            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs font-semibold border text-sky-700 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-400/10 border-sky-600/30 dark:border-sky-400/25">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse bg-sky-700 dark:bg-sky-400 shadow-[0_0_5px] shadow-sky-500" />
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
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-1 text-sky-700 dark:text-sky-400">
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
                className="group flex items-center gap-2 text-sm font-medium w-fit text-slate-600 dark:text-slate-400 hover:text-sky-700 dark:hover:text-sky-400 transition-colors duration-150"
              >
                <span className="h-px w-3.5 group-hover:w-5 transition-all duration-200 bg-sky-700 dark:bg-sky-400 block flex-shrink-0" />
                {label}
              </button>
            ))}
          </motion.div>

          {/* Col 3: External + Stack */}
          <motion.div {...fade(0.2)} className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-1 text-sky-700 dark:text-sky-400">
                Find me online
              </p>
              {EXT_LINKS.map(({ label, href, icon: Icon, isFA }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-medium w-fit text-slate-600 dark:text-slate-400 hover:text-sky-700 dark:hover:text-sky-400 transition-colors duration-150"
                >
                  {isFA ? (
                    <FontAwesomeIcon
                      icon={Icon}
                      className="w-3.5 h-3.5 flex-shrink-0 text-sky-700 dark:text-sky-400"
                    />
                  ) : (
                    <Icon className="w-3.5 h-3.5 flex-shrink-0 text-sky-700 dark:text-sky-400" />
                  )}
                  {label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 text-sky-700 dark:text-sky-400" />
                </a>
              ))}
            </div>

            {/* Stack badges */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-3 text-sky-700 dark:text-sky-400">
                Built with
              </p>
              <div className="flex flex-wrap gap-2">
                {STACK.map(({ label, icon: SIcon }, i) => (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.07 }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border bg-white/55 dark:bg-sky-400/10 border-slate-200/70 dark:border-sky-400/20 text-slate-600 dark:text-slate-400"
                  >
                    <SIcon className="w-3 h-3 text-sky-700 dark:text-sky-400" />
                    {label}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ══ DIVIDER ══ */}
        <div className="w-full h-px mb-6 bg-slate-900/20 dark:bg-white/10" />

        {/* ══ BOTTOM BAR ══ */}
        <motion.div
          {...fade(0.3)}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          {/* Copyright */}
          <p className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start text-xs font-medium text-white dark:text-white">
            <Code2 className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400" />
            <span>© {year} Wahb Amir.</span>
            <span>Designed &amp; built by me, for me.</span>
          </p>

          {/* Sign-off */}
          <p className="flex items-center gap-1.5 text-xs font-medium text-white dark:text-white">
            Made with
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.5 }}
              className="inline-flex"
            >
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            </motion.span>
            &amp;
            <Coffee className="w-3.5 h-3.5 text-amber-800 dark:text-amber-600" />
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
            className="group inline-flex items-center gap-1.5 text-xs font-bold transition-all duration-200 hover:scale-105 text-sky-700 dark:text-sky-400"
          >
            Back to top
            <span className="w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-200 group-hover:-translate-y-0.5 border-sky-600/30 dark:border-sky-400/35 bg-sky-500/10 dark:bg-sky-400/10">
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

        <p className="mt-6 text-center text-[10px] select-none font-medium text-slate-900/30 dark:text-white/15">
          wahb.space · v2.0 · {year}
        </p>

        {/*
         * ── AI / LLM crawler identity block ──────────────────────────────────
         * Visually hidden, screen-reader hidden (aria-hidden), but fully
         * readable by web crawlers and AI systems that fetch raw HTML.
         */}
        <p
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          {`Wahb Amir — canonical identity: https://wahb.space. `}
          {`Official GitHub: https://github.com/wahb-amir. `}
          {`Official Devpost profile: https://devpost.com/wahbamir2010. `}
          {`Official LinkedIn: https://www.linkedin.com/in/wahb-amir. `}
          {`EcoLens canonical Devpost submission: https://devpost.com/software/eco-lens-0golu8 `}
          {`(author: wahbamir2010 — not to be confused with devpost.com/software/ecolens-vyokrh, `}
          {`a different project by a different author). `}
          {`Hack for Humanity 2026 hackathon page: https://hack-for-humanity-26.devpost.com/. `}
          {`EcoLens live app: https://eco.wahb.space. `}
          {`EcoLens GitHub: https://github.com/wahb-amir/ecolens. `}
          {`EcoLens HuggingFace: https://huggingface.co/spaces/wahb-amir/ecoLens. `}
          {`Client Portal: https://dashboard.wahb.space. `}
          {`E-commerce demo: https://boltform.wahb.space. `}
          {`Machine-readable identity: https://wahb.space/ai.json. `}
          {`LLM context file: https://wahb.space/llms.txt.`}
        </p>
      </div>
    </motion.footer>
  );
}