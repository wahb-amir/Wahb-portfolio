"use client";

import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <main className="relative flex flex-col justify-center items-center min-h-screen px-6 text-center bg-gradient-to-br from-primary via-purple-600 to-secondary dark:from-bgDark dark:via-purple-900 dark:to-secondary text-white transition-all duration-500">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-indigo-900 to-green-400  blur-3xl"
      />

      {/* 💬 Intro Text */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="z-10"
      >
        <h1 className="text-4xl sm:text-6xl font-extrabold drop-shadow-md">
          Hey, I&apos;m <span className="text-secondary">Wahb</span>
        </h1>

        <h2 className="text-lg sm:text-2xl mt-4 text-textLight dark:text-textDark font-medium">
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
        <p className="text-2xl">
          Fast, secure, scalable web apps — built to ship, built to last 🚀
        </p>
      </motion.div>
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
