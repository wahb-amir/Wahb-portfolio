import { connectToDB } from "@/lib/db";
import Message from "@/models/Message";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

/* ─────────────────────────────────────────────────────────────
   ALLOWED ORIGINS
   ───────────────────────────────────────────────────────────── */
const ALLOWED_ORIGINS = new Set([
  "https://wahb.space",
  "https://www.wahb.space",
  "https://dashboard.wahb.space",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
]);
interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // max 5 submissions per IP per hour

function isRateLimited(ip: string): {
  limited: boolean;
  retryAfterSec: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    // Fresh window
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return { limited: false, retryAfterSec: 0 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfterSec = Math.ceil(
      (RATE_LIMIT_WINDOW_MS - (now - entry.windowStart)) / 1000,
    );
    return { limited: true, retryAfterSec };
  }

  entry.count++;
  return { limited: false, retryAfterSec: 0 };
}

// Periodically purge expired entries to prevent memory leaks
// (runs every 10 min in the same serverless worker lifetime)
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitStore.delete(key);
      }
    }
  },
  10 * 60 * 1000,
);

/* ─────────────────────────────────────────────────────────────
   VALIDATION HELPERS
   ───────────────────────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const VALID_INTERESTS = new Set([
  "Full-Stack Web Application",
  "Backend Development",
  "SEO Optimization",
  "E-commerce Store",
  "Custom Web Solution",
]);

const VALID_BUDGETS = new Set([
  "under-1k",
  "1k-3k",
  "3k-8k",
  "8k-plus",
  "not-sure",
]);

const VALID_TIMELINES = new Set(["asap", "1-month", "1-3-months", "flexible"]);

function sanitize(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

/* ─────────────────────────────────────────────────────────────
   CORS HELPERS
   ───────────────────────────────────────────────────────────── */
function getCORSHeaders(origin: string | null): Record<string, string> {
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };
  }
  return {};
}

/* ─────────────────────────────────────────────────────────────
   CONTACT REQUEST TYPE
   ───────────────────────────────────────────────────────────── */
interface ContactRequestBody {
  name: string;
  email: string;
  interest: string;
  budget?: string;
  timeline?: string;
  message?: string;
}

/* ─────────────────────────────────────────────────────────────
   OPTIONS — CORS preflight
   ───────────────────────────────────────────────────────────── */
export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: getCORSHeaders(origin),
  });
}

/* ─────────────────────────────────────────────────────────────
   POST — contact form submission
   ───────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const corsHeaders = getCORSHeaders(origin);

  /* 1 ── Origin check ──────────────────────────────────────── */

  if (!origin) {
    return NextResponse.json(
      { error: "Origin header is required" },
      { status: 400 },
    );
  }
  if (!ALLOWED_ORIGINS.has(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  /* 2 ── Resolve real client IP ────────────────────────────── */
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  /* 3 ── Rate limit ────────────────────────────────────────── */
  const { limited, retryAfterSec } = isRateLimited(ip);
  if (limited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  /* 4 ── Parse body ────────────────────────────────────────── */
  let body: ContactRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: corsHeaders },
    );
  }

  /* 5 ── Sanitise & validate ───────────────────────────────── */
  const name = sanitize(body.name, 80);
  const email = sanitize(body.email, 254);
  const interest = sanitize(body.interest, 100);
  const budget = sanitize(body.budget, 20);
  const timeline = sanitize(body.timeline, 20);
  const message = sanitize(body.message, 2000);

  const errors: string[] = [];

  if (!name) errors.push("name is required");
  if (name.length < 2) errors.push("name is too short");
  if (!email) errors.push("email is required");
  if (!EMAIL_RE.test(email)) errors.push("email is invalid");
  if (!interest) errors.push("interest is required");
  if (!VALID_INTERESTS.has(interest))
    errors.push("interest value is not allowed");
  if (budget && !VALID_BUDGETS.has(budget))
    errors.push("budget value is not allowed");
  if (timeline && !VALID_TIMELINES.has(timeline))
    errors.push("timeline value is not allowed");

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: errors },
      { status: 422, headers: corsHeaders },
    );
  }

  /* 6 ── Persist to DB ─────────────────────────────────────── */
  try {
    await connectToDB();

    await Message.create({
      name,
      email,
      interest,
      budget: budget || "not-sure",
      timeline: timeline || "flexible",
      message: message || "",
    });

    return NextResponse.json(
      { ok: true },
      { status: 200, headers: corsHeaders },
    );
  } catch (err) {
    console.error("❌ Contact API – DB error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders },
    );
  }
}
