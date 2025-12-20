"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import ImageSlider from "./ImageSlider";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import RepoSelectorModal from "./RepoSelectorModal";

type ProjectCardProps = {
  title?: string;
  role?: string;
  images?: string[];
  tech?: string[];
  short?: string;
  liveLink?: string | null;
  githubLink?: string | string[] | null;
  problem?: string;
  process?: string[];
  outcome?: string;
  stats?: { [key: string]: string | number };
};

const ProjectCard: React.FC<ProjectCardProps> = ({
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
}: ProjectCardProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  // brief loading skeleton to improve perceived performance
  useEffect(() => {
    // if there are no images keep a slightly longer skeleton so layout doesn't jump
    const delay = images && images.length > 0 ? 350 : 650;
    const id = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(id);
    // images is correct dep
  }, [images]);

  const isDark = mounted && theme === "dark";

  // fix id sanitization: allow letters, numbers and hyphens
  const safeId = title
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-]/g, "")
    .toLowerCase();

  // handle multiple repo links (if githubLink is an array)
  const isMultipleRepos: boolean =
    Array.isArray(githubLink) && githubLink.length > 1;
  const repoLinks: string[] = Array.isArray(githubLink)
    ? githubLink
    : githubLink
    ? [githubLink]
    : [];

  const formatKey = (k: string) =>
    k
      .replace(/([A-Z])/g, " $1")
      .replace(/[_\-]/g, " ")
      .replace(/^./, (s: string) => s.toUpperCase());

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`group relative rounded-xl overflow-hidden border transition-transform transform hover:shadow-xl focus-within:shadow-xl ${
        isDark ? "border-slate-700 bg-[#071020]/60" : "border-gray-100 bg-white"
      }`}
      aria-labelledby={`project-${safeId}`}
      aria-busy={loading}
    >
      <div className="w-full h-48 md:h-56 bg-gray-50 dark:bg-slate-900">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-white/60 to-gray-100/40 dark:from-slate-800/60 dark:to-slate-700/40 animate-pulse">
            <div className="w-11/12 h-40 rounded-lg bg-gray-200 dark:bg-slate-800" />
          </div>
        ) : (
          // @ts-ignore
          <ImageSlider images={images} />
        )}
      </div>

      <div className="p-4 sm:p-6">
        {/* Title + Role + Tech */}
        <div className="flex items-start justify-between gap-4">
          <div className="text-left flex-1 min-w-0">
            {loading ? (
              <div className="space-y-2">
                <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
              </div>
            ) : (
              <>
                <h3
                  id={`project-${safeId}`}
                  className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white truncate"
                >
                  {title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-slate-300 mt-1 truncate">
                  {role}
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap gap-2 justify-end max-w-[220px]">
              {loading ? (
                <>
                  <span className="inline-block h-6 w-14 rounded-full bg-gray-200 dark:bg-slate-800 animate-pulse" />
                  <span className="inline-block h-6 w-10 rounded-full bg-gray-200 dark:bg-slate-800 animate-pulse" />
                </>
              ) : (
                tech.map((t: string) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 truncate border-2 border-cyan-500/50 dark:border-cyan-400/40 shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition"
                  >
                    {t}
                  </span>
                ))
              )}
            </div>

            {!loading && (stats as any).usersOnLaunch && (
              <div className="text-xs text-gray-700 dark:text-slate-400">
                {(stats as any).usersOnLaunch} users
              </div>
            )}
          </div>
        </div>

        {/* Short description */}
        <div className="mt-3">
          {loading ? (
            <>
              <div className="h-3 w-full rounded bg-gray-200 dark:bg-slate-800 animate-pulse mb-2" />
              <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
            </>
          ) : (
            <p className="text-sm sm:text-base text-gray-800 dark:text-slate-300 min-h-[48px]">
              {short}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex gap-3">
            {!loading && liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-cyan-700 text-white text-sm font-medium hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                aria-label={`Open live demo of ${title}`}
              >
                Live Demo <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </a>
            )}

            {!loading &&
              !isMultipleRepos &&
              githubLink &&
              typeof githubLink === "string" && (
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

            {!loading && isMultipleRepos && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
              >
                Select repo <CodeBracketIcon className="w-4 h-4" />
              </button>
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
              <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                Problem
              </h4>
              <p className="text-sm text-gray-800 dark:text-slate-300 mb-3">
                {problem}
              </p>

              <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                Process
              </h4>
              <ol className="list-decimal ml-5 text-sm text-gray-800 dark:text-slate-300 mb-3 space-y-1">
                {process.length ? (
                  process.map((step, i) => (
                    <li key={i} className="leading-tight">
                      {step}
                    </li>
                  ))
                ) : (
                  <li>Documented the approach and steps here.</li>
                )}
              </ol>

              <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                Outcome / Results
              </h4>
              <p className="text-sm text-gray-800 dark:text-slate-300 mb-3">
                {outcome}
              </p>

              {stats && Object.keys(stats).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(stats).map(([k, v]) => (
                    <div
                      key={k}
                      className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200"
                    >
                      <strong className="mr-1">{formatKey(k)}:</strong> {v}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isMultipleRepos && (
        <RepoSelectorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          repoLinks={repoLinks}
          projectTitle={title}
        />
      )}
    </motion.article>
  );
};

export default ProjectCard;
