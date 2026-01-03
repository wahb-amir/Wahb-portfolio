"use client";

import React, { useEffect, useState, useMemo } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";

type DayItem = { date: string; count: number; level: number };

export default function GitHubActivity() {
  const { theme } = useTheme();
  const [data, setData] = useState<DayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // 1. Detect screen size for data slicing
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 2. Fetch Data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/github-activity");
        const json = await res.json();
        setData(json || []);
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 3. Slice data: Show full year on desktop, last ~90 days on mobile
  const processedData = useMemo(() => {
    if (!isMobile) return data;

    // Get date from 3 months ago
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    return data.filter((day) => new Date(day.date) >= threeMonthsAgo);
  }, [data, isMobile]);

  const calendarTheme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  };

  return (
    <div className="w-full rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-4">
          {isMobile
            ? "Recent Activity (Last 3 Months)"
            : "GitHub Contributions"}
        </h3>

        <div className="flex justify-center items-center overflow-hidden">
          {loading ? (
            <div className="h-[120px] w-full animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg" />
          ) : data.length > 0 ? (
            <ActivityCalendar
              data={processedData}
              theme={calendarTheme}
              maxLevel={4}
              // We make blocks slightly larger on mobile for touch/visibility
              blockSize={isMobile ? 14 : 12}
              blockMargin={4}
              fontSize={12}
              showWeekdayLabels={false}
              // Hide labels on mobile to save horizontal space
              labels={{
                months: isMobile ? ["", "", "", ""] : undefined,
              }}
            />
          ) : (
            <p className="text-sm text-slate-500">No activity found.</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500">
          <span>
            {isMobile
              ? "View full profile on GitHub"
              : "Activity since May 2025"}
          </span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            {calendarTheme.dark.map((color) => (
              <div
                key={color}
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: color }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
