"use client";

// ─── CalendarDesktop ──────────────────────────────────────────────────────────
// This file is the ONLY place `react-activity-calendar` is imported.
// It is always loaded via next/dynamic({ ssr: false }) from ActivityClient,
// so the heavy library (~40 kB parsed) is code-split into its own chunk and
// never blocks the main-thread during initial page load / hydration.

import { cloneElement } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import type { DayItem } from "./config";
import { CALENDAR_THEME } from "./config";

interface Props {
  data: DayItem[];
  isDark: boolean;
  onMouseEnter: (e: React.MouseEvent, date: string, count: number) => void;
  onMouseMove:  (e: React.MouseEvent, date: string, count: number) => void;
  onMouseLeave: () => void;
  onClick:      (e: React.MouseEvent, date: string, count: number) => void;
}

export default function CalendarDesktop({
  data,
  isDark,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onClick,
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        animation: "gh-fade-up 0.45s 0.05s ease both",
      }}
    >
      <div style={{ display: "inline-block", minWidth: "max-content" }}>
        <ActivityCalendar
          data={data}
          theme={{
            light: [...CALENDAR_THEME.light],
            dark: [...CALENDAR_THEME.dark],
          }}
          maxLevel={4}
          blockSize={12}
          blockMargin={4}
          fontSize={11}
          showWeekdayLabels={false}
          renderBlock={(block, activity) =>
            cloneElement(block, {
              onMouseEnter: (e: React.MouseEvent) =>
                onMouseEnter(e, activity.date, activity.count),
              onMouseMove: (e: React.MouseEvent) =>
                onMouseMove(e, activity.date, activity.count),
              onMouseLeave: onMouseLeave,
              onClick: (e: React.MouseEvent) =>
                onClick(e, activity.date, activity.count),
              style: { cursor: "pointer", ...(block.props?.style ?? {}) },
            })
          }
        />
      </div>
    </div>
  );
}
