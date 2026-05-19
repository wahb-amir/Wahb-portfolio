import { connectToDB } from "@/lib/db";
import Message from "@/models/Message";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import nodemailer from "nodemailer";

/* ─────────────────────────────────────────────────────────────
   ALLOWED ORIGINS
   ───────────────────────────────────────────────────────────── */
const ALLOWED_ORIGINS = new Set([
  "https://wahb.space",
  "https://www.wahb.space",
  ...(process.env.PRODUCTION === "development"
    ? ["http://localhost:3000"]
    : []),
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
   VALIDATION HELPERS
   ───────────────────────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function sanitize(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

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
  reason: string;
  message: string;
}

/* ─────────────────────────────────────────────────────────────
   NODEMAILER CONFIG
   ───────────────────────────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

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
  const name = sanitize(body.name, 80);
  const email = sanitize(body.email, 254);
  const reason = sanitize(body.reason, 100);
  const message = sanitize(body.message, 3000);

  /* 6 ── Validate ──────────────────────────────────────────── */
  const errors: string[] = [];

  if (!name || name.length < 2) errors.push("Valid name is required");
  if (!email || !EMAIL_RE.test(email)) errors.push("Valid email is required");
  if (!reason) errors.push("Reason is required");
  if (!message) errors.push("Message is required");

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: errors },
      { status: 422, headers: corsHeaders },
    );
  }

  /* 7 ── Persist to DB & Send Email ────────────────────────── */
  try {
    // 1. Save to MongoDB (assuming 'interest' can store the 'reason' value)
    await connectToDB();
    await Message.create({
      name,
      email,
      interest: reason, // Mapped to existing DB schema field
      message,
    });

    // 2. High Quality HTML Email Template
    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; padding: 40px 20px; color: #111827;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: 4px solid #0077b3; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="padding: 30px;">
            <p style="font-size: 11px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; color: #6b7280; margin-bottom: 20px;">
              System Notification // Portfolio
            </p>
            <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 20px 0; color: #111827;">
              New Contact Request
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <tbody>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; width: 100px;">Name</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: 600; color: #111827;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">Email</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: 600; color: #0077b3;">
                    <a href="mailto:${email}" style="color: #0077b3; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">Reason</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: 600; color: #111827; text-transform: capitalize;">
                    <span style="background-color: #f3f4f6; padding: 4px 10px; border-radius: 12px; font-size: 12px;">${reason.replace("_", " ")}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #6b7280; margin-bottom: 10px; letter-spacing: 0.05em;">Message Body</p>
            <div style="background-color: #f9fafb; padding: 20px; border-left: 3px solid #0077b3; font-size: 15px; line-height: 1.6; color: #374151; white-space: pre-wrap;">${message}</div>

            <div style="margin-top: 40px; text-align: center;">
              <a href="mailto:${email}" style="display: inline-block; background-color: #0077b3; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 4px; letter-spacing: 0.05em;">
                REPLY TO INQUIRY
              </a>
            </div>
          </div>
          
          <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
            Transmitted from wahb.space • ${new Date().toUTCString()}
          </div>
        </div>
      </div>
    `;

    // 3. Dispatch Email
    await transporter.sendMail({
      from: `"Portfolio Alerts" <${process.env.GMAIL_USER}>`, // Send via authenticated email to avoid DMARC spam flags
      replyTo: email,
      to: process.env.GMAIL_USER, // Send to yourself
      subject: `[Portfolio] New message from ${name} - ${reason.replace("_", " ")}`,
      html: emailHtml,
    });

    return NextResponse.json(
      { ok: true },
      { status: 200, headers: corsHeaders },
    );
  } catch (err) {
    console.error("❌ Contact API - DB/Mail error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders },
    );
  }
}
