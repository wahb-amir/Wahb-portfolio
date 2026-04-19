// app/projects/[id]/page.tsx — Individual project page
import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLatestProjectsPayload } from "@/lib/projectsService";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

type RepoLink = {
  name: string;
  url: string;
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

function formatKey(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function toAbsoluteUrl(url?: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://wahb.space${url.startsWith("/") ? "" : "/"}${url}`;
}

function normalizeRepoLinks(githubLink: unknown): RepoLink[] {
  if (!githubLink) return [];

  if (typeof githubLink === "string") {
    const url = githubLink.trim();
    return url ? [{ name: "Code Repository", url }] : [];
  }

  if (Array.isArray(githubLink)) {
    return githubLink
      .map((item, index) => {
        if (typeof item === "string") {
          const url = item.trim();
          return url
            ? { name: `Repository ${index + 1}`, url }
            : null;
        }

        if (item && typeof item === "object" && "url" in item) {
          const maybeName = "name" in item ? String((item as any).name) : "";
          const maybeUrl = String((item as any).url ?? "").trim();

          return maybeUrl
            ? {
                name: maybeName || `Repository ${index + 1}`,
                url: maybeUrl,
              }
            : null;
        }

        return null;
      })
      .filter((item): item is RepoLink => Boolean(item));
  }

  if (typeof githubLink === "object") {
    return Object.entries(githubLink as Record<string, unknown>)
      .filter(([, value]) => typeof value === "string" && value.trim().length > 0)
      .map(([key, value]) => ({
        name: `${formatKey(key)} Repository`,
        url: String(value).trim(),
      }));
  }

  return [];
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
  return projects.find((p) => slugify(p.id ?? p.title ?? p.name) === id) ?? null;
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
  const firstImage = Array.isArray(project.images) ? project.images[0] : undefined;

  return {
    title: `${title}${badge} — Wahb Amir`,
    description,
    openGraph: {
      title: `${title} — Wahb Amir`,
      description,
      url: `https://wahb.space/projects/${id}`,
      images: firstImage ? [{ url: toAbsoluteUrl(firstImage) }] : [],
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
    <div className="relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50">
      <div
        className={`absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r ${accent}`}
      />
      <div className="px-5 pb-5 pt-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <h3
            className={`bg-gradient-to-r ${accent} bg-clip-text text-[11px] font-black uppercase tracking-[0.15em] text-transparent`}
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
          className="flex items-start gap-2 text-sm leading-relaxed text-gray-600 dark:text-slate-300"
        >
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function TechChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200/60 bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:border-slate-600/40 dark:bg-slate-700/70 dark:text-slate-300">
      {label}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-cyan-100/80 bg-cyan-50/60 px-4 py-3 dark:border-cyan-800/40 dark:bg-cyan-950/30">
      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
        {label}
      </span>
      <span className="text-sm font-semibold leading-snug text-gray-800 dark:text-white">
        {value}
      </span>
    </div>
  );
}

function JudgeScoresChart({ judgeScores }: { judgeScores: JudgeScores }) {
  const MAX = judgeScores.outOf;
  const R = 54;
  const CIRC = +(2 * Math.PI * R).toFixed(4);

  const overall = judgeScores.categories.find(
    (c) => c.label.toLowerCase() === "overall",
  );
  const categories = judgeScores.categories.filter(
    (c) => c.label.toLowerCase() !== "overall",
  );

  const overallPct = overall ? overall.score / MAX : 0;
  const dashOffset = +(CIRC * (1 - overallPct)).toFixed(4);

  const accents: [string, string][] = [
    ["#8B5CF6", "#7C3AED"],
    ["#06B6D4", "#3B82F6"],
    ["#F43F5E", "#EC4899"],
    ["#F59E0B", "#F97316"],
    ["#10B981", "#0D9488"],
  ];

  return (
    <SectionBox
      label="Judge Scores"
      icon="🏅"
      accent="from-yellow-400 to-amber-500"
    >
      {judgeScores.source && (
        <p className="mb-5 -mt-1 text-[11px] text-gray-400 dark:text-slate-500">
          {judgeScores.source}
        </p>
      )}

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        {overall && (
          <div className="flex shrink-0 flex-col items-center gap-3">
            <div className="relative" style={{ width: 148, height: 148 }}>
              <svg
                width="148"
                height="148"
                viewBox="0 0 148 148"
                style={{ transform: "rotate(-90deg)" }}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="ringGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>

                <circle
                  cx="74"
                  cy="74"
                  r={R}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-gray-100 dark:text-slate-700/60"
                />

                <circle
                  cx="74"
                  cy="74"
                  r={R}
                  fill="none"
                  stroke="url(#ringGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={dashOffset}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[28px] font-extrabold leading-none tabular-nums text-gray-900 dark:text-white">
                  {overall.score.toFixed(2)}
                </span>
                <span className="mt-0.5 text-[11px] text-gray-400 dark:text-slate-500">
                  / {MAX}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-3 py-1 text-[11px] font-black tracking-wider text-amber-900 shadow-sm dark:from-amber-500 dark:to-yellow-400">
                🥉 3rd of 775
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-500">
                Overall
              </span>
            </div>
          </div>
        )}

        <div className="flex w-full min-w-0 flex-1 flex-col justify-center gap-4">
          {categories.map((cat, i) => {
            const pct = (cat.score / MAX) * 100;
            const [colorFrom, colorTo] = accents[i % accents.length];

            return (
              <div key={cat.label}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">
                    {cat.label}
                  </span>
                  <span
                    className="text-sm font-black tabular-nums"
                    style={{ color: colorFrom }}
                  >
                    {cat.score.toFixed(2)}
                    <span className="ml-1 text-[10px] font-medium text-gray-300 dark:text-slate-600">
                      /{MAX}
                    </span>
                  </span>
                </div>

                <div className="relative h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700/60">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(to right, ${colorFrom}, ${colorTo})`,
                    }}
                  />
                  <div
                    className="absolute inset-y-0 w-1 rounded-full opacity-60"
                    style={{
                      left: `calc(${pct}% - 2px)`,
                      background: colorTo,
                      filter: "blur(2px)",
                    }}
                  />
                </div>
              </div>
            );
          })}

          <div className="mt-1 flex items-center justify-between">
            <span className="text-[10px] font-medium text-gray-300 dark:text-slate-600">
              0
            </span>
            {[1, 2, 3, 4, 5].map((tick) => (
              <span
                key={tick}
                className="text-[10px] font-medium text-gray-300 dark:text-slate-600"
              >
                {tick}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SectionBox>
  );
}

function ProjectJsonLd({ project, id }: { project: any; id: string }) {
  const title = project.title ?? project.name ?? "Project";
  const url = project.liveLink ?? `https://wahb.space/projects/${id}`;
  const sameAs = normalizeRepoLinks(project.githubLink).map((repo) => repo.url);

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
          project.category === "ECommerce" ? "ECommercePlatform" : "WebApplication",
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
        ...(sameAs.length > 0 && {
          sameAs,
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
  const repoLinks = normalizeRepoLinks(project.githubLink);

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
          relative flex min-h-[65vh] flex-col items-center justify-start
          overflow-hidden bg-gradient-to-b from-[#00b1ff88] to-[#00bfff44]
          bg-white px-4 pb-28 pt-[env(safe-area-inset-top)]
          text-center text-black dark:bg-[#0b1220] dark:text-white
          sm:min-h-[72vh] sm:px-6
        "
      >
        <div className="mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="fade-up fade-up-1 mb-8 flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500"
          >
            <Link
              href="/"
              className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/projects"
              className="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400"
            >
              Projects
            </Link>
            <span>/</span>
            <span className="max-w-[200px] truncate text-gray-700 dark:text-slate-300">
              {title}
            </span>
          </nav>

          <div className="fade-up fade-up-1 mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {project.category && (
                <span
                  className={`inline-flex items-center rounded-full bg-gradient-to-r ${gradientClass} px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm`}
                >
                  {project.category}
                </span>
              )}
              {project.badge?.label && (
                <span className="inline-flex items-center gap-1 rounded-full border border-yellow-300/80 bg-yellow-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-yellow-900 shadow-sm dark:bg-yellow-500">
                  {project.badge.label}
                </span>
              )}
              {project.badge?.sub && (
                <span className="rounded-full border border-yellow-200/60 bg-yellow-50 px-2 py-0.5 text-[10px] font-medium text-yellow-800 dark:border-yellow-800/40 dark:bg-yellow-950/50 dark:text-yellow-300">
                  {project.badge.sub}
                </span>
              )}
              {project.launch?.date && (
                <span className="ml-auto text-[10px] font-medium text-gray-400 dark:text-slate-500">
                  {project.launch.date}
                </span>
              )}
            </div>

            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {title}
            </h1>

            <p className="mb-5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-3.5 w-3.5 opacity-60"
                aria-hidden="true"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              {project.role ?? "Developer"}
            </p>

            <div className="flex flex-wrap gap-3">
              {liveLink && (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
                >
                  Live Demo
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
                    <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
                  </svg>
                </a>
              )}

              {repoLinks.length === 1 && (
                <a
                  href={repoLinks[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-cyan-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-cyan-600"
                >
                  {repoLinks[0].name}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                  </svg>
                </a>
              )}

              {repoLinks.length > 1 &&
                repoLinks.map((repo) => (
                  <a
                    key={repo.url}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-cyan-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-cyan-600"
                  >
                    {repo.name}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                    </svg>
                  </a>
                ))}
            </div>
          </div>

          {images.length > 0 && (
            <div
              className="fade-up fade-up-2 mb-8 flex items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-slate-700/50 dark:bg-slate-900"
              style={{ minHeight: "220px", maxHeight: "400px" }}
            >
              <img
                src={images[0]}
                alt={`${title} preview`}
                className="h-full w-full object-contain"
                style={{ maxHeight: "400px" }}
                loading="eager"
              />
            </div>
          )}

          {cs.tlDr && (
            <div className="fade-up fade-up-2 relative mb-8 overflow-hidden rounded-2xl border border-blue-100/80 bg-gradient-to-br from-blue-50 to-cyan-50/60 px-5 py-4 dark:border-blue-800/40 dark:from-blue-950/50 dark:to-cyan-950/30">
              <div
                className={`absolute bottom-0 left-0 top-0 w-[3px] bg-gradient-to-b ${gradientClass}`}
              />
              <p className="mb-2 pl-2 text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                TL;DR
              </p>
              <p className="pl-2 text-sm leading-relaxed text-gray-700 dark:text-slate-300 sm:text-base">
                {cs.tlDr}
              </p>
            </div>
          )}

          {project.stats && Object.keys(project.stats).length > 0 && (
            <div className="fade-up fade-up-3 mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
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

          <div className="fade-up fade-up-4 mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cs.problem && (
              <SectionBox
                label="Problem"
                icon="🎯"
                accent="from-rose-500 to-pink-500"
              >
                <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300">
                  {cs.problem}
                </p>
              </SectionBox>
            )}

            {cs.constraints && (
              <SectionBox
                label="Constraints"
                icon="⚠️"
                accent="from-amber-500 to-orange-500"
              >
                <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300">
                  {cs.constraints}
                </p>
              </SectionBox>
            )}

            {cs.myRole && (
              <SectionBox
                label="My Role"
                icon="👤"
                accent="from-violet-500 to-purple-500"
              >
                <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300">
                  {cs.myRole}
                </p>
              </SectionBox>
            )}

            {cs.architectureNotes && (
              <SectionBox
                label="Architecture"
                icon="🏗️"
                accent="from-cyan-500 to-teal-500"
              >
                <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300">
                  {cs.architectureNotes}
                </p>
              </SectionBox>
            )}
          </div>

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

          {Array.isArray(cs.responsibilities) && cs.responsibilities.length > 0 && (
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

          <div className="fade-up fade-up-4 mb-4 mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cs.outcomes?.qualitative && (
              <SectionBox
                label="Outcome"
                icon="🏁"
                accent="from-cyan-500 to-blue-500"
              >
                <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300">
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

          {cs.judgeScores &&
            Array.isArray(cs.judgeScores.categories) &&
            cs.judgeScores.categories.length > 0 && (
              <div className="fade-up fade-up-4 mb-4 mt-4">
                <JudgeScoresChart judgeScores={cs.judgeScores} />
              </div>
            )}

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

          {images.length > 1 && (
            <div className="fade-up fade-up-4 mb-8">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                More Screenshots
              </p>
              <div className="grid grid-cols-2 gap-3">
                {images.slice(1).map((src, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-slate-700/50 dark:bg-slate-900"
                    style={{ minHeight: "120px" }}
                  >
                    <img
                      src={src}
                      alt={`${title} screenshot ${i + 2}`}
                      className="h-full w-full object-contain"
                      style={{ maxHeight: "200px" }}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {(prev || next) && (
            <nav
              aria-label="Project navigation"
              className="mb-8 flex items-center justify-between gap-4 border-t border-gray-100 pt-6 dark:border-slate-700/50"
            >
              {prev ? (
                <Link
                  href={`/projects/${slugify(prev.id ?? prev.title ?? prev.name)}`}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.78 3.22a.75.75 0 0 1 0 1.06L6.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="max-w-[140px] truncate">
                    {prev.title ?? prev.name}
                  </span>
                </Link>
              ) : (
                <span />
              )}

              {next ? (
                <Link
                  href={`/projects/${slugify(next.id ?? next.title ?? next.name)}`}
                  className="group ml-auto inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400"
                >
                  <span className="max-w-[140px] truncate">
                    {next.title ?? next.name}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/70 px-3 py-1.5 font-mono text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-cyan-400 hover:text-cyan-700 dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-cyan-600 dark:hover:text-cyan-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3 w-3"
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