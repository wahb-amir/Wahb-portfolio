// ProjectServer.tsx — Server Component
// Theme is 100% CSS-driven via .dark class on <html> (next-themes).
// Zero JS theme branching = zero flash, zero hydration mismatch.

import React, { Suspense } from "react";
import ProjectCardSSR from "./ProjectCardSSR";
import { getLatestProjectsPayload } from "@/lib/projectsService";
import Arrow from "../navigation/Arrow";
import Link from "next/link";

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

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ProjectCardSkeleton({ index }: { index: number }) {
  return (
    <article
      className="rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 shadow-sm ps-card-skeleton"
      style={{ animationDelay: `${index * 80}ms` }}
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

function ProjectsGridSkeleton() {
  return (
    <div className="ps-grid" aria-label="Loading projects…">
      {Array.from({ length: 2 }).map((_, i) => (
        <ProjectCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

// ─── Async data component ─────────────────────────────────────────────────────
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

  const allProjects = Array.from(uniqueProjectsMap.values());

  // ── Only show first 2 on homepage ──
  const projects = allProjects.slice(0, 2);
  const hasMore = allProjects.length > 2;

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
        className="ps-grid"
      >
        {projects.map((p, i) => (
          <div
            key={slugify(p.id ?? p.title ?? p.name ?? `project-${i}`)}
            role="listitem"
            aria-label={`Project: ${p.title ?? p.name ?? "Untitled"}`}
            data-project-id={slugify(
              p.id ?? p.title ?? p.name ?? `project-${i}`,
            )}
            className="ps-card-enter"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <ProjectCardSSR project={p} />
          </div>
        ))}
      </div>

      {/* ── View All Projects button ── */}
      {hasMore && (
        <div className="ps-card-enter mt-10" style={{ animationDelay: "180ms" }}>
          <Link
            href="/projects"
            className="
              group inline-flex items-center gap-2.5
              px-6 py-3 rounded-full
              text-sm font-semibold
              border border-cyan-300/70 dark:border-cyan-700/60
              text-cyan-700 dark:text-cyan-300
              bg-cyan-50/80 dark:bg-cyan-950/30
              hover:bg-cyan-100 dark:hover:bg-cyan-900/40
              hover:border-cyan-400 dark:hover:border-cyan-500
              transition-all duration-200
              hover:-translate-y-0.5
              shadow-sm hover:shadow-md hover:shadow-cyan-200/40 dark:hover:shadow-cyan-900/40
            "
          >
            View all projects
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      )}

      {graph?.length > 0 && jsonLdGraph && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      )}
    </>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────
export default function ProjectServer() {
  return (
    <>
      <style>{`
        /* ── Top glow — light / dark ── */
        #project-section .ps-glow-top {
          background: radial-gradient(ellipse at center, rgba(34,211,238,0.10) 0%, transparent 70%);
        }
        .dark #project-section .ps-glow-top {
          background: radial-gradient(ellipse at center, rgba(34,211,238,0.08) 0%, transparent 70%);
        }

        /* ── Bottom fade ── */
        #project-section .ps-fade-bottom {
          background: linear-gradient(to top, #f0f9ff, transparent);
        }
        .dark #project-section .ps-fade-bottom {
          background: linear-gradient(to top, #0a1628, transparent);
        }

        /* ── Grid layout ──
           Mobile:  1 column, max 480px so card doesn't balloon on wide phones
           Desktop: 2 columns, 72rem total → each card ~33rem — readable, not cramped
        */
        .ps-grid {
          display: grid;
          gap: 2rem;
          width: 100%;
          max-width: 480px;
          padding-inline: 0.5rem;
          align-items: start;
          grid-template-columns: 1fr;
          margin-inline: auto;
        }
        @media (min-width: 640px) {
          .ps-grid {
            max-width: 72rem;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        /* ── Card entrance animation ── */
        @keyframes ps-card-enter {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ps-card-enter {
          animation: ps-card-enter 0.45s ease both;
        }

        /* ── Skeleton shimmer entrance ── */
        @keyframes ps-skeleton-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .ps-card-skeleton {
          animation: ps-skeleton-fade 0.3s ease both;
        }
      `}</style>

      <section
        id="project-section"
        className="relative flex flex-col justify-start items-center px-4 xs:px-6 text-center pb-[6.25rem] text-black overflow-hidden pt-[env(safe-area-inset-top)] dark:bg-[#0b1220] dark:text-white bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]"
        role="region"
        aria-labelledby="projects-heading"
        data-keywords="projects,portfolio,case-studies,projects-grid"
      >
        {/* ── Decorative background ── */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          <div className="ps-glow-top absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-3xl" />
          <div className="ps-fade-bottom absolute bottom-0 inset-x-0 h-40" />
        </div>

        {/* ── Header ── */}
        <div className="relative z-10 mb-12 mt-2">
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-cyan-600 dark:text-cyan-400 mb-4">
            <span className="w-5 h-px bg-cyan-500 inline-block" />
            Portfolio
            <span className="w-5 h-px bg-cyan-500 inline-block" />
          </p>

          <h2
            id="projects-heading"
            className="font-extrabold tracking-tight text-4xl sm:text-5xl text-gray-900 dark:text-white leading-tight"
          >
            Things I&apos;ve{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
                Built &amp; Shipped
              </span>
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

        {/* ── Projects grid — streams in via Suspense ── */}
        <Suspense fallback={<ProjectsGridSkeleton />}>
          <ProjectsGrid />
        </Suspense>

        <Arrow
          topId="skills"
          bottomId="about"
          topBlock="start"
          bottomBlock="start"
        />
      </section>
    </>
  );
}