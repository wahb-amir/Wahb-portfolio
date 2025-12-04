import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import AboutVersion from "@/models/AboutVersion";
import { redis ,clearAboutCache} from "@/lib/redis"; // adjust import based on your setup

/**
 * Helper to clear Redis cache for About Me
 */
async function clearAboutCache() {
    try {
        await redis.del("about:payload");
    } catch (err) {
        console.error("Warning: failed to clear About Me cache", err);
    }
}

// ---------------- GET (latest About Me for internal use) ----------------
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
            data: latest.data,
        };

        return NextResponse.json(payload, { status: 200 });
    } catch (err) {
        console.error("Internal GET About API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// ---------------- PUT (create/update About Me) ----------------
export async function PUT(req) {
    try {
        const secret = req.headers.get("x-internal-secret");
        if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        if (!body || !body.data) {
            return NextResponse.json({ error: "Invalid payload — provide `data` object" }, { status: 400 });
        }

        await connectToDB();

        const latest = await AboutVersion.findOne().sort({ version: -1 });
        const baseData = latest?.data ? { ...latest.data } : {};

        // Merge incoming data — preserve fields unless overwritten
        const newData = { ...baseData, ...body.data };
        const newVersion = (latest?.version ?? 0) + 1;

        const created = await AboutVersion.create({
            version: newVersion,
            data: newData,
        });

        await clearAboutCache();

        return NextResponse.json(
            { success: true, version: created.version },
            { status: 200 }
        );
    } catch (err) {
        console.error("PUT About API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// ---------------- DELETE (reset About Me or remove specific keys) ----------------
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

        await connectToDB();

        const latest = await AboutVersion.findOne().sort({ version: -1 });
        if (!latest) {
            return NextResponse.json({ error: "No AboutVersion found" }, { status: 404 });
        }

        let newData = { ...latest.data };

        // If keys array is provided, remove only those keys
        if (Array.isArray(body.keys)) {
            body.keys.forEach((key) => delete newData[key]);
        } else {
            // Otherwise, reset everything
            newData = {};
        }

        const newVersion = (latest?.version ?? 0) + 1;
        const created = await AboutVersion.create({
            version: newVersion,
            data: newData,
        });

        await clearAboutCache();

        return NextResponse.json(
            { success: true, version: created.version },
            { status: 200 }
        );
    } catch (err) {
        console.error("DELETE About API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
