"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useReducedMotion } from "framer-motion";

// ---------------------------------------------------------------------------
// Mulberry32 PRNG
// ---------------------------------------------------------------------------
function createPrng(seed: number) {
  let s = seed >>> 0; // ensure uint32
  return (): number => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0xffffffff;
  };
}

// ---------------------------------------------------------------------------
// Star temperature palette  (O → M spectral class, weighted)
// [r, g, b, weight]
// ---------------------------------------------------------------------------
const STAR_PALETTE: Array<[number, number, number, number]> = [
  [168, 200, 255,  3], // O/B – blue-white (very rare)
  [189, 213, 255,  7], // B   – pale blue
  [240, 244, 255, 22], // A   – white       (most common)
  [255, 248, 240, 18], // F   – warm white
  [255, 232, 160, 11], // G   – yellow-white (sun-like)
  [255, 204, 122,  7], // K   – orange
  [255, 170,  85,  2], // M   – deep orange (very rare)
  // Space dust / brown interstellar medium — very dim, brownish-grey
  [120, 100,  80, 14], // dust lane – warm grey-brown
  [ 90,  80,  70, 10], // dense dust – dark sepia
];

// Weighted lookup table — O(1) sampling
const PALETTE_TABLE: Array<[number, number, number]> = [];
for (const [r, g, b, w] of STAR_PALETTE)
  for (let i = 0; i < w; i++) PALETTE_TABLE.push([r, g, b]);
const PALETTE_LEN = PALETTE_TABLE.length;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface DustStar {
  x: number;        // 0–1 fraction
  y: number;
  opacity: number;  // 0.08–0.28
  colorIdx: number;
  layer: 0 | 1 | 2; // parallax layer (0=far,1=mid,2=near)
}

interface TwinkleStar {
  x: number;
  y: number;
  size: 1 | 2;      // 1=small  2=medium  (no more giant "3")
  phase: number;
  speed: number;
  opacityMin: number;
  opacityMax: number;
  colorIdx: number;
  isBright: boolean; // medium star with a small glow halo
  layer: 0 | 1 | 2;
}

interface DustMote {
  x: number; y: number;
  size: number; delay: number; duration: number;
}

interface NebulaCloud {
  cx: number; cy: number;
  rx: number; ry: number;
  r: number; g: number; b: number;
  opacity: number;
  angle: number;
}

interface MilkyWayPoint {
  t: number; perpOffset: number; opacity: number;
}

// ---------------------------------------------------------------------------
// Counts
// ---------------------------------------------------------------------------
const DUST_STAR_COUNT   = 1100; // slightly fewer for clarity
const TWINKLE_COUNT     = 340;
const BRIGHT_COUNT      =  14;  // ↓ was 28, now 14 — fewer bright stars
const DUST_MOTE_COUNT   =  26;
const NEBULA_COUNT      =   7;
const MILKY_WAY_PTS_N   = 110;

// Fixed seeds for the structural elements (nebula, Milky Way)
const SEED_NEBULA = 777;
const SEED_TWINK  = 137;
const SEED_MOTE   = 999;

// Dust stars use a PER-LOAD random seed so the field is different every visit
const SEED_DUST_RUNTIME = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;

// ---------------------------------------------------------------------------
// Generators — all called once at module initialisation
// ---------------------------------------------------------------------------

function generateDustStars(): DustStar[] {
  const rng = createPrng(SEED_DUST_RUNTIME);
  return Array.from({ length: DUST_STAR_COUNT }, () => {
    const layerRoll = rng();
    const layer: 0 | 1 | 2 = layerRoll < 0.5 ? 0 : layerRoll < 0.82 ? 1 : 2;
    // ~30% chance to be a dust mote (warm grey-brown, slightly higher opacity)
    const isDust = rng() < 0.30;
    const colorIdx = isDust
      ? PALETTE_LEN - Math.floor(rng() * 2) - 1  // pick last 2 (dust entries)
      : Math.floor(rng() * (PALETTE_LEN - 2));    // pick any stellar colour
    // Dust particles are a bit more opaque to simulate density
    const opacity = isDust
      ? 0.14 + rng() * 0.26 // 0.14–0.40
      : 0.08 + rng() * 0.18; // 0.08–0.26
    return { x: rng(), y: rng(), opacity, colorIdx, layer };
  });
}

function generateTwinkleStars(): TwinkleStar[] {
  const rng = createPrng(SEED_TWINK);
  const stars: TwinkleStar[] = [];

  // Regular twinkling stars
  for (let i = 0; i < TWINKLE_COUNT; i++) {
    const base     = 0.22 + rng() * 0.42; // 0.22–0.64  (was 0.28–0.76)
    const size: 1 | 2 = rng() < 0.15 ? 2 : 1;
    const duration = 2.5 + rng() * 4.5;
    const layerRoll = rng();
    const layer: 0 | 1 | 2 = layerRoll < 0.5 ? 0 : layerRoll < 0.82 ? 1 : 2;
    stars.push({
      x: rng(), y: rng(),
      size,
      phase: rng() * Math.PI * 2,
      speed: (2 * Math.PI) / duration,
      opacityMin: +(base * 0.14).toFixed(3),
      opacityMax: +base.toFixed(3),
      colorIdx: Math.floor(rng() * PALETTE_LEN),
      isBright: false,
      layer,
    });
  }

  // Bright featured stars — smaller, dimmer, fewer
  const bRng = createPrng(SEED_TWINK + 1);
  for (let i = 0; i < BRIGHT_COUNT; i++) {
    const base     = 0.48 + bRng() * 0.28; // 0.48–0.76  (was 0.70–1.0)
    const duration = 4 + bRng() * 4;
    stars.push({
      x: bRng(), y: bRng(),
      size: 2,                              // was 3, now capped at 2
      phase: bRng() * Math.PI * 2,
      speed: (2 * Math.PI) / duration,
      opacityMin: +(base * 0.25).toFixed(3),
      opacityMax: +base.toFixed(3),
      colorIdx: Math.floor(bRng() * PALETTE_LEN),
      isBright: true,
      layer: 1,
    });
  }

  return stars;
}

function generateDustMotes(): DustMote[] {
  const rng = createPrng(SEED_MOTE);
  return Array.from({ length: DUST_MOTE_COUNT }, () => ({
    x: rng(), y: rng(),
    size: 18 + Math.floor(rng() * 36),
    delay: rng() * 30,
    duration: 14 + rng() * 16,
  }));
}

function generateNebulaClouds(): NebulaCloud[] {
  const rng = createPrng(SEED_NEBULA);
  // Mix emission nebulae (vivid) + dark absorption nebulae (muted)
  const palette: Array<[number,number,number]> = [
    [100,  60, 200], // violet emission
    [ 60,  90, 200], // deep blue emission
    [ 20, 130, 210], // cyan-blue emission
    [200,  60, 100], // rose / H-alpha emission
    [ 80,  60, 180], // indigo
    [ 60, 140, 180], // teal
    [ 70,  55,  45], // dark absorption nebula — warm brown-black
  ];
  return Array.from({ length: NEBULA_COUNT }, (_, i) => {
    const [r, g, b] = palette[i % palette.length];
    const isDark = i === 6; // last one is the dark nebula
    return {
      cx: 0.05 + rng() * 0.90, cy: 0.05 + rng() * 0.90,
      rx: 0.09 + rng() * 0.20, ry: 0.05 + rng() * 0.12,
      r, g, b,
      // Emission: 0.030–0.060  |  Dark absorption: 0.018–0.035
      opacity: isDark ? 0.018 + rng() * 0.017 : 0.030 + rng() * 0.030,
      angle: rng() * Math.PI,
    };
  });
}

function generateMilkyWayPoints(): MilkyWayPoint[] {
  const rng = createPrng(SEED_NEBULA + 1);
  return Array.from({ length: MILKY_WAY_PTS_N }, () => ({
    t: rng(),
    perpOffset: (rng() * 2 - 1) * 0.5,
    opacity: 0.007 + rng() * 0.014,
  }));
}

// Module-level data — allocated once, never reallocated
const DUST_STARS    = generateDustStars();
const TWINKLE_STARS = generateTwinkleStars();
const DUST_MOTES    = generateDustMotes();
const NEBULA_CLOUDS = generateNebulaClouds();
const MILKY_WAY_PTS = generateMilkyWayPoints();

// Parallax speeds per layer (fraction of scrollY added as vertical offset)
// Layer 0 = far (barely moves), Layer 1 = mid, Layer 2 = near
const PARALLAX_SPEED = [0.04, 0.10, 0.20] as const;

// ---------------------------------------------------------------------------
// Canvas sizing helper
// ---------------------------------------------------------------------------
function sizeCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  w: number, h: number, dpr: number
) {
  canvas.width  = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width  = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// ---------------------------------------------------------------------------
// Static layer: Milky Way + nebula clouds + dust stars
// Re-drawn only on mount / resize.
// ---------------------------------------------------------------------------
function drawStaticLayer(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);

  // ── Milky Way diagonal band ──────────────────────────────────────────────
  const bandAngle = 0.42;
  const cos = Math.cos(bandAngle);
  const sin = Math.sin(bandAngle);
  const bandW = Math.min(w, h) * 0.17;

  ctx.save();
  for (const pt of MILKY_WAY_PTS) {
    const tx = pt.t * w * 1.3 - w * 0.15;
    const ty = pt.t * h * 1.3 - h * 0.15;
    const bx = tx * cos - ty * sin * 0.3 + w * 0.10;
    const by = tx * sin * 0.5 + ty * cos * 0.4 + h * 0.05;
    const perpX = -sin * pt.perpOffset * bandW;
    const perpY =  cos * pt.perpOffset * bandW;
    const px = bx + perpX, py = by + perpY;
    const r  = bandW * 0.24 + Math.abs(pt.perpOffset) * bandW * 0.10;

    const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
    grad.addColorStop(0,   `rgba(180,200,255,${(pt.opacity * 1.4).toFixed(4)})`);
    grad.addColorStop(0.5, `rgba(160,180,240,${(pt.opacity * 0.6).toFixed(4)})`);
    grad.addColorStop(1,   "rgba(140,160,220,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // ── Nebula clouds ────────────────────────────────────────────────────────
  for (const cloud of NEBULA_CLOUDS) {
    const cx = cloud.cx * w, cy = cloud.cy * h;
    const rx = cloud.rx * w, ry = cloud.ry * h;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(cloud.angle);
    ctx.scale(1, ry / rx);
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    grad.addColorStop(0,   `rgba(${cloud.r},${cloud.g},${cloud.b},${(cloud.opacity*2).toFixed(4)})`);
    grad.addColorStop(0.4, `rgba(${cloud.r},${cloud.g},${cloud.b},${cloud.opacity.toFixed(4)})`);
    grad.addColorStop(1,   `rgba(${cloud.r},${cloud.g},${cloud.b},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Dust stars (temperature-colored, 1×1 px) ────────────────────────────
  // Note: static canvas doesn't scroll — dust stars in layer 0 go here.
  // Layers 1 & 2 are drawn in the animated canvas so they can be offset.
  for (const s of DUST_STARS) {
    if (s.layer !== 0) continue;
    const [r, g, b] = PALETTE_TABLE[s.colorIdx];
    ctx.globalAlpha = s.opacity;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(Math.floor(s.x * w), Math.floor(s.y * h), 1, 1);
  }
  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------------------
// Diffraction spikes (cheap 4-ray cross) — for medium bright stars only
// ---------------------------------------------------------------------------
function drawSpikes(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  alpha: number,
  r: number, g: number, b: number,
  glowR: number
) {
  const spikeLen = glowR * 2.8; // shorter than before (was 3.5)
  ctx.globalAlpha = alpha * 0.30; // dimmer (was 0.45)
  ctx.lineWidth = 0.6;
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
    const ex = px + Math.cos(angle) * spikeLen;
    const ey = py + Math.sin(angle) * spikeLen;
    const grad = ctx.createLinearGradient(px, py, ex, ey);
    grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(ex, ey);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------------------
// Animated frame — twinkling stars + scrollable dust layers
// scrollY is read from a ref written by a passive scroll listener
// ---------------------------------------------------------------------------
function drawTwinkleFrame(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  tSec: number,
  scrollY: number,
  reduced: boolean
) {
  ctx.clearRect(0, 0, w, h);

  // ── Moving dust stars (layers 1 & 2) ─────────────────────────────────────
  for (const s of DUST_STARS) {
    if (s.layer === 0) continue; // layer 0 is on the static canvas
    const [r, g, b] = PALETTE_TABLE[s.colorIdx];
    const offset = reduced ? 0 : scrollY * PARALLAX_SPEED[s.layer];
    const py = ((s.y * h - offset) % h + h) % h; // wrap vertically
    ctx.globalAlpha = s.opacity;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(Math.floor(s.x * w), Math.floor(py), 1, 1);
  }

  // ── Twinkling stars ───────────────────────────────────────────────────────
  for (let i = 0; i < TWINKLE_STARS.length; i++) {
    const s = TWINKLE_STARS[i];
    const wave  = reduced ? 0.65 : (Math.sin(tSec * s.speed + s.phase) + 1) / 2;
    const alpha = s.opacityMin + (s.opacityMax - s.opacityMin) * wave;
    const scale = reduced ? 1 : 1 + 0.08 * wave;
    const [r, g, b] = PALETTE_TABLE[s.colorIdx];

    const parallaxOffset = reduced ? 0 : scrollY * PARALLAX_SPEED[s.layer];
    const px = s.x * w;
    const py = ((s.y * h - parallaxOffset) % h + h) % h;
    const sz = s.size * scale;

    if (s.isBright) {
      // Reduced halo (glowR smaller, alpha lower than before)
      const glowR = 3.0 + 1.5 * wave; // was 5+3

      // Outer halo
      const haloGrad = ctx.createRadialGradient(px, py, 0, px, py, glowR * 2);
      haloGrad.addColorStop(0,   `rgba(${r},${g},${b},${(alpha * 0.22).toFixed(3)})`);
      haloGrad.addColorStop(0.5, `rgba(${r},${g},${b},${(alpha * 0.06).toFixed(3)})`);
      haloGrad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      ctx.fillStyle  = haloGrad;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(px, py, glowR * 2, 0, Math.PI * 2);
      ctx.fill();

      // Core
      const coreGrad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
      coreGrad.addColorStop(0,   `rgba(255,255,255,${alpha.toFixed(3)})`);
      coreGrad.addColorStop(0.4, `rgba(${r},${g},${b},${(alpha * 0.75).toFixed(3)})`);
      coreGrad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      ctx.fillStyle  = coreGrad;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(px, py, glowR, 0, Math.PI * 2);
      ctx.fill();

      // Diffraction spikes — only when bright enough
      if (!reduced && alpha > 0.35) {
        drawSpikes(ctx, px, py, alpha, r, g, b, glowR);
      }

      // Centre pixel
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(px - sz * 0.5, py - sz * 0.5, sz, sz);

    } else if (s.size === 2) {
      // Medium star: tiny glow + pixel
      const glowR = 2.8;
      const grad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
      grad.addColorStop(0, `rgba(${r},${g},${b},${(alpha * 0.42).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle  = grad;
      ctx.globalAlpha = 1;
      ctx.fillRect(px - glowR, py - glowR, glowR * 2, glowR * 2);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(px, py, sz, sz);

    } else {
      // Small star: single coloured pixel
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(px, py, 1, 1);
    }
  }

  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------------------
// Light-mode dust motes
// ---------------------------------------------------------------------------
function drawMotesFrame(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  tSec: number,
  reduced: boolean
) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";

  for (const m of DUST_MOTES) {
    const cycle = reduced
      ? 0.5
      : (((tSec - m.delay) % m.duration) + m.duration) % m.duration;
    const p = cycle / m.duration;

    let alpha: number;
    if (p < 0.2)      alpha = p / 0.2;
    else if (p < 0.8) alpha = 1;
    else              alpha = 1 - (p - 0.8) / 0.2;

    const baseOpacity = 0.09 + (m.size % 10) * 0.01;
    alpha *= baseOpacity;
    if (alpha <= 0.002) continue;

    const dx    = p < 0.5 ? 28 * (p / 0.5) : 28 - 48 * ((p - 0.5) / 0.5);
    const dy    = -180 * p;
    const scale = p < 0.5 ? 1 + 0.1 * (p / 0.5) : 1.1 - 0.1 * ((p - 0.5) / 0.5);
    const r     = (m.size * scale) / 2;

    ctx.globalAlpha = alpha;
    ctx.filter = m.size > 38 ? "blur(22px)" : "blur(14px)";
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
  const isDark  = resolvedTheme === "dark";

  const staticCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animCanvasRef   = useRef<HTMLCanvasElement | null>(null);
  const rafRef          = useRef<number | undefined>(undefined);

  // scrollY stored in a ref — written by a passive listener, read in rAF.
  // Using a ref avoids React state re-renders and guarantees the latest value
  // is always available inside the animation loop with zero overhead.
  const scrollYRef = useRef(0);

  useEffect(() => {
    // Passive scroll listener — cannot block scrolling
    function onScroll() { scrollYRef.current = window.scrollY; }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const animCanvas = animCanvasRef.current;
    if (!animCanvas) return;
    const animCtx = animCanvas.getContext("2d");
    if (!animCtx) return;

    const staticCanvas = isDark ? staticCanvasRef.current : null;
    const staticCtx    = staticCanvas ? staticCanvas.getContext("2d") : null;

    let width  = 0;
    let height = 0;
    const dpr  = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width  = window.innerWidth;
      height = window.innerHeight;
      sizeCanvas(animCanvas as HTMLCanvasElement, animCtx as CanvasRenderingContext2D, width, height, dpr);
      if (staticCanvas && staticCtx) {
        sizeCanvas(staticCanvas, staticCtx, width, height, dpr);
        drawStaticLayer(staticCtx, width, height);
      }
      if (reduced) {
        if (isDark) drawTwinkleFrame(animCtx as CanvasRenderingContext2D, width, height, 0, 0, true);
        else        drawMotesFrame  (animCtx as CanvasRenderingContext2D, width, height, 0, true);
      }
    }

    resize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    }
    window.addEventListener("resize", onResize);

    function frame(timeMs: number) {
      const t = timeMs / 1000;
      if (isDark) {
        drawTwinkleFrame(
          animCtx as CanvasRenderingContext2D,
          width, height, t,
          scrollYRef.current,
          false
        );
      } else {
        drawMotesFrame(animCtx as CanvasRenderingContext2D, width, height, t, false);
      }
      rafRef.current = requestAnimationFrame(frame);
    }

    if (!reduced) {
      rafRef.current = requestAnimationFrame(frame);
    }

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
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
          {/* Ambient nebula glow — pure CSS */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 45% at 18% 20%, rgba(67,56,202,0.11) 0%, transparent 70%)," +
                "radial-gradient(ellipse 55% 40% at 78% 12%, rgba(124,58,237,0.09) 0%, transparent 65%)," +
                "radial-gradient(ellipse 70% 30% at 50% 5%,  rgba(0,120,255,0.05) 0%, transparent 60%)," +
                "radial-gradient(ellipse 40% 25% at 85% 80%, rgba(6,182,212,0.04) 0%, transparent 60%)",
            }}
          />
          {/* Layer 0: static (Milky Way + nebulae + far dust) — drawn once */}
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

      {/* Layer 1+2: animated — twinkling + mid/near parallax dust */}
      <canvas ref={animCanvasRef} className="absolute inset-0" />
    </div>
  );
}