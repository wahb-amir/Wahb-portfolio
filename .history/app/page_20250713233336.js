"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Particles from "@tsparticles/react";

const CodeNebula = Particles; // 💅 Rename it to feel ✨custom✨

import { loadFull } from "tsparticles";

export default function Home() {
  // ① Initialize the full engine (includes links, shapes, everything)
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  // ② Manual “links” configuration
  const particlesOptions = {
    fullScreen: { enable: false },
    background: { color: "transparent" },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        repulse: { distance: 120, duration: 0.4 },
        push: { quantity: 4 },
      },
    },
    particles: {
      number: { value: 60, density: { enable: true, area: 800 } },
      links: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.5,
        width: 1,
      },
      move: { enable: true, speed: 1 },
      size: { value: { min: 1, max: 5 } },
      opacity: { value: 0.5 },
    },
    detectRetina: true,
  };

  return (
    <main className="relative flex flex-col justify-center items-center min-h-screen px-6 text-center bg-gradient-to-br from-primary via-purple-600 to-secondary dark:from-bgDark dark:via-purple-900 dark:to-secondary text-white transition-all duration-500">
      {/* 🚀 Particle Background */}
      <CodeNebula
        id="codestorm"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0 mix-blend-screen brightness-125"
      />

      {/* 💫 Background blur overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 z-[-1] bg-gradient-to-br from-gray-600 via-indigo-900 to-green-400 blur-3xl"
      />

      {/* 🧠 Hero Text Block */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="z-10"
      >
        <h1 className="text-4xl sm:text-6xl font-extrabold drop-shadow-md">
          Hey, I&apos;m{" "}
          <span className="text-5xl italic mt-2 text-secondary">~ Wahb</span>
        </h1>

        <h2 className="text-lg sm:text-2xl mt-4 font-medium">
          <Typewriter
            words={[
              "Digital Experience Engineer ⚙️",
              "Crafting Blazing-Fast, Vibe-Checked Web Apps ⚡️",
              "Pixel-Perfect UX, Backend Brains 🧠",
              "Next-Gen Web Wizardry 🔮",
              "Performance-Obsessed, Design-Driven 💡",
            ]}
            loop
            cursor
            cursorStyle="_"
            typeSpeed={100}
            deleteSpeed={40}
            delaySpeed={1500}
          />
        </h2>

        <p className="text-2xl mt-4">
          Fast, secure, scalable web apps — built to ship, built to last 🚀
        </p>
      </motion.div>

      {/* 👇 Scroll Down Icon */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-10 cursor-pointer z-10"
        onClick={() =>
          document
            .getElementById("skills")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <ChevronDownIcon className="w-8 h-8 text-white dark:text-secondary animate-pulse" />
      </motion.div>
    </main>
  );
}
