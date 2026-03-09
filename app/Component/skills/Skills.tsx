"use client";

/**
 * Skills.tsx — CLIENT COMPONENT (performance-optimized)
 *
 * Perf changes vs original:
 * 1. Chips use CSS animations + transitions only — zero framer-motion per chip.
 *    (24 × spring physics was the main cause of jank.)
 * 2. backdropFilter removed from individual chips — kept only on group cards
 *    where it's visually significant. Blur compositing on 24 small elements
 *    forces a separate GPU layer per chip.
 * 3. Single useInView per GroupCard (unchanged), but isDark is passed as prop
 *    instead of calling useTheme() in every child.
 * 4. framer-motion is kept for heading section (3 elements) — where the
 *    orchestrated entrance actually matters visually.
 * 5. CSS stagger via --i custom property; no JS timers or variant cascades.
 * 6. whileHover replaced with CSS :hover — identical visual, no JS event loop.
 */

import React, { useMemo, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { Plus_Jakarta_Sans, DM_Mono } from "next/font/google";
import {
  SiHtml5, SiCss, SiTailwindcss, SiJavascript, SiReact,
  SiNextdotjs, SiNodedotjs, SiExpress, SiMongodb, SiFramer,
  SiPython, SiPandas, SiNumpy, SiScikitlearn, SiPytorch,
  SiCplusplus, SiOpencv, SiTypescript, SiPostgresql, SiRedis,
  SiDocker, SiGithub, SiNginx, SiGithubactions,
} from "react-icons/si";
import type { IconType } from "react-icons";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500","600","700","800"] });
const mono    = DM_Mono({ subsets: ["latin"], weight: ["400","500"] });

/* ─── types ─────────────────────────────────────────────────────────── */
type SkillDef       = { id: string; name: string; icon: IconType; color: string };
type GroupDef       = { key: string; title: string; ids: string[]; accentColor: string };
type GroupWithSkills = GroupDef & { skills: SkillDef[] };

/* ─── data ──────────────────────────────────────────────────────────── */
const SKILLS: Record<string, SkillDef> = {
  html:     { id: "html",     name: "HTML",        icon: SiHtml5,          color: "#E34F26" },
  css:      { id: "css",      name: "CSS",         icon: SiCss,            color: "#1572B6" },
  tailwind: { id: "tailwind", name: "Tailwind",    icon: SiTailwindcss,    color: "#38B2AC" },
  js:       { id: "js",       name: "JavaScript",  icon: SiJavascript,     color: "#F7DF1E" },
  ts:       { id: "ts",       name: "TypeScript",  icon: SiTypescript,     color: "#007ACC" },
  react:    { id: "react",    name: "React",       icon: SiReact,          color: "#61DAFB" },
  next:     { id: "next",     name: "Next.js",     icon: SiNextdotjs,      color: "#888888" },
  framer:   { id: "framer",   name: "Framer",      icon: SiFramer,         color: "#0055FF" },
  node:     { id: "node",     name: "Node.js",     icon: SiNodedotjs,      color: "#339933" },
  express:  { id: "express",  name: "Express",     icon: SiExpress,        color: "#888888" },
  python:   { id: "python",   name: "Python",      icon: SiPython,         color: "#3776AB" },
  pandas:   { id: "pandas",   name: "Pandas",      icon: SiPandas,         color: "#2b7bb9" },
  numpy:    { id: "numpy",    name: "NumPy",       icon: SiNumpy,          color: "#4DABCF" },
  sklearn:  { id: "sklearn",  name: "Scikit",      icon: SiScikitlearn,    color: "#F7931E" },
  pytorch:  { id: "pytorch",  name: "PyTorch",     icon: SiPytorch,        color: "#EE4C2C" },
  cpp:      { id: "cpp",      name: "C++",         icon: SiCplusplus,      color: "#00599C" },
  opencv:   { id: "opencv",   name: "OpenCV",      icon: SiOpencv,         color: "#4C8BF5" },
  mongodb:  { id: "mongodb",  name: "MongoDB",     icon: SiMongodb,        color: "#47A248" },
  postgres: { id: "postgres", name: "PostgreSQL",  icon: SiPostgresql,     color: "#336791" },
  redis:    { id: "redis",    name: "Redis",       icon: SiRedis,          color: "#DC382D" },
  docker:   { id: "docker",   name: "Docker",      icon: SiDocker,         color: "#2496ED" },
  nginx:    { id: "nginx",    name: "Nginx",       icon: SiNginx,          color: "#009639" },
  github:   { id: "github",   name: "GitHub",      icon: SiGithub,         color: "#888888" },
  gha:      { id: "gha",      name: "GH Actions",  icon: SiGithubactions,  color: "#2088FF" },
};

const GROUPS: GroupDef[] = [
  { key: "frontend", title: "Frontend",      accentColor: "#06b6d4", ids: ["html","css","tailwind","js","ts","react","next","framer"] },
  { key: "backend",  title: "Backend & ML",  accentColor: "#8b5cf6", ids: ["node","express","python","pandas","numpy","sklearn","pytorch","cpp"] },
  { key: "database", title: "Databases",     accentColor: "#10b981", ids: ["mongodb","postgres","redis"] },
  { key: "devops",   title: "DevOps & Infra",accentColor: "#f59e0b", ids: ["docker","nginx","github","gha"] },
];

/* ─── framer variants (heading only — 3 elements) ───────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25,0.46,0.45,0.94] } },
};
const headingStagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};
// Card container — only staggers the grid reveal, not individual chips
const cardReveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22,1,0.36,1] } },
};

/* ─── SkillChip — pure CSS, zero framer-motion ──────────────────────── */
function SkillChip({
  skill,
  isDark,
  accentColor,
  index,
}: {
  skill: SkillDef;
  isDark: boolean;
  accentColor: string;
  index: number;
}) {
  const Icon = skill.icon;

  const iconColor =
    skill.color === "#F7DF1E" && !isDark ? "#b45309" :
    skill.color === "#61DAFB" && !isDark ? "#0369a1" :
    skill.color === "#888888"            ? (isDark ? "#94a3b8" : "#64748b") :
    skill.color;

  return (
    <div
      className="chip-item relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border cursor-default select-none overflow-hidden"
      style={{
        // CSS variable drives the stagger delay — no JS timer
        ["--chip-i" as string]: index,
        background:   isDark ? "rgba(5,16,36,0.8)"     : "rgba(255,255,255,0.9)",
        borderColor:  isDark ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.1)",
        boxShadow: isDark
          ? "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 2px 10px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,1)",
        // NO backdropFilter here — it was creating a GPU composite layer per chip
      }}
    >
      {/* Hover glow — CSS-only via .chip-item:hover .chip-glow */}
      <div
        aria-hidden
        className="chip-glow absolute inset-0 opacity-0 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 40%, ${iconColor}18 0%, transparent 70%)` }}
      />

      {/* Icon container */}
      <div
        className="relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background:  `${iconColor}${isDark ? "1e" : "16"}`,
          boxShadow:   `inset 0 1px 0 ${iconColor}28`,
        }}
      >
        <Icon style={{ color: iconColor, fontSize: "1.45rem" }} aria-hidden />
      </div>

      <span
        className={`${mono.className} text-[11px] font-semibold text-center leading-tight w-full`}
        style={{ color: isDark ? "#94a3b8" : "#475569" }}
      >
        {skill.name}
      </span>
    </div>
  );
}

/* ─── GroupCard — single useInView, chips animate via CSS ───────────── */
function GroupCard({ group, isDark }: { group: GroupWithSkills; isDark: boolean }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      variants={cardReveal}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="rounded-2xl border overflow-hidden"
      style={{
        background:   isDark ? "rgba(7,18,40,0.78)"     : "rgba(255,255,255,0.82)",
        borderColor:  isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.1)",
        boxShadow: isDark
          ? `0 4px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px ${group.accentColor}14`
          : `0 4px 24px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,1), 0 0 0 1px ${group.accentColor}12`,
        backdropFilter: "blur(18px)",          // kept on card — one composite layer per card (4 total) is fine
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      {/* Card header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{
          borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.07)",
          background: isDark
            ? `linear-gradient(90deg, ${group.accentColor}14 0%, transparent 60%)`
            : `linear-gradient(90deg, ${group.accentColor}0e 0%, transparent 60%)`,
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{
              background:  group.accentColor,
              boxShadow:   `0 0 8px ${group.accentColor}90, 0 0 16px ${group.accentColor}40`,
            }}
          />
          <h4
            className={`${jakarta.className} text-[0.95rem] font-bold tracking-tight`}
            style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
          >
            {group.title}
          </h4>
        </div>

        <span
          className={`${mono.className} text-[11px] font-semibold px-2.5 py-1 rounded-full`}
          style={{
            background: `${group.accentColor}${isDark ? "20" : "16"}`,
            color:       group.accentColor,
            border:      `1px solid ${group.accentColor}40`,
          }}
        >
          {group.skills.length} skills
        </span>
      </div>

      {/* Skills grid — CSS stagger controlled by --chip-i */}
      <div
        className={`p-4 sm:p-5 grid grid-cols-3 sm:grid-cols-4 gap-3 ${inView ? "chips-visible" : ""}`}
      >
        {group.skills.map((s, i) => (
          <SkillChip key={s.id} skill={s} isDark={isDark} accentColor={group.accentColor} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── main ───────────────────────────────────────────────────────────── */
export default function SkillsGrouped() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const headingRef    = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-40px" });

  const groups = useMemo<GroupWithSkills[]>(
    () => GROUPS.map((g) => ({ ...g, skills: g.ids.map((id) => SKILLS[id]) })),
    [],
  );

  const accent    = isDark ? "#22d3ee" : "#0891b2";
  const borderCol = isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.09)";

  return (
    <section
      id="skills"
      className={`${jakarta.className} relative flex flex-col items-center px-4 sm:px-6 py-20 overflow-hidden
        bg-gradient-to-b from-[#00b1ff88] to-[#00bfff44]`}
    >
      <style>{`
        /* ── Heading lines ── */
        @keyframes line-grow {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
        .line-grow   { transform-origin: left  center; animation: line-grow 0.55s 0.25s cubic-bezier(.22,1,.36,1) both; }
        .line-grow-r { transform-origin: right center; animation: line-grow 0.55s 0.25s cubic-bezier(.22,1,.36,1) both; }

        /* ── Chip entrance — CSS keyframe + stagger via custom property ── */
        @keyframes chip-in {
          from { opacity: 0; transform: translateY(14px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
        /* Chips start hidden; parent adds .chips-visible when in view */
        .chip-item {
          opacity: 0;
        }
        .chips-visible .chip-item {
          animation: chip-in 0.38s calc(var(--chip-i) * 40ms) cubic-bezier(0.22,1,0.36,1) both;
        }

        /* ── Chip hover — pure CSS transition, no JS ── */
        .chip-item {
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
          will-change: transform;          /* promote only on hover path */
        }
        .chip-item:hover {
          transform: translateY(-5px) scale(1.04);
          border-color: rgba(6,182,212,0.28) !important;
        }
        .chip-item:active { transform: scale(0.97); }
        .chip-item:hover .chip-glow { opacity: 1; }
        .chip-glow { transition: opacity 0.3s ease; }

        /* ── Scroll buttons ── */
        .scroll-btn {
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
        }
        .scroll-btn:hover { transform: scale(1.1); }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .chip-item, .chips-visible .chip-item { animation: none; opacity: 1; }
          .chip-item:hover { transform: none; }
          .scroll-btn:hover { transform: none; }
        }
      `}</style>

      {/* Scrim */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: isDark ? "rgba(4,10,24,0.5)" : "rgba(244,249,255,0.46)" }}
      />

      {/* Blobs */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-20 right-0 w-[420px] h-[420px] rounded-full blur-[130px]"
          style={{ background: "rgba(6,182,212,0.07)" }}
        />
        <div
          className="absolute bottom-0 -left-14 w-[360px] h-[360px] rounded-full blur-[110px]"
          style={{ background: "rgba(139,92,246,0.055)" }}
        />
      </div>

      {/* ── HEADING ── */}
      <motion.div
        ref={headingRef}
        variants={headingStagger}
        initial="hidden"
        animate={headingInView ? "show" : "hidden"}
        className="relative z-10 text-center mb-14"
      >
        <motion.div
          variants={fadeUp}
          className={`${mono.className} flex items-center justify-center gap-3 mb-5`}
        >
          <span className="line-grow h-px w-10 inline-block rounded-full"
            style={{ background: `linear-gradient(to right, transparent, ${accent})` }} />
          <span className="text-[11px] tracking-[0.2em] uppercase font-semibold" style={{ color: accent }}>
            Tech Stack
          </span>
          <span className="line-grow-r h-px w-10 inline-block rounded-full"
            style={{ background: `linear-gradient(to left, transparent, ${accent})` }} />
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(130deg, #f1f5f9 25%, #22d3ee 100%)"
              : "linear-gradient(130deg, #0f172a 15%, #0891b2 85%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.1,
          }}
        >
          Tools I Build With
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-[0.9rem] sm:text-base max-w-md mx-auto leading-relaxed"
          style={{ color: "#64748b" }}
        >
          The stack I reach for to ship fast, maintainable, production-ready apps.
        </motion.p>
      </motion.div>

      {/* ── CARDS GRID ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        {groups.map((g) => (
          <GroupCard key={g.key} group={g} isDark={isDark} />
        ))}
      </div>

      {/* ── SCROLL ARROWS ── */}
      <div className="relative z-10 flex gap-4 mt-14">
        {([
          { label: "Scroll up",   Icon: ChevronUpIcon,   fn: () => window.scrollTo({ top: 0, behavior: "smooth" }),                                                  pulse: true  },
          { label: "Scroll down", Icon: ChevronDownIcon, fn: () => document.getElementById("project-section")?.scrollIntoView({ behavior: "smooth" }), pulse: false },
        ] as const).map(({ label, Icon, fn, pulse }) => (
          <button
            key={label}
            onClick={fn}
            aria-label={label}
            className={`scroll-btn p-3 rounded-full border ${pulse ? "animate-pulse" : "animate-bounce"}`}
            style={{
              borderColor: borderCol,
              background:  isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${accent}66`;
              e.currentTarget.style.background  = isDark ? "rgba(6,182,212,0.1)" : "rgba(6,182,212,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = borderCol;
              e.currentTarget.style.background  = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)";
            }}
          >
            <Icon className="w-5 h-5" style={{ color: accent }} />
          </button>
        ))}
      </div>
    </section>
  );
}