"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Avatar from "./Avatar"; // Your existing Avatar component
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { FaReact, FaNodeJs } from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiExpress,
  SiGithub,
  SiLinkedin,
  SiGmail,
} from "react-icons/si";

// --- Lazy Load Decorative Elements ---
const LazyParticles = dynamic(() => import("./CustomParticles"), {
  ssr: false,
  loading: () => null,
});
const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
  ssr: false,
  loading: () => null,
});

// --- Icon map using react-icons (clean, consistent) ---
const ICON_MAP: Record<string, any> = {
  react: FaReact,
  next: SiNextdotjs,
  ts: SiTypescript,
  node: FaNodeJs,
  express: SiExpress,
  github: SiGithub,
  linkedin: SiLinkedin,
  gmail: SiGmail,
};
const ICON_COLOR_MAP: Record<string, string> = {
  react: "text-cyan-500",
  next: "text-black dark:text-white",
  ts: "text-blue-600",
  node: "text-green-600",
  express: "text-gray-700 dark:text-gray-300",
  github: "text-black dark:text-white",
  linkedin: "text-blue-600",
  gmail: "text-red-500",
};
// --- Inline Tech (icon + name) used inside sentences ---
const InlineTech = ({ name, label }: { name: string; label: string }) => {
  const Icon = ICON_MAP[name] ?? FaReact;
  const colorClass = ICON_COLOR_MAP[name] ?? "text-slate-800";

  return (
    <span className="inline-flex items-center gap-2 mr-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
      <Icon className={`w-5 h-5 shrink-0 ${colorClass}`} aria-hidden />
      <span>{label}</span>
    </span>
  );
};

// --- Tech Badge Component (small pill) ---
const TechBadge = ({ name, label }: { name: string; label: string }) => {
  const Icon = ICON_MAP[name] ?? FaReact;
  return (
    <span className="inline-flex items-center gap-2 px-2 py-1 mx-1 rounded-full bg-white/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200">
      <Icon className="w-4 h-4 shrink-0" aria-hidden />
      <span>{label}</span>
    </span>
  );
};

// --- Typewriter Component (unchanged) ---
interface TinyTypewriterProps {
  words: string[];
  loop?: boolean;
  typeSpeed?: number;
  deleteSpeed?: number;
  delaySpeed?: number;
  reduceMotion?: boolean;
}
function TinyTypewriter({
  words = [],
  loop = true,
  typeSpeed = 60,
  deleteSpeed = 40,
  delaySpeed = 1500,
  reduceMotion = false,
}: TinyTypewriterProps) {
  const [display, setDisplay] = useState(words[0] || "");
  const idxRef = useRef(0);
  const charRef = useRef(0);
  const deletingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (reduceMotion || words.length === 0) {
      setDisplay(words[0] || "");
      return;
    }
    function tick() {
      const word = words[idxRef.current % words.length];
      if (!deletingRef.current) {
        charRef.current += 1;
        setDisplay(word.slice(0, charRef.current));
        if (charRef.current >= word.length) {
          timeoutRef.current = setTimeout(() => {
            deletingRef.current = true;
            tick();
          }, delaySpeed);
          return;
        }
        timeoutRef.current = setTimeout(tick, typeSpeed);
      } else {
        charRef.current -= 1;
        setDisplay(word.slice(0, charRef.current));
        if (charRef.current <= 0) {
          deletingRef.current = false;
          idxRef.current += 1;
          timeoutRef.current = setTimeout(tick, 200);
          return;
        }
        timeoutRef.current = setTimeout(tick, deleteSpeed);
      }
    }
    timeoutRef.current = setTimeout(tick, 250);
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [words, typeSpeed, deleteSpeed, delaySpeed, reduceMotion]);

  return (
    <span aria-live="polite" aria-atomic="true">
      {display}
      <span aria-hidden="true" className="ml-1 inline-block animate-pulse">
        _
      </span>
    </span>
  );
}

export default function Hero() {
  const { theme } = useTheme();
  const [hydrated, setHydrated] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq) {
      setReduceMotion(mq.matches);
      const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
      mq.addEventListener?.("change", onChange);
      return () => mq.removeEventListener?.("change", onChange);
    }
  }, []);

  const handleScrollToSkills = () => {
    const skillsSection = document.getElementById("skills");
    if (skillsSection)
      skillsSection.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <main
      id="hero-section"
      className={`
    relative flex flex-col justify-start items-center
   px-4 xs:px-6 text-center pb-[6.25rem]
    bg-[#f9fafb] dark:bg-[#0f172a]
    bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
    text-black dark:text-white
    overflow-hidden pt-[env(safe-area-inset-top)]
  `}
    >
      {/* Background Effects */}
      {hydrated && <LazyBackgroundEffect aria-hidden="true" />}
      {hydrated && <LazyParticles aria-hidden="true" />}

      {/* --- Profile Card Container --- */}
      <div
        className="
          relative z-10 w-full max-w-3xl 
          backdrop-blur-xl
          rounded-2xl shadow-2xl 
          border border-white/40 dark:border-slate-700/50

          mt-6
          bg-[#f9fafb] dark:bg-[#0f172a]
    bg-gradient-to-b from-[#00b1ff88] to-[#00bfff44]
    text-black dark:text-white
    overflow-hidden pt-[env(safe-area-inset-top)]
        "
      >
        {/* 1. Banner & Quote (improved depth + shapes) */}
        <div className="relative h-44 sm:h-56 bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-500 overflow-hidden">
          {/* soft animated blob */}
          <svg
            className="absolute -top-10 -left-16 w-72 h-72 opacity-30 transform rotate-12 mix-blend-screen"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              fill="white"
              d="M43.6,-66.7C57.2,-58.1,69.6,-50.3,77.9,-38.8C86.2,-27.4,90.3,-12.3,90.6,3.2C90.9,18.7,87.5,34.7,77.8,47.6C68.1,60.5,52.1,70.3,36.1,72.9C20.1,75.5,10.1,70,0.9,68.5C-8.3,66.9,-16.6,69.4,-30.2,70.6C-43.8,71.7,-62.8,71.5,-69.4,61.4C-76.1,51.3,-70.5,31.3,-68.5,13C-66.5,-5.3,-68.9,-22.6,-63.1,-35.3C-57.3,-48,-43.2,-56.2,-28.7,-64.2C-14.2,-72.2,1.7,-80.1,17.5,-78.9C33.3,-77.6,49.9,-67.5,43.6,-66.7Z"
              transform="translate(100 100)"
            />
          </svg>

          {/* subtle diagonal stripe texture */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.02) 75%, transparent 75%, transparent)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 flex items-center justify-center h-full px-8 text-center">
            <p className="text-white/95 font-semibold text-lg sm:text-2xl tracking-tight drop-shadow-lg">
              “I design, build, and ship products that scale.”
            </p>
          </div>
        </div>

        {/* 2. Content Wrapper */}
        <div className="px-6 sm:px-10 pb-10">
          {/* Avatar Row (left aligned, overlapping banner) */}
          <div className="relative -mt-20 mb-5 flex justify-between items-start">
            <div className="relative">
              <div className="relative w-40 h-52 sm:w-44 sm:h-56 rounded-2xl overflow-hidden">
                <Avatar />
              </div>

              {/* Green Online Status Icon (keeps subtle border so it reads on any background) */}
              {/* <div
                className="
    absolute bottom-1 right-1
    translate-x-1/2 translate-y-1/2
    w-6 h-6 sm:w-7 sm:h-7
    bg-emerald-500
    border-4 border-white dark:border-slate-900
    rounded-full
    z-30
  "
                title="Online"
              >
                <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-60 animate-ping" />
              </div> */}
            </div>

            {/* Right side spacer to keep layout balanced on wide screens */}
            <div className="flex-1" />
          </div>

          {/* 3. Name & Username */}
          <div className="mb-6 text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
              Wahb
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
              @wahb-amir
            </p>
          </div>

          {/* 4. Improved Description & Tech Stack (inline icons) */}
          <div className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-8 max-w-2xl">
            <p className="mb-3 text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
              Hi — I’m Wahb, a Full Stack Web Developer.
            </p>

            <p className="mb-4">
              I build high-performance, user-first web applications using{" "}
              <InlineTech name="react" label="React" />
              <InlineTech name="next" label="Next.js" />
              <InlineTech name="ts" label="TypeScript" />
              <InlineTech name="node" label="Node.js" />
              <InlineTech name="express" label="Express.js" />— blending
              polished UI design with scalable backend engineering.
            </p>

            {/* Subheading (Typewriter) */}
            <div className="mt-4 p-3 bg-blue-50/60 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-md">
              <span className="font-semibold text-blue-700 dark:text-blue-300">
                {hydrated ? (
                  <TinyTypewriter
                    words={[
                      "Turning ideas into scalable solutions.",
                      "Focused on performance & user experience.",
                      "Open source enthusiast.",
                    ]}
                    typeSpeed={40}
                    delaySpeed={2000}
                    reduceMotion={reduceMotion}
                  />
                ) : (
                  "Turning ideas into scalable solutions."
                )}
              </span>
            </div>
          </div>

          {/* 5. Buttons Row */}
          <div className="flex flex-wrap gap-4 mb-8">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Get in Touch
            </a>

            {/* <a
              href="/resume.pdf"
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-semibold text-sm sm:text-base hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Resume / CV
            </a> */}
          </div>

          {/* 6. Social Links (Footer) */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700/60">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
              Find me on:
            </p>
            <div className="flex gap-5 items-center">
              <a
                href="https://github.com/wahb-amir"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <SiGithub className="w-5 h-5" aria-hidden />
                <span className="text-sm font-semibold">GitHub</span>
              </a>

              {/* <a
                href="https://linkedin.com/in/wahb-amir"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-600 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              >
                <SiLinkedin className="w-5 h-5" aria-hidden />
                <span className="text-sm font-semibold">LinkedIn</span>
              </a> */}

              <a
                href="mailto:wahbamir2010@gmail.com"
                target="_blank"
                className="flex items-center gap-2 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
              >
                <SiGmail className="w-5 h-5" aria-hidden />
                <span className="text-sm font-semibold">Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <button
        onClick={() =>
          document
            .getElementById("skills")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="mt-6 animate-bounce hover:scale-110 transition-transform p-2 bg-white/10 rounded-full"
      >
        <ChevronDownIcon className="w-6 h-6 text-cyan-700 dark:text-cyan-300" />
      </button>
    </main>
  );
}
