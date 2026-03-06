// app/components/ProjectCardHydrate/CaseStudyHydrate.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  InformationCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

type Metric = { metric?: string; value?: string; note?: string };

type CS = {
  tlDr?: string;
  problem?: string;
  constraints?: string;
  myRole?: string;
  responsibilities?: string[] | string;
  approach?: string[] | string;
  technicalSolution?: string[] | string;
  architectureNotes?: string;
  outcomes?: { qualitative?: string; quantitative?: Metric[] };
  launch?: { date?: string } | string;
  proofPoints?: string[] | string;
  lessons?: string[] | string;
  callToAction?: string;
};

type Props = {
  normalizedCS: CS;
  role?: string;
  liveLink?: string | null;
  outcome?: string;
  stats?: Record<string, string | number>;
};

function renderList(arr?: string[] | string) {
  if (!arr || (Array.isArray(arr) && arr.length === 0)) return null;
  if (Array.isArray(arr)) {
    return (
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
    );
  }
  // single string
  return (
    <p className="text-sm text-gray-800 dark:text-slate-300 mb-3 leading-relaxed">
      {arr}
    </p>
  );
}

function formatKey(k: string) {
  return k
    .replace(/([A-Z])/g, " $1")
    .replace(/[_\-]/g, " ")
    .replace(/^./, (s) => s.toUpperCase());
}

export default function CaseStudyHydrate({
  normalizedCS,
  role,
  liveLink,
  outcome,
  stats,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  useEffect(() => setMounted(true), []);

  // Sync details <toggle> to local open state so native <details> opens animated view
  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;
    const onToggle = () => {
      setOpen(el.open);
    };
    el.addEventListener("toggle", onToggle);
    return () => el.removeEventListener("toggle", onToggle);
  }, [detailsRef.current]);

  // helper formatDate (robust for non-standard dates)
  const formatDate = (dateStr?: string | { date?: string }) => {
    const raw = typeof dateStr === "string" ? dateStr : dateStr?.date;
    if (!raw) return "";
    const d = new Date(raw);
    if (isNaN(d.getTime())) return String(raw); // return original if unparseable
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // --- SSR / no-JS fallback: always render full <details> content so crawlers & no-JS users see everything ---
  if (!mounted) {
    return (
      <details className="text-left w-full" ref={detailsRef}>
        <summary className="text-sm font-semibold text-cyan-700 dark:text-cyan-400 cursor-pointer list-none">
          View case study
        </summary>

        <div className="mt-4 pt-5 border-t border-gray-100 dark:border-slate-700 text-left">
          {/* summary row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
            <div className="w-full p-3 rounded-md bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
              <div className="text-xs text-gray-500 dark:text-slate-400">
                Role
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {normalizedCS.myRole ?? role}
              </div>
            </div>

            {normalizedCS.constraints ? (
              <div className="w-full p-3 rounded-md bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                <div className="text-xs text-gray-500 dark:text-slate-400">
                  Constraints
                </div>
                <div className="text-sm text-gray-800 dark:text-slate-300 leading-snug">
                  {normalizedCS.constraints}
                </div>
              </div>
            ) : (
              <div className="w-full p-3 rounded-md bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                <div className="text-xs text-gray-500 dark:text-slate-400">
                  Timeline
                </div>
                <div className="text-sm text-gray-800 dark:text-slate-300">
                  MVP-focused delivery
                </div>
              </div>
            )}

            <div className="w-full p-3 rounded-md bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-slate-400">
                <InformationCircleIcon className="w-4 h-4" />
                <span>Last Published</span>
              </div>
              <div className="text-sm text-gray-800 dark:text-slate-300">
                {normalizedCS.launch
                  ? formatDate(normalizedCS.launch)
                  : "Not published yet"}
              </div>
            </div>
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

          {/* TL;DR */}
    

          {/* Approach */}
          {normalizedCS.approach && (
            <>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Approach
              </h4>
              <div className="mb-3">{renderList(normalizedCS.approach)}</div>
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

          {/* Architecture Notes */}
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

          {/* Outcomes / Results */}
          {(normalizedCS.outcomes || normalizedCS.problem) && (
            <>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Outcome / Results
              </h4>
              {normalizedCS.outcomes?.qualitative ? (
                <p className="text-sm text-gray-800 dark:text-slate-300 leading-relaxed mb-3">
                  {normalizedCS.outcomes.qualitative}
                </p>
              ) : outcome ? (
                <p className="text-sm text-gray-800 dark:text-slate-300 leading-relaxed mb-3">
                  {outcome}
                </p>
              ) : null}

              {normalizedCS.outcomes?.quantitative && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {normalizedCS.outcomes.quantitative.map((m, idx) => (
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
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Proof points */}
          {normalizedCS.proofPoints && (
            <>
              <h4 className="mt-5 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Proof points
              </h4>
              <div className="mb-3">{renderList(normalizedCS.proofPoints)}</div>
            </>
          )}

          {/* Lessons */}
          {normalizedCS.lessons && (
            <>
              <h4 className="mt-5 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Lessons
              </h4>
              <div className="mb-3">{renderList(normalizedCS.lessons)}</div>
            </>
          )}

          {/* Stats */}
          {stats && Object.keys(stats).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(stats).map(([k, v]) => (
                <span
                  key={k}
                  className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200"
                >
                  <strong className="mr-1">{formatKey(k)}:</strong>
                  {String(v)}
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
                    View demo <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  </a>
                )}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Contact about this
                </a>
              </div>
            </div>
          )}
        </div>
      </details>
    );
  }

  // Interactive animated version after mount
  return (
    <div className="w-full">
      <button
        onClick={() => {
          setOpen((s) => {
            const next = !s;
            // mirror the native details open state if present
            if (detailsRef.current) detailsRef.current.open = next;
            return next;
          });
        }}
        aria-expanded={open}
        className="text-sm font-semibold text-cyan-700 dark:text-cyan-400 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
      >
        {open ? "Hide case study" : "View case study"}
      </button>

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
            {/* keep the same structure as SSR fallback so markup matches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
              <div className="w-full p-3 rounded-md bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                <div className="text-xs text-gray-500 dark:text-slate-400">
                  Role
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {normalizedCS.myRole ?? role}
                </div>
              </div>

              {normalizedCS.constraints ? (
                <div className="w-full p-3 rounded-md bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    Constraints
                  </div>
                  <div className="text-sm text-gray-800 dark:text-slate-300 leading-snug">
                    {normalizedCS.constraints}
                  </div>
                </div>
              ) : (
                <div className="w-full p-3 rounded-md bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    Timeline
                  </div>
                  <div className="text-sm text-gray-800 dark:text-slate-300">
                    MVP-focused delivery
                  </div>
                </div>
              )}

              <div className="w-full p-3 rounded-md bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-slate-400">
                  <InformationCircleIcon className="w-4 h-4" />
                  <span>Last Published</span>
                </div>
                <div className="text-sm text-gray-800 dark:text-slate-300">
                  {normalizedCS.launch
                    ? formatDate(normalizedCS.launch)
                    : "Not published yet"}
                </div>
              </div>
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

         

            {/* Approach */}
            {normalizedCS.approach && (
              <>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Approach
                </h4>
                <div className="mb-3">{renderList(normalizedCS.approach)}</div>
              </>
            )}

            {/* Outcomes / Results */}
            {(normalizedCS.outcomes || normalizedCS.problem) && (
              <>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Outcome / Results
                </h4>
                {normalizedCS.outcomes?.qualitative ? (
                  <p className="text-sm text-gray-800 dark:text-slate-300 leading-relaxed mb-3">
                    {normalizedCS.outcomes.qualitative}
                  </p>
                ) : outcome ? (
                  <p className="text-sm text-gray-800 dark:text-slate-300 leading-relaxed mb-3">
                    {outcome}
                  </p>
                ) : null}

                {normalizedCS.outcomes?.quantitative && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {normalizedCS.outcomes.quantitative.map((m, idx) => (
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
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Proof points */}
            {normalizedCS.proofPoints && (
              <>
                <h4 className="mt-5 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Proof points
                </h4>
                <div className="mb-3">
                  {renderList(normalizedCS.proofPoints)}
                </div>
              </>
            )}

            {/* Lessons */}
            {normalizedCS.lessons && (
              <>
                <h4 className="mt-5 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Lessons
                </h4>
                <div className="mb-3">{renderList(normalizedCS.lessons)}</div>
              </>
            )}

            {/* Stats */}
            {stats && Object.keys(stats).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(stats).map(([k, v]) => (
                  <span
                    key={k}
                    className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200"
                  >
                    <strong className="mr-1">{formatKey(k)}:</strong>
                    {String(v)}
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
  );
}
