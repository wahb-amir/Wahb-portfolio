// app/projects/[id]/page.tsx — Individual project page
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProjectCardSSR from "@/app/Component/projects/ProjectCardSSR";
import { getLatestProjectsPayload } from "@/lib/projectsService";
import type { Metadata } from "next";

type Props = {
  params: { id: string };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
  return projects.find((p) => slugify(p.id ?? p.title ?? p.name) === id) ?? null;
}

// ─── Static params — pre-render all project slugs at build time ───────────────
export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({
    id: slugify(p.id ?? p.title ?? p.name),
  }));
}

// ─── Per-page metadata — unique title/description for each project ────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.id);

  if (!project) {
    return {
      title: "Project Not Found — Wahb Amir",
    };
  }

  const title = project.title ?? project.name ?? "Project";
  const description =
    project.caseStudy?.tlDr ??
    project.short ??
    project.description ??
    `${title} — a project by Wahb Amir`;

  const badge = project.badge?.label ? ` · ${project.badge.label}` : "";

  return {
    title: `${title}${badge} — Wahb Amir`,
    description,
    openGraph: {
      title: `${title} — Wahb Amir`,
      description,
      url: `https://wahb.space/projects/${params.id}`,
      images: project.images?.[0]
        ? [{ url: `https://wahb.space${project.images[0]}` }]
        : [],
    },
    alternates: {
      canonical: `https://wahb.space/projects/${params.id}`,
    },
  };
}

// ─── JSON-LD for this specific project ───────────────────────────────────────
function ProjectJsonLd({ project, id }: { project: any; id: string }) {
  const title = project.title ?? project.name ?? "Project";
  const url = project.liveLink ?? project.url ?? `https://wahb.space/projects/${id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `https://wahb.space/projects/${id}#app`,
        name: title,
        url,
        description:
          project.caseStudy?.tlDr ?? project.short ?? project.description,
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
        ...(project.badge?.label && {
          award: project.badge.label,
        }),
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
  const project = await getProject(params.id);

  if (!project) notFound();

  const title = project.title ?? project.name ?? "Project";
  const allProjects = await getAllProjects();
  const currentIndex = allProjects.findIndex(
    (p) => slugify(p.id ?? p.title ?? p.name) === params.id,
  );
  const prev = allProjects[currentIndex - 1] ?? null;
  const next = allProjects[currentIndex + 1] ?? null;

  return (
    <>
      <style>{`
        .project-page-bg {
          background: linear-gradient(to bottom, #f0f9ff, #ffffff);
        }
        .dark .project-page-bg {
          background: linear-gradient(to bottom, #0b1220, #0d1627);
        }
        @keyframes ps-card-enter {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ps-card-enter {
          animation: ps-card-enter 0.45s ease both;
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
        }
      `}</style>

      <ProjectJsonLd project={project} id={params.id} />

      <main className="project-page-bg min-h-screen flex flex-col items-center px-4 xs:px-6 pb-24 pt-16 text-black dark:text-white">

        {/* ── Breadcrumb ── */}
        <nav
          aria-label="Breadcrumb"
          className="w-full max-w-2xl mx-auto mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400"
        >
          <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/projects" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            Projects
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-[160px]">
            {title}
          </span>
        </nav>

        {/* ── Card — reuses the same ProjectCardSSR ── */}
        <div className="w-full max-w-2xl mx-auto ps-card-enter">
          <ProjectCardSSR project={project} />
        </div>

        {/* ── Prev / Next navigation ── */}
        {(prev || next) && (
          <nav
            aria-label="Project navigation"
            className="w-full max-w-2xl mx-auto mt-10 flex items-center justify-between gap-4"
          >
            {prev ? (
              <Link
                href={`/projects/${slugify(prev.id ?? prev.title ?? prev.name)}`}
                className="group inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true">
                  <path fillRule="evenodd" d="M9.78 3.22a.75.75 0 0 1 0 1.06L6.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                </svg>
                <span className="truncate max-w-[140px]">{prev.title ?? prev.name}</span>
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link
                href={`/projects/${slugify(next.id ?? next.title ?? next.name)}`}
                className="group inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors ml-auto"
              >
                <span className="truncate max-w-[140px]">{next.title ?? next.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                  <path fillRule="evenodd" d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}

        {/* ── Back to all projects ── */}
        <div className="mt-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
              <path fillRule="evenodd" d="M9.78 3.22a.75.75 0 0 1 0 1.06L6.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
            </svg>
            All projects
          </Link>
        </div>
      </main>
    </>
  );
}