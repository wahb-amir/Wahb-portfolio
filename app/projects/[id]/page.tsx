// app/projects/[id]/page.tsx — Individual project page
import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLatestProjectsPayload } from "@/lib/projectsService";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

async function getAllProjects() {
  try {
    const { payload } = await getLatestProjectsPayload({ clientVersion: null });
    const raw = (payload.data ?? []) as any[];
    const seen = new Map<string, any>();
    raw.forEach((p) => {
      const key = slugify(p.id ?? p.title ?? p.name);
      if (!seen.has(key)) seen.set(key, p);
    });
    return Array.from(seen.values());
  } catch {
    return [];
  }
}

async function getProject(id: string) {
  const projects = await getAllProjects();
  return (
    projects.find((p) => slugify(p.id ?? p.title ?? p.name) === id) ?? null
  );
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ id: slugify(p.id ?? p.title ?? p.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: "Project Not Found — Wahb Amir" };

  const title = project.title ?? project.name ?? "Project";
  const description =
    project.caseStudy?.tlDr ??
    project.short ??
    `${title} — a project by Wahb Amir`;
  const badge = project.badge?.label ? ` · ${project.badge.label}` : "";

  return {
    title: `${title}${badge} — Wahb Amir`,
    description,
    openGraph: {
      title: `${title} — Wahb Amir`,
      description,
      url: `https://wahb.space/projects/${id}`,
      images: project.images?.[0]
        ? [{ url: `https://wahb.space${project.images[0]}` }]
        : [],
    },
    alternates: { canonical: `https://wahb.space/projects/${id}` },
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

type JudgeScoreCategory = {
  label: string;
  score: number;
};

type JudgeScores = {
  outOf: number;
  source?: string;
  categories: JudgeScoreCategory[];
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionBox({
  label,
  icon,
  children,
  accent = "from-cyan-500 to-blue-500",
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="relative rounded-2xl border border-gray-100/80 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm overflow-hidden">
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${accent}`}
      />
      <div className="px-5 pt-5 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">{icon}</span>
          <h3
            className={`text-[11px] font-black tracking-[0.15em] uppercase bg-gradient-to-r ${accent} bg-clip-text text-transparent`}
          >
            {label}
          </h3>
        </div>
        {children}
      </div>
    </div>
  );
}

function ListItems({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-300 leading-relaxed"
        >
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function TechChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-slate-700/70 text-gray-600 dark:text-slate-300 border border-gray-200/60 dark:border-slate-600/40">
      {label}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-100/80 dark:border-cyan-800/40">
      <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-800 dark:text-white leading-snug">
        {value}
      </span>
    </div>
  );
}

function JudgeScoresChart({ judgeScores }: { judgeScores: JudgeScores }) {
  const CHART_H = 160;
  const MAX = judgeScores.outOf;

  // One distinct gradient per bar — intentionally varied
  const palette: [string, string][] = [
    ["#8B5CF6", "#7C3AED"], // violet   — Design
    ["#06B6D4", "#3B82F6"], // cyan     — Presentation
    ["#10B981", "#0D9488"], // emerald  — Overall
    ["#F43F5E", "#EC4899"], // rose     — Impact
    ["#F59E0B", "#F97316"], // amber    — Innovation
  ];

  const overall = judgeScores.categories.find(
    (c) => c.label.toLowerCase() === "overall",
  );

  return (
    <SectionBox label="Judge Scores" icon="🏅" accent="from-yellow-400 to-amber-500">
      {judgeScores.source && (
        <p className="text-[11px] text-gray-400 dark:text-slate-500 mb-5 -mt-1">
          {judgeScores.source}
        </p>
      )}

      {/* Chart area */}
      <div className="relative" style={{ height: `${CHART_H + 52}px` }}>

        {/* Horizontal grid lines */}
        {[1, 2, 3, 4, 5].map((tick) => (
          <div
            key={tick}
            className="absolute left-7 right-0"
            style={{ bottom: `${(tick / MAX) * CHART_H + 32}px` }}
          >
            <span className="absolute -left-6 -top-2 text-[9px] tabular-nums text-gray-300 dark:text-slate-600 select-none">
              {tick}
            </span>
            <div className="border-t border-dashed border-gray-100 dark:border-slate-700/50 w-full" />
          </div>
        ))}

        {/* Bars */}
        <div
          className="absolute left-7 right-0 flex items-end justify-around gap-3"
          style={{ bottom: "32px" }}
        >
          {judgeScores.categories.map((cat, i) => {
            const barH = Math.round((cat.score / MAX) * CHART_H);
            const [colorFrom, colorTo] = palette[i % palette.length];
            return (
              <div
                key={cat.label}
                className="flex flex-col items-center gap-1.5 flex-1 min-w-0"
              >
                {/* Score above bar */}
                <span
                  className="text-[11px] font-bold tabular-nums"
                  style={{ color: colorFrom }}
                >
                  {cat.score.toFixed(2)}
                </span>

                {/* Bar */}
                <div
                  className="w-full rounded-t-lg"
                  style={{
                    height: `${barH}px`,
                    background: `linear-gradient(to top, ${colorFrom}, ${colorTo})`,
                    transformOrigin: "bottom",
                    animation: `grow-bar 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.07}s both`,
                    opacity: 0.9,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Baseline */}
        <div
          className="absolute left-7 right-0 border-t border-gray-200 dark:border-slate-600"
          style={{ bottom: "32px" }}
        />

        {/* Category labels */}
        <div
          className="absolute left-7 right-0 flex justify-around gap-3"
          style={{ bottom: "4px" }}
        >
          {judgeScores.categories.map((cat) => (
            <div key={cat.label} className="flex-1 min-w-0 text-center">
              <span className="text-[10px] text-gray-400 dark:text-slate-500 leading-tight block truncate">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Overall callout */}
      {overall && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700/50 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-gray-800 dark:text-white tabular-nums">
            {overall.score.toFixed(2)}
          </span>
          <span className="text-xs text-gray-400 dark:text-slate-500">
            / {MAX} overall &nbsp;·&nbsp; 3rd of 775 participants
          </span>
        </div>
      )}
    </SectionBox>
  );
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────
function ProjectJsonLd({ project, id }: { project: any; id: string }) {
  const title = project.title ?? project.name ?? "Project";
  const url = project.liveLink ?? `https://wahb.space/projects/${id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `https://wahb.space/projects/${id}#app`,
        name: title,
        url,
        description: project.caseStudy?.tlDr ?? project.short,
        applicationCategory:
          project.category === "ECommerce"
            ? "ECommercePlatform"
            : "WebApplication",
        operatingSystem: "Web",
        author: {
          "@type": "Person",
          "@id": "https://wahb.space/#person",
          name: "Wahb Amir",
        },
        ...(project.badge?.label && { award: project.badge.label }),
        ...(Array.isArray(project.tech) && {
          softwareRequirements: project.tech,
        }),
        ...(project.githubLink && {
          sameAs: Array.isArray(project.githubLink)
            ? project.githubLink
            : [project.githubLink],
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://wahb.space",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: "https://wahb.space/projects",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: title,
            item: `https://wahb.space/projects/${id}`,
          },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const title = project.title ?? project.name ?? "Project";
  const cs = project.caseStudy ?? {};
  const images: string[] = Array.isArray(project.images) ? project.images : [];
  const tech: string[] = Array.isArray(project.tech) ? project.tech : [];
  const liveLink = project.liveLink ?? project.url ?? null;
  const githubLinks: string[] = Array.isArray(project.githubLink)
    ? project.githubLink
    : project.githubLink
      ? [project.githubLink]
      : [];

  const allProjects = await getAllProjects();
  const currentIndex = allProjects.findIndex(
    (p) => slugify(p.id ?? p.title ?? p.name) === id,
  );
  const prev = allProjects[currentIndex - 1] ?? null;
  const next = allProjects[currentIndex + 1] ?? null;

  const categoryColors: Record<string, string> = {
    Platform: "from-violet-500 to-purple-600",
    Web: "from-cyan-500 to-blue-600",
    Mobile: "from-emerald-500 to-teal-600",
    ECommerce: "from-orange-500 to-amber-600",
  };
  const gradientClass =
    categoryColors[project.category ?? ""] ?? "from-cyan-500 to-blue-600";

  return (
    <>
      <style>{`
        .page-bg {
          background: linear-gradient(to bottom, #f0f9ff, #ffffff);
        }
        .dark .page-bg {
          background: linear-gradient(to bottom, #0b1220, #0d1627);
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.5s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.12s; }
        .fade-up-3 { animation-delay: 0.20s; }
        .fade-up-4 { animation-delay: 0.28s; }
        @keyframes grow-bar {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
      `}</style>

      <ProjectJsonLd project={project} id={id} />

      <main
        className="
          relative flex flex-col items-center justify-start
          min-h-[65vh] sm:min-h-[72vh]
          px-4 xs:px-6 text-center
          pb-28 overflow-hidden
          pt-[env(safe-area-inset-top)]
          bg-white text-black dark:bg-[#0b1220] dark:text-white bg-gradient-to-b from-[#00b1ff88] to-[#00bfff44]
        "
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8">
          {/* ── Breadcrumb ── */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500 mb-8 fade-up fade-up-1"
          >
            <Link
              href="/"
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/projects"
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Projects
            </Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-slate-300 truncate max-w-[200px]">
              {title}
            </span>
          </nav>

          {/* ── Hero ── */}
          <div className="fade-up fade-up-1 mb-8">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {project.category && (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${gradientClass} shadow-sm`}
                >
                  {project.category}
                </span>
              )}
              {project.badge?.label && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-yellow-400 dark:bg-yellow-500 text-yellow-900 border border-yellow-300/80 shadow-sm">
                  {project.badge.label}
                </span>
              )}
              {project.badge?.sub && (
                <span className="text-[10px] font-medium text-yellow-800 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950/50 px-2 py-0.5 rounded-full border border-yellow-200/60 dark:border-yellow-800/40">
                  {project.badge.sub}
                </span>
              )}
              {project.launch?.date && (
                <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium ml-auto">
                  {project.launch.date}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight mb-2">
              {title}
            </h1>

            {/* Role */}
            <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-1.5 mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3.5 h-3.5 opacity-60"
                aria-hidden="true"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              {project.role ?? "Developer"}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {liveLink && (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition-colors shadow-sm"
                >
                  Live Demo
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                  >
                    <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
                    <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
                  </svg>
                </a>
              )}
              {githubLinks.map((link, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-sm font-medium hover:border-cyan-400 dark:hover:border-cyan-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                  </svg>
                  {githubLinks.length > 1 ? `Repo ${i + 1}` : "Code"}
                </a>
              ))}
            </div>
          </div>

          {/* ── Images — centered, object-contain ── */}
          {images.length > 0 && (
            <div
              className="fade-up fade-up-2 mb-8 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-900 flex items-center justify-center"
              style={{ minHeight: "220px", maxHeight: "400px" }}
            >
              <img
                src={images[0]}
                alt={`${title} preview`}
                className="w-full h-full object-contain"
                style={{ maxHeight: "400px" }}
                loading="eager"
              />
            </div>
          )}

          {/* ── TL;DR ── */}
          {cs.tlDr && (
            <div className="fade-up fade-up-2 relative rounded-2xl px-5 py-4 mb-8 bg-gradient-to-br from-blue-50 to-cyan-50/60 dark:from-blue-950/50 dark:to-cyan-950/30 border border-blue-100/80 dark:border-blue-800/40 overflow-hidden">
              <div
                className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${gradientClass}`}
              />
              <p className="text-xs font-bold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 mb-2 pl-2">
                TL;DR
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-slate-300 pl-2">
                {cs.tlDr}
              </p>
            </div>
          )}

          {/* ── Stats row ── */}
          {project.stats && Object.keys(project.stats).length > 0 && (
            <div className="fade-up fade-up-3 grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {Object.entries(project.stats).map(([k, v]) => (
                <StatCard
                  key={k}
                  label={k
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase())}
                  value={String(v)}
                />
              ))}
            </div>
          )}

          {/* ── Tech stack ── */}
          {tech.length > 0 && (
            <div className="fade-up fade-up-3 mb-8">
              <SectionBox
                label="Tech Stack"
                icon="🛠️"
                accent="from-indigo-500 to-blue-500"
              >
                <div className="flex flex-wrap gap-2">
                  {tech.map((t, i) => (
                    <TechChip key={i} label={t} />
                  ))}
                </div>
              </SectionBox>
            </div>
          )}

          {/* ── Main case study grid ── */}
          <div className="fade-up fade-up-4 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Problem */}
            {cs.problem && (
              <SectionBox
                label="Problem"
                icon="🎯"
                accent="from-rose-500 to-pink-500"
              >
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                  {cs.problem}
                </p>
              </SectionBox>
            )}

            {/* Constraints */}
            {cs.constraints && (
              <SectionBox
                label="Constraints"
                icon="⚠️"
                accent="from-amber-500 to-orange-500"
              >
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                  {cs.constraints}
                </p>
              </SectionBox>
            )}

            {/* My Role */}
            {cs.myRole && (
              <SectionBox
                label="My Role"
                icon="👤"
                accent="from-violet-500 to-purple-500"
              >
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                  {cs.myRole}
                </p>
              </SectionBox>
            )}

            {/* Architecture */}
            {cs.architectureNotes && (
              <SectionBox
                label="Architecture"
                icon="🏗️"
                accent="from-cyan-500 to-teal-500"
              >
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                  {cs.architectureNotes}
                </p>
              </SectionBox>
            )}
          </div>

          {/* ── Approach — full width ── */}
          {Array.isArray(cs.approach) && cs.approach.length > 0 && (
            <div className="fade-up fade-up-4 mb-4">
              <SectionBox
                label="Approach"
                icon="🗺️"
                accent="from-sky-500 to-blue-500"
              >
                <ListItems items={cs.approach} />
              </SectionBox>
            </div>
          )}

          {/* ── Responsibilities — full width ── */}
          {Array.isArray(cs.responsibilities) &&
            cs.responsibilities.length > 0 && (
              <div className="fade-up fade-up-4 mb-4">
                <SectionBox
                  label="Responsibilities"
                  icon="✅"
                  accent="from-emerald-500 to-teal-500"
                >
                  <ListItems items={cs.responsibilities} />
                </SectionBox>
              </div>
            )}

          {/* ── Technical Solution — full width ── */}
          {Array.isArray(cs.technicalSolution) &&
            cs.technicalSolution.length > 0 && (
              <div className="fade-up fade-up-4 mb-4">
                <SectionBox
                  label="Technical Solution"
                  icon="⚙️"
                  accent="from-indigo-500 to-violet-500"
                >
                  <ListItems items={cs.technicalSolution} />
                </SectionBox>
              </div>
            )}

          {/* ── Outcomes + Proof points grid ── */}
          <div className="fade-up fade-up-4 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-4">
            {cs.outcomes?.qualitative && (
              <SectionBox
                label="Outcome"
                icon="🏁"
                accent="from-cyan-500 to-blue-500"
              >
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                  {cs.outcomes.qualitative}
                </p>
              </SectionBox>
            )}

            {Array.isArray(cs.proofPoints) && cs.proofPoints.length > 0 && (
              <SectionBox
                label="Proof Points"
                icon="📊"
                accent="from-teal-500 to-cyan-500"
              >
                <ListItems items={cs.proofPoints} />
              </SectionBox>
            )}
          </div>

          {/* ── Judge Scores — full width, optional ── */}
          {cs.judgeScores &&
            Array.isArray(cs.judgeScores.categories) &&
            cs.judgeScores.categories.length > 0 && (
              <div className="fade-up fade-up-4 mb-4 mt-4">
                <JudgeScoresChart judgeScores={cs.judgeScores} />
              </div>
            )}

          {/* ── Lessons — full width ── */}
          {Array.isArray(cs.lessons) && cs.lessons.length > 0 && (
            <div className="fade-up fade-up-4 mb-8">
              <SectionBox
                label="Lessons Learned"
                icon="💡"
                accent="from-yellow-500 to-amber-500"
              >
                <ListItems items={cs.lessons} />
              </SectionBox>
            </div>
          )}

          {/* ── Additional images ── */}
          {images.length > 1 && (
            <div className="fade-up fade-up-4 mb-8">
              <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 dark:text-slate-500 mb-3">
                More Screenshots
              </p>
              <div className="grid grid-cols-2 gap-3">
                {images.slice(1).map((src, i) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-900 flex items-center justify-center"
                    style={{ minHeight: "120px" }}
                  >
                    <img
                      src={src}
                      alt={`${title} screenshot ${i + 2}`}
                      className="w-full h-full object-contain"
                      style={{ maxHeight: "200px" }}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Prev / Next ── */}
          {(prev || next) && (
            <nav
              aria-label="Project navigation"
              className="flex items-center justify-between gap-4 mb-8 pt-6 border-t border-gray-100 dark:border-slate-700/50"
            >
              {prev ? (
                <Link
                  href={`/projects/${slugify(prev.id ?? prev.title ?? prev.name)}`}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.78 3.22a.75.75 0 0 1 0 1.06L6.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="truncate max-w-[140px]">
                    {prev.title ?? prev.name}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/projects/${slugify(next.id ?? next.title ?? next.name)}`}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors ml-auto"
                >
                  <span className="truncate max-w-[140px]">
                    {next.title ?? next.name}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}

          {/* ── cd .. back ── */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold border border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-800/50 hover:border-cyan-400 dark:hover:border-cyan-600 hover:text-cyan-700 dark:hover:text-cyan-300 transition-all shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3 h-3"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9.78 3.22a.75.75 0 0 1 0 1.06L6.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
            cd ..
          </Link>
        </div>
      </main>
    </>
  );
}