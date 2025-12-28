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
          )
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

  const rawProjects = (payload.data ?? []) as Project[];

  // Deduplicate projects based on ID or fallback to title/name
  const uniqueProjectsMap = new Map<string, Project>();
  rawProjects.forEach((p) => {
    const key = (p.id || p.title || p.name || JSON.stringify(p)).toString();
    if (key && !uniqueProjectsMap.has(key)) {
      uniqueProjectsMap.set(key, p);
    }
  });
  const projects = Array.from(uniqueProjectsMap.values());

  // Build JSON-LD nodes for each project; ensure unique @id values for schema
  const seenIds = new Set<string>();
  const graphEntries = projects.map((p, idx) => {
    const title = p.title ?? p.name ?? "Untitled Project";
    const slug = slugify(p.id ?? title ?? `project-${idx}`);
    const projectId = `${SITE_URL}/#project-${slug}`;
    // Avoid accidental id collisions
    let uniqueProjectId = projectId;
    let suffix = 1;
    while (seenIds.has(uniqueProjectId)) {
      uniqueProjectId = `${projectId}-${suffix++}`;
    }
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
            /^(javascript|typescript|python|go|rust|java|c#|php|node)/i.test(t)
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
            /(github|gitlab|bitbucket)/i.test(u)
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
        "@id": `${SITE_URL}/#project-${slugify(
          p.id ?? p.title ?? p.name ?? `project-${i}`
        )}`,
      },
    })),
  });

  const jsonLdGraph = cleanObject({
    "@context": "https://schema.org",
    "@graph": [itemList, ...graph],
  });

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

      {/* Responsive grid that will expand to show as many project cards as there are. Uses CSS grid auto-fit for fluid columns. */}
      <div
        id="projects-grid"
        role="list"
        aria-label="Projects grid"
        className="grid gap-8 w-full max-w-6xl px-2 items-start"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
      >
        {projects.length === 0
          ? // Render several skeletons so layout doesn't feel limited to two
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="w-full">
                <article className="rounded-xl overflow-hidden border border-gray-100 bg-white dark:bg-[#071020]/50 dark:border-slate-700 shadow-sm">
                  <div className="w-full h-48 bg-gray-100 dark:bg-slate-800" />
                  <div className="p-4">
                    <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-slate-800 mb-3" />
                    <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-slate-800 mb-3" />
                  </div>
                </article>
              </div>
            ))
          : projects.map((p, i) => (
              <div
                key={slugify(p.id ?? p.title ?? p.name ?? `project-${i}`)}
                role="listitem"
                aria-label={`Project: ${p.title ?? p.name ?? "Untitled"}`}
                data-project-id={slugify(
                  p.id ?? p.title ?? p.name ?? `project-${i}`
                )}
              >
                <ProjectCardSSR project={p} />
              </div>
            ))}
      </div>

      {/* Output JSON-LD only when we have graph data */}
      {graph && graph.length > 0 && jsonLdGraph && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      )}
    </section>
  );
}
