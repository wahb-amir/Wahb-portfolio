"use client";

import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Particles from "react-tsparticles";
import { loadLinksPreset } from "tsparticles-preset-links";

// ✅ Init using links preset
const particlesInit = async (engine) => {
  await loadLinksPreset(engine);
};

const particlesOptions = {
  preset: "links",
  fullScreen: { enable: true },
  background: { color: "transparent" },
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        area: 800,
      },
    },
    color: {
      value: "#00dfd8", 
    },
    links: {
      enable: true,
      distance: 150,
      color: "#00dfd8",
      opacity: 0.5,
      width: 1.5,
      triangles: {
        enable: true,
        color: "#00ffcc",
        opacity: 0.1,
      },
      shadow: {
        enable: true,
        color: "#00dfd8",
        blur: 1,
      },
    },
    move: {
      enable: true,
      speed: 1.5,
      direction: "none",
      outModes: {
        default: "bounce",
      },
    },
    opacity: {
      value: 0.6,
    },
    size: {
      value: { min: 2, max: 4 },
    },
    shape: {
      type: "circle",
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "grab",
      },
      onClick: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      grab: {
        distance: 140,
        links: {
          opacity: 1,
        },
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
};

export default function Home() {
  return (
    <main className="relative flex flex-col justify-center items-center min-h-screen px-6 text-center bg-gradient-to-br from-primary via-purple-600 to-secondary dark:from-bgDark dark:via-purple-900 dark:to-secondary text-white transition-all duration-500">
      {/* 🔗 Particle Background with Links Preset */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />

      {/* 💫 Optional background blur (customize or remove if heavy) */}
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

        <h2 className="text-lg sm:text-2xl mt-4 text-white dark:text-textDark font-medium">
          <Typewriter
            words={[
              "Digital Experience Engineer ⚙️",
              "Crafting Blazing-Fast, Vibe-Checked Web Apps ⚡️",
              "Pixel-Perfect UX, Backend Brains 🧠",
              "Next-Gen Web Wizardry 🔮",
              "Performance-Obsessed, Design-Driven 💡",
            ]}
            loop={true}
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
        onClick={() => {
          document
            .getElementById("skills")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <ChevronDownIcon className="w-8 h-8 text-white dark:text-secondary animate-pulse" />
      </motion.div>
    </main>
  );
}
