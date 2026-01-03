"use client";

import React, { useEffect, useRef, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";

export default function GitHubActivity() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // tuning constants
  const WEEKS = 53; // approx number of columns in a year
  const MIN_BLOCK = 3; // allow smaller blocks to avoid overflow on small screens
  const IDEAL_BLOCK = 12;
  const MAX_BLOCK = 28; // allow bigger blocks on large screens
  const BLOCK_MARGIN = 4;

  const [blockSize, setBlockSize] = useState<number>(IDEAL_BLOCK);
  const [fontSize, setFontSize] = useState<number>(14);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const recalc = (width: number) => {
      // compute inner available width (exclude horizontal padding)
      const style = getComputedStyle(el);
      const padLeft = parseFloat(style.paddingLeft || "0");
      const padRight = parseFloat(style.paddingRight || "0");
      const available = Math.max(0, width - padLeft - padRight - 8); // safety gap

      // compute candidate pixel size per block so the whole calendar fits
      const totalMargins = (WEEKS - 1) * BLOCK_MARGIN;
      const candidate = Math.floor((available - totalMargins) / WEEKS);

      // Final block size policy:
      // - if candidate is >= MIN_BLOCK, clamp it to MAX_BLOCK (so big screens get larger blocks)
      // - if candidate is < MIN_BLOCK but > 0, use candidate (so it will fit small screens)
      // - never let block be less than 1
      let finalBlock: number;
      if (candidate >= MIN_BLOCK) {
        finalBlock = Math.min(candidate, MAX_BLOCK);
      } else {
        finalBlock = Math.max(1, candidate); // allow smaller than MIN_BLOCK to avoid overflow
      }

      setBlockSize(finalBlock);

      // font size scaled to block size, with sensible min/max bounds
      const calcFont = Math.round(finalBlock * 1.05);
      setFontSize(Math.min(18, Math.max(9, calcFont)));
    };

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) recalc(entry.contentRect.width);
    });

    ro.observe(el);
    recalc(el.getBoundingClientRect().width); // initial

    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-6"
    >
      {/* 
        Keep the calendar at its intrinsic width (max-content) so it doesn't get stretched
        and looks appropriately sized on very wide containers. If the parent is narrower,
        ResizeObserver will shrink blocks to fit (preventing overflow).
      */}
      <div style={{ display: "inline-block", width: "max-content" }}>
        <GitHubCalendar
          username="wahb-amir"
          weekStart={1}
          blockSize={blockSize}
          blockMargin={BLOCK_MARGIN}
          fontSize={fontSize}
          colorScheme={theme === "dark" ? "dark" : "light"}
          theme={{
            light: ["#e5e7eb", "#22c55e"],
            dark: ["#020617", "#22c55e"],
          }}
          labels={{
            totalCount: "{{count}} contributions in the last year",
          }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Showing my GitHub activity since I started coding in May 2025.
      </p>
    </div>
  );
}
