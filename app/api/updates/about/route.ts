import { NextResponse } from "next/server";
import { connection } from "next/server";
import getAboutPayload from "@/lib/aboutService";

export async function GET(req: Request) {
  await connection();
  try {
    const url = new URL(req.url);
    const clientVersion = url.searchParams.has("version")
      ? Number(url.searchParams.get("version"))
      : null;

    const { payload } = await getAboutPayload({ clientVersion });
    return NextResponse.json(payload);
  } catch (err) {
    console.error("Public About API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

