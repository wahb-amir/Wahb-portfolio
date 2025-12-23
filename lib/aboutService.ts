// lib/aboutService.ts
import redis from "@/lib/redis"; 
import { connectToDB } from "@/lib/db";
import AboutVersion from "@/models/AboutMe";
export type AboutPayload = {
  version: number | null;
  data: any | null;
};

export default async function getLatestAboutPayload(options?: {
  clientVersion?: number | null;
  redisKey?: string;
}): Promise<{ payload: AboutPayload; fromCache: boolean }> {
  const { clientVersion = null, redisKey = "about:payload" } = options ?? {};

  // Try Redis first
  try {
    const raw = await redis.get(redisKey);
    if (raw) {
      const parsed = JSON.parse(raw) as AboutPayload;
      // If client has same version, return data: null (cheaper to transmit)
      if (clientVersion != null && parsed.version === clientVersion) {
        return {
          payload: { version: parsed.version ?? null, data: null },
          fromCache: true,
        };
      }
      return {
        payload: { version: parsed.version ?? null, data: parsed.data ?? {} },
        fromCache: true,
      };
    }
  } catch (err) {
    // Non-fatal: log and continue to DB read
    console.warn("aboutService: redis get failed:", (err as any)?.message ?? err);
  }

  // Cache miss -> read from DB
  try {
    await connectToDB();
    const latest = await AboutVersion.findOne().sort({ version: -1 }).lean();
    const payload: AboutPayload = {
      version: latest?.version ?? null,
      data: latest?.about ?? {},
    };

    // Write to Redis for next time (best-effort)
    try {
      await redis.set(redisKey, JSON.stringify(payload));
    } catch (err) {
      console.warn("aboutService: redis set failed:", (err as any)?.message ?? err);
    }

    // If client version matches now, return data:null
    if (clientVersion != null && payload.version === clientVersion) {
      return {
        payload: { version: payload.version, data: null },
        fromCache: false,
      };
    }

    return { payload, fromCache: false };
  } catch (err) {
    console.error("aboutService: DB read failed:", err);
    // Return safe fallback
    return { payload: { version: null, data: {} }, fromCache: false };
  }
}
