"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import DOMPurify from "dompurify";

const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
  ssr: false,
  loading: () => null,
});

const DB_NAME = "wahb-projects-db";
const STORE_NAME = "projects";
const ABOUT_CACHE_KEY = "about-detail";

// --- types ---
interface TimelineItemType {
  title: string;
  desc: string;
  _id?: string;
}

interface Stats {
  projectsDeployed: number;
  selfHosted: string;
}

interface AboutContent {
  startDate: string;
  bio: string;
  stats: Stats;
  timeline: TimelineItemType[];
  quickFacts?: string[];
  quote?: string;
}

interface AboutData {
  version?: number | null;
  data: AboutContent;
}

// --- IndexedDB helpers ---
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

// --- fetch ---
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

// --- fallback ---
const FALLBACK: AboutContent = {
  startDate: "2025-03-22T00:00:00Z",
  bio: "Hello, my name is Wahb. I learnt how to code on my own...",
  stats: { projectsDeployed: 3, selfHosted: "Yes" },
  timeline: [
    { title: "Early 2025", desc: "Front-end foundations: HTML & CSS" },
    {
      title: "Spring 2025",
      desc: "Built small JS projects & sharpened JavaScript skills",
    },
    {
      title: "Mid 2025",
      desc: "Moved to React, Tailwind & Next.js — shipped full-stack apps",
    },
    {
      title: "Summer 2025",
      desc: "Deployed 3 full-stack web apps and self-hosted services",
    },
    {
      title: "Now (Advanced)",
      desc: "Focusing on TypeScript, SQL, and relational database design.",
    },
    {
      title: "Next",
      desc: "Integrate trained models into lightweight deployments.",
    },
  ],
  quickFacts: [
    "Frontend: React, Next.js, Tailwind CSS, Framer Motion",
    "Backend: Node.js, Express, MongoDB, Mongoose",
    "Machine Learning & AI: PyTorch — CNNs, detection, segmentation, training & debugging",
    "Low-level & Robotics: learning C++ for embedded/robotics and real-time systems",
    "Mathematics: Linear Algebra, Calculus, Probability & Statistics — core for ML",
    "Deployment: Linux VPS (manual + CLI-based), Docker for experiments",
    "Workflow: build small experiments, iterate quickly, ship what works",
  ],
  quote: "Still early in the journey — but building like I mean it.",
};

// --- timer ---
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

// --- subcomponents ---
interface StatCardProps {
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <div className="bg-white/20 dark:bg-slate-800/40 backdrop-blur-md p-5 rounded-lg text-center border border-white/10 dark:border-slate-700">
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-700 dark:text-slate-300">{label}</p>
  </div>
);

interface TimelineItemProps {
  title: string;
  desc: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, desc }) => (
  <div>
    <span className="font-semibold text-gray-900 dark:text-white">
      {title}:
    </span>{" "}
    <span className="text-gray-700 dark:text-slate-300">{desc}</span>
  </div>
);

// --- skeletons ---
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

// --- main component ---
export default function About() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [about, setAbout] = useState<AboutContent>(FALLBACK);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkingUpdate, setCheckingUpdate] = useState<boolean>(false);
  const [version, setVersion] = useState<number | null>(null);
  const [timeSinceStart, setTimeSinceStart] = useState<string>(() =>
    getTimeSinceStart(FALLBACK.startDate)
  );
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const tick = () => setTimeSinceStart(getTimeSinceStart(about.startDate));
    const id = setInterval(tick, 1000 * 60);
    tick();
    return () => clearInterval(id);
  }, [about.startDate]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      setLoading(true);
      try {
        const cached = await getCachedAbout();
        if (cached?.data && !cancelled) {
          setAbout(cached.data);
          setVersion(cached.version ?? null);
          setLoading(false);
        }

        if (cached?.version && !cancelled) {
          setCheckingUpdate(true);
          const remote = await fetchAbout(cached.version ?? null);
          if (
            remote?.version &&
            remote.version !== cached.version &&
            !cancelled
          ) {
            await setCachedAbout(remote);
            setAbout(remote.data);
            setVersion(remote.version);
          }
          setCheckingUpdate(false);
        } else if (!cached && !cancelled) {
          const remote = await fetchAbout();
          if (remote?.data) {
            await setCachedAbout(remote);
            setAbout(remote.data);
            setVersion(remote.version ?? null);
          } else setAbout(FALLBACK);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setAbout(FALLBACK);
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const showSkeleton = loading;

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
            <span className="text-center text-lg text-gray-700 dark:text-slate-300 max-w-3xl mx-auto mb-4 leading-relaxed">
              <p className="text-center text-lg text-gray-700 dark:text-slate-300 max-w-3xl mx-auto mb-4 leading-relaxed">
                {DOMPurify.sanitize(about.bio)}
              </p>
            </span>
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
            className="hover:scale-110 transition-transform"
          >
            <ChevronUpIcon
              className={`w-8 h-8 ${
                isDark ? "text-cyan-300" : "text-cyan-600"
              }`}
            />
          </button>
          <button
            onClick={() => {
              const nextSection = document.getElementById("contact");
              if (nextSection)
                nextSection.scrollIntoView({ behavior: "smooth" });
            }}
            aria-label="Scroll Down"
            className="animate-pulse hover:scale-110 transition-transform"
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
