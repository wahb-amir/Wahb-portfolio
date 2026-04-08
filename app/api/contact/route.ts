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
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): {
  limited: boolean;
  retryAfterSec: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
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
   FIELD MAPS — Contact form display values → DB enum values
   ───────────────────────────────────────────────────────────── */

/**
 * Contact form sends: "Full-Stack Web App" | "Backend & APIs" |
 *   "SEO & Performance" | "E-Commerce Store" | "Custom Solution"
 * DB enum expects:    "Full-Stack Web Application" | "Backend Development" |
 *   "SEO Optimization" | "E-commerce Store" | "Custom Web Solution"
 */
const SERVICE_MAP: Record<string, string> = {
  "Full-Stack Web App":   "Full-Stack Web Application",
  "Backend & APIs":       "Backend Development",
  "SEO & Performance":    "SEO Optimization",
  "E-Commerce Store":     "E-commerce Store",
  "Custom Solution":      "Custom Web Solution",
};

/**
 * Contact form sends full labels: "Under $1,000" | "$1,000–$3,000" |
 *   "$3,000–$8,000" | "$8,000+" | "Not sure yet"
 * DB enum expects slugs: "under-1k" | "1k-3k" | "3k-8k" | "8k-plus" | "not-sure"
 */
const BUDGET_MAP: Record<string, string> = {
  "Under $1,000":    "under-1k",
  "$1,000–$3,000":   "1k-3k",
  "$3,000–$8,000":   "3k-8k",
  "$8,000+":         "8k-plus",
  "Not sure yet":    "not-sure",
};

/**
 * Contact form sends full labels: "ASAP" | "Within 1 month" |
 *   "1–3 months" | "Flexible"
 * DB enum expects slugs: "asap" | "1-month" | "1-3-months" | "flexible"
 */
const TIMELINE_MAP: Record<string, string> = {
  "ASAP":           "asap",
  "Within 1 month": "1-month",
  "1–3 months":     "1-3-months",
  "Flexible":       "flexible",
};

/* ─────────────────────────────────────────────────────────────
   VALIDATION HELPERS
   ───────────────────────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
   CONTACT REQUEST BODY — shape sent by the new Contact form
   ───────────────────────────────────────────────────────────── */
interface ContactRequestBody {
  name: string;
  email: string;
  /** Display label from SERVICES array, e.g. "Full-Stack Web App" */
  service: string;
  /** Full budget label from BUDGET_FULL array, e.g. "Under $1,000" */
  budget?: string;
  /** Full timeline label from TIMELINE_FULL array, e.g. "Within 1 month" */
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

  /* 5 ── Sanitise raw strings ──────────────────────────────── */
  const name     = sanitize(body.name, 80);
  const email    = sanitize(body.email, 254);
  const service  = sanitize(body.service, 100);   // display label
  const budget   = sanitize(body.budget, 100);    // display label
  const timeline = sanitize(body.timeline, 100);  // display label
  const message  = sanitize(body.message, 2000);

  /* 6 ── Map display labels → DB enum slugs ────────────────── */
  const interest    = SERVICE_MAP[service]  ?? null;
  const budgetSlug  = BUDGET_MAP[budget]    ?? "not-sure";
  const timelineSlug = TIMELINE_MAP[timeline] ?? "flexible";

  /* 7 ── Validate ──────────────────────────────────────────── */
  const errors: string[] = [];

  if (!name)              errors.push("name is required");
  if (name.length < 2)    errors.push("name is too short");
  if (!email)             errors.push("email is required");
  if (!EMAIL_RE.test(email)) errors.push("email is invalid");
  if (!service)           errors.push("service is required");
  if (!interest)          errors.push(`service "${service}" is not a recognised option`);

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: errors },
      { status: 422, headers: corsHeaders },
    );
  }

  /* 8 ── Persist to DB ─────────────────────────────────────── */
  try {
    await connectToDB();

    await Message.create({
      name,
      email,
      interest,          // mapped DB enum value
      budget: budgetSlug,
      timeline: timelineSlug,
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