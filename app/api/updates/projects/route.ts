import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { Project } from "../../../Component/Project";
const INTERNAL_API_URL = `${process.env.NEXT_PUBLIC_ORIGIN}/api/updates/internal/projects`;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const clientVersion = Number(url.searchParams.get("version")) || 0;

    // Check Redis cache
    const cached = await redis.get("projects:payload");

    if (cached) {
      const payload: Project = JSON.parse(cached);
      if (payload.version === clientVersion) {
        // Client already has latest version
        return NextResponse.json({ version: payload.version, data: null });
      }
      // Return cached payload
      return NextResponse.json(payload);
    }

    // 3️⃣ Cache miss → call internal API
    const internalResp = await fetch(INTERNAL_API_URL, {
      headers: { "x-internal-secret": INTERNAL_API_SECRET! },
    });

    if (!internalResp.ok) {
      throw new Error(`Internal API error: ${internalResp.status}`);
    }

    const payload = await internalResp.json();

    // 4️⃣ Cache in Redis (atomic payload)
    await redis.set("projects:payload", JSON.stringify(payload));

    // 5️⃣ Return payload to frontend
    return NextResponse.json(payload);
  } catch (err) {
    console.error("Public API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
