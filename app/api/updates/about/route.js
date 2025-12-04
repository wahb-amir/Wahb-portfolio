import { NextResponse } from "next/server";
import redis from "@/lib/redis";

const INTERNAL_API_URL = `${process.env.NEXT_PUBLIC_ORIGIN}/api/updates/about/internal/about`;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const clientVersion = Number(url.searchParams.get("version")) || 0;

        // 1️⃣ Check Redis cache first
        const cached = await redis.get("about:payload");
        if (cached) {
            const payload = JSON.parse(cached);
            if (payload.version === clientVersion) {
                // Client already has latest version
                return NextResponse.json({ version: payload.version, data: null });
            }
            // Return cached payload
            return NextResponse.json(payload);
        }

        // 2️⃣ Cache miss → call internal API
        const internalResp = await fetch(INTERNAL_API_URL, {
            headers: { "x-internal-secret": INTERNAL_API_SECRET },
        });

        if (!internalResp.ok) {
            throw new Error(`Internal API failed: ${internalResp.status}`);
        }

        const payload = await internalResp.json();

        // 3️⃣ Cache in Redis
        await redis.set("about:payload", JSON.stringify(payload));

        // 4️⃣ Return payload
        return NextResponse.json(payload);
    } catch (err) {
        console.error("Public About API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
