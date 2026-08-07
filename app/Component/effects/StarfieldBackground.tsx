"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

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

// ---------------------------------------------------------------------------
// Lazy data — generated on first mount (not at module parse) to avoid blocking
// the main thread during initial JS evaluation.
// ---------------------------------------------------------------------------
type StarfieldData = {
  dustStars: DustStar[];
  twinkleStars: TwinkleStar[];
  dustMotes: DustMote[];
  nebulaClouds: NebulaCloud[];
  milkyWayPts: MilkyWayPoint[];
};

let cachedStarfieldData: StarfieldData | null = null;

function getStarCounts() {
  const mobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  return {
    dust: mobile ? 550 : DUST_STAR_COUNT,
    twinkle: mobile ? 170 : TWINKLE_COUNT,
    bright: mobile ? 8 : BRIGHT_COUNT,
    motes: mobile ? 14 : DUST_MOTE_COUNT,
    nebula: mobile ? 5 : NEBULA_COUNT,
    milkyWay: mobile ? 70 : MILKY_WAY_PTS_N,
  };
}

function buildStarfieldData(): StarfieldData {
  const counts = getStarCounts();
  const seedDust = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;

  const dustRng = createPrng(seedDust);
  const dustStars: DustStar[] = Array.from({ length: counts.dust }, () => {
    const layerRoll = dustRng();
    const layer: 0 | 1 | 2 = layerRoll < 0.5 ? 0 : layerRoll < 0.82 ? 1 : 2;
    const isDust = dustRng() < 0.30;
    const colorIdx = isDust
      ? PALETTE_LEN - Math.floor(dustRng() * 2) - 1
      : Math.floor(dustRng() * (PALETTE_LEN - 2));
    const opacity = isDust
      ? 0.14 + dustRng() * 0.26
      : 0.08 + dustRng() * 0.18;
    return { x: dustRng(), y: dustRng(), opacity, colorIdx, layer };
  });

  const twinkleRng = createPrng(SEED_TWINK);
  const twinkleStars: TwinkleStar[] = [];
  for (let i = 0; i < counts.twinkle; i++) {
    const base = 0.22 + twinkleRng() * 0.42;
    const size: 1 | 2 = twinkleRng() < 0.15 ? 2 : 1;
    const duration = 2.5 + twinkleRng() * 4.5;
    const layerRoll = twinkleRng();
    const layer: 0 | 1 | 2 = layerRoll < 0.5 ? 0 : layerRoll < 0.82 ? 1 : 2;
    twinkleStars.push({
      x: twinkleRng(), y: twinkleRng(),
      size,
      phase: twinkleRng() * Math.PI * 2,
      speed: (2 * Math.PI) / duration,
      opacityMin: +(base * 0.14).toFixed(3),
      opacityMax: +base.toFixed(3),
      colorIdx: Math.floor(twinkleRng() * PALETTE_LEN),
      isBright: false,
      layer,
    });
  }
  const bRng = createPrng(SEED_TWINK + 1);
  for (let i = 0; i < counts.bright; i++) {
    const base = 0.48 + bRng() * 0.28;
    const duration = 4 + bRng() * 4;
    twinkleStars.push({
      x: bRng(), y: bRng(),
      size: 2,
      phase: bRng() * Math.PI * 2,
      speed: (2 * Math.PI) / duration,
      opacityMin: +(base * 0.25).toFixed(3),
      opacityMax: +base.toFixed(3),
      colorIdx: Math.floor(bRng() * PALETTE_LEN),
      isBright: true,
      layer: 1,
    });
  }

  const moteRng = createPrng(SEED_MOTE);
  const dustMotes: DustMote[] = Array.from({ length: counts.motes }, () => ({
    x: moteRng(), y: moteRng(),
    size: 18 + Math.floor(moteRng() * 36),
    delay: moteRng() * 30,
    duration: 14 + moteRng() * 16,
  }));

  const nebulaRng = createPrng(SEED_NEBULA);
  const palette: Array<[number, number, number]> = [
    [100, 60, 200], [60, 90, 200], [20, 130, 210],
    [200, 60, 100], [80, 60, 180], [60, 140, 180], [70, 55, 45],
  ];
  const nebulaClouds: NebulaCloud[] = Array.from({ length: counts.nebula }, (_, i) => {
    const [r, g, b] = palette[i % palette.length];
    const isDark = i === 6;
    return {
      cx: 0.05 + nebulaRng() * 0.90, cy: 0.05 + nebulaRng() * 0.90,
      rx: 0.09 + nebulaRng() * 0.20, ry: 0.05 + nebulaRng() * 0.12,
      r, g, b,
      opacity: isDark ? 0.018 + nebulaRng() * 0.017 : 0.030 + nebulaRng() * 0.030,
      angle: nebulaRng() * Math.PI,
    };
  });

  const mwRng = createPrng(SEED_NEBULA + 1);
  const milkyWayPts: MilkyWayPoint[] = Array.from({ length: counts.milkyWay }, () => ({
    t: mwRng(),
    perpOffset: (mwRng() * 2 - 1) * 0.5,
    opacity: 0.007 + mwRng() * 0.014,
  }));

  return { dustStars, twinkleStars, dustMotes, nebulaClouds, milkyWayPts };
}

function getStarfieldData(): StarfieldData {
  if (!cachedStarfieldData) {
    cachedStarfieldData = buildStarfieldData();
  }
  return cachedStarfieldData;
}

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
function drawStaticLayer(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  data: StarfieldData,
) {
  ctx.clearRect(0, 0, w, h);

  // ── Milky Way diagonal band ──────────────────────────────────────────────
  const bandAngle = 0.42;
  const cos = Math.cos(bandAngle);
  const sin = Math.sin(bandAngle);
  const bandW = Math.min(w, h) * 0.17;

  ctx.save();
  for (const pt of data.milkyWayPts) {
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
  for (const cloud of data.nebulaClouds) {
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
  for (const s of data.dustStars) {
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
  w: number,
  h: number,
  tSec: number,
  scrollY: number,
  reduced: boolean,
  data: StarfieldData,
) {
  ctx.clearRect(0, 0, w, h);

  // ── Moving dust stars (layers 1 & 2) ─────────────────────────────────────
  for (const s of data.dustStars) {
    if (s.layer === 0) continue; // layer 0 is on the static canvas
    const [r, g, b] = PALETTE_TABLE[s.colorIdx];
    const offset = reduced ? 0 : scrollY * PARALLAX_SPEED[s.layer];
    const py = ((s.y * h - offset) % h + h) % h; // wrap vertically
    ctx.globalAlpha = s.opacity;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(Math.floor(s.x * w), Math.floor(py), 1, 1);
  }

  // ── Twinkling stars ───────────────────────────────────────────────────────
  for (let i = 0; i < data.twinkleStars.length; i++) {
    const s = data.twinkleStars[i];
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
  w: number,
  h: number,
  tSec: number,
  reduced: boolean,
  data: StarfieldData,
) {
  ctx.clearRect(0, 0, w, h);
  // Atmospheric motes: warm pearl / soft sky-white palette
  const MOTE_COLORS = ["#f8fafc", "#f1f5f9", "#e2e8f0", "#fffbf0", "#fef9ec"];

  for (const m of data.dustMotes) {
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
    ctx.filter = m.size > 38 ? "blur(24px)" : "blur(16px)";
    // Pick a warm atmospheric mote color
    ctx.fillStyle = MOTE_COLORS[Math.floor(m.size % MOTE_COLORS.length)];
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
  const [reduced, setReduced] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const isDark = resolvedTheme === "dark";

  const staticCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const scrollYRef = useRef(0);
  const visibleRef = useRef(true);
  const dataRef = useRef<StarfieldData | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Defer canvas init until after first paint / idle time
  useEffect(() => {
    const start = () => {
      dataRef.current = getStarfieldData();
      setCanvasReady(true);
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 1800 });
      return () => window.cancelIdleCallback(id);
    } else {
      const t = window.setTimeout(start, 120);
      return () => window.clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    function onScroll() {
      scrollYRef.current = window.scrollY;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onVis = () => {
      visibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (!canvasReady || !dataRef.current) return;

    // ── Light mode: CSS fallback in StarfieldBackgroundClient already
    //    provides the visual. Running rAF here causes ctx.filter="blur(...)"
    //    on every frame → forced reflow → TBT spike. Skip entirely.
    if (!isDark) return;

    const data = dataRef.current;
    const animCanvas = animCanvasRef.current;
    if (!animCanvas) return;
    const animCtx = animCanvas.getContext("2d");
    if (!animCtx) return;

    const staticCanvas = staticCanvasRef.current;
    const staticCtx = staticCanvas ? staticCanvas.getContext("2d") : null;

    let width = 0;
    let height = 0;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    const frameBudget = mobile ? 33 : 16;
    let lastFrameMs = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      sizeCanvas(animCanvas as HTMLCanvasElement, animCtx as CanvasRenderingContext2D, width, height, dpr);
      if (staticCanvas && staticCtx) {
        sizeCanvas(staticCanvas, staticCtx, width, height, dpr);
        drawStaticLayer(staticCtx, width, height, data);
      }
      if (reduced) {
        drawTwinkleFrame(animCtx as CanvasRenderingContext2D, width, height, 0, 0, true, data);
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
      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }
      if (timeMs - lastFrameMs < frameBudget) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }
      lastFrameMs = timeMs;

      drawTwinkleFrame(
        animCtx as CanvasRenderingContext2D,
        width,
        height,
        timeMs / 1000,
        scrollYRef.current,
        reduced,
        data,
      );
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
  }, [isDark, reduced, canvasReady]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
    >
      {/* ══════════════ DARK MODE only ══════════════
          Light-mode gradients live entirely in StarfieldBackgroundClient
          (pure CSS, no JS, no canvas, no DOM overhead here). */}
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
          {/* Layer 1+2: animated — twinkling + mid/near parallax dust */}
          <canvas ref={animCanvasRef} className="absolute inset-0" />
        </>
      )}
    </div>
  );
}