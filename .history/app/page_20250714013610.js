"use client";

import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Particles from "react-tsparticles";
import { loadLinksPreset } from "tsparticles-preset-links";
import Image from "next/image";
import MyComponent from "./Component/Avatar";

const particlesInit = async (engine) => {
  await loadLinksPreset(engine);
};

const particlesOptions = {
  preset: "links",
  fullScreen: { enable: true },
  background: { color: "transparent" },
  particles: {
    number: {
      value: 50,
      density: { enable: true, area: 800 },
    },
    color: {
      value: ["#00dfd8", "#00bfff", "#00aaff", "#66fcf1", "#ffffff"],
    },
    links: {
      enable: true,
      distance: 60,
      color: "#00bfff",
      opacity: 0.3,
      width: 1,
      triangles: { enable: false },
      shadow: { enable: false },
    },
    move: {
      enable: true,
      speed: 1.2,
      direction: "none",
      outModes: { default: "bounce" },
    },
    opacity: { value: 0.5 },
    size: { value: { min: 2, max: 3.5 } },
    shape: { type: "circle" },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "grab" },
      onClick: { enable: true, mode: "repulse" },
    },
    modes: {
      grab: { distance: 100, links: { opacity: 0.8 } },
      repulse: { distance: 150, duration: 0.4 },
    },
  },
};

export default function Home() {
  return (
    <main className="relative flex flex-col justify-center items-center min-h-screen px-6 text-center bg-[#0a0f1a] text-white overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />
      <MyComponent />
      {/* <Image
        src="/Avatar.svg"
        alt="Animated Avatar"
        width={200}
        height={200}
        priority
        className="rounded-full border-4 border-cyan-400 shadow-lg"
      /> */}
      {/* 💫 Back Glow (Blurred gradients) */}
      <div className="absolute inset-0 bg-gradient-radial from-[#00dfd844] via-[#00000000] to-[#00000000] blur-2xl z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-[#00bfff] blur-3xl opacity-30 rounded-full z-0 animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[300px] h-[300px] bg-[#00dfd8] blur-3xl opacity-30 rounded-full z-0 animate-pulse" />

      {/* 🧠 Hero Content */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="z-10 mt-10"
      >
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-lg">
          Hey, I&apos;m{" "}
          <span className="text-5xl sm:text-7xl text-cyan-300 font-black">
            ~ Wahb
          </span>
        </h1>

        <h2 className="text-lg sm:text-2xl mt-6 font-medium max-w-xl mx-auto text-slate-200">
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

        <p className="text-xl sm:text-2xl mt-6 max-w-2xl mx-auto text-slate-300">
          Fast, secure, scalable web apps — built to ship, built to last 🚀
        </p>
      </motion.div>

      {/* ⬇ Scroll Down Indicator */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 cursor-pointer z-10 hover:scale-110 transition"
        onClick={() =>
          document
            .getElementById("skills")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <ChevronDownIcon className="w-8 h-8 text-cyan-300 animate-pulse" />
      </motion.div>
    </main>
  );
}
