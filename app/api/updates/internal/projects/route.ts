// route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import ProjectVersion from "@/models/ProjectVersion";
import { clearProjectCache } from "@/lib/redis";

const ALLOWED_ORIGINS = (process.env.META_PLATFORM_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean); // allow comma-separated list in env

const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || "";

/** Normalize origin (return as-is if falsy) */
function normalizeOrigin(o?: string | null) {
  if (!o) return null;
  try {
    // origin header should already be an origin (scheme + host)
    const u = new URL(o);
    return u.origin;
  } catch {
    // if it's already an origin string or malformed, just return trimmed
    return o.trim();
  }
}

/** Helper: return CORS headers for a given origin (only if it matches allowed origin) */
function corsHeaders(requestOrigin?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    Vary: "Origin",
  };

  const origin = normalizeOrigin(requestOrigin);
  if (!origin || ALLOWED_ORIGINS.length === 0) return headers;

  // exact match against allowed list
  if (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes("*")) {
    Object.assign(headers, {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, x-internal-secret, Authorization",
      "Access-Control-Max-Age": "600",
    });
  }
  return headers;
}

/** Timing-safe secret comparison */
function isValidSecret(headerSecret?: string | null): boolean {
  if (!headerSecret) return false;
  if (!INTERNAL_SECRET) return false;
  try {
    const a = Buffer.from(String(headerSecret));
    const b = Buffer.from(String(INTERNAL_SECRET));
    if (a.length !== b.length) return false; // timingSafeEqual throws on different lengths
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Types */
type Matchable = {
  _id?: any;
  id?: string | number;
  slug?: string;
  [k: string]: any;
};

/** Preflight handler */
export function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);
  // some browsers expect 204 with these headers present
  return new Response(null, { status: 204, headers });
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const secret = req.headers.get("x-internal-secret");
    if (!isValidSecret(secret)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers }
      );
    }

    await connectToDB();

    // lean() to return plain object (faster, no mongoose doc methods)
    const latest = await ProjectVersion.findOne().sort({ version: -1 }).lean();

    if (!latest) {
      return NextResponse.json(
        { error: "No project versions found in DB" },
        { status: 404, headers }
      );
    }

    const payload = {
      version: latest.version,
      data: latest.projects ?? [],
    };

    return NextResponse.json(payload, { status: 200, headers });
  } catch (err) {
    console.error("Internal API error (GET):", err);
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
    if (!isValidSecret(secret)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || (!body.project && !body.projects)) {
      return NextResponse.json(
        { error: "Invalid payload — provide `project` or `projects`" },
        { status: 400, headers }
      );
    }

    await connectToDB();

    const latest = await ProjectVersion.findOne().sort({ version: -1 }).lean();
    const baseProjects: any[] = Array.isArray(latest?.projects)
      ? [...latest!.projects]
      : [];

    const incoming = body.project
      ? [body.project]
      : Array.isArray(body.projects)
      ? body.projects
      : [];

    // helper: check equal by _id/id/slug (string compare)
    const areProjectsEqual = (a: Matchable, b: Matchable): boolean => {
      if (!a || !b) return false;
      if (a._id != null && b._id != null) {
        try {
          return String(a._id) === String(b._id);
        } catch {
          return false;
        }
      }
      if (a.id != null && b.id != null) return String(a.id) === String(b.id);
      if (a.slug && b.slug) return String(a.slug) === String(b.slug);
      return false;
    };

    // merge incoming into baseProjects
    for (const inc of incoming) {
      const idx = baseProjects.findIndex((bp) => areProjectsEqual(bp, inc));
      if (idx >= 0) {
        baseProjects[idx] = { ...baseProjects[idx], ...inc };
      } else {
        baseProjects.push(inc);
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
    if (!isValidSecret(secret)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400, headers }
      );
    }

    const { projectId, projectIds, slug, slugs } = body;
    const idsToRemove: string[] = [];
    const slugsToRemove: string[] = [];

    if (projectId != null) idsToRemove.push(String(projectId));
    if (Array.isArray(projectIds))
      idsToRemove.push(...projectIds.map((i) => String(i)));
    if (slug != null) slugsToRemove.push(String(slug));
    if (Array.isArray(slugs))
      slugsToRemove.push(...slugs.map((s) => String(s)));

    if (idsToRemove.length === 0 && slugsToRemove.length === 0) {
      return NextResponse.json(
        {
          error: "Provide `projectId`/`projectIds` or `slug`/`slugs` to delete",
        },
        { status: 400, headers }
      );
    }

    await connectToDB();
    const latest = await ProjectVersion.findOne().sort({ version: -1 }).lean();
    const baseProjects: any[] = Array.isArray(latest?.projects)
      ? [...latest!.projects]
      : [];

    const idSet = new Set(idsToRemove.map((s) => String(s)));
    const slugSet = new Set(slugsToRemove.map((s) => String(s)));

    const toKeep = baseProjects.filter((p) => {
      // id/_id check
      const pid = p._id ? String(p._id) : p.id != null ? String(p.id) : null;
      if (pid && idSet.has(pid)) return false;
      // slug check
      if (p.slug && slugSet.has(String(p.slug))) return false;
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
