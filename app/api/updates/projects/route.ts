// app/api/updates/projects/route.ts (public)
import { NextResponse } from "next/server";
import { getLatestProjectsPayload }from "@/lib/projectsService";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const clientVersion = url.searchParams.has("version")
      ? Number(url.searchParams.get("version"))
      : null;

    const { payload, fromCache } = await getLatestProjectsPayload({
      clientVersion,
    });

    // If payload.data === null, client already has latest version
    return NextResponse.json(payload);
  } catch (err) {
    console.error("Public API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
