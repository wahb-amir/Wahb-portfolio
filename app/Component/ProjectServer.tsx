// app/components/ProjectServer.tsx
import React from "react";
// import Project from "./Project"; // client enhancer
import ProjectCardSSR from "./ProjectCardSSR";
import { getLatestProjectsPayload } from "@/lib/projectsService";
import Arrow from "./Arrow";
type ProjectsPayload<T = unknown> = {
  version: string | number | null;
  data: T | null;
};

const PREVIEW_COUNT = 4;

export default async function ProjectServer() {
  let payload: ProjectsPayload = { version: null, data: null };

  try {
    const { payload: svcPayload } = await getLatestProjectsPayload({
      clientVersion: null,
    });

    payload = {
      version: svcPayload.version ?? null,
      data: svcPayload.data ?? null,
    };
  } catch (err) {
    console.warn("ProjectServer: failed to load projects:", err);
  }

  const projects = (payload.data ?? []) as any[];

  return (
    <section
      id="project-section"
      className="relative flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden z-10  bg-[#f9fafb] dark:bg-[#0f172a]
    bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
    text-black dark:text-white"
      role="region"
      aria-labelledby="projects-heading"
      data-keywords="projects,portfolio,case-studies,projects-grid"
    >
      {/* Header + intro (kept styling identical) */}
      <h2
        id="projects-heading"
        className="mb-4 font-extrabold tracking-tight text-[36px] sm:text-[44px]"
      >
        My Projects
      </h2>

      <p className="max-w-2xl mx-auto mb-8 text-sm sm:text-base text-gray-700 dark:text-slate-300">
        Real apps I built & shipped — each entry includes the problem I solved,
        the approach I took, and the outcome. Click any card to read the case
        study.
      </p>

      {/* Server-rendered grid (all projects rendered server-side for SEO) */}
      <div
        id="projects-grid"
        role="list"
        aria-label="Projects grid"
        data-keywords="projects-grid,portfolio-grid"
        className="grid screen-min-850:grid-cols-2 screen-max-850:grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl px-2 items-start"
      >
        {projects.length === 0
          ? [0, 1].map((i) => (
              <div key={i} className="w-full">
                <article
                  className="rounded-xl overflow-hidden border border-gray-100 bg-white dark:bg-[#071020]/50 dark:border-slate-700 shadow-sm"
                  aria-hidden="true"
                >
                  <div className="w-full h-48 bg-gray-100 dark:bg-slate-800" />
                  <div className="p-4">
                    <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-slate-800 mb-3" />
                    <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-slate-800 mb-3" />
                  </div>
                </article>
              </div>
            ))
          : projects.map((p) => (
              // NOTE: `data-project-id` used by client enhancer to find and enhance cards
              <div
                key={p.id ?? p.title}
                role="listitem"
                aria-label={`Project: ${p.title}`}
                data-project-id={
                  p.id ??
                  (p.title ?? p.name ?? "")
                    .replace(/\s+/g, "-")
                    .replace(/[^a-zA-Z0-9\-]/g, "")
                    .toLowerCase()
                }
              >
                <ProjectCardSSR project={p} />
              </div>
            ))}
      </div>
      <Arrow topId="skills" bottomId="about" topBlock="start" bottomBlock="start" />
      {projects.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": projects.map((p) => ({
                "@type": "CreativeWork",
                name: p.title ?? p.name ?? "Untitled Project",
                url: p.liveLink ?? p.url ?? undefined,
                description: p.short ?? p.description ?? undefined,
              })),
            }),
          }}
        />
      )}
    </section>
  );
}
