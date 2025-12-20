import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import ProjectVersion from "@/models/ProjectVersion";
import { clearProjectCache } from "@/lib/redis";

const ALLOWED_ORIGIN = process.env.META_PLATFORM_ORIGIN; // e.g. "https://platform.example.com"

/** Helper: return CORS headers for a given origin (only if it matches allowed origin) */
function corsHeaders(
  requestOrigin: string | null | undefined
): Record<string, string> {
  const headers = {
    Vary: "Origin",
  };

  if (!requestOrigin || !ALLOWED_ORIGIN) return headers;

  if (requestOrigin === ALLOWED_ORIGIN) {
    Object.assign(headers, {
      "Access-Control-Allow-Origin": requestOrigin,
      "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, x-internal-secret, Authorization",
      "Access-Control-Max-Age": "600",
      // "Access-Control-Expose-Headers": "X-My-Custom-Header" // uncomment if needed
    });
  }

  return headers;
}

/** Preflight handler */
export function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);
  return new Response(null, { status: 204, headers });
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const secret = req.headers.get("x-internal-secret");
    if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers }
      );
    }

    await connectToDB();

    const latest = await ProjectVersion.findOne().sort({ version: -1 });

    if (!latest) {
      return NextResponse.json(
        { error: "No project versions found in DB" },
        { status: 404, headers }
      );
    }

    const payload = {
      version: latest.version,
      data: latest.projects,
    };

    return NextResponse.json(payload, { status: 200, headers });
  } catch (err) {
    console.error("Internal API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers }
    );
  }
}

export async function PUT(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const secret = req.headers.get("x-internal-secret");
    if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers }
      );
    }

    const body = await req.json();
    if (!body || (!body.project && !body.projects)) {
      return NextResponse.json(
        { error: "Invalid payload — provide `project` or `projects`" },
        { status: 400, headers }
      );
    }

    await connectToDB();

    const latest = await ProjectVersion.findOne().sort({ version: -1 });
    const baseProjects = Array.isArray(latest?.projects)
      ? [...latest.projects]
      : [];

    // Normalize incoming as array
    const incoming = body.project ? [body.project] : body.projects;

    // helper to match projects (by Mongo _id string, id, or slug)
    // Define a type for objects we’re matching
    interface Matchable {
      _id?: string | number;
      id?: string | number;
      slug?: string;
      [key: string]: any; // allow extra fields
    }

    // Function to check if two items are the same
    const areProjectsEqual = (
      projectA: Matchable,
      projectB: Matchable
    ): boolean => {
      if (!projectA || !projectB) return false;

      if (projectA._id && projectB._id) {
        try {
          return projectA._id.toString() === projectB._id.toString();
        } catch {
          return false;
        }
      }

      if (projectA.id && projectB.id) return projectA.id === projectB.id;
      if (projectA.slug && projectB.slug)
        return projectA.slug === projectB.slug;

      return false;
    };

    // Merge incoming projects into existing base projects
    for (const incomingProject of incoming) {
      const existingIndex = baseProjects.findIndex((baseProject) =>
        areProjectsEqual(baseProject, incomingProject)
      );

      if (existingIndex >= 0) {
        // merge — preserve existing fields unless overwritten
        baseProjects[existingIndex] = {
          ...baseProjects[existingIndex],
          ...incomingProject,
        };
      } else {
        // new project
        baseProjects.push(incomingProject);
      }
    }

    const newVersion = (latest?.version ?? 0) + 1;
    const created = await ProjectVersion.create({
      version: newVersion,
      projects: baseProjects,
    });

    try {
      await clearProjectCache();
    } catch (cacheErr) {
      console.error("Warning: cache clear failed after PUT:", cacheErr);
    }

    return NextResponse.json(
      {
        success: true,
        version: created.version,
        projectsCount: baseProjects.length,
      },
      { status: 200, headers }
    );
  } catch (err) {
    console.error("PUT handler error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers }
    );
  }
}

export async function DELETE(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const secret = req.headers.get("x-internal-secret");
    if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers }
      );
    }

    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400, headers }
      );
    }

    const { projectId, projectIds, slug, slugs } = body;
    const idsToRemove: Array<number | string> = [];
    const slugsToRemove: Array<string | number> = [];

    if (projectId) idsToRemove.push(projectId);
    if (Array.isArray(projectIds)) idsToRemove.push(...projectIds);
    if (slug) slugsToRemove.push(slug);
    if (Array.isArray(slugs)) slugsToRemove.push(...slugs);

    if (idsToRemove.length === 0 && slugsToRemove.length === 0) {
      return NextResponse.json(
        {
          error: "Provide `projectId`/`projectIds` or `slug`/`slugs` to delete",
        },
        { status: 400, headers }
      );
    }

    await connectToDB();

    const latest = await ProjectVersion.findOne().sort({ version: -1 });
    const baseProjects = Array.isArray(latest?.projects)
      ? [...latest.projects]
      : [];

    const toKeep = baseProjects.filter((p) => {
      // compare id/_id
      if (idsToRemove.length) {
        const pid = p._id ? p._id.toString() : p.id || null;
        if (pid && idsToRemove.some((r) => r.toString() === pid)) return false;
      }
      // compare slug
      if (slugsToRemove.length && p.slug) {
        if (slugsToRemove.includes(p.slug)) return false;
      }
      return true;
    });

    if (toKeep.length === baseProjects.length) {
      return NextResponse.json(
        { error: "No matching projects found to delete" },
        { status: 404, headers }
      );
    }

    const newVersion = (latest?.version ?? 0) + 1;
    const created = await ProjectVersion.create({
      version: newVersion,
      projects: toKeep,
    });

    try {
      await clearProjectCache();
    } catch (cacheErr) {
      console.error("Warning: cache clear failed after DELETE:", cacheErr);
    }

    return NextResponse.json(
      { success: true, version: created.version, projectsCount: toKeep.length },
      { status: 200, headers }
    );
  } catch (err) {
    console.error("DELETE handler error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers }
    );
  }
}
