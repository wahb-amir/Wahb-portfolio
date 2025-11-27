"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";

const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
  ssr: false,
  loading: () => null,
});

/** Start date for the "dev journey" timer */
const START_DATE = new Date("2025-03-22T00:00:00Z");

/** Helper that returns "Xd Yh Zm" */
function getTimeSinceStart(start = START_DATE) {
  const now = new Date();
  const diff = now - start;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `${days}d ${hours}h ${minutes}m`;
}

export default function About() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // initialize synchronously to avoid layout shift
  const [timeSinceStart, setTimeSinceStart] = useState(() => getTimeSinceStart());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);

    const tick = () => setTimeSinceStart(getTimeSinceStart());
    const interval = setInterval(tick, 1000 * 60);
    tick();

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="about"
      className={`relative w-full min-h-screen py-24 px-6 overflow-hidden flex items-center justify-center
       bg-[#f9fafb] dark:bg-[#0f172a]
       bg-gradient-to-b from-[#00b1ff88] to-[#00bfff44]
       text-black dark:text-white`}
      aria-labelledby="about-heading"
    >
      {hydrated && <LazyBackgroundEffect />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl z-10 px-4 sm:px-6 md:px-8"
      >
        <h2 id="about-heading" className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          👨‍💻 About Me
        </h2>

        <p className="text-center text-lg text-gray-700 dark:text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
          Hey — I’m Wahb. I taught myself to code and I’m happiest when I’m building things that actually work.
          Right now I’m deep into <strong className="underline decoration-blue-500">PyTorch</strong>, training and debugging convolutional models for computer vision — think object detection, segmentation, and all the messy training-loop stuff.
          At the same time I’m learning <strong className="underline decoration-blue-500">C++</strong> so I can move models off the cloud and run them on robots and low-level hardware.
          I also build and deploy full-stack apps and self-host services on Linux VPS — practical, hands-on work. 🤝
        </p>

        {/* Timer */}
        <div className="bg-white/20 dark:bg-slate-800/40 backdrop-blur-md rounded-xl p-6 text-center mb-16 border border-white/10 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-2">⏳ Active Dev Journey</h3>
          <p className="text-cyan-800 dark:text-cyan-400 text-xl font-mono">{timeSinceStart}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          <StatCard
            label="Days in Dev Flow"
            value={`${Math.floor((new Date() - START_DATE) / (1000 * 60 * 60 * 24))}d`}
          />
          <StatCard label="Projects Deployed" value="3" />
          <StatCard label="Self-Hosted on VPS" value="Yes 🐧" />
        </div>

        {/* Quick Facts */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">⚡ Quick Facts</h3>
          <ul className="list-disc pl-6 text-gray-700 dark:text-slate-300 space-y-2">
            <li>Frontend: React, Next.js, Tailwind CSS, Framer Motion</li>
            <li>Backend: Node.js, Express, MongoDB, Mongoose</li>
            <li>Machine Learning & AI: <strong>PyTorch</strong> — CNNs, detection, segmentation, training & debugging</li>
            <li>Low-level & Robotics: learning <strong>C++</strong> for embedded/robotics and real-time systems</li>
            <li>Mathematics: Linear Algebra, Calculus, Probability & Statistics — core for ML</li>
            <li>Deployment: Linux VPS (manual + CLI-based), Docker for experiments</li>
            <li>Workflow: build small experiments, iterate quickly, ship what works</li>
          </ul>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">🚀 Learning Timeline</h3>

          <div className="space-y-4 border-l-2 border-cyan-400 pl-4">
            <TimelineItem title="Early 2025" desc="Front-end foundations: HTML & CSS" />
            <TimelineItem title="Spring 2025" desc="Built small JS projects & sharpened JavaScript skills" />
            <TimelineItem title="Mid 2025" desc="Moved to React, Tailwind & Next.js — shipped full-stack apps" />
            <TimelineItem title="Summer 2025" desc="Deployed 3 full-stack web apps and self-hosted services" />

            <TimelineItem
              title="Now (Advanced)"
              desc="Deep-diving into PyTorch for computer vision (CNNs, detection, segmentation, training loops) while learning C++ for robotics/low-level programming."
            />
            <TimelineItem
              title="Next"
              desc="Integrate trained models into lightweight deployments — experiment with model optimization and edge/embedded inference (C++ + inference runtimes)."
            />

            <TimelineItem
              title="Future"
              desc="Scale to production-ready AI systems: optimize models for latency, contribute to ML tooling, and build robotic systems that actually move stuff."
            />
          </div>
        </div>

        <blockquote className="text-center italic dark:text-cyan-400 text-blue-600 text-xl">
          “Still early in the journey — but building like I mean it.”
        </blockquote>

        <div className="relative z-10 flex justify-center items-center gap-6 mt-12">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll Up"
            className="hover:scale-110 transition-transform"
          >
            <ChevronUpIcon className={`w-8 h-8 ${isDark ? "text-cyan-300" : "text-cyan-600"}`} />
          </button>
          <button
            onClick={() => {
              const nextSection = document.getElementById("contributions");
              if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
            }}
            aria-label="Scroll Down"
            className="animate-pulse hover:scale-110 transition-transform"
          >
            <ChevronDownIcon className={`w-8 h-8 ${isDark ? "text-cyan-300" : "text-cyan-600"}`} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}

const StatCard = ({ label, value }) => (
  <div className="bg-white/20 dark:bg-slate-800/40 backdrop-blur-md p-5 rounded-lg text-center border border-white/10 dark:border-slate-700">
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-700 dark:text-slate-300">{label}</p>
  </div>
);

const TimelineItem = ({ title, desc }) => (
  <div>
    <span className="font-semibold text-gray-900 dark:text-white">{title}:</span>{" "}
    <span className="text-gray-700 dark:text-slate-300">{desc}</span>
  </div>
);
