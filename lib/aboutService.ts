// // lib/aboutService.ts
// import redis from "@/lib/redis"; 
// import { connectToDB } from "@/lib/db";
// import AboutVersion from "@/models/AboutMe";
// export type AboutPayload = {
//   version: number | null;
//   data: any | null;
// };

// export default async function getLatestAboutPayload(options?: {
//   clientVersion?: number | null;
//   redisKey?: string;
// }): Promise<{ payload: AboutPayload; fromCache: boolean }> {
//   const { clientVersion = null, redisKey = "about:payload" } = options ?? {};

//   // Try Redis first
//   try {
//     const raw = await redis.get(redisKey);
//     if (raw) {
//       const parsed = JSON.parse(raw) as AboutPayload;
//       // If client has same version, return data: null (cheaper to transmit)
//       if (clientVersion != null && parsed.version === clientVersion) {
//         return {
//           payload: { version: parsed.version ?? null, data: null },
//           fromCache: true,
//         };
//       }
//       return {
//         payload: { version: parsed.version ?? null, data: parsed.data ?? {} },
//         fromCache: true,
//       };
//     }
//   } catch (err) {
//     // Non-fatal: log and continue to DB read
//     console.warn("aboutService: redis get failed:", (err as any)?.message ?? err);
//   }

//   // Cache miss -> read from DB
//   try {
//     await connectToDB();
//     const latest = await AboutVersion.findOne().sort({ version: -1 }).lean();
//     const payload: AboutPayload = {
//       version: latest?.version ?? null,
//       data: latest?.about ?? {},
//     };

//     // Write to Redis for next time (best-effort)
//     try {
//       await redis.set(redisKey, JSON.stringify(payload));
//     } catch (err) {
//       console.warn("aboutService: redis set failed:", (err as any)?.message ?? err);
//     }

//     // If client version matches now, return data:null
//     if (clientVersion != null && payload.version === clientVersion) {
//       return {
//         payload: { version: payload.version, data: null },
//         fromCache: false,
//       };
//     }

//     return { payload, fromCache: false };
//   } catch (err) {
//     console.error("aboutService: DB read failed:", err);
//     // Return safe fallback
//     return { payload: { version: null, data: {} }, fromCache: false };
//   }
// }

/**
 * aboutService.ts
 *
 * Static-only version — no Redis, no DB, no async overhead.
 * Data is imported at build time from about.data.json and bundled
 * into the server module. Zero network round-trips on page load.
 *
 * To restore Redis/DB later:
 *   1. Swap this file with the original aboutService.db.ts
 *   2. The AboutPayload type and getLatestAboutPayload signature are
 *      intentionally kept identical so call sites need zero changes.
 */

import about from "@/app/data/about.json";

export type TimelineEntry = {
  title: string;
  desc: string;
};

export type AboutData = {
  bio: string;
  quickFacts: string[];
  timeline: TimelineEntry[];
};

export type AboutPayload = {
  version: number | null;
  data: AboutData | null;
};

/**
 * Returns the full about payload.
 * Async wrapper kept so call sites are forward-compatible with the DB version.
 */
export default async function getLatestAboutPayload(options?: {
  clientVersion?: number | null;
  redisKey?: string; // accepted but ignored — kept for API compatibility
}): Promise<{ payload: AboutPayload; fromCache: boolean }> {
  const { clientVersion = null } = options ?? {};

  const payload: AboutPayload = {
    version: null,             // no versioning in static mode
    data: about as AboutData,
  };

  // Mimic the "client already up-to-date" short-circuit
  if (clientVersion != null) {
    return {
      payload: { version: null, data: null },
      fromCache: true,
    };
  }

  return { payload, fromCache: false };
}

/**
 * Convenience: get the about data directly (for server components
 * that don't need the version/cache metadata).
 *
 * Usage:
 *   import { getAbout } from "@/lib/aboutService";
 *   const about = await getAbout();
 */
export async function getAbout(): Promise<AboutData> {
  return about as AboutData;
}

/**
 * Convenience: get just the timeline entries.
 */
export async function getTimeline(): Promise<TimelineEntry[]> {
  return (about as AboutData).timeline;
}

/**
 * Convenience: get just the quick facts.
 */
export async function getQuickFacts(): Promise<string[]> {
  return (about as AboutData).quickFacts;
}