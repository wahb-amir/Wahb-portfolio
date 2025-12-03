import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET(req) {
    const origin = req.headers.get("origin");

    const allowed = [
        process.env.PRODUCTION ? process.env.ORIGIN : process.env.DEV_ORIGIN,
        process.env.META_PLATFORM_ORIGIN,
    ];


    if (origin && !allowed.includes(origin)) {
        return new Response("Forbidden", { status: 403 });
    }

    const cached = await redis.get("projects_data");
    if (!cached) {
        return new Response("No data", { status: 404 });
    }

    return new Response(JSON.stringify(cached), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin ?? "*",
        },
    });
}
