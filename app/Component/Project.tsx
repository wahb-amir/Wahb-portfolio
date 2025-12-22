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
 * Static fallback projects (kept intact)
 */
const staticProjects: Project[] = [
  {
    id: "client-dev-platform",
    title: "Client & Developer Collaboration Platform",
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
      "GitHub Automation",
    ],
    short:
      "A single workspace where clients can request project quotes, track progress, message developers, and see real-time updates — without chasing emails or spreadsheets.",
    liveLink: "https://dashboard.wahb.space",
    githubLink: [
      "https://github.com/wahb-amir/dev-dashboard",
      "https://github.com/wahb-amir/dashboard",
    ],

    problem:
      "Clients and developers were using emails, chats, and separate tools to manage projects, making communication confusing and progress hard to track.",
    process: [
      "Created a client dashboard where users can request quotes, view project timelines, and message their assigned developers",
      "Built a developer workspace to manage tasks, update progress, and respond to client requests",
      "Ensured each user sees only what’s relevant to them (clients, managers, developers)",
      "Automatically linked projects with GitHub so development activity updates project progress without manual reporting",
      "Added email and in-app notifications so everyone stays informed of changes and messages",
      "Launched the platform with secure login and automated deployment",
    ],
    outcome:
      "Clients gained transparency and confidence, while developers reduced manual updates. Communication improved, project visibility increased, and overall coordination became faster and clearer.",
    stats: {
      automation:
        "Project progress updates automatically from development activity",
      features:
        "Quote requests, live messaging, progress tracking, notifications, role-based access",
    },
    category: "Platform",

    caseStudy: {
      tlDr: "Built a single-platform collaboration tool that replaced fragmented email/chat processes and automated progress reporting — improving transparency and reducing manual status updates for developers and clients.",
      problem:
        "Clients and developers relied on email, chat and spreadsheets to track work. This caused missed updates, unclear ownership, and frequent status-check requests.",
      constraints:
        "Tight timeline (MVP in 8 weeks), role-based access requirements, need for secure logins and enterprise-grade data isolation, and limited budget for external integrations.",
      myRole:
        "Full-Stack Engineer — owned end-to-end design and implementation of the client & developer workflows, GitHub integration, and CI/CD automation.",
      responsibilities: [
        "Designed UI/UX for client dashboard and developer workspace",
        "Implemented role-based access control and secure authentication",
        "Built GitHub -> platform automation to sync commits/PRs with project progress",
        "Implemented real-time notifications (in-app + email) and messaging",
        "Owned deployments and monitoring (automated builds and secure hosting)",
      ],
      approach: [
        "Interviewed 5 stakeholders (clients & devs) to capture the main pain points",
        "Mapped out user journeys for three personas (client, manager, developer)",
        "Prioritized features into an MVP: quotes, messaging, progress tracking, GitHub sync",
        "Iterated rapidly with 1-week sprints and early feedback from two pilot clients",
      ],
      technicalSolution: [
        "Next.js + React for server-side rendered pages and fast UX",
        "Node.js API with role-based endpoints; MongoDB for flexible project data",
        "GitHub Actions + webhooks to automatically map commits/PRs to tasks and update progress",
        "Tailwind for consistent, responsive design and small CSS footprint",
        "Auth (JWT / secure cookies) and permission checks on every API call",
      ],
      architectureNotes:
        "Single Next.js app serving client & dev experiences with serverless API routes. GitHub webhooks push events to a queue; worker processes map events to project activities and update project state in MongoDB. This keeps user-facing APIs fast and offloads heavy processing to background workers.",
      outcomes: {
        qualitative:
          "Clients reported clearer visibility and fewer status-check meetings; developers stopped doing manual update emails. The platform created a single source of truth for all project activity.",
      },
      proofPoints: [
        "Automated GitHub-linked progress reduced manual reporting work (see GitHub links).",
        "Pilot clients moved from weekly status calls to in-app updates.",
      ],
      lessons: [
        "Start with one core workflow (quote → accepted → project) and automate the most painful manual step first.",
        "Push heavy integrations (webhook processing) to background workers to preserve UI responsiveness.",
        "Invest in clear distinctions between client-view and developer-view to reduce noise.",
      ],
      callToAction:
        "If you want to see the platform in action or discuss how I architect similar collaboration tools, check the live demo or message me.",
    },
  },

  {
    id: "ecom-1",
    title: "Modern Online Store",
    role: "Full-Stack Developer",
    images: [
      "/Project/Ecom/light-shop.png",
      "/Project/Ecom/light-men.png",
      "/Project/Ecom/light-women.png",
      "/Project/Ecom/light-product.png",
      "/Project/Ecom/stripe.png",
    ],
    tech: ["Next.js", "Stripe", "Secure Login", "Tailwind", "MongoDB"],
    short:
      "A clean, fast online store where users can browse products, add items to a cart, and check out — with a simple admin view for managing products safely.",
    liveLink: "https://boltform.buttnetworks.com/",
    githubLink: "https://github.com/wahb-amir/Ecommer-Store",
    problem:
      "Small businesses need an easy-to-use online store with secure checkout and basic admin visibility, without exposing sensitive system access.",
    process: [
      "Designed a modern, mobile-friendly shopping experience",
      "Built secure login so users can sign in safely",
      "Integrated a test payment system to simulate real checkout flows",
      "Created a read-only admin dashboard so owners can view data without security risks",
      "Optimized performance so pages load fast on all devices",
    ],
    outcome:
      "Delivered a fast, responsive online store that demonstrates real-world e-commerce flows, secure payments, and admin visibility — suitable for small businesses or MVP launches.",
    stats: { pagespeed: "Improved site performance from slow to fast loading" },
    category: "Web",

    /* NEW: recruiter / client friendly case study structure */
    caseStudy: {
      tlDr: "Built a performant e-commerce demo that demonstrates secure checkout, mobile-first UX, and an admin view — ideal as an MVP for small businesses.",
      problem:
        "Small merchants needed a simple, secure storefront and basic admin reporting without a complex backend or exposing full admin privileges.",
      constraints:
        "Target mobile-first UX, PCI-safe checkout demo (Stripe test mode), and an admin view that is read-only to avoid accidental data changes.",
      myRole:
        "Full-Stack Developer — implemented product browsing, cart/checkout flow, secure auth, and the admin reporting view.",
      responsibilities: [
        "Designed and implemented responsive product listing and checkout flow",
        "Integrated Stripe (test mode) to demonstrate end-to-end payments",
        "Implemented secure authentication and read-only admin dashboard",
        "Performance-tuned pages for mobile-first speed",
      ],
      approach: [
        "Prioritized core funnel: browse → add to cart → checkout → order confirmation",
        "Kept admin features minimal (read-only) to avoid complexity for MVP",
        "Used lazy-loading images and SSR for initial page speed",
      ],
      technicalSolution: [
        "Next.js for SSR and fast static rendering of product pages",
        "Stripe for secure, PCI-compliant payment flows (test integration shown)",
        "MongoDB to store product and order data; secure API endpoints for checkout",
        "Tailwind for responsive, consistent UI",
      ],
      architectureNotes:
        "Hybrid approach: static rendering for catalog pages, server-side checkout endpoints to handle payments and order creation. Images served via optimized `<img>` with srcset and lazy loading to reduce LCP.",
      outcomes: {
        qualitative:
          "MVP-ready store demonstrating the core e-commerce funnel with strong mobile performance and secure payments.",
      },
      launch: {
        date: "December 10 ,2025",
      },
      proofPoints: [
        "Stripe integration for secure payment flows.",
        "Read-only admin reduces risk for non-technical store owners.",
      ],
      lessons: [
        "Optimize the critical funnel (catalog → checkout) first — everything else can be iterative.",
        "SSR + image optimization produce the best first-load experience for product pages.",
      ],
      callToAction:
        "Want an MVP storefront for your business? I can adapt this foundation to your product catalogue and payments.",
    },
  },
];

const DB_NAME = "wahb-projects-db";
const STORE_NAME = "projects";
const CACHE_KEY = "project-detail";

const PREVIEW_COUNT = 4;

/**
 * IndexedDB helpers (typed)
 */
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
    // non-fatal: no IDB available
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

async function fetchProjectDetail(version: string | null = null): Promise<{
  version: string | null;
  data: Project[] | null;
  raw: any;
} | null> {
  try {
    const api_path = "/api/updates/projects";
    const url = version
      ? `${api_path}?version=${encodeURIComponent(version)}`
      : api_path;

    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);

    const json = await resp.json();
    return {
      version: (json && json.version) ?? null,
      data: (json &&
        (json.data ?? json.projects ?? (Array.isArray(json) ? json : null))) as
        | Project[]
        | null,
      raw: json,
    };
  } catch (err) {
    console.warn("fetchProjectDetail error:", err);
    return null;
  }
}

/**
 * Skeleton card
 */
const SkeletonCard: React.FC = () => (
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
);

/**
 * Motion variants (typed)
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

// Keywords for DOM indexing
const KEYWORDS = {
  projectsSection: ["projects", "portfolio", "case-studies", "projects-grid"],
  projectCard: ["project-card", "case-study", "portfolio-item"],
  controls: ["view-all", "toggle", "navigation"],
};

const Project: React.FC = () => {
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
        const cached = await getCached();
        if (cached && cached.data) {
          setProjects(cached.data);
          setLoading(false);

          setCheckingUpdate(true);
          const remote = await fetchProjectDetail(cached.version ?? null);
          if (
            !isCancelled &&
            remote &&
            remote.version &&
            remote.version !== cached.version
          ) {
            const payload: CachedPayload = {
              version: remote.version,
              data: remote.data ?? (remote.raw as Project[] | null),
            };
            await setCached(payload);
            setProjects(payload.data ?? []);
          }
          setCheckingUpdate(false);
        } else {
          const remote = await fetchProjectDetail();
          if (remote && remote.data) {
            const payload: CachedPayload = {
              version: remote.version,
              data: remote.data,
            };
            await setCached(payload);
            if (!isCancelled) setProjects(payload.data ?? []);
          } else if (!isCancelled) {
            setProjects(staticProjects);
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
    // intentionally empty deps: run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSkeleton = loading && projects.length === 0;

  // Determine which projects to render (preview vs all)
  const visibleProjects = showAll ? projects : projects.slice(0, PREVIEW_COUNT);

  // Smooth reveal helper: after showing all, scroll slightly so users notice new items (optional)
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
          className="grid grid-cols-1 md850:grid-cols-2 gap-8 w-full max-w-6xl px-2 items-start"
          variants={gridVariants}
          initial="visible"
          animate="visible"
          layout
          role="list"
          aria-label="Projects grid"
          data-keywords="projects-grid,portfolio-grid"
        >
          {showSkeleton ? (
            // show skeletons
            [0, 1].map((i) => (
              <div key={i}>
                <SkeletonCard />
              </div>
            ))
          ) : (
            // render project cards with animation
            <AnimatePresence initial={false}>
              {visibleProjects.map((p) => (
                <motion.div
                  key={p.id ?? p.title}
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
          {/* Show the count and toggle only if we have more than preview */}
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

              {/* optional: quick jump buttons */}
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

          {/* Keep your original scroll controls if there are few projects too */}
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
