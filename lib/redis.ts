// Redis is currently disabled, as we have shifted back to static content.
let redisInstance: any = null;

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
  if (!redisClient) {
    console.warn(
      "clearAboutCache: Redis client not available — skipping cache clear.",
    );
    return {
      success: false,
      message: "Redis client not available.",
    };
  }

  try {
    const deleted = await redisClient.del("about:payload");

    return {
      success: true,
      message: deleted
        ? "About Me cache cleared successfully."
        : "About Me cache was already empty.",
    };
  } catch (err) {
    console.error("Error clearing About Me cache:", err);
    return {
      success: false,
      message: "Failed to clear About Me cache.",
    };
  }
}

export default redisInstance;
