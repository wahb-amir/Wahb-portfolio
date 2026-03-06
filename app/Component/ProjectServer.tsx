// ProjectServer.tsx
// PERFORMANCE FIX: Shell renders instantly. Cards stream in via Suspense.
// The page never blocks on Redis/DB — users see content immediately.

import React, { Suspense } from "react";
import ProjectCardSSR from "./ProjectCardSSR";
import { getLatestProjectsPayload } from "@/lib/projectsService";
import Arrow from "./Arrow";

type ProjectsPayload<T = unknown> = {
  version: string | number | null;
  data: T | null;
};

type Project = {
  id?: string;
  title?: string;
  name?: string;
  short?: string;
  description?: string;
  liveLink?: string;
  url?: string;
  repo?: string;
  repoUrl?: string;
  image?: string;
  banner?: string;
  datePublished?: string;
  publishedAt?: string;
  techStack?: string[];
  languages?: string[];
  tags?: string[];
  category?: string;
  rating?: { value: number; best?: number; worst?: number; count?: number };
  [k: string]: any;
};

const SITE_URL = "https://wahb.space";
const PERSON_ID = `${SITE_URL}/#person`;

function cleanObject<T extends Record<string, any>>(obj: T): any {
  if (obj == null) return obj;
  if (Array.isArray(obj)) {
    const arr = obj
      .map((v) => cleanObject(v))
      .filter(
        (v) =>
          !(
            v == null ||
            (typeof v === "string" && v.trim() === "") ||
            (Array.isArray(v) && v.length === 0)
          ),
      );
    return arr.length ? arr : undefined;
  }
  if (typeof obj === "object") {
    const out: Record<string, any> = {};
    Object.entries(obj).forEach(([k, v]) => {
      const cleaned = cleanObject(v);
      if (
        cleaned !== undefined &&
        !(typeof cleaned === "string" && cleaned.trim() === "") &&
        !(Array.isArray(cleaned) && cleaned.length === 0)
      ) {
        out[k] = cleaned;
      }
    });
    return Object.keys(out).length ? out : undefined;
  }
  return obj;
}

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

// ─── Skeleton card shown instantly while data loads ───────────────────────────
function ProjectCardSkeleton({ index }: { index: number }) {
  return (
    <article
      className="project-card-skeleton rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 shadow-sm"
      style={{ animationDelay: `${index * 80}ms` }}
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <div className="w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 animate-pulse" />
      <div className="p-5 space-y-3">
        {/* Title */}
        <div className="h-5 w-3/4 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse" />
        {/* Role */}
        <div className="h-3.5 w-2/5 rounded-md bg-gray-100 dark:bg-slate-700/60 animate-pulse" />
        {/* Tags row */}
        <div className="flex gap-2 pt-1">
          {[40, 56, 48].map((w, i) => (
            <div
              key={i}
              className="h-5 rounded-full bg-gray-100 dark:bg-slate-700/50 animate-pulse"
              style={{ width: `${w}px` }}
            />
          ))}
        </div>
        {/* TL;DR block */}
        <div className="h-14 w-full rounded-xl bg-blue-50 dark:bg-blue-900/20 animate-pulse mt-2" />
        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <div className="h-8 w-24 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 animate-pulse" />
          <div className="h-8 w-20 rounded-lg bg-gray-100 dark:bg-slate-700/40 animate-pulse" />
        </div>
      </div>
    </article>
  );
}

function ProjectsGridSkeleton() {
  return (
    <div
      className="grid gap-6 w-full max-w-6xl px-2 items-start"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      aria-label="Loading projects…"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <ProjectCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

// ─── Async data component — suspends until data is ready ──────────────────────
async function ProjectsGrid() {
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

  const rawProjects = (payload.data ?? []) as Project[];

  const uniqueProjectsMap = new Map<string, Project>();
  rawProjects.forEach((p) => {
    const key = (p.id || p.title || p.name || JSON.stringify(p)).toString();
    if (key && !uniqueProjectsMap.has(key)) uniqueProjectsMap.set(key, p);
  });
  const projects = Array.from(uniqueProjectsMap.values());

  // Build JSON-LD
  const seenIds = new Set<string>();
  const graphEntries = projects.map((p, idx) => {
    const title = p.title ?? p.name ?? "Untitled Project";
    const slug = slugify(p.id ?? title ?? `project-${idx}`);
    const projectId = `${SITE_URL}/#project-${slug}`;
    let uniqueProjectId = projectId;
    let suffix = 1;
    while (seenIds.has(uniqueProjectId))
      uniqueProjectId = `${projectId}-${suffix++}`;
    seenIds.add(uniqueProjectId);

    const url = p.liveLink ?? p.url ?? p.repoUrl ?? p.repo ?? undefined;
    let category = "WebApplication";
    const catSearch =
      (Array.isArray(p.tags) ? p.tags.join(" ") : "") + (p.category ?? "");
    if (/ecom|shop|store|commerce/i.test(catSearch))
      category = "ECommercePlatform";
    else if (/mobile|pwa/i.test(catSearch)) category = "MobileApplication";
    else if (p.category) category = p.category;

    const languages =
      (Array.isArray(p.languages) && p.languages.length
        ? p.languages
        : undefined) ??
      (Array.isArray(p.techStack)
        ? p.techStack.filter((t) =>
            /^(javascript|typescript|python|go|rust|java|c#|php|node)/i.test(t),
          )
        : undefined);

    const sameAs = [
      ...(p.repo ? [p.repo] : p.repoUrl ? [p.repoUrl] : []),
      ...(p.liveLink ? [p.liveLink] : p.url ? [p.url] : []),
    ].filter(Boolean);

    const softwareApp = cleanObject({
      "@type": "SoftwareApplication",
      "@id": uniqueProjectId,
      name: title,
      url,
      description: p.short ?? p.description,
      applicationCategory: category,
      operatingSystem: "Web",
      programmingLanguage: languages,
      softwareRequirements: p.techStack,
      author: { "@id": PERSON_ID },
      sameAs: sameAs.length ? sameAs : undefined,
      datePublished: p.datePublished ?? p.publishedAt,
      image: p.banner ?? p.image,
      aggregateRating:
        p.rating && typeof p.rating.value === "number"
          ? {
              "@type": "AggregateRating",
              ratingValue: p.rating.value,
              reviewCount: p.rating.count,
              bestRating: p.rating.best,
              worstRating: p.rating.worst,
            }
          : undefined,
    });

    const codeEntry = sameAs.length
      ? cleanObject({
          "@type": "SoftwareSourceCode",
          "@id": `${uniqueProjectId}#source`,
          name: `${title} — source code`,
          codeRepository: sameAs.filter((u) =>
            /(github|gitlab|bitbucket)/i.test(u),
          ),
          creator: { "@id": PERSON_ID },
        })
      : undefined;

    return { softwareApp, codeEntry };
  });

  const graph = graphEntries
    .flatMap((e) => [e.softwareApp, e.codeEntry])
    .filter(Boolean);

  const itemList = cleanObject({
    "@type": "ItemList",
    "@id": `${SITE_URL}/#projects-list`,
    name: "Projects — Wahb Amir",
    url: `${SITE_URL}/#projects`,
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@id": `${SITE_URL}/#project-${slugify(p.id ?? p.title ?? p.name ?? `project-${i}`)}`,
      },
    })),
  });

  const jsonLdGraph = cleanObject({
    "@context": "https://schema.org",
    "@graph": [itemList, ...graph],
  });

  return (
    <>
      <div
        id="projects-grid"
        role="list"
        aria-label="Projects grid"
        className="grid gap-6 w-full max-w-6xl px-2 items-start"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {projects.map((p, i) => (
          <div
            key={slugify(p.id ?? p.title ?? p.name ?? `project-${i}`)}
            role="listitem"
            aria-label={`Project: ${p.title ?? p.name ?? "Untitled"}`}
            data-project-id={slugify(
              p.id ?? p.title ?? p.name ?? `project-${i}`,
            )}
            className="project-card-enter"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <ProjectCardSSR project={p} />
          </div>
        ))}
      </div>

      {graph?.length > 0 && jsonLdGraph && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      )}
    </>
  );
}

// ─── Shell — renders INSTANTLY, streams grid when data arrives ────────────────
export default function ProjectServer() {
  return (
    <section
      id="project-section"
      className={`
    relative flex flex-col justify-start items-center
   px-4 xs:px-6 text-center pb-[6.25rem]
    bg-[#f9fafb] dark:bg-[#0f172a]
    bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
    text-black dark:text-white
    overflow-hidden pt-[env(safe-area-inset-top)]
  `}
      role="region"
      aria-labelledby="projects-heading"
      data-keywords="projects,portfolio,case-studies,projects-grid"
    >
      {/* ── Decorative background ── */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* Subtle radial glow top */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-cyan-400/10 dark:bg-cyan-500/8 blur-3xl" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#f0f9ff] dark:from-[#0a1628] to-transparent" />
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #64748b 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* ── Header ── */}
      <div className="relative z-10 mb-12 mt-2">
        {/* Eyebrow label */}
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-cyan-600 dark:text-cyan-400 mb-4">
          <span className="w-5 h-px bg-cyan-500 inline-block" />
          Portfolio
          <span className="w-5 h-px bg-cyan-500 inline-block" />
        </p>

        <h2
          id="projects-heading"
          className="font-extrabold tracking-tight text-4xl sm:text-5xl text-gray-900 dark:text-white leading-tight"
        >
          Things I've{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
              Built & Shipped
            </span>
            {/* Underline accent */}
            <span
              className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-60"
              aria-hidden="true"
            />
          </span>
        </h2>

        <p className="max-w-xl mx-auto mt-5 text-sm sm:text-base text-gray-500 dark:text-slate-400 leading-relaxed">
          Each entry covers the{" "}
          <strong className="font-medium text-gray-700 dark:text-slate-300">
            problem
          </strong>
          ,{" "}
          <strong className="font-medium text-gray-700 dark:text-slate-300">
            approach
          </strong>
          , and{" "}
          <strong className="font-medium text-gray-700 dark:text-slate-300">
            outcome
          </strong>
          . Open a card for the full case study.
        </p>
      </div>

      {/* ── Projects grid — streams in; skeleton shows immediately ── */}
      <Suspense fallback={<ProjectsGridSkeleton />}>
        <ProjectsGrid />
      </Suspense>

      <Arrow
        topId="skills"
        bottomId="about"
        topBlock="start"
        bottomBlock="start"
      />

      {/* ── Scroll hint ── */}
      <style>{`
        @keyframes card-enter {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .project-card-enter {
          animation: card-enter 0.45s ease both;
        }
        .projects-section {
          background: linear-gradient(
            180deg,
            #f0f9ff 0%,
            #f9fafb 100%
          );
        }
        :is(.dark) .projects-section {
          background: linear-gradient(
            180deg,
            #0c1a2e 0%,
            #0f172a 100%
          );
        }
      `}</style>
    </section>
  );
}
