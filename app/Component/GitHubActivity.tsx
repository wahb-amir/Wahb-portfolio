"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";

type DayItem = { date: string; count: number; level: number };

export default function GitHubActivity() {
  const { theme } = useTheme();
  const [data, setData] = useState<DayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // 1) detect mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 2) fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/github-activity");
        const json = await res.json();
        setData(json || []);
      } catch (err) {
        console.error("Failed to fetch activity:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 3) processedData: full year (desktop) or last ~90 days (mobile)
  const processedData = useMemo(() => {
    if (!isMobile) return data;
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return data.filter((d) => new Date(d.date) >= threeMonthsAgo);
  }, [data, isMobile]);

  // palette
  const calendarTheme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  };

  // helpers for mobile grid
  const mobileGrid = useMemo(() => {
    if (!processedData || processedData.length === 0) return null;

    // sort ascending by date (safety)
    const sorted = [...processedData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstDate = new Date(sorted[0].date);
    const firstDayOfWeek = firstDate.getDay(); // 0..6 (Sun..Sat)
    const n = sorted.length;

    // number of week columns needed
    const cols = Math.ceil((firstDayOfWeek + n) / 7);

    // create empty grid: cols x 7
    const grid: (DayItem | null)[][] = Array.from({ length: cols }, () =>
      Array.from({ length: 7 }, () => null)
    );

    // fill grid by computing week index and weekday for each day
    sorted.forEach((d) => {
      const dt = new Date(d.date);
      // weekIndex relative to firstDate:
      // daysSinceStart = difference in days between dt and firstDate
      const daysSinceStart = Math.floor(
        (dt.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const position = firstDayOfWeek + daysSinceStart;
      const weekIndex = Math.floor(position / 7);
      const weekday = dt.getDay(); // 0..6
      if (weekIndex >= 0 && weekIndex < cols) {
        grid[weekIndex][weekday] = d;
      }
    });

    return { grid, cols, firstDate };
  }, [processedData]);

  function levelColor(level: number) {
    const pal = theme === "dark" ? calendarTheme.dark : calendarTheme.light;
    const idx = Math.max(0, Math.min(pal.length - 1, level));
    return pal[idx];
  }

  // mobile sizing
  const MOBILE_MIN_BLOCK = 8;
  const MOBILE_MAX_BLOCK = 14;
  const MOBILE_MARGIN = 4;

  // pick a reasonable block size for mobile that keeps things readable and fits typical phones
  const pickMobileBlock = (cols: number) => {
    if (!cols) return MOBILE_MIN_BLOCK;
    // assume container inner width ~ window.innerWidth - 48 padding (p-6)
    const available = Math.max(280, window.innerWidth - 48);
    const totalGaps = (cols - 1) * MOBILE_MARGIN;
    const candidate = Math.floor((available - totalGaps) / cols);
    return Math.max(MOBILE_MIN_BLOCK, Math.min(MOBILE_MAX_BLOCK, candidate));
  };

  return (
    <div className="w-full rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-4">
          {isMobile ? "Recent activity" : "GitHub Contributions"}
        </h3>

        <div className="flex justify-center items-center">
          {loading ? (
            // plain skeleton
            <div className="h-[120px] w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          ) : !isMobile ? (
            // desktop: use ActivityCalendar (full-year)
            data && data.length > 0 ? (
              <ActivityCalendar
                data={processedData}
                theme={calendarTheme}
                maxLevel={4}
                blockSize={12}
                blockMargin={4}
                fontSize={12}
                showWeekdayLabels={false}
              />
            ) : (
              <p className="text-sm text-slate-500">No activity found.</p>
            )
          ) : // mobile: custom compact grid
          mobileGrid && mobileGrid.grid.length > 0 ? (
            (() => {
              const { grid, cols, firstDate } = mobileGrid;
              const block = pickMobileBlock(cols);

              return (
                <div
                  className="inline-block"
                  style={{
                    width: `${cols * (block + MOBILE_MARGIN)}px`,
                  }}
                >
                  <div style={{ display: "flex", gap: `${MOBILE_MARGIN}px` }}>
                    {grid.map((col, ci) => (
                      <div
                        key={ci}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: `${MOBILE_MARGIN}px`,
                        }}
                      >
                        {col.map((cell, ri) => {
                          // title: date & count if available
                          const title = cell
                            ? `${cell.date} — ${cell.count} contributions`
                            : undefined;
                          const bg = cell
                            ? levelColor(cell.level)
                            : theme === "dark"
                            ? "#0b1220"
                            : "#f3f4f6";
                          return (
                            <div
                              key={ri}
                              title={title}
                              className="rounded-sm"
                              style={{
                                width: `${block}px`,
                                height: `${block}px`,
                                background: bg,
                                borderRadius: 3,
                              }}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()
          ) : (
            <p className="text-sm text-slate-500">No recent activity.</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500">
          <span>{isMobile ? "View on GitHub" : "Activity since May 2025"}</span>
          <div className="flex items-center gap-1">
            <span className="text-xs">Less</span>
            <div className="flex gap-1 items-center">
              {calendarTheme.dark.map((color) => (
                <div
                  key={color}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-xs">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
