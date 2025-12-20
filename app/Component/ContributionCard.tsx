"use client";
import React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

type ContributionCardProps = {
  project: string;
  role: string;
  stack: string;
  description: string;
  highlight: string;
  links?: {
    live?: string;
    repo?: string;
  };
};
export default function ContributionCard({
  project,
  role,
  stack,
  description,
  highlight,
  links,
}: ContributionCardProps ) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className={`rounded-lg p-5 border shadow-md transition-transform hover:scale-[1.02] ${
        isDark
          ? "bg-[#1f2937] border-gray-700 text-white"
          : "bg-white border-gray-200 text-black"
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xl font-bold mb-2">🧩 {project}</h3>

      <p className="text-sm mb-1">
        <span className="font-semibold">🧠 Role:</span> {role}
      </p>
      <p className="text-sm mb-1">
        <span className="font-semibold">⚙️ Stack:</span> {stack}
      </p>

      <p className="text-sm mt-2">{description}</p>

      <p
        className={`text-sm font-semibold mt-2 ${
          isDark ? "text-purple-300" : "text-purple-600"
        }`}
      >
        🔥 {highlight}
      </p>

      <div className="flex gap-4 mt-4 text-sm">
        {links?.live && (
          <a
            href={links.live}
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:underline ${
              isDark ? "text-cyan-300" : "text-cyan-600"
            }`}
          >
            🌐 Live
          </a>
        )}
        {links?.repo && (
          <a
            href={links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:underline ${
              isDark ? "text-cyan-300" : "text-cyan-600"
            }`}
          >
            💻 GitHub
          </a>
        )}
      </div>
    </motion.div>
  );
}
