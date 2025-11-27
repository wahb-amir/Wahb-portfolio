import { connectToDB } from "@/lib/db";
import Message from "@/models/Message";
import { NextResponse } from "next/server";
import Redis from "ioredis";

// --- Redis client ---
const redis = new Redis(process.env.REDIS_URL);

// ✅ Allowed origins list
const allowedOrigins = [
  "https://shahnawaz.buttnetworks.com",
  "https://buttnetworks.com",
];

const getCORSHeaders = (req) => {
  const origin = req.headers.get("origin");
  if (allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
  }
  return {};
};

// --- Redis-backed rate limiter ---
const RATE_LIMIT_WINDOW = 60; // seconds
const MAX_REQUESTS = 5;

async function rateLimit(ip) {
  const key = `rl:${ip}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW);
  }

  const ttl = await redis.ttl(key);
  const remaining = Math.max(0, MAX_REQUESTS - current);

  return {
    success: current <= MAX_REQUESTS,
    limit: MAX_REQUESTS,
    remaining,
    reset: Date.now() + ttl * 1000,
  };
}

export async function OPTIONS(req) {
  const headers = getCORSHeaders(req);
  return new Response(null, { status: 204, headers });
}

export async function POST(req) {
  const corsHeaders = getCORSHeaders(req);

  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";

    const rl = await rateLimit(ip);

    const headers = {
      ...corsHeaders,
      "X-RateLimit-Limit": String(rl.limit),
      "X-RateLimit-Remaining": String(rl.remaining),
      "X-RateLimit-Reset": String(Math.ceil(rl.reset / 1000)),
    };

    if (!rl.success) {
      headers["Retry-After"] = String(Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000)));
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers,
      });
    }

    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers,
      });
    }

    await connectToDB();
    await Message.create({ name, email, message });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("❌ Internal error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
