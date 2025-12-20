import Redis from "ioredis";

// Extend the Node.js global type to include 'redis'
declare global {
  var redis: Redis | undefined;
}

// Use the global redis instance if it exists
let redisInstance: Redis;

if (!global.redis) {
  const redisUrl = process.env.REDIS_URL!;
  global.redis = new Redis(redisUrl);
  global.redis.on("connect", () => console.log("Redis connected"));
  global.redis.on("error", (err) =>
    console.error(`Redis error: ${redisUrl}`, err)
  );
}

redisInstance = global.redis;

export async function clearProjectCache(redisClient = redisInstance) {
  try {
    const deleted = await redisClient.del("projects:payload");
    return {
      success: true,
      message: deleted
        ? "Project cache cleared successfully."
        : "Project cache key did not exist.",
    };
  } catch (err) {
    console.error("Error clearing project cache:", err);
    return { success: false, message: "Internal server error" };
  }
}

export async function clearAboutCache(redisClient = redisInstance) {
  try {
    const deleted = await redisClient.del("about:payload");
    return {
      success: true,
      message: deleted
        ? "About Me cache cleared successfully."
        : "About Me cache key did not exist.",
    };
  } catch (err) {
    console.error("Error clearing About Me cache:", err);
    return { success: false, message: "Internal server error" };
  }
}

export default redisInstance;
