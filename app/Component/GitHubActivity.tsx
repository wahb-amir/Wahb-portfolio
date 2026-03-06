"use client";

import React, {
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";

type DayItem = { date: string; count: number; level: number };

/* ─── Skeleton shimmer ─── */
function SkeletonBlock({
  isDark,
  delay = 0,
}: {
  isDark: boolean;
  delay?: number;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 4,
        background: isDark
          ? "linear-gradient(90deg, #0d1b2a 25%, #162032 50%, #0d1b2a 75%)"
          : "linear-gradient(90deg, #e8edf2 25%, #f4f7fa 50%, #e8edf2 75%)",
        backgroundSize: "200% 100%",
        animation: `shimmer 1.6s ease-in-out ${delay}ms infinite`,
      }}
    />
  );
}

function SkeletonGrid({ isDark }: { isDark: boolean }) {
  const cols = 53;
  const rows = 7;

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      {/* Month label row skeleton */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 6,
          paddingLeft: 0,
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 10,
              width: 28,
              borderRadius: 4,
              marginRight: Math.floor(cols / 12) * 16 - 32,
              background: isDark ? "#1a2535" : "#e8edf2",
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Grid skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 12px)`,
          gridTemplateRows: `repeat(${rows}, 12px)`,
          gap: 4,
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => {
          const col = Math.floor(i / rows);
          const row = i % rows;
          const delay = (col * 20 + row * 8) % 400;
          // Randomly skip some cells to mimic GitHub's realistic shape
          const skip = Math.random() > 0.92 && col < 2;
          return (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                opacity: skip ? 0 : 1,
                overflow: "hidden",
              }}
            >
              {!skip && <SkeletonBlock isDark={isDark} delay={delay} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PulsingDots({ isDark }: { isDark: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "32px 0",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: isDark ? "#26a641" : "#30a14e",
            animation: `pulse-dot 1.2s ease-in-out ${i * 180}ms infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main Component ─── */
export default function GitHubActivity() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState<DayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    text: string;
    left: number;
    top: number;
    pinned: boolean;
  }>({ visible: false, text: "", left: 0, top: 0, pinned: false });

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(ev.target as Node)) {
        setTooltip((t) => ({ ...t, visible: false, pinned: false }));
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const processedData = useMemo(() => {
    if (!isMobile) return data;
    const daysToShow = Math.round(4.5 * 30.4375);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysToShow);
    return data.filter((d) => new Date(d.date) >= cutoff);
  }, [data, isMobile]);

  const calendarTheme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: [
      isDark ? "#161b22" : "#b3b2b2",
      "#0e4429",
      "#006d32",
      "#26a641",
      "#39d353",
    ],
  };

  const dateRange = useMemo(() => {
    if (!processedData || !Array.isArray(processedData) || processedData.length === 0) return null;
    const dates = processedData.map((d) => new Date(d.date));
    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    return { start: min, end: max, days: processedData.length };
  }, [processedData]);

  const totalContributions = useMemo(
    () => (processedData?.reduce((s, d) => s + (d.count || 0), 0) ?? 0),
    [processedData]
  );

  function levelColor(level: number) {
    const pal = isDark ? calendarTheme.dark : calendarTheme.light;
    return pal[Math.max(0, Math.min(pal.length - 1, level))];
  }

  /* ─── Mobile grid ─── */
  const mobileGrid = useMemo(() => {
    if (!processedData || processedData.length === 0) return null;
    const sorted = [...processedData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const firstDate = new Date(sorted[0].date);
    const firstDayOfWeek = firstDate.getDay();
    const n = sorted.length;
    const cols = Math.ceil((firstDayOfWeek + n) / 7);
    const grid: (DayItem | null)[][] = Array.from({ length: cols }, () =>
      Array.from({ length: 7 }, () => null)
    );
    sorted.forEach((d) => {
      const dt = new Date(d.date);
      const daysSinceStart = Math.floor(
        (dt.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const position = firstDayOfWeek + daysSinceStart;
      const weekIndex = Math.floor(position / 7);
      const weekday = dt.getDay();
      if (weekIndex >= 0 && weekIndex < cols) grid[weekIndex][weekday] = d;
    });
    return { grid, cols, firstDate };
  }, [processedData]);

  const pickMobileBlock = (cols: number) => {
    if (typeof window === "undefined") return 4;
    const safeViewport = Math.max(220, window.innerWidth - 32);
    const baseGap = 3;
    const candidate = Math.floor((safeViewport - (cols - 1) * baseGap) / cols);
    const maxBlock = window.innerWidth < 450 ? 9 : 13;
    return Math.max(4, Math.min(maxBlock, candidate));
  };

  /* ─── Tooltip helpers ─── */
  const showTooltipAt = (e: React.MouseEvent, text: string, pinned = false) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const left = Math.min(Math.max(8, e.clientX - rect.left - 10), rect.width - 8);
    const top = Math.max(6, e.clientY - rect.top - 44);
    setTooltip({ visible: true, text, left, top, pinned });
  };

  const hideTooltip = () =>
    setTooltip((t) => (t.pinned ? t : { visible: false, text: "", left: 0, top: 0, pinned: false }));

  const togglePinTooltip = (e: React.MouseEvent, text: string, cellExists: boolean) => {
    if (!cellExists) return;
    setTooltip((t) =>
      t.pinned
        ? { visible: false, text: "", left: 0, top: 0, pinned: false }
        : { ...t, pinned: true, text }
    );
    showTooltipAt(e, text, !tooltip.pinned);
  };

  const formatTitle = (date: string, count: number) =>
    `${date} — ${count} contribution${count === 1 ? "" : "s"}`;

  /* ─── Styles ─── */
  const bg = isDark ? "rgba(13,19,33,0.75)" : "rgba(248,250,253,0.92)";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const headingColor = isDark ? "#c9d8eb" : "#0f172a";
  const subColor = isDark ? "#4a6380" : "#9ca3af";
  const badgeBg = isDark ? "rgba(38,166,65,0.14)" : "rgba(48,161,78,0.09)";
  const badgeColor = isDark ? "#39d353" : "#216e39";

  /* ─── Legend ─── */
  const Legend = () => {
    const pal = isDark ? calendarTheme.dark : calendarTheme.light;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
        <span style={{ fontSize: 11, color: subColor, letterSpacing: "0.02em" }}>Less</span>
        <div style={{ display: "flex", gap: 4 }}>
          {pal.map((c, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                background: c,
                borderRadius: 3,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 11, color: subColor, letterSpacing: "0.02em" }}>More</span>
      </div>
    );
  };

  return (
    <>
      {/* Global keyframe styles */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(0.7); opacity: 0.4; }
          50%       { transform: scale(1.2); opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(57,211,83,0); }
          50%       { box-shadow: 0 0 14px 2px rgba(57,211,83,0.18); }
        }
        .gh-container {
          animation: fade-in-up 0.5s ease both;
        }
        .gh-block-enter {
          animation: fade-in-up 0.3s ease both;
        }
      `}</style>

      <div
        ref={containerRef}
        className="gh-container"
        style={{
          width: "100%",
          maxWidth: 980,           
          margin: "24px auto",    
          boxSizing: "border-box",
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 20,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "20px 20px 16px",
          position: "relative",
          boxShadow: isDark
            ? "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "0 2px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* GitHub icon dot */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: loading
                  ? isDark ? "#2a3a50" : "#d1d8e0"
                  : "#39d353",
                animation: loading ? undefined : "glow-pulse 2.4s ease infinite",
                transition: "background 0.4s ease",
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: headingColor,
                letterSpacing: "0.01em",
              }}
            >
              {isMobile ? "Recent Activity" : "GitHub Contributions"}
            </span>
          </div>

          {/* Badge — shown when data loaded */}
          {!loading && processedData.length > 0 && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 10px",
                borderRadius: 20,
                background: badgeBg,
                color: badgeColor,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.02em",
                animation: "fade-in-up 0.4s 0.2s ease both",
              }}
            >
              {totalContributions.toLocaleString()} contributions
              {isMobile && dateRange ? ` · ${dateRange.days}d` : ""}
            </div>
          )}

          {/* Skeleton badge while loading */}
          {loading && (
            <div
              style={{
                width: 120,
                height: 22,
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <SkeletonBlock isDark={isDark} delay={0} />
            </div>
          )}
        </div>

        {/* ── Calendar area ── */}
        <div style={{ width: "100%" }}>
          {loading ? (
            /* ── LOADING STATE ── */
            <div>
              {isMobile ? (
                <PulsingDots isDark={isDark} />
              ) : (
                <SkeletonGrid isDark={isDark} />
              )}
            </div>
          ) : !isMobile ? (
            /* ── DESKTOP ── */
            data.length > 0 ? (
              <div
                style={{
                  width: "100%",
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                  animation: "fade-in-up 0.45s 0.05s ease both",
                }}
              >
                <div style={{ display: "inline-block", minWidth: "max-content" }}>
                  <ActivityCalendar
                    data={processedData}
                    theme={calendarTheme}
                    maxLevel={4}
                    blockSize={12}
                    blockMargin={4}
                    fontSize={11}
                    showWeekdayLabels={false}
                    renderBlock={(block, activity) =>
                      cloneElement(block, {
                        onMouseEnter: (e: React.MouseEvent) =>
                          showTooltipAt(e, formatTitle(activity.date, activity.count)),
                        onMouseMove: (e: React.MouseEvent) => {
                          if (tooltip.visible && !tooltip.pinned)
                            showTooltipAt(e, formatTitle(activity.date, activity.count));
                        },
                        onMouseLeave: hideTooltip,
                        onClick: (e: React.MouseEvent) =>
                          togglePinTooltip(e, formatTitle(activity.date, activity.count), true),
                        style: { cursor: "pointer", ...(block.props?.style || {}) },
                      })
                    }
                  />
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: subColor, textAlign: "center", padding: "24px 0" }}>
                No activity data found.
              </p>
            )
          ) : mobileGrid && mobileGrid.grid.length > 0 ? (
            /* ── MOBILE ── */
            (() => {
              const { grid, cols } = mobileGrid;
              const block = pickMobileBlock(cols);
              const margin = Math.max(2, Math.round(block * 0.28));
              return (
                <div
                  style={{
                    width: "100%",
                    overflowX: "auto",
                    WebkitOverflowScrolling: "touch",
                    animation: "fade-in-up 0.45s 0.05s ease both",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      gap: margin,
                    }}
                  >
                    {grid.map((col, ci) => (
                      <div
                        key={ci}
                        style={{ display: "flex", flexDirection: "column", gap: margin }}
                      >
                        {col.map((cell, ri) => {
                          const title = cell
                            ? formatTitle(cell.date, cell.count)
                            : "No contributions";
                          const bg = cell
                            ? levelColor(cell.level)
                            : isDark
                            ? "#0d1520"
                            : "#ebedf0";
                          const isActive =
                            tooltip.visible && tooltip.text === title && !!cell;

                          return (
                            <div
                              key={ri}
                              role={cell ? "button" : "img"}
                              aria-label={title}
                              tabIndex={cell ? 0 : -1}
                              onMouseEnter={(e) => {
                                if (cell) showTooltipAt(e as any, title);
                              }}
                              onMouseMove={(e) => {
                                if (tooltip.visible && !tooltip.pinned)
                                  showTooltipAt(e as any, title);
                              }}
                              onMouseLeave={hideTooltip}
                              onClick={(e) => togglePinTooltip(e, title, !!cell)}
                              style={{
                                width: block,
                                height: block,
                                background: bg,
                                borderRadius: 3,
                                cursor: cell ? "pointer" : "default",
                                transition: "transform 0.1s ease, box-shadow 0.1s ease",
                                transform: isActive ? "scale(1.2)" : undefined,
                                boxShadow: isActive
                                  ? `0 0 0 1.5px ${isDark ? "#39d353" : "#30a14e"}`
                                  : undefined,
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
            <p style={{ fontSize: 13, color: subColor, textAlign: "center", padding: "24px 0" }}>
              No recent activity.
            </p>
          )}
        </div>

        {/* ── Legend (mobile only) ── */}
        {!loading && isMobile && <Legend />}

        {/* ── Desktop footer ── */}
        {!loading && !isMobile && data.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 10,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <Legend />
            <span style={{ fontSize: 11, color: subColor }}>
              {totalContributions.toLocaleString()} contributions in the last year
            </span>
          </div>
        )}

        {/* ── Tooltip ── */}
        {tooltip.visible && (
          <div
            role="tooltip"
            style={{
              position: "absolute",
              left: tooltip.left,
              top: tooltip.top,
              transform: "translate(-50%, 0)",
              background: isDark ? "#0b1320" : "#ffffff",
              color: isDark ? "#d4e4f5" : "#0f172a",
              padding: "6px 10px",
              borderRadius: 10,
              boxShadow: isDark
                ? "0 8px 28px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)"
                : "0 8px 28px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
              fontSize: 12,
              fontWeight: 500,
              zIndex: 60,
              whiteSpace: "nowrap",
              pointerEvents: "auto",
              animation: "fade-in-up 0.15s ease both",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>{tooltip.text}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTooltip((t) => ({ ...t, pinned: !t.pinned }));
              }}
              aria-label={tooltip.pinned ? "Unpin" : "Pin"}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 2,
                fontSize: 12,
                lineHeight: 1,
                color: "inherit",
                opacity: 0.75,
                transition: "opacity 0.15s",
              }}
            >
              {tooltip.pinned ? "📌" : "📍"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}