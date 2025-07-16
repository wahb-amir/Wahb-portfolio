"use client";

import { AnimatePresence } from "framer-motion";
import Hero from "./Component/Hero";
import SkillsCloud from "./Component/SkillsCloud";
import PageTransition from "./Component/PageTransition";
import Project from "./Component/Project";
import Navbar from "./Component/Navbar";
import About from "./Component/About";
import ContributionCard from "./Component/ContributionCard";
export default function Home() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <Navbar />
        <Hero />
        <SkillsCloud />
        <Project />
        <About />
        'use client';

import { motion } from 'framer-motion';

export default function ContributionCard({
  project,
  role,
  stack,
  description,
  highlight,
  links,
}) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-md hover:scale-[1.02] transition-transform duration-200"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        🧩 {project}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        <span className="font-semibold">🧠 Role:</span> {role}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-semibold">⚙️ Stack:</span> {stack}
      </p>
      <p className="text-sm text-gray-800 dark:text-gray-300 mt-2">{description}</p>
      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mt-2">
        🔥 {highlight}
      </p>

      <div className="flex gap-3 mt-4 text-sm">
        {links?.live && (
          <a
            href={links.live}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            🌐 Live
          </a>
        )}
        {links?.repo && (
          <a
            href={links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            💻 GitHub
          </a>
        )}
      </div>
    </motion.div>
  );
}

      </PageTransition>
    </AnimatePresence>
  );
}
