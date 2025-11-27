import redis from "./redis";

const memoryStore = new Map();

function cleanTimestamps(timestamps, windowMs) {
  const now = Date.now();
  return timestamps.filter(ts => ts > now - windowMs);
}

export function createRateLimiter({ points = 10, window = 60 * 1000 } = {}) {
  return {
    async limit(key) {
      const windowMs = window;
      const now = Date.now();

      // Try Redis first
      try {
        if (!redis || !redis.status || redis.status !== "ready") throw new Error("Redis not ready");

        const redisKey = `rl:${key}`;
        const member = `${now}:${Math.random().toString(36).slice(2, 9)}`;

        const pipeline = redis.multi();
        pipeline.zremrangebyscore(redisKey, 0, now - windowMs);
        pipeline.zadd(redisKey, now, member);
        pipeline.zcard(redisKey);
        pipeline.expire(redisKey, Math.ceil(windowMs / 1000));
        const results = await pipeline.exec();

        const count = results?.[2]?.[1] || 0;
        const success = count <= points;
        const remaining = Math.max(0, points - count);

        const earliest = await redis.zrange(redisKey, 0, 0, "WITHSCORES");
        let reset = now + windowMs;
        if (earliest?.length === 2) {
          reset = parseInt(earliest[1], 10) + windowMs;
        }

        return { success, remaining, reset, limit: points };
      } catch (err) {
        console.warn("⚠️ Redis failed, using in-memory rate limiter:", err);

        // Fallback in-memory
        let entry = memoryStore.get(key);
        if (!entry) {
          entry = { timestamps: [] };
        }

        // clean old timestamps
        entry.timestamps = cleanTimestamps(entry.timestamps, windowMs);
        entry.timestamps.push(now);

        const count = entry.timestamps.length;
        const success = count <= points;
        const remaining = Math.max(0, points - count);
        const reset = entry.timestamps[0] + windowMs;

        memoryStore.set(key, entry);

        return { success, remaining, reset, limit: points, fallback: true };
      }
    },
  };
}

// default instance: 10 req / 1 min
export const ratelimit = createRateLimiter({ points: 10, window: 60 * 1000 });
