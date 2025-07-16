"use client";

import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Particles from "react-tsparticles";
import { loadLinksPreset } from "tsparticles-preset-links";

const particlesInit = async (engine) => {
  await loadLinksPreset(engine);
};
const particlesOptions = {
  preset: "links",
  fullScreen: { enable: true },
  background: { color: "transparent" },
};

export default function Home() {
  const particlesOptions = {
    fullScreen: { enable: false },
    background: { color: "transparent" },
    fpsLimit: 90, // 🚀 smoother motion
    detectRetina: true,

    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" }, // 💥 sticky magnet
        onClick: { enable: true, mode: "bubble" }, // 💡 tap-to-pop effect
        resize: true,
      },
      modes: {
        grab: {
          distance: 160,
          links: {
            opacity: 0.4,
            color: "#00FFFF",
          },
        },
        bubble: {
          distance: 200,
          duration: 2,
          size: 30,
          opacity: 0.8,
          color: "#FF00FF",
        },
        repulse: {
          distance: 120,
          duration: 0.4,
        },
        push: {
          quantity: 6,
        },
      },
    },

    particles: {
      number: {
        value: 65,
        density: {
          enable: true,
          area: 1000,
        },
      },
      shape: {
        type: "char",
        character: {
          value: ["<W/>", "λ", "⚛️", "React", "{JS}"],
          font: "Fira Code",
          weight: "bold",
          fill: true,
        },
      },
      color: {
        value: ["#14f1ff", "#f914e4", "#ffc800", "#ffffff"],
      },
      size: {
        value: { min: 10, max: 20 },
        animation: {
          enable: true,
          speed: 2.5,
          minimumValue: 8,
          sync: false,
        },
      },
      opacity: {
        value: 0.35,
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
          sync: false,
        },
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        outModes: "bounce", // 🌌 they bounce off the edges
        random: false,
        straight: false,
      },
      links: {
        enable: true,
        distance: 140,
        color: "#ffffff",
        opacity: 0.15,
        width: 1,
        triangles: {
          enable: true,
          opacity: 0.05,
          color: "#ffffff",
        },
      },
      shadow: {
        enable: true,
        blur: 10,
        color: "#0ff",
      },
    },
  };

  return (
    <main className="relative flex flex-col justify-center items-center min-h-screen px-6 text-center bg-gradient-to-br from-primary via-purple-600 to-secondary dark:from-bgDark dark:via-purple-900 dark:to-secondary text-white transition-all duration-500">
      <Particles
        id="codestorm"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0 pointer-events-none mix-blend-screen brightness-125"
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
