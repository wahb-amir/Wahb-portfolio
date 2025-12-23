// lib/projectsService.ts
import redis from "@/lib/redis"; // server-only ioredis client
import { connectToDB } from "@/lib/db";
import ProjectVersion from "@/models/ProjectVersion";

export type ProjectsPayload = {
  version: number | null;
  data: any[] | null;
};

// Return shape: { payload, fromCache }
// If clientVersion passed and equals cache version, payload.data === null (client is up-to-date)
export async function getLatestProjectsPayload(options?: {
  clientVersion?: number | null;
  redisKey?: string;
}): Promise<{ payload: ProjectsPayload; fromCache: boolean }> {
  const { clientVersion = null, redisKey = "projects:payload" } = options ?? {};

  // Try Redis first
  try {
    const raw = await redis.get(redisKey);
    if (raw) {
      const parsed = JSON.parse(raw) as ProjectsPayload;
      // If client has same version, return data: null (cheaper to transmit)
      if (clientVersion != null && parsed.version === clientVersion) {
        return {
          payload: { version: parsed.version ?? null, data: null },
          fromCache: true,
        };
      }
      return {
        payload: { version: parsed.version ?? null, data: parsed.data ?? [] },
        fromCache: true,
      };
    }
  } catch (err) {
    // Non-fatal: log and continue to DB read
    console.warn(
      "projectsService: redis get failed:",
      (err as any)?.message ?? err
    );
  }


  try {
    await connectToDB();
    const latest = await ProjectVersion.findOne().sort({ version: -1 }).lean();
    const payload: ProjectsPayload = {
      version: latest?.version ?? null,
      data: latest?.projects ?? [],
    };

    // Write to Redis for next time (best-effort)
    try {
      await redis.set(redisKey, JSON.stringify(payload));
    } catch (err) {
      console.warn(
        "projectsService: redis set failed:",
        (err as any)?.message ?? err
      );
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
    console.error("projectsService: DB read failed:", err);
    // Return safe fallback
    return { payload: { version: null, data: [] }, fromCache: false };
  }
}
