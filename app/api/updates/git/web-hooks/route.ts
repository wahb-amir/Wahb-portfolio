import { NextResponse } from "next/server";
import crypto from "crypto";
import redis, { clearProjectCache } from "@/lib/redis";
import { connectToDB } from "@/lib/db";
import ProjectVersion from "@/models/ProjectVersion";

const SECRET = process.env.WEBHOOK_SECRET || "";

function verifyGitHubSignature(
  secret: string,
  signatureHeader: string | null,
  payload: string
) {
  if (!secret) {
    console.warn(
      "No webhook secret configured (WEBHOOK_SECRET). Rejecting by default."
    );
    return false;
  }
  if (!signatureHeader) return false;

  // signatureHeader looks like: "sha256=<hex>" or "sha1=<hex>"
  const [algo, sigHex] = signatureHeader.split("=");
  if (!algo || !sigHex) return false;

  let computedHex: string;
  try {
    const hmac = crypto.createHmac(algo === "sha1" ? "sha1" : "sha256", secret);
    computedHex = hmac.update(payload).digest("hex");
  } catch (e) {
    // unsupported algo
    return false;
  }

  // Build expected header string (same format as received)
  const expected = `${algo}=${computedHex}`;

  // timingSafeEqual requires Buffers of same length
  const a = Buffer.from(signatureHeader);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  try {
    // read raw body as text (needed for HMAC verification)
    const payloadText = await req.text();

    // verify signature (sha256 preferred, fallback to sha1)
    const sig256 = req.headers.get("x-hub-signature-256");
    const sig1 = req.headers.get("x-hub-signature");
    const signatureHeader = sig256 || sig1;

    if (!verifyGitHubSignature(SECRET, signatureHeader, payloadText)) {
      console.warn("Invalid GitHub signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // parse JSON safely
    let body: any = {};
    try {
      body = payloadText ? JSON.parse(payloadText) : {};
    } catch (err) {
      console.warn("Failed to parse JSON payload:", err);
      body = {};
    }

    // projectId from query
    const url = new URL(req.url);
    const projectId = url.searchParams.get("projectId");
    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    // Read event header
    const githubEvent = (req.headers.get("x-github-event") || "").toLowerCase();

    // Skip ping events
    if (githubEvent === "ping" || body.zen) {
      console.log("Webhook ping received — skipping update.");
      return NextResponse.json({ skipped: true, reason: "ping event" });
    }

    // Determine if update needed (push to main/master or merged PR into main/master)
    let shouldUpdate = false;

    if (githubEvent === "push") {
      const ref: string | undefined = body.ref;
      const before: string | undefined = body.before;
      const after: string | undefined = body.after;
      const commits = Array.isArray(body.commits) ? body.commits : [];

      if (ref && (ref.endsWith("/main") || ref.endsWith("/master"))) {
        if (after && before && after === before) {
          console.log(
            "Push to main/master with identical before/after — skipping."
          );
        } else if (
          commits.length === 0 &&
          (!after || after.startsWith("0000000"))
        ) {
          console.log("Push contains no commits — skipping.");
        } else {
          shouldUpdate = true;
        }
      } else {
        console.log("Push not to main/master — skipping.");
      }
    } else if (githubEvent === "pull_request") {
      const action: string | undefined = body.action;
      const pr = body.pull_request;
      if (action === "closed" && pr && pr.merged === true) {
        const baseRef = pr.base?.ref;
        if (baseRef && (baseRef === "main" || baseRef === "master")) {
          shouldUpdate = true;
        } else {
          console.log("PR merged but not into main/master — skipping.");
        }
      } else {
        console.log("Pull request event not merged/closed — skipping.");
      }
    } else {
      console.log(`Unhandled GitHub event: ${githubEvent} — skipping.`);
    }

    if (!shouldUpdate) {
      return NextResponse.json({
        skipped: true,
        reason: "No relevant change detected",
      });
    }

    // format date "Monday 22, 2025"
    const lastPublished = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      year: "numeric",
    });

    await connectToDB();

    const projectVersion = await ProjectVersion.findOne({
      "projects.id": projectId,
    });
    if (!projectVersion) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // update nested project
    projectVersion.projects = projectVersion.projects.map((proj) => {
      if (proj.id === projectId) {
        return {
          ...proj.toObject(),
          launch: { date: lastPublished },
        };
      }
      return proj;
    });

    // bump global version
    projectVersion.version = (projectVersion.version || 0) + 1;

    await projectVersion.save();
    await clearProjectCache(redis);

    console.log(
      `Project ${projectId} launch date updated to ${lastPublished} and version bumped to ${projectVersion.version}`
    );

    return NextResponse.json({
      success: true,
      projectId,
      lastPublished,
      globalVersion: projectVersion.version,
    });
  } catch (err: any) {
    console.error("❌ Error:", err.message || err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
