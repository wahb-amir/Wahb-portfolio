// app/components/Project.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { createRoot, Root } from "react-dom/client";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

const ImageSlider = dynamic(() => import("./ImageSlider"), {
  ssr: false,
  loading: () => null,
});

// IDB constants (same as your original)
const DB_NAME = "wahb-projects-db";
const STORE_NAME = "projects";
const CACHE_KEY = "project-detail";
const PREVIEW_COUNT = 4;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e: any) => {
      const db = e.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = (e: any) => resolve(e.target.result as IDBDatabase);
    req.onerror = (e: any) => reject(e.target.error);
  });
}

async function getCached(): Promise<{
  version: string | null;
  data: any[] | null;
} | null> {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const r = store.get(CACHE_KEY);
      r.onsuccess = () => resolve((r.result as any) ?? null);
      r.onerror = (e: any) => reject(e.target.error);
    });
  } catch (err) {
    console.warn("IDB get error:", err);
    return null;
  }
}

async function setCached(payload: {
  version: string | null;
  data: any[] | null;
}) {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const r = store.put(payload, CACHE_KEY);
      r.onsuccess = () => resolve(true);
      r.onerror = (e: any) => reject(e.target.error);
    });
  } catch (err) {
    console.warn("IDB put error:", err);
    return false;
  }
}

type CachedPayload = { version: string | null; data: any[] | null };

/**
 * Client-side lightweight card component used when we render the whole grid on client
 * It matches SSR markup & tailwind classes so styling remains identical.
 * Uses ImageSlider (client-only) for images.
 */
function ClientCard({ p }: { p: any }) {
  const title = p.title ?? p.name ?? "Untitled Project";
  const role = p.role ?? "Contributor";
  const images = Array.isArray(p.images) ? p.images : [];
  const tech = Array.isArray(p.tech) ? p.tech : [];
  const short = p.short ?? p.description ?? "";
  const liveLink = p.liveLink ?? p.url ?? null;
  const githubLink = p.githubLink ?? null;
  const stats = p.stats ?? {};
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
      data-project-id={p.id ?? safeId}
    >
      <div className="w-full h-48 md:h-56 bg-gray-50 dark:bg-slate-900">
        {images && images.length > 0 ? (
          // @ts-ignore - ImageSlider accepts images: string[]
          <ImageSlider images={images} />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-slate-800" />
        )}
      </div>

      <div className="p-4 sm:p-6 flex flex-col flex-1 min-w-0">
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
              {tech.slice(0, 6).map((t: string) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 truncate border-2 border-cyan-500/50 dark:border-cyan-400/40 shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {short && (
          <div className="mb-4 mt-4">
            <div className="inline-flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-900">
              <p className="m-0 text-sm font-medium text-blue-700 dark:text-cyan-200 max-w-prose">
                {short}
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-auto">
          <div className="flex gap-3">
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-cyan-700 text-white text-sm font-medium hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                aria-label={`Open live demo of ${title}`}
              >
                Live Demo
              </a>
            )}

            {repoLinks.length === 1 && (
              <a
                href={repoLinks[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm font-medium"
                aria-label={`Open GitHub repo of ${title}`}
              >
                Code
              </a>
            )}

            {repoLinks.length > 1 && (
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-sm font-medium">
                <span>Code:</span>
                <ul className="ml-2 list-inside list-disc">
                  {repoLinks.map((r, i) => (
                    <li key={i}>
                      <a
                        href={r}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm"
                      >
                        {r}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="text-sm font-semibold text-cyan-700 dark:text-cyan-400 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded">
              View case study
            </button>
          </div>
        </div>

        {stats && Object.keys(stats).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(stats).map(([k, v]) => (
              <span
                key={k}
                className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200"
              >
                <strong className="mr-1">{k}:</strong>
                {String(v)}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Project({
  serverPayload,
}: {
  serverPayload?: CachedPayload | null;
}) {
  const [mounted, setMounted] = useState(false);
  const rootsRef = useRef<Map<string, Root>>(new Map());
  const clientRootRef = useRef<Root | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Enhancement + caching logic
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const serverVersion = serverPayload?.version ?? null;
      const serverData = serverPayload?.data ?? null;

      // 1) Check IDB cache
      const cached = await getCached();

      // If client has a newer/different version, prefer cached and client-render entire grid
      if (
        cached &&
        cached.data &&
        cached.version &&
        cached.version !== serverVersion
      ) {
        // Replace server-rendered grid with client-rendered grid using React (instant)
        const container = document.getElementById("projects-grid");
        if (container && !cancelled) {
          // unmount any previous client root
          try {
            if (clientRootRef.current) {
              clientRootRef.current.unmount();
              clientRootRef.current = null;
            }
          } catch (e) {}

          const root = createRoot(container);
          clientRootRef.current = root;

          root.render(
            <div
              id="projects-grid-client"
              className="grid screen-min-850:grid-cols-2 screen-max-850:grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl px-2 items-start"
            >
              {cached.data.map((p: any) => (
                <div
                  key={p.id ?? p.title}
                  role="listitem"
                  aria-label={`Project: ${p.title}`}
                >
                  <ClientCard p={p} />
                </div>
              ))}
            </div>
          );

          // we're done — do not continue to SSR DOM enhancement
          return;
        }
      }

      // 2) If no client replacement, enhance SSR DOM: mount sliders and apply theme class
      if (serverData && Array.isArray(serverData) && serverData.length > 0) {
        // persist server payload to IDB if client doesn't have it
        if (!cached || !cached.data) {
          await setCached({ version: serverVersion ?? null, data: serverData });
        }

        // Enhance each server-rendered card
        const isDark =
          typeof document !== "undefined" &&
          document.documentElement.classList.contains("dark");

        serverData.forEach((p: any) => {
          const id =
            p.id ??
            (p.title || p.name || "")
              .replace(/\s+/g, "-")
              .replace(/[^a-zA-Z0-9\-]/g, "")
              .toLowerCase();
          const article = document.querySelector<HTMLElement>(
            `[data-project-id="${id}"]`
          );
          if (!article) return;

          // apply theme helper class to match client's theme (prevents flash)
          if (isDark) article.classList.add("project-theme-dark");
          else article.classList.remove("project-theme-dark");

          // mount ImageSlider into the .project-image-slot if images exist
          if (Array.isArray(p.images) && p.images.length > 0) {
            const slot = article.querySelector<HTMLElement>(
              ".project-image-slot"
            );
            if (slot && !rootsRef.current.has(id)) {
              const root = createRoot(slot);
              // @ts-ignore - dynamic component is fine to render
              root.render(<ImageSlider images={p.images} />);
              rootsRef.current.set(id, root);
            }
          }
        });
      } else {
        // No server data — fallback: fetch client-side (keeps your UX)
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_ORIGIN}/api/projects`
          );
          const data = await res.json();
          if (!cancelled) {
            // replace grid with client rendering
            const container = document.getElementById("projects-grid");
            if (container) {
              if (clientRootRef.current) {
                clientRootRef.current.unmount();
                clientRootRef.current = null;
              }
              const root = createRoot(container);
              clientRootRef.current = root;

              root.render(
                <div
                  id="projects-grid-client"
                  className="grid screen-min-850:grid-cols-2 screen-max-850:grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl px-2 items-start"
                >
                  {data.map((p: any) => (
                    <div
                      key={p.id ?? p.title}
                      role="listitem"
                      aria-label={`Project: ${p.title}`}
                    >
                      <ClientCard p={p} />
                    </div>
                  ))}
                </div>
              );
            }
          }
        } catch (err) {
          console.warn("ProjectClient fetch failed:", err);
        }
      }
    })();

    return () => {
      // cleanup mounted ImageSlider roots
      try {
        rootsRef.current.forEach((r) => {
          try {
            r.unmount();
          } catch {}
        });
        rootsRef.current.clear();
      } catch {}
    };
  }, [serverPayload]);

  // The client enhancer doesn't render the grid itself when server has rendered it.
  // We return a small invisible anchor so this component exists in the tree (and to keep accessibility of aria-hidden)
  return <div aria-hidden={!mounted} />;
}
