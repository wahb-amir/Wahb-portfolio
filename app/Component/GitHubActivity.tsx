"use client";

import React, { useEffect, useRef, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";

export default function GitHubActivity() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // tuning constants
  const WEEKS = 53; // approx number of columns in a year
  const MIN_BLOCK = 6;
  const MAX_BLOCK = 18;
  const BLOCK_MARGIN = 4;

  const [blockSize, setBlockSize] = useState<number>(12);
  const [fontSize, setFontSize] = useState<number>(14);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const recalc = (width: number) => {
      // get container horizontal padding to avoid overflow miscalc
      const style = getComputedStyle(el);
      const padLeft = parseFloat(style.paddingLeft || "0");
      const padRight = parseFloat(style.paddingRight || "0");

      // available drawing width inside container
      const available = Math.max(0, width - padLeft - padRight - 8); // small safety gap

      // compute candidate block size
      const candidate = Math.floor(
        (available - (WEEKS - 1) * BLOCK_MARGIN) / WEEKS
      );

      // clamp to min/max so cells remain readable
      const clamped = Math.max(MIN_BLOCK, Math.min(MAX_BLOCK, candidate || MIN_BLOCK));
      setBlockSize(clamped);

      // adjust font size proportionally so labels look good
      setFontSize(Math.max(9, Math.round(clamped * 1.1)));
    };

    // ResizeObserver for responsive container resizing
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        recalc(entry.contentRect.width);
      }
    });

    ro.observe(el);

    // initial calculation
    recalc(el.getBoundingClientRect().width);

    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-6"
    >
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

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Showing my GitHub activity since I started coding in May 2025.
      </p>
    </div>
  );
}
