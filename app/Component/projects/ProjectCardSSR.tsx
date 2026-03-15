// ProjectCardSSR.tsx — redesigned for a clean, professional look
import React from "react";
import ImageSlotHydrate from "../slider/ImageSlider";
import ActionsHydrate from "../projects/ProjectCard";
import CaseStudyHydrate from "../case-study/CaseStudy";
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
          launch: cs.launch?.date
            ? cs.launch
            : launchDate
              ? { date: launchDate }
              : cs.launch,
        }
      : {
          tlDr: short || undefined,
          problem: project.problem ?? undefined,
          myRole: role,
          approach: project.process?.length ? project.process : undefined,
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
          launch: launchDate ? { date: launchDate } : undefined,
        };

  const baseId = (project.id && String(project.id)) || title;
  const safeId = baseId
    .toString()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-]/g, "")
    .toLowerCase()
    .slice(0, 60);

  const repoLinks: string[] = Array.isArray(githubLink)
    ? githubLink.filter(Boolean).map(String)
    : githubLink
      ? [String(githubLink)]
      : [];

  // Pick a category color accent
  const categoryColors: Record<string, string> = {
    Platform: "from-violet-500 to-purple-600",
    Web: "from-cyan-500 to-blue-600",
    Mobile: "from-emerald-500 to-teal-600",
    ECommerce: "from-orange-500 to-amber-600",
  };
  const gradientClass =
    categoryColors[project.category ?? ""] ?? "from-cyan-500 to-blue-600";

  return (
    <article
      className="project-card group relative rounded-2xl overflow-hidden border transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl focus-within:shadow-2xl
        w-full h-full flex flex-col
        border-gray-100/80 bg-white
        dark:border-slate-700/60 dark:bg-slate-800/50
        backdrop-blur-sm
        shadow-sm"
      aria-labelledby={`project-${safeId}`}
      data-project-id={project.id ?? safeId}
    >
      {/* ── IMAGE AREA ── */}
      <div className="relative w-full h-52 overflow-hidden bg-gray-50 dark:bg-slate-900">
        {/* Gradient overlay at bottom of image for readability */}
        <div
          className="absolute bottom-0 inset-x-0 h-16 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(255,255,255,0.15) 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Category badge — top-left */}
        {project.category && (
          <div className="absolute top-3 left-3 z-20">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${gradientClass} shadow-sm`}
            >
              {project.category}
            </span>
          </div>
        )}

        <div className="project-image-slot w-full h-full">
          <ImageSlotHydrate
            images={images}
            serverPreview={images[0] ?? null}
            title={title}
          />
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="p-5 flex flex-col flex-1 min-w-0 gap-3">
        {/* Title + Role */}
        <div>
          <h3
            id={`project-${safeId}`}
            className="text-lg font-bold tracking-tight text-gray-900 dark:text-white leading-snug line-clamp-1"
          >
            {title}
          </h3>
          <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
            {/* Role icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3 h-3 opacity-60"
              aria-hidden="true"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            {role}
          </p>
        </div>

        {/* Tech chips */}
        {tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tech.slice(0, 5).map((t, i) => (
              <span
                key={`${String(t).slice(0, 20)}-${i}`}
                title={String(t)}
                className="text-[11px] px-2 py-0.5 rounded-full font-medium
                  bg-gray-100 text-gray-600
                  dark:bg-slate-700/70 dark:text-slate-300
                  border border-gray-200/60 dark:border-slate-600/40
                  truncate max-w-[90px]"
              >
                {t}
              </span>
            ))}
            {tech.length > 5 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-gray-100 dark:bg-slate-700/70 text-gray-400 dark:text-slate-500 border border-gray-200/60 dark:border-slate-600/40">
                +{tech.length - 5}
              </span>
            )}
          </div>
        )}

        {/* TL;DR block */}
        {normalizedCS.tlDr && (
          <div className="relative overflow-hidden rounded-xl px-3.5 py-3 bg-gradient-to-br from-blue-50 to-cyan-50/60 dark:from-blue-950/50 dark:to-cyan-950/30 border border-blue-100/80 dark:border-blue-800/40">
            {/* Accent bar */}
            <span
              className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl bg-gradient-to-b ${gradientClass}`}
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-gray-700 dark:text-slate-300 line-clamp-3 pl-1">
              {normalizedCS.tlDr}
            </p>
          </div>
        )}

        {/* Divider */}
        <hr className="border-gray-100 dark:border-slate-700/50 mt-auto" />

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-2">
            <ActionsHydrate
              title={title}
              liveLink={liveLink}
              repoLinks={repoLinks}
            />
          </div>
          <div className="flex items-center gap-2">
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
