import { connectToDB } from "@/lib/db";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

const allowedOrigins: string[] = [
  "https://shahnawaz.buttnetworks.com",
  "https://buttnetworks.com",
];
const getCORSHeaders = (req: Request): Record<string, string> => {
  const origin = req.headers.get("origin");

  if (origin && allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
  }

  // Always return a valid Record<string, string>, even if empty
  return {};
};


// --- OPTIONS handler for CORS preflight ---
export async function OPTIONS(req: Request) {
  const headers: HeadersInit = getCORSHeaders(req);
  return NextResponse.json(null, { status: 204, headers });
}

// --- POST handler ---
export async function POST(req: Request) {
  const corsHeaders: HeadersInit = getCORSHeaders(req);
interface ContactRequestBody {
  name: string;
  email: string;
  interest: string;
}
  try {
    const { name, email, interest }: ContactRequestBody = await req.json();

    if (!name || !email || !interest) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    await connectToDB();
    await Message.create({ name, email, interest });

    return NextResponse.json(
      { ok: true },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("❌ Internal error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
