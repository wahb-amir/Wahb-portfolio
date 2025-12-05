import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import AboutVersion from "@/models/AboutMe";
import { clearAboutCache } from "@/lib/redis";

const ALLOWED_ORIGIN = process.env.META_PLATFORM_ORIGIN; // e.g. "https://platform.example.com"

/** Helper: return CORS headers for a given origin (only if it matches allowed origin) */
function corsHeaders(requestOrigin) {
    const headers = {
        // required so caches vary by Origin
        Vary: "Origin",
    };

    if (!requestOrigin || !ALLOWED_ORIGIN) return headers;

    if (requestOrigin === ALLOWED_ORIGIN) {
        Object.assign(headers, {
            "Access-Control-Allow-Origin": requestOrigin,
            "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, x-internal-secret, Authorization",
            // how long preflight can be cached by browser (seconds)
            "Access-Control-Max-Age": "600",
            // expose any headers client JS might need (optional)
            // "Access-Control-Expose-Headers": "X-My-Custom-Header"
        });
    }

    return headers;
}

/**
 * Handle preflight requests
 */
export function OPTIONS(req) {
    const origin = req.headers.get("origin");
    const headers = corsHeaders(origin);
    // 204 No Content for preflight is fine
    return new Response(null, { status: 204, headers });
}

/**
 * Internal GET: return the latest AboutVersion (protected by x-internal-secret)
 */
export async function GET(req) {
    const origin = req.headers.get("origin");
    const headers = corsHeaders(origin);

    try {
        const secret = req.headers.get("x-internal-secret");
        if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
        }

        await connectToDB();

        const latest = await AboutVersion.findOne().sort({ version: -1 });

        if (!latest) {
            return NextResponse.json({ error: "No AboutVersion found" }, { status: 404, headers });
        }
        const payload = {
            version: latest.version,
            data: latest.about,
        };

        return NextResponse.json(payload, { status: 200, headers });
    } catch (err) {
        console.error("Internal GET About API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500, headers });
    }
}

/**
 * Internal PUT: merge provided about data into latest and create a new version.
 */
export async function PUT(req) {
    const origin = req.headers.get("origin");
    const headers = corsHeaders(origin);

    try {
        const secret = req.headers.get("x-internal-secret");
        if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
        }

        const body = await req.json();
        if (!body || typeof body.data !== "object") {
            return NextResponse.json({ error: "Invalid payload — provide `data` object" }, { status: 400, headers });
        }

        await connectToDB();

        const latest = await AboutVersion.findOne().sort({ version: -1 });
        const baseData = latest?.about ? { ...latest.about } : {};
        const newData = { ...baseData, ...body.data };
        const newVersion = (latest?.version ?? 0) + 1;

        const created = await AboutVersion.create({
            version: newVersion,
            about: newData,
        });

        try {
            await clearAboutCache();
        } catch (cacheErr) {
            console.error("Warning: failed to clear about cache after PUT", cacheErr);
        }

        return NextResponse.json({ success: true, version: created.version }, { status: 200, headers });
    } catch (err) {
        console.error("PUT About API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500, headers });
    }
}

/**
 * Internal DELETE: remove specific keys or reset completely.
 */
export async function DELETE(req) {
    const origin = req.headers.get("origin");
    const headers = corsHeaders(origin);

    try {
        const secret = req.headers.get("x-internal-secret");
        if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
        }

        const body = await req.json().catch(() => ({}));

        await connectToDB();

        const latest = await AboutVersion.findOne().sort({ version: -1 });
        if (!latest) {
            return NextResponse.json({ error: "No AboutVersion found" }, { status: 404, headers });
        }

        let newData = latest.about ? { ...latest.about } : {};

        if (Array.isArray(body.keys) && body.keys.length) {
            for (const key of body.keys) {
                delete newData[key];
            }
        } else {
            newData = {};
        }

        const newVersion = (latest?.version ?? 0) + 1;
        const created = await AboutVersion.create({
            version: newVersion,
            about: newData,
        });

        try {
            await clearAboutCache();
        } catch (cacheErr) {
            console.error("Warning: failed to clear about cache after DELETE", cacheErr);
        }

        return NextResponse.json({ success: true, version: created.version }, { status: 200, headers });
    } catch (err) {
        console.error("DELETE About API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500, headers });
    }
}
