import { redis } from "@/lib/kv";

export async function POST(req) {
    const token = req.headers.get("x-internal-key");

    if (token !== process.env.INTERNAL_API_TOKEN) {
        return new Response("Unauthorized", { status: 403 });
    }

    let body;
    try {
        body = await req.json();
    } catch (err) {
        return new Response("Invalid JSON", { status: 400 });
    }

    const payload = {
        version: Date.now(),
        data: body.data ?? body,
    };

    await redis.set("projects_data", payload);

    return Response.json({
        success: true,
        stored: true,
        message: "Projects updated in KV.",
    });
}
