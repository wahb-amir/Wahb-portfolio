"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BackgroundEffect from "./BackgroundEffect";
import { useTheme } from "next-themes";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

const About = () => {
  const [timeSinceStart, setTimeSinceStart] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  

  useEffect(() => {
    const startDate = new Date("2025-03-22T00:00:00Z");

    const updateTimer = () => {
      const now = new Date();
      const diff = now - startDate;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeSinceStart(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section
        id="about"
        className="relative w-full min-h-screen py-24 px-6 overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(circle at top left, #00b1ff33, transparent 70%), radial-gradient(circle at bottom right, #00dfd033, transparent 70%)"
            : "radial-gradient(circle at top left, #7f5af022, transparent 70%), radial-gradient(circle at bottom right, #00dfd822, transparent 70%)",
          backgroundColor: isDark ? "#0f172a" : "#f9fafb",
        }}
      >
        <BackgroundEffect />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl z-10 px-4 sm:px-6 md:px-8"
        >
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            👨‍💻 About Me
          </h2>

          <p className="text-center text-lg text-gray-700 dark:text-slate-300 max-w-3xl mx-auto mb-12">
            I&#39;m a 15-year-old self-taught full-stack developer passionate
            about building high-performance web apps. In just 115 days, I’ve
            gone from learning HTML to deploying full-stack applications with
            React, Next.js, Node.js, and MongoDB — hosted on Linux VPS.
          </p>

          {/* Timer */}
          <div className="bg-white/20 dark:bg-slate-800/40 backdrop-blur-md rounded-xl p-6 text-center mb-16 border border-white/10 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-2">
              ⏳ Time Since I Started Coding
            </h3>
            <p className="text-cyan-400 text-xl font-mono">{timeSinceStart}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
            <StatCard
              label="Days of Learning"
              value={(() => {
                const startDate = new Date("2025-03-22T00:00:00Z");
                const now = new Date();
                const diff = now - startDate;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                return `${days}d`;
              })()}
            />
            <StatCard label="Projects Deployed" value="3" />
            <StatCard label="Self-Hosted on VPS" value="Yes 🐧" />
          </div>

          {/* Quick Facts */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              ⚡ Quick Facts
            </h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-slate-300 space-y-2">
              <li>Frontend: React, Next.js, Tailwind, Framer Motion</li>
              <li>Backend: Node.js, Express, MongoDB, Mongoose</li>
              <li>Deployment: Linux VPS (manual + CLI-based setup)</li>
              <li>Learning by doing — shipping every step of the way</li>
            </ul>
          </div>
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              🚀 Learning Timeline
            </h3>
            <div className="space-y-4 border-l-2 border-cyan-400 pl-4">
              <TimelineItem
                title="Mar 2025"
                desc="Started with HTML & CSS basics"
              />
              <TimelineItem
                title="April 2025"
                desc="Learned JavaScript and built mini projects"
              />
              <TimelineItem
                title="May 2025"
                desc="Dived into React, Tailwind & Next.js"
              />
              <TimelineItem
                title="June 2025"
                desc="Completed & deployed 3 full-stack apps"
              />
              <TimelineItem
                title="Now"
                desc="Exploring more backend concepts & scaling"
              />
            </div>
          </div>

          <blockquote className="text-center italic text-cyan-400 text-xl">
            &quot;Still early in the journey — but building like I mean
            it.&quot;
          </blockquote>
        </motion.div>
      </section>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-0 flex items-center gap-6">
        <button
          onClick={() => {
            const nextSection = document.getElementById("project-section");
            if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
          }}
          aria-label="Scroll Up"
          className="hover:scale-110 transition-transform"
        >
          <ChevronUpIcon
            className={`w-8 h-8 ${isDark ? "text-cyan-300" : "text-cyan-600"}`}
          />
        </button>
        <button
          onClick={() => {
            const nextSection = document.getElementById("contributions");
            if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
          }}
          aria-label="Scroll Down"
          className="animate-pulse hover:scale-110 transition-transform"
        >
          <ChevronDownIcon
            className={`w-8 h-8 ${isDark ? "text-cyan-300" : "text-cyan-600"}`}
          />
        </button>
      </div>
    </>
  );
};

export default About;

const StatCard = ({ label, value }) => (
  <div className="bg-white/20 dark:bg-slate-800/40 backdrop-blur-md p-5 rounded-lg text-center border border-white/10 dark:border-slate-700">
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-700 dark:text-slate-300">{label}</p>
  </div>
);

const TimelineItem = ({ title, desc }) => (
  <div>
    <span className="font-semibold text-gray-900 dark:text-white">
      {title}:
    </span>{" "}
    <span className="text-gray-700 dark:text-slate-300">{desc}</span>
  </div>
);
