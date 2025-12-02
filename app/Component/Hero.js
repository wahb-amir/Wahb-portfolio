"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Avatar from "./Avatar";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const LazyParticles = dynamic(() => import("./CustomParticles"), {
  ssr: false,
  loading: () => null,
});
const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // mark client hydrate timing — used to enable client-only bits
    setHydrated(true);
  }, []);

  const handleScrollToSkills = () => {
    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.warn("Skills section not found!");
    }
  };

  // --- CONSTANTS for fallbacks so layout is consistent ---
  const HERO_MIN_HEIGHT = "min-h-[60vh] sm:min-h-[68vh]"; // reserve vertical space
  const AVATAR_SIZE = {
    // explicit pixel sizes to prevent resizing flashes
    mobile: 150, // matches w-[150px]
    tablet: 200, // xs:w-[200px]
    large: 300, // 3xl:w-[300px]
  };

  return (
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
      aria-label="Hero"
    >
      {/* Background placeholder (server-rendered) — keeps same visual baseline while bg effects load */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          // subtle overlay that matches final visual; this prevents jump when BackgroundEffect mounts
          background:
            "linear-gradient(to bottom, rgba(0,191,255,0.08), rgba(0,177,255,0.12))",
        }}
      />

      {hydrated && (
        <>
          <LazyBackgroundEffect />
          <LazyParticles />
        </>
      )}

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="z-10 mt-8 max-w-xl mx-auto"
      >
        {/* Avatar container: explicit sizing so image space is reserved on SSR */}
        <div
          className="mx-auto p-2"
          style={{
            width: AVATAR_SIZE.mobile,
            height: AVATAR_SIZE.mobile,
            maxWidth: "92vw",
          }}
        >
         
          <Avatar />
        </div>

        <h1 className="font-sans text-4xl xs:text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-800 dark:text-white drop-shadow-lg mt-6">
          Hey, I&apos;m{" "}
          <span className="font-serif text-5xl xs:text-6xl sm:text-8xl text-blue-600 font-black drop-shadow-lg">
            Wahb
          </span>
          <br />
          <span className="mt-4 block text-lg xs:text-xl sm:text-2xl font-medium text-gray-700 dark:text-slate-300 drop-shadow-sm">
            — I Build Fast & Scalable Web Apps 🚀
          </span>
        </h1>


        {/* Typewriter: show a static fallback until hydrated to avoid changing height */}
        <h2 className="text-base xs:text-lg sm:text-2xl mt-6 font-medium max-w-screen-3xl mx-auto text-gray-800 dark:text-slate-300 drop-shadow-md">
          {hydrated ? (
            <Typewriter
              words={[
                "Full-Stack Web Developer 💻",
                "Building Scalable Web Apps 🚀",
                "Optimizing Performance & UX ⚡",
                "Deploying Apps on Linux VPS 🐧",
                "Turning Ideas into Production 🔁",
              ]}
              loop
              cursor
              cursorStyle="_"
              typeSpeed={60}
              deleteSpeed={40}
              delaySpeed={1500}
            />
          ) : (
            // Fallback text has same approximate length to avoid reflow
            "Full-Stack Web Developer 💻 — Building Scalable Web Apps 🚀"
          )}
        </h2>

        <p className="text-base mt-6 max-w-2xl mx-auto text-black dark:text-slate-400 drop-shadow-sm">
          I turn complex ideas into elegant, fast, and reliable web applications.
        </p>
        <p className="text-blue-700 dark:text-cyan-300 mt-2 text-sm sm:text-base drop-shadow-sm">
          Turning ideas into full-stack apps — from my terminal to the cloud ☁️💻
        </p>
      </motion.div>

      {/* Scroll down chevron */}
      <motion.button
        initial={{ y: 0 }}
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 flex flex-col items-center cursor-pointer z-10 hover:scale-110 transition"
        onClick={handleScrollToSkills}
        aria-label="Scroll to skills section"
      >
        <ChevronDownIcon className="w-8 h-8 text-white animate-pulse" />
        <span className="mt-2 text-sm xs:text-base text-gray-700 dark:text-slate-300 drop-shadow-sm">
          Scroll to see my skills 👇
        </span>
      </motion.button>

    </main>
  );
}
