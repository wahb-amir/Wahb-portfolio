// components/About.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import { Syne, DM_Mono } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"] });

const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
  ssr: false,
  loading: () => null,
});

/* ─────────────────────────── types & constants ─────────────────────────── */
const DB_NAME = "wahb-projects-db";
const STORE_NAME = "projects";
const ABOUT_CACHE_KEY = "about-detail";

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

/* ─────────────────────────── IndexedDB helpers ─────────────────────────── */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
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
      const r = tx.objectStore(STORE_NAME).get(ABOUT_CACHE_KEY);
      r.onsuccess = () => resolve(r.result ?? null);
      r.onerror = () => reject(r.error);
    });
  } catch {
    return null;
  }
}
async function setCachedAbout(payload: AboutData): Promise<boolean> {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const r = tx.objectStore(STORE_NAME).put(payload, ABOUT_CACHE_KEY);
      r.onsuccess = () => resolve(true);
      r.onerror = () => reject(r.error);
    });
  } catch {
    return false;
  }
}

/* ─────────────────────────── fetch helper ──────────────────────────────── */
async function fetchAbout(
  version: number | null = null,
): Promise<AboutData | null> {
  try {
    const url = version
      ? `/api/updates/about?version=${version}`
      : "/api/updates/about";
    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
    const json = await resp.json();
    return {
      version: json.version ?? null,
      data: json.data ?? json.about ?? json,
    };
  } catch {
    return null;
  }
}

/* ─────────────────────────── fallback ──────────────────────────────────── */
const FALLBACK: AboutContent = {
  startDate: "2025-03-22T00:00:00Z",
  bio: "Hi, I'm Wahb. I enjoy building useful things and solving problems, which led me to teach myself how to code. I'm happiest when I'm creating practical tools—whether that's a web application, a backend service, or exploring computer vision. Lately, I've been working on helping computers understand images, such as recognizing objects or separating them from the background, with a focus on making these systems run well on everyday hardware rather than relying on powerful cloud machines. Alongside this, I build full-stack web applications and manage my own servers, keeping my work grounded in real-world needs.",
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
      desc: "Strengthening problem-solving skills through DSA and deploying lightweight AI models into real products.",
    },
  ],
  quickFacts: [
    "Builds clean, user-friendly web applications",
    "End-to-end: idea → deployment",
    "Computer vision & practical ML",
    "Linux server management",
    "Breaks complex problems into simple solutions",
    "Focused on long-term growth & real-world impact",
  ],
  quote:
    "Still early in the journey — focused on learning deeply and building things that matter.",
};

function getTimeSinceStart(start: string | Date) {
  const s = new Date(start || FALLBACK.startDate);
  if (isNaN(s.getTime())) return "0d 0h 0m";
  const diff = Date.now() - s.getTime();
  return `${Math.floor(diff / 86400000)}d ${Math.floor((diff / 3600000) % 24)}h ${Math.floor((diff / 60000) % 60)}m`;
}

/* ─────────────────────────── animation variants ────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const slideLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};
const pillIn: Variants = {
  hidden: { opacity: 0, scale: 0.82 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─────────────────────────── sub-components ────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${mono.className} flex items-center gap-3 mb-6`}>
      <span
        className="w-8 h-px inline-block"
        style={{ background: "#00e5c3" }}
      />
      <span
        className="text-[11px] tracking-[0.2em] uppercase font-semibold"
        style={{ color: "#00bfa0" }}
      >
        {children}
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative overflow-hidden rounded-2xl p-5 text-center border backdrop-blur-xl"
      style={{
        background: accent
          ? "linear-gradient(135deg, rgba(2,22,32,0.82), rgba(0,35,45,0.78))"
          : "rgba(2,14,28,0.68)",
        borderColor: accent ? "rgba(0,229,195,0.4)" : "rgba(255,255,255,0.1)",
        boxShadow: accent
          ? "0 0 28px -6px rgba(0,229,195,0.2), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "inset 0 1px 0 rgba(255,255,255,0.04), 0 2px 12px rgba(0,0,0,0.25)",
      }}
    >
      {accent && (
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-teal-400/10 blur-2xl" />
      )}
      <p
        className={`${mono.className} text-2xl font-bold`}
        style={{ color: accent ? "#00e5c3" : "#f1f5f9" }}
      >
        {value}
      </p>
      <p className="text-xs mt-1.5 font-medium" style={{ color: "#94a3b8" }}>
        {label}
      </p>
    </motion.div>
  );
}

function SkeletonPulse({ className, style }: { className: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`${className} rounded-lg bg-white/10 dark:bg-slate-800/50 animate-pulse`}
      style={style}
    />
  );
}

/* ─────────────────────────── MAIN COMPONENT ────────────────────────────── */
export default function About({
  serverData,
}: {
  serverData?: AboutData | null;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [about, setAbout] = useState<AboutContent>(FALLBACK);
  const [loading, setLoading] = useState(!Boolean(serverData));
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [version, setVersion] = useState<number | null>(
    serverData?.version ?? null,
  );
  const [timeSinceStart, setTimeSinceStart] = useState(() =>
    getTimeSinceStart(serverData?.data?.startDate ?? FALLBACK.startDate),
  );
  const [hydrated, setHydrated] = useState(false);
  const [sanitizedBio, setSanitizedBio] = useState("");

  // Refs for in-view triggers
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const factsRef = useRef(null);
  const timelineRef = useRef(null);
  const quoteRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-80px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
  const factsInView = useInView(factsRef, { once: true, margin: "-60px" });
  const timelineInView = useInView(timelineRef, {
    once: true,
    margin: "-60px",
  });
  const quoteInView = useInView(quoteRef, { once: true, margin: "-60px" });

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const tick = () => setTimeSinceStart(getTimeSinceStart(about.startDate));
    const id = setInterval(tick, 60_000);
    tick();
    return () => clearInterval(id);
  }, [about.startDate]);

  useEffect(() => {
    let mounted = true;
    async function doSanitize() {
      if (!about?.bio) {
        if (mounted) setSanitizedBio("");
        return;
      }
      try {
        const mod = await import("dompurify");
        const purifier = (mod as any).default ?? mod;
        const safe = purifier.sanitize
          ? purifier.sanitize(about.bio)
          : String(about.bio);
        if (mounted) setSanitizedBio(safe);
      } catch {
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
        if (serverData?.data && !cancelled) {
          setAbout(serverData.data);
          setVersion(serverData.version ?? null);
          setLoading(false);
        }
        const cached = await getCachedAbout();
        if (cancelled) return;
        if (cached?.data) {
          if (
            cached.version &&
            cached.version !== (serverData?.version ?? version)
          ) {
            setAbout(cached.data);
            setVersion(cached.version ?? null);
            setLoading(false);
          }
        } else {
          if (serverData?.data) {
            await setCachedAbout({
              version: serverData.version ?? null,
              data: serverData.data,
            });
          } else {
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
        if (cached?.version) {
          setCheckingUpdate(true);
          const remote = await fetchAbout(cached.version ?? null);
          if (
            remote?.version &&
            remote.version !== cached.version &&
            !cancelled
          ) {
            await setCachedAbout(remote);
            setAbout(remote.data);
            setVersion(remote.version ?? null);
          }
          setCheckingUpdate(false);
        }
      } catch (err) {
        console.error("About init error:", err);
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
  }, [serverData]);

  const dayCount = Math.floor(
    (Date.now() - new Date(about.startDate || FALLBACK.startDate).getTime()) /
      86400000,
  );
  const showSkeleton = loading;

  /* ── render ── */
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className={`relative w-full min-h-screen overflow-hidden
        
        bg-gradient-to-b from-[#00b1ff88] to-[#00bfff44]
        text-black dark:text-white`}
    >
      {/* CSS */}
      <style>{`
        @keyframes about-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track { animation: about-ticker 22s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }

        @keyframes timeline-dot-pop {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); }
        }
        .tl-dot-animate { animation: timeline-dot-pop 0.4s cubic-bezier(.22,1,.36,1) both; }

        .fact-pill {
          transition: background 0.18s, color 0.18s, transform 0.18s, box-shadow 0.18s;
        }
        .fact-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,229,195,0.2);
        }
      `}</style>

      {hydrated && <LazyBackgroundEffect />}

      {/* ── Scrim: softens the cyan gradient so cards pop above it ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none "
        style={{
          background: isDark ? "rgba(5,12,24,0.45)" : "rgba(240,249,255,0.35)",
        }}
      />

      {/* ── Decorative ambient blobs ── */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-400/[0.06] blur-[100px]" />
        <div className="absolute bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-sky-500/[0.07] blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 py-24">
        {/* ── SECTION HEADER ── */}
        <motion.div
          ref={heroRef}
          variants={stagger}
          initial="hidden"
          animate={heroInView ? "show" : "hidden"}
          className="mb-16"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>About me</SectionLabel>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Left: big headline */}

            {/* Left: big headline */}
            <motion.div
              variants={fadeUp}
              className="flex-shrink-0 w-full lg:w-1/2 flex flex-col items-center"
            >
              <motion.div
                variants={fadeUp}
                className="w-full flex flex-col items-center justify-center"
              >
                <h2
                  id="projects-heading"
                  className="w-full max-w-4xl mx-auto text-center font-extrabold tracking-tight leading-tight"
                >
                  {/* First line */}
                  <span className="block text-[clamp(1.5rem,4vw,3.5rem)]">
                    Turning Ideas into
                  </span>

                  {/* Second line (smaller and perfectly centered) */}
                  <span className="relative inline-block mx-auto text-[clamp(1.2rem,3vw,2.4rem)] mt-1">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
                      Shipped Products
                    </span>

                    <span
                      className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-60"
                      aria-hidden="true"
                    />
                  </span>
                </h2>

                <motion.div
                  variants={fadeUp}
                  className={`${mono.className} mt-5 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border`}
                  style={{
                    background: "rgba(2,18,28,0.7)",
                    borderColor: "rgba(0,229,195,0.35)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#34d399" }}
                  >
                    Available for work
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
            {/* Right: bio — frosted card for contrast */}
            <motion.div variants={fadeUp} className="flex-1 min-w-0">
              <div
                className="relative rounded-2xl p-6 sm:p-8 border backdrop-blur-xl"
                style={{
                  background: isDark
                    ? "rgba(5,15,30,0.75)"
                    : "rgba(255,255,255,0.75)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.08)",
                  boxShadow:
                    "0 4px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                {/* Decorative quote mark */}
                <span
                  aria-hidden
                  className={`${syne.className} absolute -top-4 left-4 text-7xl leading-none select-none pointer-events-none`}
                  style={{ color: "rgba(0,229,195,0.18)" }}
                >
                  "
                </span>

                {showSkeleton ? (
                  <div className="space-y-3 pt-2">
                    <SkeletonPulse className="h-4 w-full" />
                    <SkeletonPulse className="h-4 w-full" />
                    <SkeletonPulse className="h-4 w-5/6" />
                    <SkeletonPulse className="h-4 w-4/6" />
                  </div>
                ) : sanitizedBio ? (
                  <p
                    className="relative text-base sm:text-[0.95rem] leading-[1.85] pt-2"
                    style={{ color: isDark ? "#cbd5e1" : "#1e293b" }}
                    dangerouslySetInnerHTML={{ __html: sanitizedBio }}
                  />
                ) : (
                  <p
                    className="relative text-base sm:text-[0.95rem] leading-[1.85] pt-2"
                    style={{ color: isDark ? "#cbd5e1" : "#1e293b" }}
                  >
                    {about.bio}
                  </p>
                )}

                {checkingUpdate && (
                  <p
                    className={`${mono.className} text-[11px] mt-3`}
                    style={{ color: "#64748b" }}
                  >
                    Syncing latest content…
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── STATS ROW ── */}
        <motion.div
          ref={statsRef}
          variants={stagger}
          initial="hidden"
          animate={statsInView ? "show" : "hidden"}
          className="mb-14"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>By the numbers</SectionLabel>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            <StatCard
              label="Active dev journey"
              value={timeSinceStart}
              accent
            />
            <StatCard label="Days in flow" value={`${dayCount}d`} />
            <StatCard
              label="Projects deployed"
              value={
                about.stats?.projectsDeployed ?? FALLBACK.stats.projectsDeployed
              }
            />
            <StatCard label="Self-hosted" value="Yes" />
          </motion.div>
        </motion.div>

        {/* ── QUICK FACTS PILLS ── */}
        <motion.div
          ref={factsRef}
          variants={stagger}
          initial="hidden"
          animate={factsInView ? "show" : "hidden"}
          className="mb-14"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>Quick facts</SectionLabel>
          </motion.div>

          <div
            className="rounded-2xl p-6 border backdrop-blur-xl"
            style={{
              background: isDark
                ? "rgba(5,15,30,0.65)"
                : "rgba(255,255,255,0.65)",
              borderColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.07)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.14)",
            }}
          >
            {showSkeleton ? (
              <div className="flex flex-wrap gap-3">
                {[120, 90, 140, 100, 130, 110].map((w, i) => (
                  <SkeletonPulse
                    key={i}
                    className="h-8 rounded-full"
                    style={{ width: w } as React.CSSProperties}
                  />
                ))}
              </div>
            ) : (
              <motion.div variants={stagger} className="flex flex-wrap gap-2.5">
                {(Array.isArray(about.quickFacts)
                  ? about.quickFacts
                  : FALLBACK.quickFacts!
                ).map((fact, i) => (
                  <motion.span
                    key={i}
                    variants={pillIn}
                    className="fact-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-default border"
                    style={{
                      background:
                        i % 3 === 0
                          ? isDark
                            ? "rgba(0,229,195,0.14)"
                            : "rgba(0,229,195,0.15)"
                          : isDark
                            ? "rgba(255,255,255,0.07)"
                            : "rgba(15,23,42,0.06)",
                      borderColor:
                        i % 3 === 0
                          ? "rgba(0,229,195,0.4)"
                          : isDark
                            ? "rgba(255,255,255,0.12)"
                            : "rgba(15,23,42,0.12)",
                      color:
                        i % 3 === 0
                          ? isDark
                            ? "#2dd4bf"
                            : "#0e7490"
                          : isDark
                            ? "#e2e8f0"
                            : "#1e293b",
                    }}
                  >
                    <span style={{ color: "#00e5c3", fontSize: "0.6rem" }}>
                      ◆
                    </span>
                    {fact}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ── TIMELINE ── */}
        <motion.div
          ref={timelineRef}
          variants={stagger}
          initial="hidden"
          animate={timelineInView ? "show" : "hidden"}
          className="mb-14"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>Learning timeline</SectionLabel>
          </motion.div>

          <div
            className="rounded-2xl p-6 sm:p-8 border backdrop-blur-xl"
            style={{
              background: isDark
                ? "rgba(5,15,30,0.65)"
                : "rgba(255,255,255,0.65)",
              borderColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.07)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.14)",
            }}
          >
            <div className="relative">
              {/* Vertical rail */}
              <div
                className="absolute left-[7px] top-2 bottom-2 w-px"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(0,229,195,0.6) 15%, rgba(0,229,195,0.3) 85%, transparent)",
                }}
                aria-hidden
              />

              <motion.div variants={stagger} className="space-y-0">
                {showSkeleton
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex gap-6 pb-8">
                        <div className="w-4 h-4 rounded-full bg-white/10 animate-pulse flex-shrink-0 mt-1" />
                        <div className="space-y-2 flex-1">
                          <SkeletonPulse className="h-3 w-24" />
                          <SkeletonPulse className="h-3 w-full" />
                        </div>
                      </div>
                    ))
                  : (Array.isArray(about.timeline)
                      ? about.timeline
                      : FALLBACK.timeline
                    ).map((t, idx) => {
                      const isNow = t.title === "Now";
                      const isNext = t.title === "Next";
                      return (
                        <motion.div
                          key={t._id ?? idx}
                          variants={slideLeft}
                          className="relative flex gap-6 pb-7"
                        >
                          {/* Dot */}
                          <div className="relative flex-shrink-0 mt-1">
                            <div
                              className="tl-dot-animate w-[15px] h-[15px] rounded-full border-2"
                              style={{
                                borderColor: isNext
                                  ? "#f59e0b"
                                  : isNow
                                    ? "#00e5c3"
                                    : "rgba(0,229,195,0.45)",
                                background: isNext
                                  ? "rgba(245,158,11,0.25)"
                                  : isNow
                                    ? "rgba(0,229,195,0.25)"
                                    : isDark
                                      ? "rgba(5,15,30,0.9)"
                                      : "rgba(255,255,255,0.9)",
                                animationDelay: `${idx * 80}ms`,
                                boxShadow:
                                  isNow || isNext
                                    ? `0 0 10px ${isNext ? "rgba(245,158,11,0.6)" : "rgba(0,229,195,0.6)"}`
                                    : "none",
                              }}
                            />
                            {isNow && (
                              <div
                                className="absolute inset-0 rounded-full animate-ping"
                                style={{ background: "rgba(0,229,195,0.25)" }}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div
                            className="pb-4 flex-1"
                            style={{
                              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                            }}
                          >
                            <div className="flex items-center gap-3 mb-1.5">
                              <span
                                className={`${mono.className} text-xs font-semibold tracking-wider uppercase`}
                                style={{
                                  color: isNext
                                    ? "#f59e0b"
                                    : isNow
                                      ? "#00e5c3"
                                      : isDark
                                        ? "#64748b"
                                        : "#94a3b8",
                                }}
                              >
                                {t.title}
                              </span>
                              {(isNow || isNext) && (
                                <span
                                  className={`${mono.className} text-[10px] px-2 py-0.5 rounded-full`}
                                  style={{
                                    background: isNext
                                      ? "rgba(245,158,11,0.12)"
                                      : "rgba(0,229,195,0.1)",
                                    color: isNext ? "#f59e0b" : "#00e5c3",
                                    border: `1px solid ${isNext ? "rgba(245,158,11,0.28)" : "rgba(0,229,195,0.28)"}`,
                                  }}
                                >
                                  {isNext ? "upcoming" : "active"}
                                </span>
                              )}
                            </div>
                            <p
                              className="text-sm leading-relaxed"
                              style={{ color: isDark ? "#94a3b8" : "#475569" }}
                            >
                              {t.desc}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── PULL QUOTE ── */}
        <motion.div
          ref={quoteRef}
          variants={fadeUp}
          initial="hidden"
          animate={quoteInView ? "show" : "hidden"}
          className="mb-14"
        >
          <div
            className="relative rounded-3xl px-8 sm:px-12 py-10 overflow-hidden border backdrop-blur-xl"
            style={{
              background: isDark
                ? "linear-gradient(135deg, rgba(2,18,32,0.82), rgba(0,30,40,0.78))"
                : "rgba(255,255,255,0.80)",
              borderColor: "rgba(0,229,195,0.25)",
              boxShadow:
                "0 0 60px -20px rgba(0,229,195,0.15), 0 4px 24px rgba(0,0,0,0.18)",
            }}
          >
            {/* Left accent bar */}
            <span
              aria-hidden
              className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full"
              style={{
                background: "linear-gradient(to bottom, #00e5c3, #06b6d4)",
              }}
            />
            {/* Giant decorative " */}
            <span
              aria-hidden
              className={`${syne.className} absolute -top-4 left-8 text-[9rem] leading-none select-none pointer-events-none`}
              style={{ color: "rgba(0,229,195,0.1)" }}
            >
              "
            </span>
            <blockquote
              className={`${syne.className} relative z-10 text-xl sm:text-2xl font-bold text-center leading-snug`}
              style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
            >
              {showSkeleton ? "…" : (about.quote ?? FALLBACK.quote)}
            </blockquote>
            <p
              className={`${mono.className} text-center text-xs mt-4`}
              style={{ color: "#64748b" }}
            >
              — Wahb Amir
            </p>
          </div>
        </motion.div>

        {/* ── SCROLL ARROWS ── */}
        <div className="flex justify-center items-center gap-5">
          <button
            onClick={() =>
              document
                .getElementById("project-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label="Scroll up"
            className="p-3 rounded-full border border-cyan-500/20 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-200 hover:scale-110"
          >
            <ChevronUpIcon className="w-5 h-5 text-cyan-400" />
          </button>
          <button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label="Scroll down"
            className="p-3 rounded-full border border-cyan-500/20 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-200 hover:scale-110 animate-bounce"
          >
            <ChevronDownIcon className="w-5 h-5 text-cyan-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
