"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import ProjectCard from "./ProjectCard";
import { motion } from "framer-motion";

const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
  ssr: false,
  loading: () => null,
});

// --- your static fallback list (kept intact) ---
const staticProjects = [
  {
    id: "client-dev-platform",
    title: "Client–Dev Collaboration Platform",
    role: "Full-Stack Engineer",
    images: [
      "/Project/Platform/Login.png",
      "/Project/Platform/Dashboard.png",
      "/Project/Platform/Quote.png",
    ],
    tech: [
      "Next.js",
      "React",
      "Node.js",
      "Tailwind",
      "MongoDB",
      "GitHub Webhooks",
    ],
    short:
      "A unified platform connecting clients and dev teams — request quotes, receive email alerts, view project progress & assignees, chat with developers, and automatically sync repo activity to project status.",
    liveLink: "https://projects.buttnetworks.com",
    githubLink: [
      "https://github.com/coder101-js/dev-dashboard",
      "https://github.com/coder101-js/dashboard",
    ],
    problem:
      "Clients and development teams lacked a single workspace to request quotes, track project progress, communicate, and sync repository activity into task status.",
    process: [
      "Built client portal: request quotes, view project progress, see who's working on what, and chat with assigned developers",
      "Built dev dashboard: manage tasks, update progress, assign team members, and review client requests",
      "Implemented role-based auth (RBAC) so Clients, PMs, and Devs see appropriate views and actions",
      "Automated user setup to create GitHub repositories for new projects and connect webhooks to auto-update progress from repo events (commits/PRs)",
      "Added email & in-app alerts for quote responses, status changes, and mentions; real-time chat via Socket.io",
      "Deployed with CI/CD pipelines and secure OAuth authentication for GitHub integration",
    ],
    outcome:
      "Delivered a single collaboration surface that improved visibility and reduced coordination friction — clients can request quotes and track progress, and devs get an organized dashboard with automated repo syncing and status updates.",
    stats: {
      automation: "Auto repo creation & webhook sync for project status",
      features:
        "Quote requests, email alerts, real-time chat, progress timeline, role-based auth",
    },
    category: "Platform",
  },
  {
    id: "ecom-1",
    title: "Modern E-Commerce Store",
    role: "Full-Stack Developer",
    images: [
      "/Project/Ecom/light-shop.png",
      "/Project/Ecom/light-men.png",
      "/Project/Ecom/light-women.png",
      "/Project/Ecom/light-product.png",
      "/Project/Ecom/stripe.png",
    ],
    tech: ["Next.js", "Stripe", "OAuth", "Tailwind", "MongoDB"],
    short: "A fully functional e-commerce platform with OAuth, fake Stripe checkout, and a client-safe read-only admin dashboard.",
    liveLink: "https://boltform.buttnetworks.com/",
    githubLink: "https://github.com/coder101-js/Ecommer-Store",
    problem:
      "Customers needed a lightweight store with easy checkout and an admin view that doesn't require exposing sensitive keys.",
    process: [
      "Designed product pages and cart UX with Tailwind and responsive-first approach",
      "Implemented OAuth-based auth and session handling",
      "Connected Stripe sandbox for payments and built a read-only admin dashboard",
      "Deployed on a Linux VPS with PM2 + Nginx reverse proxy",
    ],
    outcome:
      "Deployed MVP with a responsive store, Stripe sandbox working, and an admin dashboard. Reduced TTFB by optimizing image sizes & server-side rendering.",
    stats: { pagespeed: "Bumped 15→82" },
    category: "Web",
  },
];

// --- tiny IndexedDB helper (no external dep) ---
const DB_NAME = "wahb-projects-db";
const STORE_NAME = "projects";
const CACHE_KEY = "project-detail";

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function getCached() {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const r = store.get(CACHE_KEY);
      r.onsuccess = () => resolve(r.result);
      r.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.warn("IDB get error:", err);
    return null;
  }
}

async function setCached(payload) {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const r = store.put(payload, CACHE_KEY);
      r.onsuccess = () => resolve(true);
      r.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.warn("IDB put error:", err);
    return false;
  }
}


async function fetchProjectDetail(version = null) {
  try {
    const api_path = process.env.NEXT_PUBLIC_PROJECTS_API;
    console.log(api_path)
    const url = new URL(api_path);
    if (version) url.searchParams.set("version", version);
    const resp = await fetch(url.toString(), { cache: "no-store" }); // always ask server
    if (!resp.ok) {
      // If 304 Not Modified semantics used server-side, handle accordingly — but fetch won't return 304 to client for CORS mostly
      throw new Error(`Fetch failed: ${resp.status}`);
    }
    const json = await resp.json();
    // Normalize payload: accept {version, projects} or {version, data}
    const normalized = {
      version: json.version ?? json.versionId ?? null,
      data: json.projects ?? json.data ?? (Array.isArray(json) ? json : null),
      raw: json,
    };
    return normalized;
  } catch (err) {
    console.warn("fetchProjectDetail error:", err);
    return null;
  }
}

// --- Small skeleton card for loading state ---
const SkeletonCard = () => (
  <article className="rounded-xl overflow-hidden border border-gray-100 bg-white dark:bg-[#071020]/50 dark:border-slate-700 shadow-sm animate-pulse">
    <div className="w-full h-48 bg-gray-100 dark:bg-slate-800" />
    <div className="p-4">
      <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-slate-800 mb-3" />
      <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-slate-800 mb-3" />
      <div className="h-3 w-full rounded bg-gray-200 dark:bg-slate-800 mt-3" />
    </div>
  </article>
);

const Project = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && theme === "dark";

  const [projects, setProjects] = useState([]); // actual project items
  const [loading, setLoading] = useState(true); // initial load flag
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function init() {
      setLoading(true);
      try {
        const cached = await getCached();
        if (cached && cached.data) {
          // show cached immediately
          setProjects(cached.data);
          setLoading(false); // we've got something to show

          // always try to check updates in background (only once on mount)
          setCheckingUpdate(true);
          const remote = await fetchProjectDetail(cached.version);
          if (!isCancelled && remote && remote.version && remote.version !== cached.version) {
            // update cache + UI if changed
            const payload = { version: remote.version, data: remote.data ?? remote.raw };
            await setCached(payload);
            setProjects(payload.data);
          }
          setCheckingUpdate(false);
        } else {
          // No cache – fetch from server
          const remote = await fetchProjectDetail();
          if (remote && remote.data) {
            const payload = { version: remote.version, data: remote.data };
            await setCached(payload);
            if (!isCancelled) setProjects(payload.data);
          } else {
            // fallback to static content if server didn't return data
            if (!isCancelled) setProjects(staticProjects);
          }
          if (!isCancelled) setLoading(false);
        }
      } catch (err) {
        console.error("Project init error:", err);
        if (!isCancelled) {
          setProjects(staticProjects);
          setLoading(false);
        }
      }
    }

    init();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Render logic: if loading & no projects yet -> show skeleton grid.
  const showSkeleton = loading && projects.length === 0;

  return (
    <>
      <div id="projects" />

      <section
        id="project-section"
        className={`relative flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden z-10  bg-[#f9fafb] dark:bg-[#0f172a]
    bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
    text-black dark:text-white`}
      >
        <LazyBackgroundEffect />

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`mb-4 font-extrabold tracking-tight ${isDark ? "text-white" : "text-gray-800"
            } text-[36px] sm:text-[44px]`}
        >
          My Projects
        </motion.h1>

        <p
          className={`max-w-2xl mx-auto mb-8 text-sm sm:text-base ${isDark ? "text-slate-300" : "text-gray-700"
            }`}
        >
          Real apps I built & shipped — each entry includes the problem I solved, the approach I
          took, and the outcome. Click any card to read the case study.
          {checkingUpdate && (
            <span className="ml-2 text-xs text-gray-500 dark:text-slate-400">Checking updates…</span>
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 w-full max-w-6xl px-2 items-start">
          {showSkeleton
            ? // show 4 skeleton cards while initial fetch completes
            [0, 1, 2, 3].map((i) => (
              <div key={i}>
                <SkeletonCard />
              </div>
            ))
            : // show actual project cards (from cache, remote or static fallback)
            projects.map((p) => <ProjectCard key={p.id ?? p.title} {...p} />)}
        </div>

        <div className="relative z-10 flex items-center gap-6 mt-10">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll Up"
            className="p-2 rounded hover:scale-105 transition"
          >
            <ChevronUpIcon className={`w-8 h-8 ${isDark ? "text-cyan-300" : "text-cyan-600"}`} />
          </button>

          <button
            onClick={() => {
              const sec = document.getElementById("about");
              sec?.scrollIntoView({ behavior: "smooth" });
            }}
            aria-label="Scroll Down"
            className="p-2 rounded animate-pulse hover:scale-105 transition"
          >
            <ChevronDownIcon className={`w-8 h-8 ${isDark ? "text-cyan-300" : "text-cyan-600"}`} />
          </button>
        </div>
      </section>
    </>
  );
};

export default Project;
