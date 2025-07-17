import { connectToDB } from "@/lib/db";
import Message from "@/models/Message";
import { ratelimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous";

  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await connectToDB();
  await Message.create({ name, email, message });

  return NextResponse.json({ ok: true });
}
