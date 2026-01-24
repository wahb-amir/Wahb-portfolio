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

export default function GitHubActivity() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState<DayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    text: string;
    left: number;
    top: number;
    pinned: boolean;
  }>({ visible: false, text: "", left: 0, top: 0, pinned: false });

  useEffect(() => {
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

  // For mobile we show a recent slice; desktop shows full (or what the API returned)
  const processedData = useMemo(() => {
    if (!isMobile) return data;
    const monthsToShow = 4.5;
    const daysToShow = Math.round(monthsToShow * 30.4375);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysToShow);
    return data.filter((d) => new Date(d.date) >= cutoff);
  }, [data, isMobile]);

  const calendarTheme = {
    light: ["#161b22", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: [`${isDark?"#161b22":"#b3b2b2"}`, "#0e4429", "#006d32", "#26a641", "#39d353"],
  };

  const dateRange = useMemo(() => {
    if (!processedData || processedData.length === 0) return null;
    const dates = processedData.map((d) => new Date(d.date));
    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    return { start: min, end: max, days: processedData.length };
  }, [processedData]);

  // total contributions from the processed dataset (desktop: full set; mobile: truncated one)
  const totalContributions = useMemo(
    () =>
      processedData && processedData.length > 0
        ? processedData.reduce((s, d) => s + (d.count || 0), 0)
        : 0,
    [processedData]
  );

  function levelColor(level: number) {
    const pal = isDark ? calendarTheme.dark : calendarTheme.light;
    const idx = Math.max(0, Math.min(pal.length - 1, level));
    return pal[idx];
  }

  // Build grid for mobile
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
      if (weekIndex >= 0 && weekIndex < cols) {
        grid[weekIndex][weekday] = d;
      }
    });

    return { grid, cols, firstDate };
  }, [processedData]);

  // sizing constants (min/max block)
  const MOBILE_MIN_BLOCK = 4;
  const MOBILE_MAX_BLOCK_DEFAULT = 14;

  const pickMobileBlock = (cols: number) => {
    if (typeof window === "undefined") return MOBILE_MIN_BLOCK;
    if (!cols) return MOBILE_MIN_BLOCK;

    // horizontal padding for a card-like container
    const horizontalPadding = 32;
    const safeViewport = Math.max(220, window.innerWidth - horizontalPadding);
    const baseGap = 4;
    const candidate = Math.floor((safeViewport - (cols - 1) * baseGap) / cols);
    const maxBlock = window.innerWidth < 450 ? 10 : MOBILE_MAX_BLOCK_DEFAULT;
    return Math.max(MOBILE_MIN_BLOCK, Math.min(maxBlock, candidate));
  };

  // tooltip helpers
  const showTooltipAt = (e: React.MouseEvent, text: string, pinned = false) => {
    if (!containerRef.current) {
      setTooltip({
        visible: true,
        text,
        left: e.clientX,
        top: e.clientY,
        pinned,
      });
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const left = Math.min(
      Math.max(8, e.clientX - rect.left - 10),
      rect.width - 8
    );
    const top = Math.max(6, e.clientY - rect.top - 40);
    setTooltip({ visible: true, text, left, top, pinned });
  };

  const hideTooltip = (pinnedOnly = false) => {
    setTooltip((t) => {
      if (pinnedOnly && t.pinned) return t;
      return { visible: false, text: "", left: 0, top: 0, pinned: false };
    });
  };

  const togglePinTooltip = (
    e: React.MouseEvent,
    text: string,
    cellExists: boolean
  ) => {
    if (!cellExists) return;
    setTooltip((t) =>
      t.pinned
        ? { visible: false, text: "", left: 0, top: 0, pinned: false }
        : { ...t, pinned: true, text: text }
    );
    showTooltipAt(e, text, !tooltip.pinned);
  };

  // tooltip text helper
  const formatTitle = (date: string, count: number) =>
    `${date} — ${count} contribution${count === 1 ? "" : "s"}`;

  const Legend = () => {
    const pal = isDark ? calendarTheme.dark : calendarTheme.light;

    return (
      <div
        className="mt-4"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          overflowX: "auto",
          paddingBottom: 6,
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="text-xs" style={{ color: isDark ? "#94a3b8" : "#6b7280" }}>
          Less
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {pal.map((c, i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                background: c,
                borderRadius: 3,
                border: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(2,6,23,0.04)",
                boxSizing: "border-box",
              }}
              aria-hidden
            />
          ))}
        </div>

        <div className="text-xs" style={{ color: isDark ? "#94a3b8" : "#6b7280" }}>
          More
        </div>
      </div>
    );
  };

  const containerBg = isDark ? "rgba(15,23,42,0.62)" : "rgba(249,250,251,0.88)"; 
  const containerBorder = isDark ? "rgba(71,85,105,0.15)" : "rgba(2,6,23,0.06)";
  const headingColor = isDark ? "#e6eef6" : "#0f172a"; 

  return (
    <div
      ref={containerRef}
      className="mx-auto rounded-2xl backdrop-blur-xl p-5 relative mt-8 mb-6 max-w-full"
      style={{
        boxSizing: "border-box",
        background: containerBg,
        border: `1px solid ${containerBorder}`,
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h3
            className="text-sm font-medium mb-0"
            style={{ color: headingColor }}
          >
            {isMobile
              ? `Recent activity (≈4–5 months)`
              : `GitHub Contributions`}
          </h3>

          {/* UPDATED: Total contributions badge is now hidden on desktop */}
          {isMobile && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(2,6,23,0.04)",
                color: isDark ? "#e6eef6" : "#0f172a",
              }}
              aria-live="polite"
              aria-atomic="true"
            >
              {totalContributions.toLocaleString()} contribution
              {totalContributions === 1 ? "" : "s"}
              {dateRange ? ` • ${dateRange.days} days` : ""}
            </div>
          )}
        </div>

        <div className="flex justify-center items-center">
          {loading ? (
            <div className="h-[120px] w-full animate-pulse rounded-lg" style={{
              background: isDark ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.03)"
            }}/>
          ) : !isMobile ? (
            data && data.length > 0 ? (
              <div
                style={{
                  width: "100%",
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <div style={{ display: "inline-block", minWidth: "max-content" }}>
                  <ActivityCalendar
                    data={processedData}
                    theme={calendarTheme}
                    maxLevel={4}
                    blockSize={12}
                    blockMargin={4}
                    fontSize={12}
                    showWeekdayLabels={false}
                    renderBlock={(block, activity) =>
                      cloneElement(block, {
                        onMouseEnter: (e: React.MouseEvent) =>
                          showTooltipAt(
                            e,
                            formatTitle(activity.date, activity.count),
                            false
                          ),
                        onMouseMove: (e: React.MouseEvent) => {
                          if (tooltip.visible && !tooltip.pinned) {
                            showTooltipAt(
                              e,
                              formatTitle(activity.date, activity.count),
                              false
                            );
                          }
                        },
                        onMouseLeave: () => {
                          if (!tooltip.pinned) hideTooltip();
                        },
                        onClick: (e: React.MouseEvent) =>
                          togglePinTooltip(
                            e,
                            formatTitle(activity.date, activity.count),
                            true
                          ),
                        style: {
                          cursor: "pointer",
                          ...(block.props?.style || {}),
                        },
                      })
                    }
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm" style={{ color: isDark ? "#94a3b8" : "#6b7280" }}>
                No activity found.
              </p>
            )
          ) : mobileGrid && mobileGrid.grid.length > 0 ? (
            (() => {
              const { grid, cols } = mobileGrid;
              const block = pickMobileBlock(cols);
              const gapRatio = 0.12;
              const margin = Math.max(2, Math.round(block * gapRatio));
              const gridInnerWidth = cols * block + Math.max(0, cols - 1) * margin;
              const horizontalPadding = 32;
              const safeViewport = typeof window !== "undefined" ? Math.max(260, window.innerWidth) : 1024;
              const desiredCardWidth = gridInnerWidth + horizontalPadding;
              const cardMaxWidth = Math.min(safeViewport - 16, desiredCardWidth);

              const innerWrapperStyle: React.CSSProperties = {
                width: `${gridInnerWidth}px`,
                display: "flex",
                gap: `${margin}px`,
              };

              return (
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                  <div
                    style={{
                      boxSizing: "border-box",
                      width: `${Math.min(cardMaxWidth, safeViewport)}px`,
                      padding: "0px",
                      display: "flex",
                      justifyContent: "center",
                      overflowX: "auto",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    <div className="inline-block" style={{ ...innerWrapperStyle, maxWidth: "none", overflowX: "visible" }}>
                      {grid.map((col, ci) => (
                        <div key={ci} style={{ display: "flex", flexDirection: "column", gap: `${margin}px` }}>
                          {col.map((cell, ri) => {
                            const title = cell ? formatTitle(cell.date, cell.count) : "No contributions";
                            const bg = cell ? levelColor(cell.level) : (isDark ? "#0b1220" : "#f3f4f6");

                            return (
                              <div
                                key={ri}
                                role={cell ? "button" : "img"}
                                aria-label={title}
                                tabIndex={cell ? 0 : -1}
                                onMouseEnter={(e) => {
                                  if (cell) showTooltipAt(e as any, title, false);
                                }}
                                onMouseMove={(e) => {
                                  if (tooltip.visible && !tooltip.pinned) showTooltipAt(e as any, title, false);
                                }}
                                onMouseLeave={() => {
                                  if (!tooltip.pinned) hideTooltip();
                                }}
                                onClick={(e) => {
                                  togglePinTooltip(e, title, !!cell);
                                }}
                                onKeyDown={(e) => {
                                  if ((e as React.KeyboardEvent).key === "Enter" && cell) {
                                    const fakeEvent = {
                                      clientX: (e.nativeEvent as any).clientX || ((containerRef.current?.getBoundingClientRect().left || 0) + 8),
                                      clientY: (e.nativeEvent as any).clientY || ((containerRef.current?.getBoundingClientRect().top || 0) + 8),
                                    } as unknown as React.MouseEvent;
                                    togglePinTooltip(fakeEvent, title, !!cell);
                                  }
                                }}
                                className="rounded-sm transition-shadow duration-150"
                                style={{
                                  width: `${block}px`,
                                  height: `${block}px`,
                                  background: bg,
                                  borderRadius: 3,
                                  cursor: cell ? "pointer" : "default",
                                  boxShadow: tooltip.visible && tooltip.text === title ? "0 3px 10px rgba(0,0,0,0.08)" : undefined,
                                  border: tooltip.visible && tooltip.text === title ? "1px solid rgba(0,0,0,0.06)" : undefined,
                                }}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <p className="text-sm" style={{ color: isDark ? "#94a3b8" : "#6b7280" }}>
              No recent activity.
            </p>
          )}
        </div>

        {/* UPDATED: Legend is now hidden on desktop */}
        {isMobile && <Legend />}
      </div>

      {tooltip.visible && (
        <div
          role="tooltip"
          aria-hidden={!tooltip.visible}
          style={{
            position: "absolute",
            left: tooltip.left,
            top: tooltip.top,
            transform: "translate(-50%, 0)",
            background: isDark ? "#0b1220" : "#f8fafc",
            color: isDark ? "#e6eef6" : "#0f172a",
            padding: "6px 8px",
            borderRadius: 8,
            boxShadow: "0 6px 20px rgba(2,6,23,0.12)",
            fontSize: 12,
            zIndex: 60,
            whiteSpace: "nowrap",
            pointerEvents: "auto",
            border: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(2,6,23,0.06)",
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ fontWeight: 600 }}>{tooltip.text}</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTooltip((t) => ({ ...t, pinned: !t.pinned }));
              }}
              aria-label={tooltip.pinned ? "Unpin details" : "Pin details"}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 4,
                color: "inherit",
                fontSize: 12,
              }}
            >
              {tooltip.pinned ? "📌" : "📍"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}