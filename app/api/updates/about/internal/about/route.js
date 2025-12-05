import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import AboutVersion from "@/models/AboutMe";
import { clearAboutCache } from "@/lib/redis";

/**
 * Internal GET: return the latest AboutVersion (protected by x-internal-secret)
 */
export async function GET(req) {
    try {
        const secret = req.headers.get("x-internal-secret");
        if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();

        const latest = await AboutVersion.findOne().sort({ version: -1 });

        if (!latest) {
            return NextResponse.json({ error: "No AboutVersion found" }, { status: 404 });
        }
        const payload = {
            version: latest.version,
            data: latest.about, // about is the field in the schema
        };

        return NextResponse.json(payload, { status: 200 });
    } catch (err) {
        console.error("Internal GET About API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * Internal PUT: merge provided about data into latest and create a new version.
 * Expect body: { data: { bio: "...", timeline: [...], stats: {...}, ... } }
 */
export async function PUT(req) {
    try {
        const secret = req.headers.get("x-internal-secret");
        if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        if (!body || typeof body.data !== "object") {
            return NextResponse.json({ error: "Invalid payload — provide `data` object" }, { status: 400 });
        }

        await connectToDB();

        const latest = await AboutVersion.findOne().sort({ version: -1 });

        // baseData comes from latest.about (not latest.data)
        const baseData = latest?.about ? { ...latest.about } : {};

        // shallow merge: preserve existing fields unless overwritten
        const newData = { ...baseData, ...body.data };

        const newVersion = (latest?.version ?? 0) + 1;

        const created = await AboutVersion.create({
            version: newVersion,
            about: newData,
        });

        // clear only the about cache
        try {
            await clearAboutCache();
        } catch (cacheErr) {
            console.error("Warning: failed to clear about cache after PUT", cacheErr);
        }

        return NextResponse.json({ success: true, version: created.version }, { status: 200 });
    } catch (err) {
        console.error("PUT About API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

/**
 * Internal DELETE: either remove specific keys from about object, or reset it completely.
 * Expect body: { keys: ["timeline","bio"] }  OR empty body to reset.
 */
export async function DELETE(req) {
    try {
        const secret = req.headers.get("x-internal-secret");
        if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json().catch(() => ({})); // tolerate empty body

        await connectToDB();

        const latest = await AboutVersion.findOne().sort({ version: -1 });
        if (!latest) {
            return NextResponse.json({ error: "No AboutVersion found" }, { status: 404 });
        }

        // operate on latest.about
        let newData = latest.about ? { ...latest.about } : {};

        if (Array.isArray(body.keys) && body.keys.length) {
            // remove only specified keys
            for (const key of body.keys) {
                delete newData[key];
            }
        } else {
            // reset everything
            newData = {};
        }

        const newVersion = (latest?.version ?? 0) + 1;
        const created = await AboutVersion.create({
            version: newVersion,
            about: newData,
        });

        // clear only the about cache
        try {
            await clearAboutCache();
        } catch (cacheErr) {
            console.error("Warning: failed to clear about cache after DELETE", cacheErr);
        }

        return NextResponse.json({ success: true, version: created.version }, { status: 200 });
    } catch (err) {
        console.error("DELETE About API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
