import { connectToDB } from "@/lib/db";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

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

// --- OPTIONS handler for CORS preflight ---
export async function OPTIONS(req) {
  const headers = getCORSHeaders(req);
  return NextResponse.json(null, { status: 204, headers });
}

// --- POST handler ---
export async function POST(req) {
  const corsHeaders = getCORSHeaders(req);

  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    await connectToDB();
    await Message.create({ name, email, message });

    return NextResponse.json({ ok: true }, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("❌ Internal error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
