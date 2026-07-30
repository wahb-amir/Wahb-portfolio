"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useReducedMotion } from "framer-motion";

// ---------------------------------------------------------------------------
// Mulberry32 PRNG — fixed seeds, same numbers every time (client-only now,
// so determinism only matters for "does the layout look the same on every
// load", not for SSR/client matching).
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
  x: number; // 0–1 fraction of width
  y: number; // 0–1 fraction of height
  opacity: number; // static — 0.15–0.35
}

interface TwinkleStar {
  x: number;
  y: number;
  size: number; // 1 or 2 (css px, pre-DPR)
  phase: number; // radians, replaces "delay"
  speed: number; // radians/sec, replaces "duration"
  opacityMin: number;
  opacityMax: number;
  colorIdx: number;
}

interface DustMote {
  x: number;
  y: number;
  size: number; // 20–60 px
  delay: number; // s
  duration: number; // 15–30 s
}

// ---------------------------------------------------------------------------
// Generation — fixed seeds (no more Date.now()!)
// ---------------------------------------------------------------------------
const SEED_DUST = 42;
const SEED_TWINK = 137;
const SEED_MOTE = 999;

const DUST_STAR_COUNT = 1500;
const TWINKLE_COUNT = 500;
const DUST_MOTE_COUNT = 35;

const TWINKLE_COLORS = ["#ffffff", "#ffffff", "#ffffff", "#c8dfff", "#d8e8ff"];

function generateDustStars(): DustStar[] {
  const rng = createPrng(SEED_DUST);
  return Array.from({ length: DUST_STAR_COUNT }, () => ({
    x: rng(),
    y: rng(),
    opacity: 0.15 + rng() * 0.2, // 0.15–0.35
  }));
}

function generateTwinkleStars(): TwinkleStar[] {
  const rng = createPrng(SEED_TWINK);
  return Array.from({ length: TWINKLE_COUNT }, () => {
    const base = 0.3 + rng() * 0.45; // 0.30–0.75
    const size = rng() < 0.22 ? 2 : 1;
    const duration = 3 + rng() * 3; // 3–6s, same as v2
    return {
      x: rng(),
      y: rng(),
      size,
      phase: rng() * Math.PI * 2, // random starting point in the cycle
      speed: (2 * Math.PI) / duration,
      opacityMin: +(base * 0.18).toFixed(3),
      opacityMax: +base.toFixed(3),
      colorIdx: Math.floor(rng() * TWINKLE_COLORS.length),
    };
  });
}

function generateDustMotes(): DustMote[] {
  const rng = createPrng(SEED_MOTE);
  return Array.from({ length: DUST_MOTE_COUNT }, () => ({
    x: rng(),
    y: rng(),
    size: 20 + Math.floor(rng() * 40), // 20–60px
    delay: rng() * 30, // 0–30s
    duration: 15 + rng() * 15, // 15–30s
  }));
}

const DUST_STARS = generateDustStars();
const TWINKLE_STARS = generateTwinkleStars();
const DUST_MOTES = generateDustMotes();

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}
const TWINKLE_RGB = TWINKLE_COLORS.map(hexToRgb);

// ---------------------------------------------------------------------------
// Drawing helpers
// ---------------------------------------------------------------------------
function sizeCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, w: number, h: number, dpr: number) {
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawStaticDust(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  for (const s of DUST_STARS) {
    ctx.globalAlpha = s.opacity;
    ctx.fillRect(s.x * w, s.y * h, 1, 1);
  }
  ctx.globalAlpha = 1;
}

function drawTwinkleFrame(ctx: CanvasRenderingContext2D, w: number, h: number, tSec: number, reduced: boolean) {
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i < TWINKLE_STARS.length; i++) {
    const s = TWINKLE_STARS[i];
    const wave = reduced ? 1 : (Math.sin(tSec * s.speed + s.phase) + 1) / 2; // 0..1
    const alpha = s.opacityMin + (s.opacityMax - s.opacityMin) * wave;
    const scale = reduced ? 1 : 1 + 0.08 * wave;
    const [r, g, b] = TWINKLE_RGB[s.colorIdx];
    const px = s.x * w;
    const py = s.y * h;
    const sz = s.size * scale;

    if (s.size === 2) {
      // soft glow via radial gradient — cheap because radius is tiny
      const glowR = 4;
      const grad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
      grad.addColorStop(0, `rgba(180,210,255,${(alpha * 0.45).toFixed(3)})`);
      grad.addColorStop(1, "rgba(180,210,255,0)");
      ctx.fillStyle = grad;
      ctx.globalAlpha = 1;
      ctx.fillRect(px - glowR, py - glowR, glowR * 2, glowR * 2);
    }

    ctx.globalAlpha = alpha;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(px, py, sz, sz);
  }
  ctx.globalAlpha = 1;
}

function drawMotesFrame(ctx: CanvasRenderingContext2D, w: number, h: number, tSec: number, reduced: boolean) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  for (const m of DUST_MOTES) {
    const cycle = reduced ? 0.5 : (((tSec - m.delay) % m.duration) + m.duration) % m.duration;
    const p = cycle / m.duration; // 0..1 through the drift cycle

    let alpha: number;
    if (p < 0.2) alpha = p / 0.2;
    else if (p < 0.8) alpha = 1;
    else alpha = 1 - (p - 0.8) / 0.2;

    const baseOpacity = 0.1 + (m.size % 10) * 0.01; // 0.10–0.19, same as v2
    alpha *= baseOpacity;
    if (alpha <= 0.002) continue;

    const dx = p < 0.5 ? 30 * (p / 0.5) : 30 - 50 * ((p - 0.5) / 0.5);
    const dy = -200 * p;
    const scale = p < 0.5 ? 1 + 0.1 * (p / 0.5) : 1.1 - 0.1 * ((p - 0.5) / 0.5);
    const r = (m.size * scale) / 2;

    ctx.globalAlpha = alpha;
    ctx.filter = m.size > 40 ? "blur(24px)" : "blur(16px)";
    ctx.beginPath();
    ctx.arc(m.x * w + dx, m.y * h + dy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.filter = "none";
  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function StarfieldBackground() {
  const { resolvedTheme } = useTheme();
  const reduced = useReducedMotion() ?? false;
  const isDark = resolvedTheme === "dark";

  const staticCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animCanvas = animCanvasRef.current;
    if (!animCanvas) return;
    const animCtx = animCanvas.getContext("2d");
    if (!animCtx) return;

    const staticCanvas = isDark ? staticCanvasRef.current : null;
    const staticCtx = staticCanvas ? staticCanvas.getContext("2d") : null;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      sizeCanvas(animCanvas as HTMLCanvasElement, animCtx as CanvasRenderingContext2D, width, height, dpr);
      if (staticCanvas && staticCtx) {
        sizeCanvas(staticCanvas, staticCtx, width, height, dpr);
        drawStaticDust(staticCtx, width, height); // drawn once, never again
      }
      if (reduced) {
        // paint one still frame immediately so resizes don't go blank
        if (isDark) drawTwinkleFrame(animCtx as CanvasRenderingContext2D, width, height, 0, true);
        else drawMotesFrame(animCtx as CanvasRenderingContext2D, width, height, 0, true);
      }
    }

    resize();
    window.addEventListener("resize", resize);

    function frame(timeMs: number) {
      const t = timeMs / 1000;
      if (isDark) drawTwinkleFrame(animCtx as CanvasRenderingContext2D, width, height, t, false);
      else drawMotesFrame(animCtx as CanvasRenderingContext2D, width, height, t, false);
      rafRef.current = requestAnimationFrame(frame);
    }

    if (!reduced) {
      rafRef.current = requestAnimationFrame(frame);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [isDark, reduced]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
    >
      {/* ══════════════ DARK MODE ══════════════ */}
      {isDark && (
        <>
          {/* Nebula / ambient glow — pure CSS, unchanged from v2 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 45% at 18% 20%, rgba(67,56,202,0.11) 0%, transparent 70%)," +
                "radial-gradient(ellipse 55% 40% at 78% 12%, rgba(124,58,237,0.09) 0%, transparent 65%)," +
                "radial-gradient(ellipse 70% 30% at 50% 5%, rgba(0,120,255,0.05) 0%, transparent 60%)," +
                "radial-gradient(ellipse 40% 25% at 85% 80%, rgba(6,182,212,0.04) 0%, transparent 60%)",
            }}
          />
          {/* Layer 1: static dust — drawn once, never redrawn */}
          <canvas ref={staticCanvasRef} className="absolute inset-0" />
        </>
      )}

      {/* ══════════════ LIGHT MODE ══════════════ */}
      {!isDark && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-200 via-slate-100 to-zinc-50" />
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 75% 25%, rgba(253,230,138,0.3) 0%, rgba(251,146,60,0.05) 45%, transparent 70%)",
              transform: "translate(20%, -20%)",
              filter: "blur(60px)",
            }}
          />
        </>
      )}

   
      <canvas ref={animCanvasRef} className="absolute inset-0" />
    </div>
  );
}