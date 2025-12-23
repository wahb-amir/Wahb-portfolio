// components/Project.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import ProjectCard from "./ProjectCard";
import { motion, AnimatePresence, Variants } from "framer-motion";

/**
 * Types
 */
export interface Project {
  id?: string;
  title: string;
  role?: string;
  images?: string[];
  tech?: string[];
  short?: string;
  liveLink?: string;
  githubLink?: string | string[];
  problem?: string;
  process?: string[];
  outcome?: string;
  stats?: Record<string, string>;
  category?: string;
  launch?: {
    date?: string;
  };
  [k: string]: any;
}

export interface CachedPayload {
  version: string | null;
  data: Project[] | null;
}

/**
 * Lazy background effect (client only)
 */
const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
  ssr: false,
  loading: () => null,
});

/**
 * (Keep your staticProjects as-is — unchanged)
 */
const staticProjects: Project[] = [
  /* ... your static projects here (same as before) ... */
];

/**
 * IndexedDB setup (unchanged)
 */
const DB_NAME = "wahb-projects-db";
const STORE_NAME = "projects";
const CACHE_KEY = "project-detail";
const PREVIEW_COUNT = 4;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e: any) => {
      const db = e.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = (e: any) => resolve(e.target.result as IDBDatabase);
    req.onerror = (e: any) => reject(e.target.error);
  });
}

async function getCached(): Promise<CachedPayload | null> {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const r = store.get(CACHE_KEY);
      r.onsuccess = () => resolve((r.result as CachedPayload) ?? null);
      r.onerror = (e: any) => reject(e.target.error);
    });
  } catch (err) {
    console.warn("IDB get error:", err);
    return null;
  }
}

async function setCached(payload: CachedPayload): Promise<boolean> {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const r = store.put(payload, CACHE_KEY);
      r.onsuccess = () => resolve(true);
      r.onerror = (e: any) => reject(e.target.error);
    });
  } catch (err) {
    console.warn("IDB put error:", err);
    return false;
  }
}

/**
 * Motion variants
 */
const gridVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.995 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: 6, scale: 0.995, transition: { duration: 0.25 } },
};

const KEYWORDS = {
  projectsSection: ["projects", "portfolio", "case-studies", "projects-grid"],
  projectCard: ["project-card", "case-study", "portfolio-item"],
  controls: ["view-all", "toggle", "navigation"],
};

type ProjectProps = {
  serverPayload?: CachedPayload | null;
};

const Project: React.FC<ProjectProps> = ({ serverPayload = null }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && theme === "dark";

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkingUpdate, setCheckingUpdate] = useState<boolean>(false);

  // control whether we show all projects or only preview
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    async function init() {
      setLoading(true);

      try {
        // 1) Use server payload if available (SSR passed this in)
        const serverData = serverPayload?.data ?? null;
        const serverVersion = serverPayload?.version ?? null;

        if (serverData && Array.isArray(serverData) && serverData.length > 0) {
          if (!isCancelled) setProjects(serverData);
        } else {
          // fallback to static projects if server didn't give data
          if (!isCancelled) setProjects(staticProjects);
        }
        if (!isCancelled) setLoading(false);

        // 2) Check client IDB cache — if client has a different/newer version, use it
        setCheckingUpdate(true);
        const cached = await getCached();
        if (!isCancelled && cached && cached.data) {
          // if client cache version differs from server version, prefer client cache (instant)
          if (cached.version && cached.version !== serverVersion) {
            setProjects(cached.data);
          }
          // if there was no cached version but serverPayload exists, persist it to IDB
        } else {
          if (serverPayload && serverPayload.data) {
            await setCached({
              version: serverPayload.version ?? null,
              data: serverPayload.data,
            });
          }
        }
        setCheckingUpdate(false);
      } catch (err) {
        console.error("Project init error (client):", err);
        if (!isCancelled) {
          setProjects(staticProjects);
          setLoading(false);
          setCheckingUpdate(false);
        }
      }
    }

    init();

    return () => {
      isCancelled = true;
    };
    // serverPayload intentionally omitted from deps? we include it so client updates when serverPayload changes
  }, [serverPayload]);

  const showSkeleton = loading && projects.length === 0;

  // Determine which projects to render (preview vs all)
  const visibleProjects = showAll ? projects : projects.slice(0, PREVIEW_COUNT);

  // Smooth reveal helper
  useEffect(() => {
    if (showAll) {
      const t = setTimeout(() => {
        const gridEl = document.getElementById("projects-grid");
        if (gridEl) {
          gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 220);
      return () => clearTimeout(t);
    }
    return;
  }, [showAll]);

  return (
    <>
      <div id="projects" />

      <section
        id="project-section"
        className={`relative flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden z-10  bg-[#f9fafb] dark:bg-[#0f172a]
    bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
    text-black dark:text-white`}
        role="region"
        aria-labelledby="projects-heading"
        data-keywords={KEYWORDS.projectsSection.join(",")}
      >
        <LazyBackgroundEffect aria-hidden="true" />

        <motion.h1
          id="projects-heading"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`mb-4 font-extrabold tracking-tight ${
            isDark ? "text-white" : "text-gray-800"
          } text-[36px] sm:text-[44px]`}
        >
          My Projects
        </motion.h1>

        <p
          className={`max-w-2xl mx-auto mb-8 text-sm sm:text-base ${
            isDark ? "text-slate-300" : "text-gray-700"
          }`}
        >
          Real apps I built & shipped — each entry includes the problem I
          solved, the approach I took, and the outcome. Click any card to read
          the case study.
          {checkingUpdate && (
            <span
              className="ml-2 text-xs text-gray-500 dark:text-slate-400"
              role="status"
              aria-live="polite"
            >
              Checking updates…
            </span>
          )}
        </p>

        <motion.div
          id="projects-grid"
          role="list"
          aria-label="Projects grid"
          data-keywords="projects-grid,portfolio-grid"
          variants={gridVariants}
          initial="visible"
          animate="visible"
        //  screen-850:grid-cols-2
          className="grid screen-min-850:grid-cols-2 screen-max-850:grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl px-2 items-start"
        >
          {showSkeleton ? (
            [0, 1].map((i) => (
              <div key={i} className="w-full">
                <article
                  className="rounded-xl overflow-hidden border border-gray-100 bg-white dark:bg-[#071020]/50 dark:border-slate-700 shadow-sm animate-pulse"
                  aria-hidden="true"
                >
                  <div className="w-full h-48 bg-gray-100 dark:bg-slate-800" />
                  <div className="p-4">
                    <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-slate-800 mb-3" />
                    <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-slate-800 mb-3" />
                    <div className="h-3 w-full rounded bg-gray-200 dark:bg-slate-800 mt-3" />
                  </div>
                </article>
              </div>
            ))
          ) : (
            <AnimatePresence initial={false}>
              {visibleProjects.map((p) => (
                <motion.div
                  key={p.id ?? p.title}
                  className="w-full h-full"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  role="listitem"
                  aria-label={`Project: ${p.title}`}
                  data-keywords={[...KEYWORDS.projectCard, p.category, p.id]
                    .filter(Boolean)
                    .join(",")}
                >
                  <ProjectCard {...(p as any)} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* View all / Show less controls */}
        <div className="relative z-10 flex flex-col items-center gap-4 mt-8">
          {projects.length > PREVIEW_COUNT && (
            <div
              className="flex items-center gap-3"
              role="region"
              aria-label="Project controls"
              data-keywords={KEYWORDS.controls.join(",")}
            >
              <button
                onClick={() => setShowAll((s) => !s)}
                aria-expanded={showAll}
                aria-controls="projects-grid"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border hover:scale-105 transition bg-white/80 dark:bg-[#06202b]/80 border-gray-200 dark:border-slate-700 shadow-sm"
                aria-pressed={showAll}
                title={
                  showAll
                    ? "Show fewer projects"
                    : `View all (${projects.length}) projects`
                }
              >
                {showAll ? (
                  <>
                    Show less
                    <ChevronUpIcon
                      className={`w-5 h-5 ${
                        isDark ? "text-cyan-300" : "text-cyan-600"
                      }`}
                      aria-hidden="true"
                    />
                  </>
                ) : (
                  <>
                    View all ({projects.length})
                    <ChevronDownIcon
                      className={`w-5 h-5 ${
                        isDark ? "text-cyan-300" : "text-cyan-600"
                      }`}
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Scroll Up"
                className="p-2 rounded hover:scale-105 transition"
              >
                <ChevronUpIcon
                  className={`w-6 h-6 ${
                    isDark ? "text-cyan-300" : "text-cyan-600"
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>
          )}

          {projects.length <= PREVIEW_COUNT && (
            <div className="flex items-center gap-6">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Scroll Up"
                className="p-2 rounded hover:scale-105 transition"
              >
                <ChevronUpIcon
                  className={`w-8 h-8 ${
                    isDark ? "text-cyan-300" : "text-cyan-600"
                  }`}
                  aria-hidden="true"
                />
              </button>

              <button
                onClick={() => {
                  const sec = document.getElementById("about");
                  sec?.scrollIntoView({ behavior: "smooth" });
                }}
                aria-label="Scroll Down"
                className="p-2 rounded animate-pulse hover:scale-105 transition"
              >
                <ChevronDownIcon
                  className={`w-8 h-8 ${
                    isDark ? "text-cyan-300" : "text-cyan-600"
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Project;
