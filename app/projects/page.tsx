// app/projects/page.tsx — All Projects page

import React, { Suspense } from "react";
import ProjectCardSSR from "../Component/projects/ProjectCardSSR";
import { getLatestProjectsPayload } from "@/lib/projectsService";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Projects — Wahb Amir",
  description:
    "Every project I've shipped — full-stack apps, AI tools, e-commerce, and more. Each with a full case study covering the problem, approach, and outcome.",
};

type Project = {
  id?: string;
  title?: string;
  name?: string;
  [k: string]: any;
};

function slugify(input?: string, fallback = "untitled") {
  if (!input) return fallback;
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-");
}

function ProjectCardSkeleton({ index }: { index: number }) {
  return (
    <article
      className="rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 shadow-sm"
      style={{ animationDelay: `${index * 60}ms` }}
      aria-hidden="true"
    >
      <div className="w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-3.5 w-2/5 rounded-md bg-gray-100 dark:bg-slate-700/60 animate-pulse" />
        <div className="flex gap-2 pt-1">
          {[40, 56, 48].map((w, i) => (
            <div
              key={i}
              className="h-5 rounded-full bg-gray-100 dark:bg-slate-700/50 animate-pulse"
              style={{ width: `${w}px` }}
            />
          ))}
        </div>
        <div className="h-14 w-full rounded-xl bg-blue-50 dark:bg-blue-900/20 animate-pulse mt-2" />
        <div className="flex gap-3 pt-2">
          <div className="h-8 w-24 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 animate-pulse" />
          <div className="h-8 w-20 rounded-lg bg-gray-100 dark:bg-slate-700/40 animate-pulse" />
        </div>
      </div>
    </article>
  );
}

async function AllProjectsGrid() {
  let projects: Project[] = [];

  try {
    const { payload } = await getLatestProjectsPayload({ clientVersion: null });
    const raw = (payload.data ?? []) as Project[];
    const seen = new Map<string, Project>();
    raw.forEach((p) => {
      const key = (p.id || p.title || p.name || JSON.stringify(p)).toString();
      if (!seen.has(key)) seen.set(key, p);
    });
    projects = Array.from(seen.values());
  } catch (err) {
    console.warn("AllProjectsGrid: failed to load projects:", err);
  }

  if (!projects.length) {
    return (
      <p className="text-gray-500 dark:text-slate-400 text-sm mt-12">
        No projects found.
      </p>
    );
  }

  return (
    <div className="all-projects-grid" role="list" aria-label="All projects">
      {projects.map((p, i) => (
        <div
          key={slugify(p.id ?? p.title ?? p.name ?? `project-${i}`)}
          role="listitem"
          className="ps-card-enter"
          style={{ animationDelay: `${i * 55}ms` }}
        >
          <ProjectCardSSR project={p} />
        </div>
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <style>{`
        .all-projects-grid {
          display: grid;
          gap: 1.5rem;
          width: 100%;
          max-width: min(100%, 72rem);
          box-sizing: border-box;
          align-items: start;
          grid-template-columns: minmax(0, 1fr);
        }
        @media (min-width: 640px) {
          .all-projects-grid {
            gap: 2rem;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @keyframes ps-card-enter {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ps-card-enter {
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
          animation: ps-card-enter 0.45s ease both;
        }
        @keyframes ps-card-enter {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ps-card-enter {
          animation: ps-card-enter 0.45s ease both;
        }
        /* Page background */
        .projects-page-bg {
          background: linear-gradient(to bottom, #f0f9ff, #ffffff);
        }
        .dark .projects-page-bg {
          background: linear-gradient(to bottom, #0b1220, #0d1627);
        }
      `}</style>

      <main
        id="Project-page"
        className="
          relative flex flex-col items-center justify-start
          min-h-[65vh] sm:min-h-[72vh]
          px-4 xs:px-6 text-center
          pb-28 overflow-hidden
          pt-[env(safe-area-inset-top)]
          bg-white text-black dark:bg-[#0b1220] dark:text-white bg-gradient-to-b from-[#00b1ff88] to-[#00bfff44]
        "
        aria-label="Projects Page"
        role="section"
      >
        {/* ── Back link ── */}
        <div className="w-full max-w-56rem mb-8 self-start max-w-[56rem] mx-auto">
          <Link
            href="/#project-section"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3.5 h-3.5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9.78 3.22a.75.75 0 0 1 0 1.06L6.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
            Back to portfolio
          </Link>
        </div>

        {/* ── Header ── */}
        <div className="text-center mb-12 max-w-xl mx-auto">
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-cyan-600 dark:text-cyan-400 mb-4">
            <span className="w-5 h-px bg-cyan-500 inline-block" />
            All Work
            <span className="w-5 h-px bg-cyan-500 inline-block" />
          </p>

          <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl text-gray-900 dark:text-white leading-tight">
            Every Project{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
                I&apos;ve Shipped
              </span>
              <span
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-60"
                aria-hidden="true"
              />
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-slate-400 leading-relaxed">
            Full case studies — problem, approach, architecture, and outcome.
          </p>
        </div>

        {/* ── Grid ── */}
        <Suspense
          fallback={
            <div className="all-projects-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProjectCardSkeleton key={i} index={i} />
              ))}
            </div>
          }
        >
          <AllProjectsGrid />
        </Suspense>
      </main>
    </>
  );
}
