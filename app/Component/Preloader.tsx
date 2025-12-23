// app/components/Preloader.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const BG_FROM = "#071126"; // deep navy
const BG_TO = "#0ea5b7"; // cyan/teal

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [startExit, setStartExit] = useState(false);
  const ctrls = useAnimation();

  // tile grid (5x5) for peel-away exit
  const grid = useMemo(() => {
    const n = 5;
    const center = (n - 1) / 2;
    const cells: { r: number; c: number; dist: number; id: string }[] = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const dr = Math.abs(r - center);
        const dc = Math.abs(c - center);
        const dist = Math.sqrt(dr * dr + dc * dc); // euclidean
        cells.push({ r, c, dist, id: `tile-${r}-${c}` });
      }
    }
    // sort by dist so center disappear first
    cells.sort((a, b) => a.dist - b.dist);
    return { cells, n, center };
  }, []);

  useEffect(() => {
    // Shortened sequence timings for a snappy loader
    const drawDuration = 520; // ms - SVG stroke draw (shorter)
    const fillDelay = 80; // ms - after draw complete before fill
    const showHold = 120; // ms - short hold before exit
    const tileDuration = 820; // slower, more premium
    const maxExtra = 260; // allows outer tiles to finish cleanly

    // Start SVG stroke draw controller
    ctrls.start("draw");

    const t1 = window.setTimeout(() => {
      ctrls.start("filled");
    }, drawDuration + fillDelay);

    const t2 = window.setTimeout(() => {
      setStartExit(true);
    }, drawDuration + fillDelay + showHold);

    const t3 = window.setTimeout(() => {
      setVisible(false);
    }, drawDuration + fillDelay + showHold + tileDuration + maxExtra);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [ctrls]);

  if (!visible) return null;

  // For SVG stroke dash length we set a generous value and animate offset -> 0
  const strokeDash = 1200;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${BG_FROM} 0%, ${BG_TO} 100%)`,
      }}
    >
      {/* subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/8 to-transparent" />

      {/* Center SVG "HELLO" */}
      <div className="relative z-20 flex items-center justify-center px-4">
        <motion.svg
          width="560"
          height="120"
          viewBox="0 0 560 120"
          xmlns="http://www.w3.org/2000/svg"
          className="max-w-[88vw] w-[560px] h-auto"
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* One <text> per letter so we can stagger drawing */}
          {["H", "E", "L", "L", "O"].map((ch, i) => {
            const x = 8 + i * 106; // tightened spacing for smaller width
            const delay = i * 0.09; // faster stagger
            return (
              <g key={i} transform={`translate(${x}, 84)`}>
                {/* stroked text (draw) */}
                <motion.text
                  initial={{ strokeDashoffset: strokeDash, opacity: 1 }}
                  animate={ctrls}
                  variants={{
                    draw: {
                      strokeDashoffset: 0,
                      transition: { delay, duration: 0.5, ease: "easeInOut" },
                    },
                    filled: {
                      strokeDashoffset: 0,
                      transition: { duration: 0.08 },
                    },
                  }}
                  stroke="url(#g1)"
                  strokeWidth={3.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="transparent"
                  fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
                  fontWeight={800}
                  fontSize={84}
                  style={{ paintOrder: "stroke" }}
                >
                  <tspan
                    x={0}
                    y={0}
                    style={{ vectorEffect: "non-scaling-stroke" }}
                  >
                    {ch}
                  </tspan>
                </motion.text>

                {/* filled white copy which fades in after drawing */}
                <motion.text
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={ctrls}
                  variants={{
                    draw: { opacity: 0 },
                    filled: {
                      opacity: 1,
                      scale: 1,
                      transition: { delay: delay + 0.42, duration: 0.16 },
                    },
                  }}
                  fill="#ffffff"
                  stroke="none"
                  fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
                  fontWeight={800}
                  fontSize={84}
                  style={{ transformOrigin: "center center" }}
                >
                  <tspan x={0} y={0}>
                    {ch}
                  </tspan>
                </motion.text>
              </g>
            );
          })}
        </motion.svg>
      </div>

      {/* subtle center radial bloom for the exit */}
      <motion.div
        className="absolute z-10 pointer-events-none rounded-full"
        initial={{ scale: 0.6, opacity: 0.06 }}
        animate={
          startExit
            ? { scale: 2.4, opacity: 0 }
            : { scale: 0.95, opacity: 0.06 }
        }
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          width: 320,
          height: 320,
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.06), transparent 60%)",
        }}
      />

      {/* 5x5 tiles overlay for peel animation */}
      <div className="absolute inset-0 z-30 grid grid-cols-5 grid-rows-5">
        {grid.cells.map((cell) => {
          const maxDist = Math.sqrt(
            ((grid.n - 1) / 2) ** 2 + ((grid.n - 1) / 2) ** 2
          );
          const norm = cell.dist / maxDist; // 0..1
          const tileDelay = norm * 0.12; // seconds, smaller
          const effectiveDelay = startExit ? tileDelay : 999;
          return (
            <motion.div
              key={cell.id}
              className="w-full h-full bg-[rgba(7,17,38,0.95)]"
              initial={{ scale: 1, opacity: 1, rotate: 0 }}
              animate={
                startExit
                  ? {
                      scale: [1, 0.9, 0.14],
                      opacity: [1, 0.92, 0],
                      rotate: [
                        0,
                        -6 + Math.random() * 12,
                        10 * (Math.random() > 0.5 ? 1 : -1),
                      ],
                      transition: {
                        delay: effectiveDelay,
                        duration: 0.5,
                        ease: [0.2, 0.8, 0.25, 1],
                      },
                    }
                  : {}
              }
              style={{
                borderRight: "1px solid rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
