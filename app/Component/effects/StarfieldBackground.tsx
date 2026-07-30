"use client";

/**
 * StarfieldBackground — v2
 *
 * Dark mode — 3 depth layers:
 *   Layer 1 (Deep-sky dust)  : 180 tiny 1px static stars, opacity 0.15–0.35.
 *                              No animation — true background noise.
 *   Layer 2 (Main star field): 70 stars 1–2px, calm asynchronous twinkle
 *                              with 3–6 s cycles and randomised delay.
 *   Layer 3 (Nebula tint)    : 4 high-blur radial gradients (indigo/violet)
 *                              fixed in the upper half — pure CSS, zero JS.
 *
 * Light mode — atmospheric shimmer:
 *   Soft slate-blue dust-mote particles that fade in/drift gently,
 *   matching the sun/cloud toggle palette.
 *
 * • Fixed behind all content  → z-index: -1
 * • Pointer-events: none
 * • Hydration-safe: deterministic PRNG — SSR and client produce identical markup
 * • Respects prefers-reduced-motion
 */

import React, { useMemo } from "react";
import { useTheme } from "next-themes";
import { useReducedMotion } from "framer-motion";

// ---------------------------------------------------------------------------
// Mulberry32 PRNG — deterministic seed ensures SSR ↔ client match
// ---------------------------------------------------------------------------
function createPrng(seed: number) {
  let s = seed;
  return (): number => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0xffffffff;
  };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface DustStar {
  id: number;
  x: number;   // %
  y: number;   // %
  opacity: number; // static — 0.15–0.35
}

interface TwinkleStar {
  id: number;
  x: number;
  y: number;
  size: number;        // 1 or 2
  delay: number;       // s
  duration: number;    // 3–6 s
  opacityMin: number;
  opacityMax: number;
  color: string;       // white or soft blue-white
}

interface DustMote {
  id: number;
  x: number;
  y: number;
  size: number;   // 1–3 px
  delay: number;
  duration: number;
}

// ---------------------------------------------------------------------------
// Generation — all seeded so SSR matches client
// ---------------------------------------------------------------------------
const SEED_DUST   = 42;
const SEED_TWINK  = 137;
const SEED_MOTE   = 999;

const DUST_STAR_COUNT  = 185;
const TWINKLE_COUNT    = 70;
const DUST_MOTE_COUNT  = 50;

function generateDustStars(): DustStar[] {
  const rng = createPrng(SEED_DUST);
  return Array.from({ length: DUST_STAR_COUNT }, (_, i) => ({
    id: i,
    x: rng() * 100,
    y: rng() * 100,
    opacity: 0.15 + rng() * 0.20, // 0.15–0.35
  }));
}

function generateTwinkleStars(): TwinkleStar[] {
  const rng = createPrng(SEED_TWINK);
  const COLORS = ["#ffffff", "#ffffff", "#ffffff", "#c8dfff", "#d8e8ff"];
  return Array.from({ length: TWINKLE_COUNT }, (_, i) => {
    const base = 0.30 + rng() * 0.45; // 0.30–0.75
    const size = rng() < 0.22 ? 2 : 1;
    return {
      id: i,
      x: rng() * 100,
      y: rng() * 100,
      size,
      delay: rng() * 9,          // spread 0–9 s so they never sync
      duration: 3 + rng() * 3,   // 3–6 s
      opacityMin: +(base * 0.18).toFixed(3),
      opacityMax: +base.toFixed(3),
      color: COLORS[Math.floor(rng() * COLORS.length)],
    };
  });
}

function generateDustMotes(): DustMote[] {
  const rng = createPrng(SEED_MOTE);
  return Array.from({ length: DUST_MOTE_COUNT }, (_, i) => ({
    id: i,
    x: rng() * 100,
    y: rng() * 100,
    size: 1 + Math.floor(rng() * 3),
    delay: rng() * 12,
    duration: 5 + rng() * 5,
  }));
}

const DUST_STARS    = generateDustStars();
const TWINKLE_STARS = generateTwinkleStars();
const DUST_MOTES    = generateDustMotes();

// ---------------------------------------------------------------------------
// Keyframe CSS — injected once
// ---------------------------------------------------------------------------
const DARK_KEYFRAMES = `
@keyframes sfb-twinkle {
  0%,100% { opacity: var(--s-min); transform: scale(1); }
  50%      { opacity: var(--s-max); transform: scale(1.08); }
}
`;

const LIGHT_KEYFRAMES = `
@keyframes sfb-mote-drift {
  0%,100% { opacity: 0;               transform: translateY(0) scale(1);   }
  25%     { opacity: var(--m-opacity); }
  60%     { opacity: var(--m-opacity); transform: translateY(-8px) scale(1.12); }
}
@keyframes sfb-mote-shimmer {
  0%,100% { opacity: 0;    }
  50%     { opacity: 0.08; }
}
`;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function StaticDustDot({ star }: { star: DustStar }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        left: `${star.x}%`,
        top: `${star.y}%`,
        width: 1,
        height: 1,
        borderRadius: "50%",
        backgroundColor: "#ffffff",
        opacity: star.opacity,
        willChange: "auto",
      }}
    />
  );
}

function TwinkleDot({
  star,
  reduced,
}: {
  star: TwinkleStar;
  reduced: boolean;
}) {
  const glow =
    star.size === 2
      ? `0 0 4px 1px rgba(180,210,255,${(star.opacityMax * 0.45).toFixed(3)})`
      : "none";

  return (
    <span
      aria-hidden="true"
      style={
        {
          position: "absolute",
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: star.size,
          height: star.size,
          borderRadius: "50%",
          backgroundColor: star.color,
          "--s-min": star.opacityMin,
          "--s-max": star.opacityMax,
          opacity: reduced ? star.opacityMax : star.opacityMin,
          animation: reduced
            ? "none"
            : `sfb-twinkle ${star.duration.toFixed(2)}s ease-in-out ${star.delay.toFixed(2)}s infinite`,
          boxShadow: glow,
          willChange: "opacity",
        } as React.CSSProperties
      }
    />
  );
}

function MoteDot({
  mote,
  reduced,
}: {
  mote: DustMote;
  reduced: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      style={
        {
          position: "absolute",
          left: `${mote.x}%`,
          top: `${mote.y}%`,
          width: mote.size,
          height: mote.size,
          borderRadius: "50%",
          // Warm slate-blue to match the light-mode sky palette
          backgroundColor: "rgba(100,116,139,0.55)",
          "--m-opacity": "0.22",
          opacity: 0,
          animation: reduced
            ? "none"
            : `sfb-mote-drift ${mote.duration.toFixed(2)}s ease-in-out ${mote.delay.toFixed(2)}s infinite`,
          filter: "blur(0.6px)",
          willChange: "opacity, transform",
        } as React.CSSProperties
      }
    />
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function StarfieldBackground() {
  const { resolvedTheme } = useTheme();
  const reduced = useReducedMotion() ?? false;

  const isDark = resolvedTheme === "dark";

  const dustStars    = useMemo(() => DUST_STARS, []);
  const twinkleStars = useMemo(() => TWINKLE_STARS, []);
  const dustMotes    = useMemo(() => DUST_MOTES, []);

  return (
    <>
      {/* Keyframes — injected once per theme */}
      {!reduced && (
        <style
          id="sfb-keyframes"
          dangerouslySetInnerHTML={{
            __html: isDark ? DARK_KEYFRAMES : LIGHT_KEYFRAMES,
          }}
        />
      )}

      {/* ── Fixed full-screen canvas ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: -1 }}
      >
        {/* ══════════════ DARK MODE ══════════════ */}
        {isDark && (
          <>
            {/* ── Layer 3: Nebula / ambient glow (deep indigo & violet) ── */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  // Upper-left: soft indigo wash
                  "radial-gradient(ellipse 60% 45% at 18% 20%, rgba(67,56,202,0.11) 0%, transparent 70%)," +
                  // Upper-right: cool violet
                  "radial-gradient(ellipse 55% 40% at 78% 12%, rgba(124,58,237,0.09) 0%, transparent 65%)," +
                  // Centre-top: faint blue haze
                  "radial-gradient(ellipse 70% 30% at 50% 5%, rgba(0,120,255,0.05) 0%, transparent 60%)," +
                  // Lower accent: deep teal touch
                  "radial-gradient(ellipse 40% 25% at 85% 80%, rgba(6,182,212,0.04) 0%, transparent 60%)",
              }}
            />

            {/* ── Layer 1: Deep-sky dust — static, no animation ── */}
            <div className="absolute inset-0">
              {dustStars.map((s) => (
                <StaticDustDot key={s.id} star={s} />
              ))}
            </div>

            {/* ── Layer 2: Main twinkling field ── */}
            <div className="absolute inset-0">
              {twinkleStars.map((s) => (
                <TwinkleDot key={s.id} star={s} reduced={reduced} />
              ))}
            </div>
          </>
        )}

        {/* ══════════════ LIGHT MODE ══════════════ */}
        {!isDark && (
          <>
            {/* Subtle top-down atmospheric gradient — daytime sky */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(170deg, rgba(186,210,235,0.22) 0%, rgba(226,232,240,0.08) 60%, transparent 100%)",
              }}
            />

            {/* Soft shimmer wash across upper third */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 35% at 50% 0%, rgba(148,163,184,0.12) 0%, transparent 70%)",
              }}
            />

            {/* Atmospheric dust-mote particles */}
            {!reduced && (
              <div className="absolute inset-0">
                {dustMotes.map((m) => (
                  <MoteDot key={m.id} mote={m} reduced={reduced} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
