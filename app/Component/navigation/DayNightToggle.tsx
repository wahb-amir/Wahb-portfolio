"use client";

import { motion, AnimatePresence } from "framer-motion";

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

// ── Concentric circle layers ─────────────────────────────────────────────────
const LIGHT_RINGS = [
  "#bfdbfe", // blue-200
  "#93c5fd", // blue-300
  "#60a5fa", // blue-400
  "#3b82f6", // blue-500
  "#2563eb", // blue-600
];

const DARK_RINGS = [
  "#1e293b", // slate-800
  "#0f172a", // slate-900
  "#020617", // slate-950
  "#111827", // gray-900
  "#0a0a14", // deep-navy
];

// ── 4-pointed star SVG ───────────────────────────────────────────────────────
function Star4({
  x,
  y,
  size,
  delay,
}: {
  x: number;
  y: number;
  size: number;
  delay: number;
}) {
  const half = size / 2;
  const d = `M ${x},${y - size} C ${x},${y - half} ${x + half},${y} ${x + size},${y}
             C ${x + half},${y} ${x},${y + half} ${x},${y + size}
             C ${x},${y + half} ${x - half},${y} ${x - size},${y}
             C ${x - half},${y} ${x},${y - half} ${x},${y - size} Z`;
  return (
    <motion.path
      d={d}
      fill="white"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    />
  );
}

// ── Cloud shape (three overlapping circles) ──────────────────────────────────
function CloudShape({
  cx,
  cy,
  scale = 1,
}: {
  cx: number;
  cy: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      <ellipse cx={0} cy={0} rx={14} ry={10} fill="white" />
      <ellipse cx={12} cy={-4} rx={10} ry={8} fill="white" />
      <ellipse cx={-10} cy={-2} rx={9} ry={7} fill="white" />
      <ellipse cx={22} cy={2} rx={8} ry={7} fill="white" />
    </g>
  );
}

export default function DayNightToggle({
  isDark,
  onToggle,
}: DayNightToggleProps) {
  // pill dimensions
  const W = 88;
  const H = 44;
  const R = H / 2; // 22 – corner radius
  const knobR = 18; // knob radius
  const pad = 4; // padding from pill edge
  const knobCX = isDark ? W - pad - knobR : pad + knobR;

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={onToggle}
      style={{ width: W, height: H }}
      className="relative shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-full"
    >
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "hidden", borderRadius: R }}
      >
        <defs>
          {/* clip to pill shape */}
          <clipPath id="pill-clip">
            <rect x={0} y={0} width={W} height={H} rx={R} ry={R} />
          </clipPath>
          {/* sun glow */}
          <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </radialGradient>
          {/* moon gradient */}
          <radialGradient id="moon-grad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
          {/* knob shadow */}
          <filter id="knob-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor="rgba(0,0,0,0.45)"
            />
          </filter>
          {/* inner shadow for pill */}
          <filter id="inner-shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feFlood floodColor="rgba(0,0,0,0.4)" result="flood" />
            <feComposite in="flood" in2="SourceGraphic" operator="in" result="shadow" />
            <feGaussianBlur in="shadow" stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Background base ───────────────────────────────────────── */}
        <g clipPath="url(#pill-clip)">
          {/* Animated bg color */}
          <motion.rect
            x={0}
            y={0}
            width={W}
            height={H}
            animate={{ fill: isDark ? "#0f172a" : "#60a5fa" }}
            transition={{ duration: 0.5 }}
          />

          {/* Concentric rings emanating from right-center (day) or left-center (night) */}
          {LIGHT_RINGS.map((lightColor, i) => {
            const ringR = R * (i + 1) * 1.05;
            const originX = isDark ? W - R : R;
            return (
              <motion.circle
                key={i}
                cx={originX}
                cy={H / 2}
                r={ringR}
                fill="none"
                strokeWidth={ringR * 0.55}
                animate={{
                  stroke: isDark ? DARK_RINGS[i] : lightColor,
                  cx: isDark ? W - R : R,
                }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
              />
            );
          })}

          {/* ── Stars (dark mode only) ─────────────────────────────── */}
          <AnimatePresence>
            {isDark && (
              <motion.g key="stars">
                {STARS.map((s, i) => (
                  <Star4
                    key={i}
                    x={s.x}
                    y={s.y}
                    size={s.size}
                    delay={i * 0.06}
                  />
                ))}
              </motion.g>
            )}
          </AnimatePresence>

          {/* ── Clouds (light mode only) ──────────────────────────── */}
          <AnimatePresence>
            {!isDark && (
              <motion.g
                key="clouds"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <CloudShape cx={62} cy={38} scale={0.9} />
                <CloudShape cx={46} cy={40} scale={0.7} />
              </motion.g>
            )}
          </AnimatePresence>

          {/* ── Knob ──────────────────────────────────────────────── */}
          <motion.g
            animate={{ x: knobCX, y: H / 2 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            filter="url(#knob-shadow)"
          >
            {/* White border ring */}
            <circle cx={0} cy={0} r={knobR + 2} fill="white" />

            {/* Knob face */}
            {isDark ? (
              // Moon
              <>
                <circle cx={0} cy={0} r={knobR} fill="url(#moon-grad)" />
                {/* Craters */}
                <circle cx={-5} cy={-4} r={5} fill="#94a3b8" opacity={0.55} />
                <circle cx={5} cy={5} r={3.5} fill="#94a3b8" opacity={0.45} />
                <circle cx={8} cy={-6} r={2.5} fill="#94a3b8" opacity={0.4} />
              </>
            ) : (
              // Sun
              <circle cx={0} cy={0} r={knobR} fill="url(#sun-grad)" />
            )}
          </motion.g>
        </g>

        {/* ── Pill border ───────────────────────────────────────────── */}
        <motion.rect
          x={1}
          y={1}
          width={W - 2}
          height={H - 2}
          rx={R - 1}
          ry={R - 1}
          fill="none"
          strokeWidth={2}
          animate={{
            stroke: isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.8)",
          }}
          transition={{ duration: 0.4 }}
        />
      </svg>
    </button>
  );
}
