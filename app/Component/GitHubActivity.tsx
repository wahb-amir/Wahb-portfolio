"use client";

import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";

export default function GitHubActivity() {
  const { theme } = useTheme();

  return (
    <div className="w-full overflow-x-auto rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-6">
      <GitHubCalendar
        username="wahb-amir"
        weekStart={1}
        blockSize={12}
        blockMargin={4}
        fontSize={14}
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
