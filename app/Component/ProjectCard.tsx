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

type Metric = {
  metric?: string;
  value?: string;
  note?: string;
};

type CaseStudy = {
  tlDr?: string;
  problem?: string;
  constraints?: string;
  myRole?: string;
  responsibilities?: string[];
  approach?: string[];
  technicalSolution?: string[];
  architectureNotes?: string;
  outcomes?: {
    qualitative?: string;
    quantitative?: Metric[];
  };
  launch?: {
    date?: string;
  };
  proofPoints?: string[];
  lessons?: string[];
  callToAction?: string;
};

export type ProjectCardProps = {
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
  caseStudy?: CaseStudy;
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
  caseStudy,
}: ProjectCardProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const delay = images && images.length > 0 ? 350 : 650;
    const id = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(id);
  }, [images]);

  const isDark = mounted && theme === "dark";

  const safeId = title
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-]/g, "")
    .toLowerCase();

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

  const renderList = (arr?: string[]) =>
    arr && arr.length ? (
      <ul className="list-inside list-disc space-y-2 ml-4">
        {arr.map((s, i) => (
          <li
            key={i}
            className="text-sm text-gray-800 dark:text-slate-300 leading-relaxed"
          >
            {s}
          </li>
        ))}
      </ul>
    ) : null;

  const renderMetric = (m: Metric, idx: number) => (
    <div
      key={idx}
      className="flex flex-col items-start gap-1 p-3 rounded-md bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 min-w-[140px]"
    >
      <div className="text-sm font-semibold text-gray-900 dark:text-white">
        {m.value ?? "—"}
      </div>
      <div className="text-xs text-gray-600 dark:text-slate-400">
        {m.metric ?? "Metric"}
      </div>
      {m.note && (
        <div className="text-2xs text-gray-500 dark:text-slate-500 mt-1">
          {m.note}
        </div>
      )}
    </div>
  );

  // normalized case study (fall back to legacy fields)
  const normalizedCS: CaseStudy =
    caseStudy && Object.keys(caseStudy).length > 0
      ? caseStudy
      : {
          tlDr: short || undefined,
          problem,
          constraints: undefined,
          myRole: role,
          responsibilities: undefined,
          approach: process?.length ? process : undefined,
          technicalSolution: undefined,
          architectureNotes: undefined,
          outcomes: {
            qualitative: outcome || undefined,
            quantitative:
              stats && Object.keys(stats).length
                ? Object.entries(stats).map(([k, v]) => ({
                    metric: formatKey(k),
                    value: String(v),
                  }))
                : undefined,
          },
          launch: undefined,
          proofPoints: undefined,
          lessons: undefined,
          callToAction: undefined,
        };
  console.log(normalizedCS);
  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={`project-card group relative rounded-xl overflow-hidden border transition-transform transform hover:shadow-xl focus-within:shadow-xl ${
          isDark
            ? "border-slate-700 bg-[#071020]/60"
            : "border-gray-100 bg-white"
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
            // @ts-ignore - ImageSlider accepts images: string[]
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
            </div>
          </div>

          {/* Short description */}
          {normalizedCS.tlDr && (
            <div className="mb-4 mt-4">
              <div className="inline-flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-900">
                <span
                  className="w-2 h-2 rounded-full bg-blue-500 dark:bg-cyan-300 inline-block"
                  aria-hidden="true"
                />
                <p className="m-0 text-sm font-medium text-blue-700 dark:text-cyan-200 max-w-prose">
                  {normalizedCS.tlDr}
                </p>
              </div>
            </div>
          )}

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

              {!loading && repoLinks.length === 1 && (
                <a
                  href={repoLinks[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                  aria-label={`Open GitHub repo of ${title}`}
                >
                  Code <CodeBracketIcon className="w-4 h-4" />
                </a>
              )}

              {!loading && repoLinks.length > 1 && (
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
              <motion.section
                key="case-study"
                layout="position"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-700 text-left"
              >
                {/* Role / Constraints / Launch row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-md bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                    <div className="text-xs text-gray-500 dark:text-slate-400">
                      Role
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {normalizedCS.myRole ?? role}
                    </div>
                  </div>

                  {normalizedCS.constraints ? (
                    <div className="p-3 rounded-md bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                      <div className="text-xs text-gray-500 dark:text-slate-400">
                        Constraints
                      </div>
                      <div className="text-sm text-gray-800 dark:text-slate-300 leading-snug">
                        {normalizedCS.constraints}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-md bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                      <div className="text-xs text-gray-500 dark:text-slate-400">
                        Timeline
                      </div>
                      <div className="text-sm text-gray-800 dark:text-slate-300">
                        MVP-focused delivery
                      </div>
                    </div>
                  )}
                </div>

                {/* Problem */}
                {normalizedCS.problem && (
                  <>
                    <h4 className="mt-5 text-sm font-semibold text-gray-900 dark:text-white">
                      Problem
                    </h4>
                    <p className="text-sm text-gray-800 dark:text-slate-300 mb-3 leading-relaxed">
                      {normalizedCS.problem}
                    </p>
                  </>
                )}

                {/* Approach / Process */}
                {normalizedCS.approach && (
                  <>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Approach
                    </h4>
                    <div className="mb-3">
                      {renderList(normalizedCS.approach)}
                    </div>
                  </>
                )}

                {/* Responsibilities */}
                {normalizedCS.responsibilities && (
                  <>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      My responsibilities
                    </h4>
                    <div className="mb-3">
                      {renderList(normalizedCS.responsibilities)}
                    </div>
                  </>
                )}

                {/* Technical Solution */}
                {normalizedCS.technicalSolution && (
                  <>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Technical solution
                    </h4>
                    <div className="mb-3">
                      {renderList(normalizedCS.technicalSolution)}
                    </div>
                  </>
                )}

                {/* Architecture notes */}
                {normalizedCS.architectureNotes && (
                  <>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Architecture notes
                    </h4>
                    <p className="text-sm text-gray-800 dark:text-slate-300 mb-3 leading-relaxed whitespace-pre-line">
                      {normalizedCS.architectureNotes}
                    </p>
                  </>
                )}

                {/* Outcomes */}
                {(normalizedCS.outcomes || normalizedCS.problem) && (
                  <>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Outcome / Results
                    </h4>

                    {/* qualitative */}
                    {normalizedCS.outcomes?.qualitative ? (
                      <p className="text-sm text-gray-800 dark:text-slate-300 leading-relaxed mb-3">
                        {normalizedCS.outcomes?.qualitative}
                      </p>
                    ) : outcome ? (
                      <p className="text-sm text-gray-800 dark:text-slate-300 leading-relaxed mb-3">
                        {outcome}
                      </p>
                    ) : null}
                  </>
                )}

                {/* Lessons */}
                {stats && Object.keys(stats).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {Object.entries(stats).map(([k, v]) => (
                      <span
                        key={k}
                        className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200"
                      >
                        <strong className="mr-1">{formatKey(k)}:</strong>
                        {v}
                      </span>
                    ))}
                  </div>
                )}

                {/* Call to action */}
                {normalizedCS.callToAction && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-800 dark:text-slate-300 mb-3">
                      {normalizedCS.callToAction}
                    </p>
                    <div className="flex gap-3">
                      {liveLink && (
                        <a
                          href={liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-cyan-700 text-white text-sm font-medium hover:bg-cyan-800 transition"
                        >
                          View demo{" "}
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          const el = document.getElementById("contact");
                          if (el)
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                        }}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                      >
                        Contact about this
                      </button>
                    </div>
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Repo selector modal if multiple repos */}
        {isMultipleRepos && (
          <RepoSelectorModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            repoLinks={repoLinks}
            projectTitle={title}
          />
        )}
      </motion.article>

      {/* small local styles to make the card "break" (take full row) at <= 850px */}
      <style jsx>{`
        .project-card {
          /* preserve usual behavior by default */
        }

        /* WHEN viewport is 850px or smaller, make the card occupy the full row.
           This helps cards placed in a grid/flex to wrap below 850px. */
        @media (max-width: 850px) {
          .project-card {
            width: 100% !important;
            max-width: 100% !important;
            flex-basis: 100% !important;
            /* if you're using CSS columns, avoid breaking inside */
            break-inside: avoid;
            -webkit-column-break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </>
  );
};

export default ProjectCard;
