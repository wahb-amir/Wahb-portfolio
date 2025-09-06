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
    bg-[#f9fafb] dark:bg-[#0f172a]
    bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
    text-black dark:text-white
    overflow-hidden pt-[env(safe-area-inset-top)]
  "
    >


      <LazyBackgroundEffect />

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="z-10 mt-8 max-w-xl mx-auto"
      >
        <div className="mx-auto w-[150px] xs:w-[200px] 3xl:w-[300px] p-2">
          <Avatar />
        </div>

        <h1 className="font-sans text-4xl xs:text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-lg mt-6">
          Hey, I&apos;m{" "}
          <span className="font-serif text-5xl xs:text-6xl sm:text-8xl text-cyan-400 font-black drop-shadow-lg">
            Wahb
          </span>
          <br />
          <span className="mt-4 block text-lg xs:text-xl sm:text-2xl font-medium text-gray-700 dark:text-slate-300 drop-shadow-sm">
            — I Build Fast & Scalable Web Apps 🚀
          </span>
        </h1>



        <h2 className="text-base xs:text-lg sm:text-2xl mt-6 font-medium max-w-screen-3xl mx-auto text-gray-800 dark:text-slate-300 drop-shadow-md">
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
        </h2>

        <p className="text-base mt-6 max-w-2xl mx-auto text-black dark:text-slate-400 drop-shadow-sm">
          I turn complex ideas into elegant, fast, and reliable web applications.
        </p>
        <p className="text-blue-700 dark:text-cyan-300 mt-2 text-sm sm:text-base drop-shadow-sm">
          Turning ideas into full-stack apps — from my terminal to the cloud ☁️💻
        </p>

      </motion.div>

      {/* Scroll down chevron */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 flex flex-col items-center cursor-pointer z-10 hover:scale-110 transition"
        onClick={handleScrollToSkills}
        aria-label="Scroll to skills section"
      >
        <ChevronDownIcon className="w-8 h-8 text-cyan-300 animate-pulse" />
        <span className="mt-2 text-sm xs:text-base text-gray-700 dark:text-slate-300 drop-shadow-sm">
          Scroll to see my skills 👇
        </span>
      </motion.div>

    </main>
  );
};

export default Hero;
