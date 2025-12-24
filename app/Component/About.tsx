// components/About.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";

/* -------------------- types & constants (same as you had) -------------------- */

const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
  ssr: false,
  loading: () => null,
});

const DB_NAME = "wahb-projects-db";
const STORE_NAME = "projects";
const ABOUT_CACHE_KEY = "about-detail";

// --- types ---
export interface TimelineItemType {
  title: string;
  desc: string;
  _id?: string;
}

export interface Stats {
  projectsDeployed: number;
  selfHosted: string;
}

export interface AboutContent {
  startDate: string;
  bio: string;
  stats: Stats;
  timeline: TimelineItemType[];
  quickFacts?: string[];
  quote?: string;
}

export interface AboutData {
  version?: number | null;
  data: AboutContent;
}

/* -------------------- IndexedDB helpers (unchanged) -------------------- */

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const req: IDBOpenDBRequest = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME))
        db.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getCachedAbout(): Promise<AboutData | null> {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const r = store.get(ABOUT_CACHE_KEY);
      r.onsuccess = () => resolve(r.result ?? null);
      r.onerror = () => reject(r.error);
    });
  } catch (err) {
    console.warn("IDB get error:", err);
    return null;
  }
}

async function setCachedAbout(payload: AboutData): Promise<boolean> {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const r = store.put(payload, ABOUT_CACHE_KEY);
      r.onsuccess = () => resolve(true);
      r.onerror = () => reject(r.error);
    });
  } catch (err) {
    console.warn("IDB put error:", err);
    return false;
  }
}

/* -------------------- fetch helper (client) -------------------- */

async function fetchAbout(
  version: number | null = null
): Promise<AboutData | null> {
  try {
    const api_path = "/api/updates/about";
    const url = version ? `${api_path}?version=${version}` : api_path;
    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
    const json = await resp.json();
    return {
      version: json.version ?? null,
      data: json.data ?? json.about ?? json,
    };
  } catch (err) {
    console.warn("fetchAbout error:", err);
    return null;
  }
}

/* -------------------- FALLBACK & helpers (unchanged) -------------------- */

const FALLBACK: AboutContent = {
  startDate: "2025-03-22T00:00:00Z",
  bio: "Hi, I’m Wahb. I enjoy building useful things and solving problems, which led me to teach myself how to code. I’m happiest when I’m creating practical tools—whether that’s a web application, a backend service, or exploring computer vision Lately, I’ve been working on helping computers understand images, such as recognizing objects or separating them from the background, with a focus on making these systems run well on everyday hardware rather than relying on powerful cloud machines. Alongside this, I build full-stack web applications and manage my own servers, keeping my work grounded in real-world needs",
  stats: { projectsDeployed: 3, selfHosted: "Yes" },
  timeline: [
    {
      title: "Early 2025",
      desc: "Learned the basics of how websites are built and styled.",
    },
    {
      title: "Spring 2025",
      desc: "Started building small interactive projects and learning how logic and code work together.",
    },
    {
      title: "Mid 2025",
      desc: "Built complete web applications with modern tools and real features like dashboards and authentication.",
    },
    {
      title: "Summer 2025",
      desc: "Launched multiple real projects and ran them on my own servers.",
    },
    {
      title: "Now",
      desc: "Improving code quality, working with structured databases, and building more reliable systems.",
    },
    {
      title: "Next",
      desc: "Strengthening problem-solving skills through data structures & algorithms, and deploying lightweight AI models into real products.",
    },
  ],
  quickFacts: [
    "Builds clean, user-friendly web applications",
    "Creates and manages full projects from idea to deployment",
    "Works with image-based AI systems and experiments with practical machine learning",
    "Comfortable running and maintaining apps on Linux servers",
    "Enjoys breaking down complex problems into simple, working solutions",
    "Focused on long-term growth, fundamentals, and real-world impact",
  ],
  quote:
    "Still early in the journey — focused on learning deeply and building things that matter.",
};

function getTimeSinceStart(start: string | Date) {
  const s = new Date(start || FALLBACK.startDate);
  if (isNaN(s.getTime())) return "0d 0h 0m";
  const now = new Date();
  const diff = now.getTime() - s.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `${days}d ${hours}h ${minutes}m`;
}

/* -------------------- subcomponents (kept) -------------------- */

const StatCard: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="bg-white/20 dark:bg-slate-800/40 backdrop-blur-md p-5 rounded-lg text-center border border-white/10 dark:border-slate-700">
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-700 dark:text-slate-300">{label}</p>
  </div>
);

const TimelineItem: React.FC<{ title: string; desc: string }> = ({
  title,
  desc,
}) => (
  <div>
    <span className="font-semibold text-gray-900 dark:text-white">
      {title}:
    </span>{" "}
    <span className="text-gray-700 dark:text-slate-300">{desc}</span>
  </div>
);

const SkeletonBio: React.FC = () => (
  <div className="max-w-3xl mx-auto space-y-3 animate-pulse">
    <div className="h-6 w-2/3 bg-gray-200 dark:bg-slate-800 rounded" />
    <div className="h-4 w-full bg-gray-200 dark:bg-slate-800 rounded" />
    <div className="h-4 w-full bg-gray-200 dark:bg-slate-800 rounded" />
    <div className="h-4 w-5/6 bg-gray-200 dark:bg-slate-800 rounded" />
  </div>
);

const SkeletonStat: React.FC = () => (
  <div className="bg-white/20 dark:bg-slate-800/40 backdrop-blur-md p-5 rounded-lg text-center border border-white/10 dark:border-slate-700 animate-pulse">
    <div className="h-7 w-14 mx-auto bg-gray-200 dark:bg-slate-800 rounded mb-2" />
    <div className="h-3 w-24 mx-auto bg-gray-200 dark:bg-slate-800 rounded" />
  </div>
);

const SkeletonTimelineItem: React.FC = () => (
  <div className="space-y-2">
    <div className="h-4 w-1/3 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
    <div className="h-3 w-full bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
  </div>
);

/* -------------------- main ABOUT component (client) -------------------- */

/**
 * Accepts `serverData` when rendered from a server component.
 * If not provided, falls back to the previous client-only fetch + cache behavior.
 */
export default function About({
  serverData,
}: {
  serverData?: AboutData | null;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [about, setAbout] = useState<AboutContent>(FALLBACK);
  const [loading, setLoading] = useState<boolean>(!Boolean(serverData));
  const [checkingUpdate, setCheckingUpdate] = useState<boolean>(false);
  const [version, setVersion] = useState<number | null>(
    serverData?.version ?? null
  );
  const [timeSinceStart, setTimeSinceStart] = useState<string>(() =>
    getTimeSinceStart(serverData?.data?.startDate ?? FALLBACK.startDate)
  );
  const [hydrated, setHydrated] = useState<boolean>(false);

  // NEW: sanitized HTML for bio (populated client-side)
  const [sanitizedBio, setSanitizedBio] = useState<string>("");

  useEffect(() => setHydrated(true), []);

  // keep timer for "Active Dev Journey"
  useEffect(() => {
    const tick = () => setTimeSinceStart(getTimeSinceStart(about.startDate));
    const id = setInterval(tick, 1000 * 60);
    tick();
    return () => clearInterval(id);
  }, [about.startDate]);

  // Dynamically import DOMPurify on the client and sanitize about.bio
  useEffect(() => {
    let mounted = true;
    async function doSanitize() {
      // if no bio available, clear sanitized state
      if (!about?.bio) {
        if (mounted) setSanitizedBio("");
        return;
      }

      // Only run in client — dynamic import ensures this doesn't run during SSR
      try {
        const mod = await import("dompurify");
        // some bundlers put module on .default
        const purifier = (mod as any).default ?? mod;
        const safe = purifier.sanitize
          ? purifier.sanitize(about.bio)
          : String(about.bio);
        if (mounted) setSanitizedBio(safe);
      } catch (err) {
        // gracefully fallback to raw text if sanitize fails
        console.warn("DOMPurify dynamic import or sanitize failed:", err);
        if (mounted) setSanitizedBio(String(about.bio));
      }
    }

    doSanitize();
    return () => {
      mounted = false;
    };
  }, [about.bio]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      setLoading(!Boolean(serverData));

      try {
        // 1. If server provided data, use it immediately for fast paint
        if (serverData?.data && !cancelled) {
          setAbout(serverData.data);
          setVersion(serverData.version ?? null);
          setLoading(false);
        }

        // 2. Now check client IndexedDB cache
        const cached = await getCachedAbout();
        if (cancelled) return;

        if (cached?.data) {
          // If client cache is newer/different than serverData, prefer client cache
          if (
            cached.version &&
            cached.version !== (serverData?.version ?? version)
          ) {
            setAbout(cached.data);
            setVersion(cached.version ?? null);
            setLoading(false);
          }
        } else {
          // If there's no cached version but server gave us data, persist it
          if (serverData?.data) {
            await setCachedAbout({
              version: serverData.version ?? null,
              data: serverData.data,
            });
          } else {
            // no serverData and no cache: fetch remote
            setCheckingUpdate(true);
            const remote = await fetchAbout();
            if (remote?.data) {
              await setCachedAbout(remote);
              if (!cancelled) {
                setAbout(remote.data);
                setVersion(remote.version ?? null);
                setLoading(false);
              }
            } else if (!cancelled) {
              setAbout(FALLBACK);
              setLoading(false);
            }
            setCheckingUpdate(false);
          }
        }

        // 3. If we have a cached version, double-check server for an update in background
        if (cached?.version) {
          setCheckingUpdate(true);
          const remote = await fetchAbout(cached.version ?? null);
          if (
            remote?.version &&
            remote.version !== cached.version &&
            !cancelled
          ) {
            // remote newer: persist and use it
            await setCachedAbout(remote);
            setAbout(remote.data);
            setVersion(remote.version ?? null);
          }
          setCheckingUpdate(false);
        }
      } catch (err) {
        console.error("About init error (client):", err);
        if (!cancelled) {
          setAbout(FALLBACK);
          setLoading(false);
          setCheckingUpdate(false);
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
    // serverData intentionally left in deps so client updates if server passes new payload
  }, [serverData]);

  const showSkeleton = loading;

  /* -------------------- render (kept your original markup) -------------------- */
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
        <h2
          id="about-heading"
          className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white"
        >
          👨‍💻 About Me
        </h2>

        {/* bio */}
        <div className="mb-8">
          {showSkeleton ? (
            <SkeletonBio />
          ) : (
            <div className="text-center text-lg text-gray-700 dark:text-slate-300 max-w-3xl mx-auto mb-4 leading-relaxed">
              {/* Use sanitized HTML if available, otherwise render plain text */}
              {sanitizedBio ? (
                <p
                  className="max-w-3xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: sanitizedBio }}
                />
              ) : (
                <p className="max-w-3xl mx-auto">{about.bio}</p>
              )}
            </div>
          )}

          {checkingUpdate && (
            <div className="text-center text-xs text-gray-500 dark:text-slate-400 mt-2">
              Checking updates…
            </div>
          )}
        </div>

        {/* Timer + Stats */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-stretch justify-center">
          <div className="bg-white/20 dark:bg-slate-800/40 backdrop-blur-md rounded-xl p-6 text-center border border-white/10 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-2">
              ⏳ Active Dev Journey
            </h3>
            <p className="text-cyan-800 dark:text-cyan-400 text-xl font-mono">
              {timeSinceStart}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {showSkeleton ? (
              <>
                <SkeletonStat />
                <SkeletonStat />
              </>
            ) : (
              <>
                <StatCard
                  label="Days in Dev Flow"
                  value={`${Math.floor(
                    (new Date().getTime() -
                      new Date(
                        about.startDate || FALLBACK.startDate
                      ).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}d`}
                />
                <StatCard
                  label="Projects Deployed"
                  value={
                    about.stats?.projectsDeployed ??
                    FALLBACK.stats.projectsDeployed
                  }
                />
              </>
            )}
          </div>
        </div>

        {/* Quick Facts */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            ⚡ Quick Facts
          </h3>

          {showSkeleton ? (
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
          ) : (
            <ul className="list-disc pl-4 md:pl-6 text-gray-700 dark:text-slate-300 space-y-2 max-w-4xl mx-auto">
              {Array.isArray(about.quickFacts) ? (
                about.quickFacts.map((f, i) => <li key={i}>{f}</li>)
              ) : (
                <>
                  <li>Frontend: React, Next.js, Tailwind CSS, Framer Motion</li>
                  <li>Backend: Node.js, Express, MongoDB, Mongoose</li>
                  <li>
                    Machine Learning & AI: <strong>PyTorch</strong> — CNNs,
                    detection, segmentation, training & debugging
                  </li>
                  <li>
                    Low-level & Robotics: learning <strong>C++</strong> for
                    embedded/robotics and real-time systems
                  </li>
                  <li>
                    Mathematics: Linear Algebra, Calculus, Probability &
                    Statistics — core for ML
                  </li>
                  <li>
                    Deployment: Linux VPS (manual + CLI-based), Docker for
                    experiments
                  </li>
                  <li>
                    Workflow: build small experiments, iterate quickly, ship
                    what works
                  </li>
                </>
              )}
            </ul>
          )}
        </div>

        {/* Timeline */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            🚀 Learning Timeline
          </h3>

          <div className="space-y-4 border-l-2 border-cyan-400 pl-4 md:pl-6 max-w-5xl mx-auto">
            {showSkeleton ? (
              <>
                <SkeletonTimelineItem />
                <SkeletonTimelineItem />
                <SkeletonTimelineItem />
              </>
            ) : (
              (Array.isArray(about.timeline)
                ? about.timeline
                : FALLBACK.timeline
              ).map((t, idx) => (
                <TimelineItem
                  key={t._id ?? idx}
                  title={t.title}
                  desc={t.desc}
                />
              ))
            )}
          </div>
        </div>

        <blockquote className="text-center italic dark:text-cyan-400 text-blue-600 text-xl mb-8">
          {showSkeleton
            ? "…"
            : about.quote ??
              "“Still early in the journey — but building like I mean it.”"}
        </blockquote>

        <div className="relative z-10 flex justify-center items-center gap-6 mt-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll Up"
            className="hover:scale-110 transition-transform p-2 bg-white/10 rounded-full"
          >
            <ChevronUpIcon
              className={`w-8 h-8 ${
                isDark ? "text-cyan-300" : "text-cyan-600"
              }`}
            />
          </button>
          <button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label="Scroll Down"
            className="animate-bounce hover:scale-110 transition-transform p-2 bg-white/10 rounded-full"
          >
            <ChevronDownIcon
              className={`w-8 h-8 ${
                isDark ? "text-cyan-300" : "text-cyan-600"
              }`}
            />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
