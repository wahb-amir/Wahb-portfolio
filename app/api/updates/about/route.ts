// app/api/updates/about/route.ts  (or wherever your public route lives)
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import getAboutPayload from "@/lib/aboutService";

const REDIS_KEY = "about:payload";

export async function GET(req: Request) {
  try {
    // try cached payload in redis
    const cached = await redis.get(REDIS_KEY);
    if (cached) {
      const payload = JSON.parse(cached);
      // If client requested a version, return {version, data: null} when up-to-date
      const url = new URL(req.url);
      const clientVersion = Number(url.searchParams.get("version")) || 0;
      if (payload.version === clientVersion) {
        return NextResponse.json({ version: payload.version, data: null });
      }
      return NextResponse.json(payload);
    }

    // cache miss -> read from DB directly (no fetch loop)
    const payload = await getAboutPayload();
    if (!payload) {
      return NextResponse.json(
        { error: "No About payload found" },
        { status: 404 }
      );
    }

    // persist to redis (TTL 1h)
    await redis.set(REDIS_KEY, JSON.stringify(payload), "EX", 60 * 60);

    return NextResponse.json(payload);
  } catch (err) {
    console.error("Public About API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
