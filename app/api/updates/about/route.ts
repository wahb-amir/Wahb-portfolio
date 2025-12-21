import { NextResponse } from "next/server";
import redis from "@/lib/redis";
const INTERNAL_API_URL = `${process.env.NEXT_PUBLIC_ORIGIN}/api/updates/about/internal/about`;
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

// Type for your About payload
interface TimelineItemType {
  title: string;
  desc: string;
  _id?: string;
}

interface Stats {
  projectsDeployed: number;
  selfHosted: string;
}

interface AboutContent {
  startDate: string;
  bio: string;
  stats: Stats;
  timeline: TimelineItemType[];
  quickFacts?: string[];
  quote?: string;
}

interface AboutPayload {
  version?: number | null;
  data: AboutContent;
}

export async function GET(req: Request) {
  try {
    // 0️⃣ Ensure secret exists
    if (!INTERNAL_API_SECRET) {
      console.error("Internal API secret is missing!");
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    const url = new URL(req.url);
    const clientVersion = Number(url.searchParams.get("version")) || 0;

    // 1️⃣ Check Redis cache
    const cached = await redis.get("about:payload");
    if (cached) {
      const payload: AboutPayload = JSON.parse(cached);
      if (payload.version === clientVersion) {
        // Client already has latest version
        return NextResponse.json({ version: payload.version, data: null });
      }
      // Return cached payload
      return NextResponse.json(payload);
    }

    const internalResp = await fetch(INTERNAL_API_URL, {
      headers: { "x-internal-secret": INTERNAL_API_SECRET },
    });

    if (!internalResp.ok) {
      throw new Error(`Internal API error: ${internalResp.status}`);
    }

    const payload: AboutPayload = await internalResp.json();

    // 3️⃣ Cache in Redis with TTL (1 hour)
    await redis.set("about:payload", JSON.stringify(payload), "EX", 60 * 60);

    // 4️⃣ Return payload
    return NextResponse.json(payload);
  } catch (err) {
    console.error("Public About API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
