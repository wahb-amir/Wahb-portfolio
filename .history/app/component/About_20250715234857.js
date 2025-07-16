"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const About = () => {
  const [timeSinceStart, setTimeSinceStart] = useState("");

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
    <section
      id="about"
      className="max-w-4xl mx-auto px-6 py-20 text-gray-800 dark:text-slate-300"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          👨‍💻 About Me
        </h2>

        <p className="text-center text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
          I’m a 15-year-old self-taught full-stack developer, passionate about
          building fast, scalable web apps. In just 115 days, I’ve gone from
          zero to deploying full-stack projects using modern tech like React,
          Next.js, MongoDB, and Node — all hosted on my own Linux VPS.
        </p>

        {/* Live Timer */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-5 text-center mb-16 shadow-inner">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-2">
            ⏳ Time Since I Started Coding
          </h3>
          <p className="text-cyan-400 text-xl font-mono">{timeSinceStart}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          <StatCard label="Days of Learning" value="115" />
          <StatCard label="Projects Deployed" value="3" />
          <StatCard label="Self-Hosted on VPS" value="Yes 🐧" />
        </div>

        {/* Quick Facts */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            ⚡ Quick Facts
          </h3>
          <ul className="list-disc pl-6 text-gray-600 dark:text-slate-400 space-y-2">
            <li>Frontend: React, Next.js, Tailwind, Framer Motion</li>
            <li>Backend: Node.js, Express, MongoDB, Mongoose</li>
            <li>Deployment: Linux VPS (manual + CLI deployment)</li>
            <li>Learning by building — every single day</li>
          </ul>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            🚀 Learning Timeline
          </h3>
          <div className="space-y-4 border-l-2 border-cyan-400 pl-4">
            <TimelineItem title="Mar 2025" desc="Started with HTML & CSS basics" />
            <TimelineItem title="April 2025" desc="Learned JavaScript and built mini projects" />
            <TimelineItem title="May 2025" desc="Dived into React, Tailwind & Next.js" />
            <TimelineItem title="June 2025" desc="Completed & deployed 3 full-stack apps" />
            <TimelineItem title="Now" desc="Exploring more backend concepts & scaling" />
          </div>
        </div>

        {/* Final Quote */}
        <blockquote className="text-center italic text-cyan-400 text-xl">
          &quot;Still early in the journey — but building like I mean it.&quot;
        </blockquote>
      </motion.div>
    </section>
  );
};

export default About;

// 👇 Optional Components for clean modular code

const StatCard = ({ label, value }) => (
  <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg text-center shadow-md">
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-600 dark:text-slate-400">{label}</p>
  </div>
);

const TimelineItem = ({ title, desc }) => (
  <div>
    <span className="font-semibold text-gray-900 dark:text-white">
      {title}:
    </span>{" "}
    <span className="text-gray-600 dark:text-slate-400">{desc}</span>
  </div>
);
