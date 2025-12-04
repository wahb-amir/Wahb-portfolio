import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import ProjectVersion from "@/models/ProjectVersion";

import { clearProjectCache } from "@/lib/redis"; 


export async function GET(req) {
    try {
        const secret = req.headers.get("x-internal-secret");
        if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();

        const latest = await ProjectVersion.findOne().sort({ version: -1 });

        if (!latest) {
            return NextResponse.json(
                { error: "No project versions found in DB" },
                { status: 404 }
            );
        }

        const payload = {
            version: latest.version,
            data: latest.projects,
        };

        return NextResponse.json(payload, { status: 200 });
    } catch (err) {
        console.error("Internal API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const secret = req.headers.get("x-internal-secret");
        if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        if (!body || (!body.project && !body.projects)) {
            return NextResponse.json(
                { error: "Invalid payload — provide `project` or `projects`" },
                { status: 400 }
            );
        }

        await connectToDB();

        const latest = await ProjectVersion.findOne().sort({ version: -1 });
        const baseProjects = Array.isArray(latest?.projects) ? [...latest.projects] : [];

        // Normalize incoming as array
        const incoming = body.project ? [body.project] : body.projects;

        // helper to match projects (by Mongo _id string, id, or slug)
        const matches = (a, b) => {
            if (!a || !b) return false;
            if (a._id && b._id) {
                try {
                    return a._id.toString() === b._id.toString();
                } catch (e) { }
            }
            if (a.id && b.id) return a.id === b.id;
            if (a.slug && b.slug) return a.slug === b.slug;
            return false;
        };

        for (const inc of incoming) {
            const idx = baseProjects.findIndex(p => matches(p, inc));
            if (idx >= 0) {
                // merge — preserve existing fields unless overwritten
                baseProjects[idx] = { ...baseProjects[idx], ...inc };
            } else {
                // new project
                baseProjects.push(inc);
            }
        }

        const newVersion = (latest?.version ?? 0) + 1;
        const created = await ProjectVersion.create({
            version: newVersion,
            projects: baseProjects,
        });

        // Attempt to clear cache — non-fatal if it fails (we still succeed DB write)
        try {
            await clearProjectCache();
        } catch (cacheErr) {
            console.error("Warning: cache clear failed after PUT:", cacheErr);
        }

        return NextResponse.json(
            { success: true, version: created.version, projectsCount: baseProjects.length },
            { status: 200 }
        );
    } catch (err) {
        console.error("PUT handler error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const secret = req.headers.get("x-internal-secret");
        if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        if (!body) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const { projectId, projectIds, slug, slugs } = body;
        const idsToRemove = [];
        const slugsToRemove = [];

        if (projectId) idsToRemove.push(projectId);
        if (Array.isArray(projectIds)) idsToRemove.push(...projectIds);
        if (slug) slugsToRemove.push(slug);
        if (Array.isArray(slugs)) slugsToRemove.push(...slugs);

        if (idsToRemove.length === 0 && slugsToRemove.length === 0) {
            return NextResponse.json(
                { error: "Provide `projectId`/`projectIds` or `slug`/`slugs` to delete" },
                { status: 400 }
            );
        }

        await connectToDB();

        const latest = await ProjectVersion.findOne().sort({ version: -1 });
        const baseProjects = Array.isArray(latest?.projects) ? [...latest.projects] : [];

        const toKeep = baseProjects.filter((p) => {
            // compare id/_id
            if (idsToRemove.length) {
                const pid = p._id ? p._id.toString() : p.id || null;
                if (pid && idsToRemove.some(r => r.toString() === pid)) return false;
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
                { status: 404 }
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
            { status: 200 }
        );
    } catch (err) {
        console.error("DELETE handler error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
