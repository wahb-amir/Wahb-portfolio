import { connectToDB } from "@/lib/db";
import Message from "@/models/Message";
import { ratelimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

// ✅ Allowed origins list
const allowedOrigins = [
  "https://shahnawaz.buttnetworks.com",
  "https://buttnetworks.com"
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
  return {}; // 🛑 Not allowed, don’t set CORS headers
};

export async function OPTIONS(req) {
  const headers = getCORSHeaders(req);
  return new Response(null, {
    status: 204,
    headers,
  });
}

export async function POST(req) {
  const headers = getCORSHeaders(req);

  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
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
      headers,
    });
  }
}
