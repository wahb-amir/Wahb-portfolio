"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import ImageSlider from "./ImageSlider";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowTopRightOnSquareIcon, CodeBracketIcon } from "@heroicons/react/24/outline";

const ProjectCard = ({
  title = "Untitled Project",
  role = "Contributor",
  images = [],
  tech = [],
  short = "",
  liveLink = null,
  githubLink = null,
  problem = "",
  process = [],
  outcome = "",
  stats = {},
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && theme === "dark";

  const safeId = title.replace(/\s+/g, "-").toLowerCase(); 

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`self-start relative rounded-xl shadow-lg overflow-hidden border ${isDark ? "border-slate-700 bg-[#071020]/60" : "border-gray-100 bg-white"
        }`}
      aria-labelledby={`project-${safeId}`}
    >
      {/* Image slider */}
      <div className="w-full h-48 md:h-56 bg-gray-50 dark:bg-slate-900">
        <ImageSlider images={images} />
      </div>

      <div className="p-4 sm:p-6">
        {/* Title + Role + Tech */}
        <div className="flex items-start justify-between gap-4">
          <div className="text-left">
            <h3
              id={`project-${safeId}`}
              className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
            >
              {title}
            </h3>
            <p className="text-sm text-gray-700 dark:text-slate-300 mt-1">{role}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap gap-2 justify-end">
              {tech.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200"
                >
                  {t}
                </span>
              ))}
            </div>
            {stats.usersOnLaunch && (
              <div className="text-xs text-gray-700 dark:text-slate-400">
                {stats.usersOnLaunch} users
              </div>
            )}
          </div>
        </div>

        {/* Short description */}
        <p className="mt-3 text-sm sm:text-base text-gray-800 dark:text-slate-300 min-h-[48px]">
          {short}
        </p>

        {/* Actions */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex gap-3">
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-cyan-700 text-white text-sm font-medium hover:bg-cyan-800 transition"
                aria-label={`Open live demo of ${title}`}
              >
                Live Demo <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </a>
            )}

            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                aria-label={`Open GitHub repo of ${title}`}
              >
                Code <CodeBracketIcon className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
              className="text-sm font-semibold text-cyan-700 dark:text-cyan-400 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
            >
              {open ? "Hide case study" : "View case study"}
            </button>
          </div>
        </div>

        {/* Case Study */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 text-left"
            >
              <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Problem</h4>
              <p className="text-sm text-gray-800 dark:text-slate-300 mb-3">{problem}</p>

              <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Process</h4>
              <ol className="list-decimal ml-5 text-sm text-gray-800 dark:text-slate-300 mb-3 space-y-1">
                {process.length
                  ? process.map((step, i) => (
                    <li key={i} className="leading-tight">
                      {step}
                    </li>
                  ))
                  : <li>Documented the approach and steps here.</li>}
              </ol>

              <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Outcome / Results</h4>
              <p className="text-sm text-gray-800 dark:text-slate-300 mb-3">{outcome}</p>

              {stats && Object.keys(stats).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(stats).map(([k, v]) => (
                    <div
                      key={k}
                      className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200"
                    >
                      <strong className="mr-1">{k}:</strong> {v}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
