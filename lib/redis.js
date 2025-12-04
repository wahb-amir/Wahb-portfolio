import Redis from "ioredis";

let redis;

if (!global.redis) {
    global.redis = new Redis(process.env.REDIS_URL);
    global.redis.on("connect", () => console.log("Redis connected"));
    global.redis.on("error", (err) => console.error("Redis error:", err));
}

redis = global.redis;

/**
 * Clears the project cache in Redis.
 * @param {Redis} redisInstance - Optional, defaults to global redis
 */
export async function clearProjectCache(redisInstance = redis) {
    try {
        const deleted = await redisInstance.del("projects:payload");
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

/**
 * Clears the "About Me" cache in Redis.
 * @param {Redis} redisInstance - Optional, defaults to global redis
 */
export async function clearAboutCache(redisInstance = redis) {
    try {
        const deleted = await redisInstance.del("about:payload");
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

export default redis;
