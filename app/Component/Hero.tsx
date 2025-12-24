"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Avatar from "./Avatar";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

// keep decorative / heavy visuals client-only and lazy
const LazyParticles = dynamic(() => import("./CustomParticles"), {
  ssr: false,
  loading: () => null,
});
const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
  ssr: false,
  loading: () => null,
});

/**
 * Tiny Typewriter (no external lib)
 * - very small, minimal DOM updates to reduce main-thread work
 * - respects prefers-reduced-motion (shows static text)
 */
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
        // type
        charRef.current += 1;
        setDisplay(word.slice(0, charRef.current));
        if (charRef.current >= word.length) {
          // pause then delete
          timeoutRef.current = setTimeout(() => {
            deletingRef.current = true;
            tick();
          }, delaySpeed);
          return;
        }
        timeoutRef.current = setTimeout(tick, typeSpeed);
      } else {
        // delete
        charRef.current -= 1;
        setDisplay(word.slice(0, charRef.current));
        if (charRef.current <= 0) {
          deletingRef.current = false;
          idxRef.current += 1;
          // small pause before next word
          timeoutRef.current = setTimeout(tick, 200);
          return;
        }
        timeoutRef.current = setTimeout(tick, deleteSpeed);
      }
    }

    // start typing
    timeoutRef.current = setTimeout(tick, 250);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null; // reset ref
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, typeSpeed, deleteSpeed, delaySpeed, reduceMotion]);

  return (
    <span aria-live="polite" aria-atomic="true">
      {display}
      <span aria-hidden="true" className="ml-1 inline-block">
        _
      </span>
    </span>
  );
}

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
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
    else console.warn("Skills section not found!");
  };

  // constants for SSR-friendly layout (unchanged)
  const HERO_MIN_HEIGHT = "min-h-[60vh] sm:min-h-[68vh]";
  const AVATAR_SIZE = { mobile: 150 };

  return (
    <>
      {/* SKIP LINK (keyboard users) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white dark:bg-slate-800 p-2 rounded"
      >
        Skip to content
      </a>

      <main
        id="hero-section"
        className={`
    relative flex flex-col justify-start items-center
    ${HERO_MIN_HEIGHT} px-4 xs:px-6 text-center pb-[6.25rem]
    bg-[#f9fafb] dark:bg-[#0f172a]
    bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
    text-black dark:text-white
    overflow-hidden pt-[env(safe-area-inset-top)]
  `}
        aria-label="Hero Section"
        role="banner"
      >
        {/* decorative background (SSR-friendly) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,191,255,0.06), rgba(0,177,255,0.10))",
          }}
        />

        {hydrated && <LazyBackgroundEffect aria-hidden="true" />}
        {hydrated && <LazyParticles aria-hidden="true" />}

        {/* Main content (balanced hierarchy + color priority) */}
        <div
          className="z-10 mt-8 max-w-xl mx-auto px-4"
          role="main"
          id="main-content"
          aria-labelledby="hero-heading"
        >
          {/* Avatar */}
          <div
            className="
    mx-auto
    p-2
    rounded-full
    bg-white/70 dark:bg-slate-800/60
    shadow-[0_8px_30px_rgba(0,0,0,0.06)]
    ring-1 ring-black/5 dark:ring-white/10
  "
            style={{
              width: AVATAR_SIZE.mobile,
              height: AVATAR_SIZE.mobile,
              maxWidth: "92vw",
            }}
            role="img"
            aria-label="Portrait of Wahb"
          >
            <Avatar />
          </div>

          <div className="h-4" aria-hidden="true" />

          {/* H1: PRIMARY — Name (largest, blue = top priority) */}
          <h1
            id="hero-heading"
            className="mt-6 flex items-baseline justify-center gap-4 text-center"
          >
            <span
              className="
    text-3xl xs:text-4xl sm:text-5xl
    font-semibold
    text-gray-700 dark:text-slate-300
  "
            >
              Hey, I&apos;m
            </span>

            <span
              className="
    font-serif
    text-5xl xs:text-6xl sm:text-8xl
    text-blue-600
    font-black
    leading-none
  "
            >
              Wahb
            </span>
          </h1>

          {/* H2: SECONDARY — Value proposition (prominent, darker/indigo color) */}
          <h2 className="mt-4 text-lg xs:text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 max-w-2xl mx-auto">
            I build fast, reliable web apps that scale with your product.
          </h2>

          {/* H3: TERTIARY — Typewriter as supporting proof (accent color + subtle left border) */}
          <div
            className="mt-4 max-w-md mx-auto flex items-center gap-3 px-3 py-2 rounded-lg
                 border-l-4 border-blue-100 dark:border-blue-900 bg-white/60 dark:bg-slate-800/40"
            aria-hidden={false}
          >
            {/* subtle icon-like dot to help visual parsing (accessible hidden) */}
            <span
              className="w-2 h-2 rounded-full bg-blue-400 dark:bg-cyan-400 inline-block"
              aria-hidden="true"
            />
            <p
              className="m-0 text-sm xs:text-base sm:text-base font-medium text-indigo-600 dark:text-cyan-300"
              aria-label="Developer specialties"
              role="text"
            >
              {hydrated ? (
                <TinyTypewriter
                  words={[
                    "Next.js & React — performance first",
                    "Scalable full-stack systems for real users",
                    "UX-focused frontend with robust backend",
                    "Production deployments on Linux & cloud",
                  ]}
                  typeSpeed={45}
                  deleteSpeed={25}
                  delaySpeed={1400}
                  reduceMotion={reduceMotion}
                />
              ) : (
                "Full-stack developer building scalable web applications"
              )}
            </p>
          </div>

          <p className="mt-3 text-sm sm:text-base max-w-xl mx-auto text-cyan-600 dark:text-cyan-300 font-medium">
            For startups & product teams focused on performance and reliability.
          </p>

          {/* CTAs — single strong button + subtle text link */}
          <div className="mt-8 flex items-center gap-4 justify-center">
            <a
              href="/#project-section"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("project-section");
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md transition-all duration-200 hover:bg-blue-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
              aria-label="See my work"
            >
              See my work
            </a>

            <a
              href="/#contact"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("contact");
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="
    inline-flex items-center justify-center
    px-5 py-2.5
    rounded-xl
    border border-blue-600/60
    text-blue-600
    font-semibold
    shadow-sm
    transition-all duration-200
    hover:bg-blue-600 hover:text-white
    hover:shadow-md
    focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300
    dark:border-cyan-400/60
    dark:text-cyan-300
    dark:hover:bg-cyan-400 dark:hover:text-slate-700
  "
              aria-label="Contact Wahb"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Scroll hint (small, unobtrusive) */}
        <button
          onClick={handleScrollToSkills}
          className="absolute bottom-8 flex flex-col items-center cursor-pointer z-10 transition-transform motion-reduce:animate-none"
          aria-label="Scroll to skills section"
        >
          <ChevronDownIcon
            className="w-8 h-8 text-white animate-bounce motion-reduce:animate-none "
            aria-hidden="true"
          />
          <span className="mt-2 text-sm xs:text-base text-gray-700 dark:text-slate-300">
            Scroll to see my skills
          </span>
        </button>
      </main>
    </>
  );
}
