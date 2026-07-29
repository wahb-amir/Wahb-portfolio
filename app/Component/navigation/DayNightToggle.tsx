"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

interface DayNightToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

// ── Star positions (Big-Dipper-ish constellation) ────────────────────────────
const STARS = [
  { x: 22, y: 28, size: 3.5 },
  { x: 36, y: 20, size: 3 },
  { x: 52, y: 24, size: 3.5 },
  { x: 66, y: 18, size: 3 },
  { x: 78, y: 26, size: 4 },
  { x: 70, y: 38, size: 3 },
  { x: 58, y: 44, size: 3.5 },
];

// ── 4-pointed star path ───────────────────────────────────────────────────────
function starPath(x: number, y: number, size: number) {
  const half = size / 2;
  return `M ${x},${y - size} C ${x},${y - half} ${x + half},${y} ${x + size},${y}
           C ${x + half},${y} ${x},${y + half} ${x},${y + size}
           C ${x},${y + half} ${x - half},${y} ${x - size},${y}
           C ${x - half},${y} ${x},${y - half} ${x},${y - size} Z`;
}

export default function DayNightToggle({
  isDark,
  onToggle,
}: DayNightToggleProps) {
  const W = 88;
  const H = 44;
  const R = H / 2;       // 22 – corner radius
  const knobR = 18;      // knob radius
  const pad = 4;         // padding from pill edge
  const knobX = isDark ? W - pad - knobR : pad + knobR;

  // We only animate `transform` on the knob – always GPU composited
  const knobTranslate = `translateX(${knobX}px) translateY(${H / 2}px)`;

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={onToggle}
      style={{ width: W, height: H }}
      className="relative shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-full"
    >
      {/* ── Pure-CSS pill – no Framer Motion animate props on SVG attrs ── */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "hidden", borderRadius: R, display: "block" }}
      >
        <defs>
          <clipPath id="pill-clip-dnt">
            <rect x={0} y={0} width={W} height={H} rx={R} ry={R} />
          </clipPath>
          {/* Sun glow */}
          <radialGradient id="sun-grad-dnt" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fef08a" />
            <stop offset="60%"  stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </radialGradient>
          {/* Moon gradient */}
          <radialGradient id="moon-grad-dnt" cx="35%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
        </defs>

        <g clipPath="url(#pill-clip-dnt)">
          {/* ── Background: CSS transition on fill via style ── */}
          <rect
            x={0} y={0} width={W} height={H}
            style={{
              fill: isDark ? "#0f172a" : "#60a5fa",
              transition: "fill 0.45s ease",
            }}
          />

          {/* ── Concentric atmosphere rings – CSS transition on cx & stroke ── */}
          {[0, 1, 2, 3, 4].map((i) => {
            const ringR = R * (i + 1) * 1.05;
            const lightColors = ["#bfdbfe","#93c5fd","#60a5fa","#3b82f6","#2563eb"];
            const darkColors  = ["#1e293b","#0f172a","#020617","#111827","#0a0a14"];
            return (
              <circle
                key={i}
                cy={H / 2}
                r={ringR}
                fill="none"
                strokeWidth={ringR * 0.55}
                style={{
                  cx: isDark ? W - R : R,
                  stroke: isDark ? darkColors[i] : lightColors[i],
                  transition: "cx 0.45s ease, stroke 0.45s ease",
                }}
              />
            );
          })}

          {/* ── Stars (dark only) – CSS opacity transition ── */}
          {STARS.map((s, i) => (
            <path
              key={i}
              d={starPath(s.x, s.y, s.size)}
              fill="white"
              style={{
                opacity: isDark ? 1 : 0,
                transform: isDark ? "scale(1)" : "scale(0.4)",
                transformOrigin: `${s.x}px ${s.y}px`,
                transition: `opacity 0.35s ease ${i * 0.04}s, transform 0.35s ease ${i * 0.04}s`,
              }}
            />
          ))}

          {/* ── Clouds (light only) – CSS opacity + translateY ── */}
          <g
            style={{
              opacity: isDark ? 0 : 1,
              transform: isDark ? "translateY(10px)" : "translateY(0px)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
            }}
          >
            {/* Cloud 1 */}
            <g transform="translate(62, 38) scale(0.9)">
              <ellipse cx={0}   cy={0}  rx={14} ry={10} fill="white" />
              <ellipse cx={12}  cy={-4} rx={10} ry={8}  fill="white" />
              <ellipse cx={-10} cy={-2} rx={9}  ry={7}  fill="white" />
              <ellipse cx={22}  cy={2}  rx={8}  ry={7}  fill="white" />
            </g>
            {/* Cloud 2 */}
            <g transform="translate(46, 40) scale(0.7)">
              <ellipse cx={0}   cy={0}  rx={14} ry={10} fill="white" />
              <ellipse cx={12}  cy={-4} rx={10} ry={8}  fill="white" />
              <ellipse cx={-10} cy={-2} rx={9}  ry={7}  fill="white" />
              <ellipse cx={22}  cy={2}  rx={8}  ry={7}  fill="white" />
            </g>
          </g>

          {/* ── Knob – Framer Motion only for spring translateX/Y (transform = GPU) ── */}
          <motion.g
            animate={{ x: knobX, y: H / 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            style={{ willChange: "transform", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.45))" }}
          >
            {/* White border ring */}
            <circle cx={0} cy={0} r={knobR + 2} fill="white" />

            {/* Knob face – instant swap, the spring motion hides any harshness */}
            {isDark ? (
              <>
                <circle cx={0} cy={0} r={knobR} fill="url(#moon-grad-dnt)" />
                <circle cx={-5} cy={-4} r={5}   fill="#94a3b8" opacity={0.55} />
                <circle cx={5}  cy={5}  r={3.5} fill="#94a3b8" opacity={0.45} />
                <circle cx={8}  cy={-6} r={2.5} fill="#94a3b8" opacity={0.4}  />
              </>
            ) : (
              <circle cx={0} cy={0} r={knobR} fill="url(#sun-grad-dnt)" />
            )}
          </motion.g>
        </g>

        {/* ── Pill border – CSS transition ── */}
        <rect
          x={1} y={1}
          width={W - 2} height={H - 2}
          rx={R - 1} ry={R - 1}
          fill="none"
          strokeWidth={2}
          style={{
            stroke: isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.8)",
            transition: "stroke 0.4s ease",
          }}
        />
      </svg>
    </button>
  );
}
