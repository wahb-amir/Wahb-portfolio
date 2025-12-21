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
        {/* SSR placeholder for smooth visual (decorative) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,191,255,0.08), rgba(0,177,255,0.12))",
          }}
        />

        {/* lazy decorative complex visuals */}
        {hydrated && <LazyBackgroundEffect aria-hidden="true" />}
        {hydrated && <LazyParticles aria-hidden="true" />}

        {/* Main content (CSS-driven animation; no heavy libs) */}
        <div
          className="z-10 mt-8 max-w-xl mx-auto"
          role="main"
          id="main-content"
          aria-labelledby="hero-heading"
        >
          {/* Avatar wrapper - ensure this container has fixed dimensions to avoid CLS */}
          <div
            className="mx-auto p-2"
            style={{
              width: AVATAR_SIZE.mobile,
              height: AVATAR_SIZE.mobile,
              maxWidth: "92vw",
            }}
            aria-hidden={false}
            role="img"
            aria-label="Portrait of Wahb"
          >
            {/* Keep your Avatar component (assumed optimized). If it's an <img>, ensure it has width/height attributes and loading="eager" to help LCP. */}
            <Avatar />
          </div>

          {/* Heading */}
          <h1
            id="hero-heading"
            className="font-sans text-4xl xs:text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-800 dark:text-white drop-shadow-lg mt-6"
          >
            Hey, I&apos;m{" "}
            <span className="font-serif text-5xl xs:text-6xl sm:text-8xl text-blue-600 font-black drop-shadow-lg">
              Wahb
            </span>
            <br />
            <span className="mt-4 block text-lg xs:text-xl sm:text-2xl font-medium text-gray-700 dark:text-slate-300 drop-shadow-sm">
              — I Build Fast & Scalable Web Apps 🚀
            </span>
          </h1>

          {/* Typewriter (lightweight) */}
          <p
            className="text-base xs:text-lg sm:text-2xl mt-6 font-medium max-w-screen-3xl mx-auto text-gray-800 dark:text-slate-300 drop-shadow-md"
            aria-label="Developer specialties"
            role="text"
          >
            {hydrated ? (
              <TinyTypewriter
                words={[
                  "Full-Stack Web Developer 💻",
                  "Building Scalable Web Apps 🚀",
                  "Optimizing Performance & UX ⚡",
                  "Deploying Apps on Linux VPS 🐧",
                ]}
                typeSpeed={50}
                deleteSpeed={30}
                delaySpeed={1300}
                reduceMotion={reduceMotion}
              />
            ) : (
              // server-rendered fallback to avoid layout shift & be readable to bots
              "Full-Stack Web Developer 💻 — Building Scalable Web Apps 🚀"
            )}
          </p>

          {/* Short description (keeps visual hierarchy) */}
          <p className="text-base mt-6 max-w-2xl mx-auto text-black dark:text-slate-400 drop-shadow-sm">
            I turn complex ideas into elegant, fast, and reliable web
            applications.
          </p>
          <p className="text-blue-700 dark:text-cyan-300 mt-2 text-sm sm:text-base drop-shadow-sm">
            Turning ideas into full-stack apps — from my terminal to the cloud
            ☁️💻
          </p>

          {/* Primary + Secondary CTA */}
          <div className="mt-6 flex items-center gap-4 justify-center">
            {/* See my work */}
            <a
              href="/#projects"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("projects");
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex items-center px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md transition-all duration-300 hover:bg-blue-500 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
              aria-label="See my projects"
            >
              See my work
            </a>

            {/* Contact Me */}
            <a
              href="/#contact"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("contact");
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="
    inline-flex items-center px-5 py-2 rounded-xl border border-blue-600 
    text-blue-600 font-semibold shadow-md transition-all duration-300 
    hover:bg-blue-600 hover:text-white hover:shadow-xl hover:scale-105 
    focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 
    focus-visible:ring-opacity-75
    dark:hover:bg-blue-500 dark:hover:text-white
    dark:text-cyan-400
    text-lg
    drop-shadow-sm
  "
              aria-label="Contact me"
            >
              Contact Me
            </a>
          </div>
        </div>

        {/* Scroll hint - CSS animation only, respects reduced-motion via Tailwind's 'motion-reduce' utility */}
        <button
          onClick={handleScrollToSkills}
          className="absolute bottom-8 flex flex-col items-center cursor-pointer z-10 hover:scale-105 transition-transform motion-reduce:animate-none"
          aria-label="Scroll to skills section"
        >
          <ChevronDownIcon
            className="w-8 h-8 text-white animate-bounce motion-reduce:animate-none"
            aria-hidden="true"
          />
          <span className="mt-2 text-sm xs:text-base text-gray-700 dark:text-slate-300 drop-shadow-sm">
            Scroll to see my skills 👇
          </span>
        </button>
      </main>
    </>
  );
}
