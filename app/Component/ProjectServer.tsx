// app/components/ProjectServer.tsx
import React from "react";
import ProjectCardSSR from "./ProjectCardSSR";
import { getLatestProjectsPayload } from "@/lib/projectsService";

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
  techStack?: string[]; // e.g. ["React", "Next.js", "Node.js"]
  languages?: string[]; // e.g. ["JavaScript", "TypeScript"]
  tags?: string[];
  category?: string;
  rating?: { value: number; best?: number; worst?: number; count?: number };
  [k: string]: any;
};

const SITE_URL = "https://wahb.space";
const PERSON_ID = `${SITE_URL}/#person`;

/** remove null/undefined/empty-string/empty-array properties recursively */
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
          )
      );
    return arr.length ? arr : undefined;
  }
  if (typeof obj === "object") {
    const out: Record<string, any> = {};
    Object.entries(obj).forEach(([k, v]) => {
      const cleaned = cleanObject(v);
      const shouldKeep =
        cleaned !== undefined &&
        !(typeof cleaned === "string" && cleaned.trim() === "") &&
        !(Array.isArray(cleaned) && cleaned.length === 0);
      if (shouldKeep) out[k] = cleaned;
    });
    return Object.keys(out).length ? out : undefined;
  }
  return obj;
}

/** simple slug generator for project @id */
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

  const projects = (payload.data ?? []) as Project[];

  // Build JSON-LD graph entries for projects
  const graphEntries = projects.map((p) => {
    const title = p.title ?? p.name ?? "Untitled Project";
    const slug = slugify(p.id ?? title);
    const projectId = `${SITE_URL}/#project-${slug}`;

    // Choose canonical URL if available
    const url = p.liveLink ?? p.url ?? p.repoUrl ?? p.repo ?? undefined;

    // Detect applicationCategory defaulting to WebApplication, allow overrides via p.category or tags
    let category = "WebApplication";
    const catFromTags =
      (p.tags ?? []).find((t: string) => /ecom|shop|store|commerce/i.test(t)) ||
      (p.category && /ecom|shop|store|commerce/i.test(String(p.category))
        ? p.category
        : null);
    if (catFromTags) category = "ECommercePlatform";
    if (p.category && typeof p.category === "string") {
      // user provided explicit category – allow common mapping
      const c = p.category.toLowerCase();
      if (c.includes("ecom") || c.includes("commerce"))
        category = "ECommercePlatform";
      else if (c.includes("mobile") || c.includes("pwa"))
        category = "MobileApplication";
      else category = p.category;
    }

    // programmingLanguage preferred from p.languages; otherwise try to derive from techStack
    const languages =
      (Array.isArray(p.languages) && p.languages.length
        ? p.languages
        : undefined) ??
      (Array.isArray(p.techStack) && p.techStack.length
        ? p.techStack.filter((t) =>
            /^(javascript|typescript|python|go|rust|java|c#|php|node|node.js|nodejs)/i.test(
              t
            )
          )
        : undefined);

    const softwareRequirements =
      Array.isArray(p.techStack) && p.techStack.length
        ? p.techStack
        : undefined;

    const datePublished = p.datePublished ?? p.publishedAt ?? undefined;

    const image = p.banner ?? p.image ?? undefined;

    const sameAs = [
      ...(p.repo ? [p.repo] : p.repoUrl ? [p.repoUrl] : []),
      ...(p.liveLink ? [p.liveLink] : p.url ? [p.url] : []),
    ].filter(Boolean);

    const maybeRating =
      p.rating && typeof p.rating.value === "number"
        ? {
            "@type": "AggregateRating",
            ratingValue: p.rating.value,
            reviewCount: p.rating.count ?? undefined,
            bestRating: p.rating.best ?? undefined,
            worstRating: p.rating.worst ?? undefined,
          }
        : undefined;

    // Core software application object
    const softwareApp = cleanObject({
      "@type": "SoftwareApplication",
      "@id": projectId,
      name: title,
      url,
      description: p.short ?? p.description ?? undefined,
      applicationCategory: category,
      operatingSystem: "Web",
      programmingLanguage: languages,
      softwareRequirements,
      author: { "@id": PERSON_ID },
      sameAs: sameAs.length ? sameAs : undefined,
      datePublished,
      image,
      aggregateRating: maybeRating,
    });

    // Optional SoftwareSourceCode entry if a repo exists
    const codeEntry = sameAs.length
      ? cleanObject({
          "@type": "SoftwareSourceCode",
          "@id": `${projectId}#source`,
          name: `${title} — source code`,
          codeRepository: sameAs.filter((u) =>
            /(github|gitlab|bitbucket)/i.test(u)
          ),
          creator: { "@id": PERSON_ID },
        })
      : undefined;

    return { softwareApp, codeEntry };
  });

  // Flatten graph: include both software apps and code entries (omit undefined)
  const graph = [];
  for (const ent of graphEntries) {
    if (ent.softwareApp) graph.push(ent.softwareApp);
    if (ent.codeEntry) graph.push(ent.codeEntry);
  }

  // Build an ItemList referencing the project @ids (helps crawlers find each entry)
  const itemList = cleanObject({
    "@type": "ItemList",
    "@id": `${SITE_URL}/#projects-list`,
    name: "Projects — Wahb Amir",
    url: `${SITE_URL}/#projects`,
    numberOfItems: projects.length,
    itemListElement: projects.map((p) => {
      const title = p.title ?? p.name ?? "Untitled Project";
      const slug = slugify(p.id ?? title);
      return {
        "@type": "ListItem",
        position: (p as any).position ?? undefined,
        item: { "@id": `${SITE_URL}/#project-${slug}` },
      };
    }),
  });

  const jsonLdGraph = cleanObject({
    "@context": "https://schema.org",
    "@graph": [itemList, ...graph],
  });

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
          : projects.map((p) => {
              const dataProjectId =
                p.id ??
                (p.title ?? p.name ?? "")
                  .replace(/\s+/g, "-")
                  .replace(/[^a-zA-Z0-9\-]/g, "")
                  .toLowerCase();

              return (
                <div
                  key={p.id ?? p.title}
                  role="listitem"
                  aria-label={`Project: ${p.title ?? p.name}`}
                  data-project-id={dataProjectId}
                >
                  <ProjectCardSSR project={p} />
                </div>
              );
            })}
      </div>

      {graph.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdGraph),
          }}
        />
      )}
    </section>
  );
}
