// app/components/ProjectCardSSR.tsx
import React from "react";
import ImageSlotHydrate from "./ImageSlider";
import ActionsHydrate from "./ProjectCard";
import CaseStudyHydrate from "./CaseStudy";
export type Project = {
  id?: string;
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
  stats?: Record<string, string | number>;
  category?: string;
  caseStudy?: any;
  launch?: { date?: string };
  [k: string]: any;
};

function formatKey(k: string) {
  return k
    .replace(/([A-Z])/g, " $1")
    .replace(/[_\-]/g, " ")
    .replace(/^./, (s) => s.toUpperCase());
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function renderList(arr?: string[] | undefined) {
  if (!arr || arr.length === 0) return null;
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

export default function ProjectCardSSR({ project }: { project: Project }) {
  const title = project.title ?? project.name ?? "Untitled Project";
  const role = project.role ?? "Contributor";
  const images = Array.isArray(project.images) ? project.images : [];
  const tech = Array.isArray(project.tech) ? project.tech : [];
  const short = project.short ?? project.description ?? "";
  const liveLink = project.liveLink ?? project.url ?? null;
  const githubLink = project.githubLink ?? null;
  const stats = project.stats ?? {};
  const cs = project.caseStudy ?? undefined;
  const launchDate = cs?.launch?.date ?? project.launch?.date ?? "";

  const normalizedCS =
    cs && Object.keys(cs).length > 0
      ? {
          ...cs,
          launch:
            cs.launch && cs.launch.date
              ? cs.launch
              : launchDate
              ? { date: launchDate }
              : cs.launch,
        }
      : {
          tlDr: short || undefined,
          problem: project.problem ?? undefined,
          constraints: undefined,
          myRole: role,
          responsibilities: undefined,
          approach: project.process?.length ? project.process : undefined,
          technicalSolution: undefined,
          architectureNotes: undefined,
          outcomes: {
            qualitative: project.outcome ?? undefined,
            quantitative:
              stats && Object.keys(stats).length
                ? Object.entries(stats).map(([k, v]) => ({
                    metric: formatKey(k),
                    value: String(v),
                  }))
                : undefined,
          },
          proofPoints: undefined,
          lessons: undefined,
          callToAction: undefined,
          launch: launchDate ? { date: launchDate } : undefined,
        };

  const safeId = (title || "untitled")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-]/g, "")
    .toLowerCase();

  const repoLinks: string[] = Array.isArray(githubLink)
    ? githubLink
    : githubLink
    ? [githubLink]
    : [];

  return (
    <article
      className="project-card group relative rounded-xl overflow-hidden border transition-transform transform hover:shadow-xl focus-within:shadow-xl w-full h-full flex flex-col border-gray-100 bg-white dark:border-slate-700 dark:bg-[#071020]/60"
      aria-labelledby={`project-${safeId}`}
      data-project-id={project.id ?? safeId}
    >
      {/* IMAGE: static preview for SSR; client will mount slider into hydrator */}
      <div className="w-full h-48 md:h-56 bg-gray-50 dark:bg-slate-900">
        <div className="project-image-slot w-full h-full">
          {/* Hydrator renders the same static img during hydration and swaps to slider after mount */}
          <ImageSlotHydrate
            images={images}
            serverPreview={images[0] ?? null}
            title={title}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 sm:p-6 flex flex-col flex-1 min-w-0">
        {/* Title + Role + Tech */}
        <div className="flex items-start justify-between gap-4">
          <div className="text-left flex-1 min-w-0">
            <h3
              id={`project-${safeId}`}
              className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white truncate"
            >
              {title}
            </h3>
            <p className="text-sm text-gray-700 dark:text-slate-300 mt-1 truncate">
              {role}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap gap-2 justify-end max-w-[220px]">
              {tech.slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 truncate"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Short / TL;DR */}
        {normalizedCS.tlDr && (
          <div className="mb-4 mt-4">
            <div className="inline-flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-900">
              <p className="m-0 text-sm font-medium text-blue-700 dark:text-cyan-200 max-w-prose">
                {normalizedCS.tlDr}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-auto">
          <div className="flex gap-3">
            {/* Hydrate action buttons (Live Demo / Code / Select repo) */}
            <ActionsHydrate
              title={title}
              liveLink={liveLink}
              repoLinks={repoLinks}
            />
          </div>

          {/* Case study toggle: progressive-hydrate the interactive version; SSR fallback is produced by the hydrator until mount */}
          <div className="ml-auto flex items-center gap-3">
            <CaseStudyHydrate
              normalizedCS={normalizedCS}
              role={role}
              liveLink={liveLink}
              outcome={project.outcome}
              stats={stats}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
