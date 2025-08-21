"use client";

import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Avatar from "./Avatar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Hero = () => {
  const handleScrollToSkills = () => {
    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.warn("Skills section not found!");
    }
  };
  const LazyParticles = dynamic(() => import("./CustomParticles"), {
    ssr: false,
    loading: () => null,
  });
  const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
    ssr: false,
    loading: () => null,
  });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <main
      id="hero-section"
      className="
    relative flex flex-col justify-start items-center
    h-fit px-4 xs:px-6 text-center pb-[6.25rem]
    text-gray-900 dark:text-gray-100
    overflow-hidden pt-[env(safe-area-inset-top)]
   
  "
      style={{
        backgroundImage: isDark
          ? "radial-gradient(circle at top left, #00b1ff33, transparent 70%), radial-gradient(circle at bottom right, #00dfd033, transparent 70%)"
          : "radial-gradient(circle at top left, #7f5af022, transparent 70%), radial-gradient(circle at bottom right, #00dfd822, transparent 70%)",
        backgroundColor: isDark ? "#0f172a" : " bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]",
      }}
    >
      <LazyParticles
        colors={["#00dfd8", "#00bfff", "#00aaff", "#66fcf1", "#ffffff"]}
      />

      <LazyBackgroundEffect />

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="z-10 mt-8 max-w-xl mx-auto"
      // style={{ marginTop: "max(1rem, 10vh)" }}
      >
        <div className="mx-auto w-[150px] xs:w-[200px] 3xl:w-[300px] p-2">
          <Avatar />
        </div>

        <h1 className="text-3xl xs:text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-lg mt-4 text-gray-900 dark:text-white">
          Hey, I&apos;m{" "}
          <span className="text-4xl xs:text-5xl sm:text-7xl text-cyan-300 font-black drop-shadow-lg">
            ~ Wahb
          </span>
        </h1>

        <h2 className="text-base xs:text-lg sm:text-2xl mt-6 font-medium max-w-screen-3xl mx-auto text-gray-800 dark:text-slate-300 drop-shadow-md">
          <Typewriter
            words={[
              "Full-Stack Web Developer 💻",
              "Deploying on Linux VPS like a boss 🐧",
              "React, Next.js, MongoDB = ❤️",
              "Building fast, sleek web apps 🚀",
              "Learning, breaking, building again 🔁",
            ]}
            loop
            cursor
            cursorStyle="_"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={1500}
          />
        </h2>

        <p className="text-base mt-6 max-w-2xl mx-auto text-black dark:text-slate-400 drop-shadow-sm">
          Fast, secure, scalable web apps — built to ship, built to last
        </p>
        <p className="text-cyan-400 mt-2 text-sm sm:text-base drop-shadow-sm">
          Turning ideas into full-stack apps — from my terminal to the cloud ☁️💻
        </p>

      </motion.div>

      {/* Scroll down chevron */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 cursor-pointer z-10 hover:scale-110 transition"
        onClick={handleScrollToSkills}
        aria-label="Scroll to skills section"
      >
        <ChevronDownIcon className="w-8 h-8 text-cyan-300 animate-pulse mt-10" />
      </motion.div>
    </main>
  );
};

export default Hero;
