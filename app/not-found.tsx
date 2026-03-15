"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FolderOpen, Terminal } from "lucide-react";

// Typewriter hook — types a string one character at a time
function useTypewriter(text: string, speed = 38, startDelay = 900) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let i = 0;
    const start = setTimeout(() => {
      const tick = () => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i < text.length) timeout = setTimeout(tick, speed);
      };
      tick();
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearTimeout(timeout);
    };
  }, [text, speed, startDelay]);
  return displayed;
}

// Spring presets
const SPRING = { type: "spring", stiffness: 320, damping: 28 } as const;
const EASE = { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as const;

export default function NotFound() {
  const terminalLine = useTypewriter(
    "wahb@portfolio:~$ find . -name 'this-page'",
    42,
    700,
  );
  const resultLine = useTypewriter(
    "find: 'this-page': No such file or directory",
    36,
    2600,
  );

  return (
    <div
      className="
        relative min-h-screen w-full flex flex-col items-center justify-center
        bg-[#f9fafb] dark:bg-[#0f172a]
        bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
        text-black dark:text-white
        overflow-hidden
        pt-[env(safe-area-inset-top)]
      "
      style={{ fontFamily: "'Poppins', 'Inter', system-ui, sans-serif" }}
    >
      {/* ── Ambient glows (unchanged positions) ───────────────────────────── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* ── Dot grid texture ───────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.18] dark:opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #0ea5e9 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl w-full">
        {/* ── 404 numeral — layered with outline + fill ─────────────────────── */}
        <div className="relative select-none mb-2" aria-hidden="true">
          {/* Outline layer — always visible on both themes */}
          <motion.span
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...EASE, duration: 0.6 }}
            className="
              block text-[9rem] md:text-[13rem] font-black leading-none tracking-tighter
              text-transparent
              [-webkit-text-stroke:2px_theme(colors.sky.400)]
              [text-stroke:2px_theme(colors.sky.400)]
            "
          >
            404
          </motion.span>

          {/* Clipped gradient fill on top — dark mode only */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="
              absolute inset-0
              block text-[9rem] md:text-[13rem] font-black leading-none tracking-tighter
              hidden dark:block
              bg-gradient-to-b from-white/90 via-white/30 to-transparent
              bg-clip-text text-transparent
            "
            aria-hidden="true"
          >
            404
          </motion.span>

          {/* Light mode fill — slate tint so it reads on the cyan gradient */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="
              absolute inset-0
              block text-[9rem] md:text-[13rem] font-black leading-none tracking-tighter
              dark:hidden
              bg-gradient-to-b from-slate-700/70 via-slate-500/30 to-transparent
              bg-clip-text text-transparent
            "
            aria-hidden="true"
          >
            404
          </motion.span>
        </div>

        {/* ── Terminal block ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, ...EASE }}
          className="
            w-full max-w-md mb-8
            rounded-xl border
            border-slate-300/60 dark:border-slate-700/60
            bg-white/50 dark:bg-slate-900/60
            backdrop-blur-sm
            overflow-hidden
            shadow-lg shadow-black/5 dark:shadow-black/30
            text-left
          "
        >
          {/* Terminal titlebar */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-200/60 dark:border-slate-700/50 bg-slate-100/60 dark:bg-slate-800/60">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            <span className="ml-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <Terminal className="w-3 h-3" />
              bash
            </span>
          </div>

          {/* Terminal body */}
          <div className="px-4 py-3 font-mono text-[12px] md:text-[13px] leading-6 space-y-1 min-h-[72px]">
            <p>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                wahb
              </span>
              <span className="text-slate-500 dark:text-slate-500">@</span>
              <span className="text-sky-600 dark:text-sky-400 font-semibold">
                portfolio
              </span>
              <span className="text-slate-500 dark:text-slate-500">:~$ </span>
              <span className="text-slate-800 dark:text-slate-200">
                {terminalLine.replace("wahb@portfolio:~$ ", "")}
              </span>
              {terminalLine.length <
                "wahb@portfolio:~$ find . -name 'this-page'".length && (
                <span className="inline-block w-[7px] h-[13px] bg-sky-500 dark:bg-sky-400 ml-0.5 align-middle animate-pulse" />
              )}
            </p>
            {resultLine && (
              <p className="text-red-500 dark:text-red-400">
                {resultLine}
                {resultLine.length <
                  "find: 'this-page': No such file or directory".length && (
                  <span className="inline-block w-[7px] h-[13px] bg-red-400 ml-0.5 align-middle animate-pulse" />
                )}
              </p>
            )}
          </div>
        </motion.div>

        {/* ── Heading + body ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, ...EASE }}
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            This page doesn&apos;t exist.
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed text-sm md:text-base">
            Whatever you were looking for has either moved, been deleted, or was
            never here to begin with. Let&apos;s get you somewhere useful.
          </p>
        </motion.div>

        {/* ── CTAs ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, ...EASE }}
          className="mt-8 flex flex-row items-center justify-center gap-3 flex-wrap"
        >
          {/* Primary */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={SPRING}
          >
            <Link
              href="/"
              className="
                inline-flex items-center gap-2
                px-6 py-2.5 rounded-full
                bg-slate-900 dark:bg-white
                text-white dark:text-slate-900
                text-sm font-semibold
                shadow-md shadow-black/20 dark:shadow-white/10
                hover:shadow-lg hover:shadow-black/25 dark:hover:shadow-white/15
                transition-shadow duration-200
              "
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </motion.div>

          {/* Secondary */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={SPRING}
          >
            <Link
              href="/#project-section"
              className="
                inline-flex items-center gap-2
                px-6 py-2.5 rounded-full
                border border-slate-400/50 dark:border-slate-600
                bg-white/40 dark:bg-slate-800/50
                text-slate-800 dark:text-slate-200
                text-sm font-semibold
                hover:bg-white/60 dark:hover:bg-slate-700/60
                hover:border-slate-500/60 dark:hover:border-slate-500
                backdrop-blur-sm
                transition-all duration-200
              "
            >
              <FolderOpen className="w-3.5 h-3.5" />
              View Projects
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Status badge ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-10"
        >
          <span
            className="
            inline-flex items-center gap-2
            text-[11px] font-mono font-medium tracking-widest uppercase
            text-slate-500 dark:text-slate-500
            px-3 py-1 rounded-full
            border border-slate-300/50 dark:border-slate-700/50
            bg-white/30 dark:bg-slate-900/30
          "
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            HTTP 404 · Page not found
          </span>
        </motion.div>
      </div>

      {/* ── Corner error code ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-8 hidden md:flex items-center gap-2"
      >
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-400/40 dark:via-slate-600/40 to-transparent" />
        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-600 font-mono">
          Error :: 0x000404
        </p>
      </motion.div>

      {/* ── Corner: wahb.space attribution ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 right-8 hidden md:block"
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 font-mono">
          wahb.space
        </p>
      </motion.div>
    </div>
  );
}
