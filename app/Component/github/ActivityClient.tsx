"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
  memo,
} from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

import { CALENDAR_THEME, DAYS_MOBILE, type DayItem } from "./config";
import { SkeletonGrid, PulsingDots, SkeletonBlock } from "./Skeletons";

// ── Lazy-load the heavy calendar — second deferred chunk ──────────────────────
const CalendarDesktop = dynamic(() => import("./CalendarDesktop"), {
  ssr: false,
  loading: () => <SkeletonGrid />,
});

// ── Types ─────────────────────────────────────────────────────────────────────
type TooltipState = {
  visible: boolean;
  text: string;
  left: number;
  top: number;
  pinned: boolean;
};
const T0: TooltipState = { visible: false, text: "", left: 0, top: 0, pinned: false };

// ── Tooltip island — isolated so calendar grid never re-renders on hover ──────
const Tooltip = memo(function Tooltip({
  state,
  onPin,
}: {
  state: TooltipState;
  onPin: () => void;
}) {
  if (!state.visible) return null;
  return (
    <div
      role="tooltip"
      className="gh-tooltip"
      style={{ left: state.left, top: state.top }}
    >
      <span>{state.text}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onPin(); }}
        aria-label={state.pinned ? "Unpin tooltip" : "Pin tooltip"}
        style={{
          border: "none", background: "transparent", cursor: "pointer",
          padding: 2, fontSize: 12, lineHeight: 1, color: "inherit",
          opacity: 0.75, transition: "opacity 0.15s",
        }}
      >
        {state.pinned ? "📌" : "📍"}
      </button>
    </div>
  );
});

// ── Legend — pure, no reactive deps ──────────────────────────────────────────
const Legend = memo(function Legend({ isDark }: { isDark: boolean }) {
  const pal = isDark ? CALENDAR_THEME.dark : CALENDAR_THEME.light;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
      <span className="gh-sub">Less</span>
      <div style={{ display: "flex", gap: 4 }}>
        {pal.map((c, i) => (
          <div key={i} style={{
            width: 12, height: 12, background: c, borderRadius: 3,
            border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
          }} />
        ))}
      </div>
      <span className="gh-sub">More</span>
    </div>
  );
});

// ── Main island ───────────────────────────────────────────────────────────────
export default function ActivityClient() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [data,     setData]     = useState<DayItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [tooltip,  setTooltip]  = useState<TooltipState>(T0);
  // Gate: don't run fetch or render the calendar until near viewport
  const [inView,   setInView]   = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // ── Viewport gate — defer ALL work until card is ~300px from viewport ──────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // If already in view on mount (e.g. above-the-fold), trigger immediately
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" } // pre-load 300px before visible
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── Responsive breakpoint — matchMedia, not resize ────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Fetch — only fires after inView gate + idle callback ──────────────────
  useEffect(() => {
    if (!inView) return;

    const run = () => {
      fetch("/api/github-activity")
        .then((r) => r.json())
        .then((json) =>
          startTransition(() => {
            setData(Array.isArray(json) ? json : []);
            setLoading(false);
          })
        )
        .catch(() =>
          startTransition(() => {
            setData([]);
            setLoading(false);
          })
        );
    };

    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(run, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(run, 0);
    return () => clearTimeout(id);
  }, [inView]);

  // ── Close tooltip on outside click ────────────────────────────────────────
  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      if (!containerRef.current?.contains(ev.target as Node)) setTooltip(T0);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────
  const processedData = useMemo(() => {
    if (!isMobile) return data;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - DAYS_MOBILE);
    return data.filter((d) => new Date(d.date) >= cutoff);
  }, [data, isMobile]);

  const totalContributions = useMemo(
    () => processedData.reduce((s, d) => s + (d.count ?? 0), 0),
    [processedData]
  );

  const dateRangeDays = useMemo(
    () => (processedData.length ? processedData.length : 0),
    [processedData]
  );

  const mobileGrid = useMemo(() => {
    if (!processedData.length) return null;
    const sorted = [...processedData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const first     = new Date(sorted[0].date);
    const firstDay  = first.getDay();
    const cols      = Math.ceil((firstDay + sorted.length) / 7);
    const grid: (DayItem | null)[][] = Array.from({ length: cols }, () => Array(7).fill(null));
    sorted.forEach((d) => {
      const dt   = new Date(d.date);
      const diff = Math.floor((dt.getTime() - first.getTime()) / 86_400_000);
      const wk   = Math.floor((firstDay + diff) / 7);
      if (wk < cols) grid[wk][dt.getDay()] = d;
    });
    return { grid, cols };
  }, [processedData]);

  const mobileBlockSize = useMemo(() => {
    if (!mobileGrid || typeof window === "undefined") return 8;
    const vw  = Math.max(220, window.innerWidth - 32);
    const gap = 3;
    const sz  = Math.floor((vw - (mobileGrid.cols - 1) * gap) / mobileGrid.cols);
    return Math.max(4, Math.min(window.innerWidth < 450 ? 9 : 13, sz));
  }, [mobileGrid]);

  // ── Tooltip helpers — stable refs ─────────────────────────────────────────
  const showAt = useCallback((e: React.MouseEvent, text: string, pinned = false) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const left = Math.min(Math.max(8, e.clientX - rect.left - 10), rect.width - 8);
    const top  = Math.max(6, e.clientY - rect.top - 44);
    setTooltip({ visible: true, text, left, top, pinned });
  }, []);

  const hide = useCallback(
    () => setTooltip((t) => (t.pinned ? t : T0)),
    []
  );

  const fmt = (date: string, count: number) =>
    `${date} — ${count} contribution${count === 1 ? "" : "s"}`;

  const onEnter = useCallback(
    (e: React.MouseEvent, date: string, count: number) => showAt(e, fmt(date, count)),
    [showAt]
  );
  const onMove = useCallback(
    (e: React.MouseEvent, date: string, count: number) => {
      setTooltip((t) => { if (!t.visible || t.pinned) return t; return t; });
      showAt(e, fmt(date, count));
    },
    [showAt]
  );
  const onClick = useCallback(
    (e: React.MouseEvent, date: string, count: number) => {
      const text = fmt(date, count);
      setTooltip((t) => (t.pinned ? T0 : { ...t, pinned: true, text }));
      showAt(e, text, true);
    },
    [showAt]
  );
  const onPin = useCallback(
    () => setTooltip((t) => ({ ...t, pinned: !t.pinned })),
    []
  );

  const levelColor = useCallback(
    (level: number) => {
      const pal = isDark ? CALENDAR_THEME.dark : CALENDAR_THEME.light;
      return pal[Math.max(0, Math.min(pal.length - 1, level))];
    },
    [isDark]
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} style={{ width: "100%" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className={`gh-status-dot${!loading && data.length ? " loaded" : ""}`} />
          <span className="gh-label">
            {isMobile ? "Recent Activity" : "GitHub Contributions"}
          </span>
        </div>

        {!loading && processedData.length > 0 && (
          <div className="gh-badge">
            {totalContributions.toLocaleString()} contributions
            {isMobile && dateRangeDays ? ` · ${dateRangeDays}d` : ""}
          </div>
        )}
        {loading && (
          <div style={{ width: 120, height: 22, borderRadius: 20, overflow: "hidden" }}>
            <SkeletonBlock />
          </div>
        )}
      </div>

      {/* Calendar area — min-height reserved in CSS → no CLS */}
      <div className="gh-calendar-area">
        {loading ? (
          isMobile ? <PulsingDots /> : <SkeletonGrid />
        ) : !isMobile ? (
          data.length > 0 ? (
            <CalendarDesktop
              data={processedData}
              onMouseEnter={onEnter}
              onMouseMove={onMove}
              onMouseLeave={hide}
              onClick={onClick}
            />
          ) : (
            <p style={{ fontSize: 13, color: "var(--gh-sub)", textAlign: "center", padding: "24px 0" }}>
              No activity data found.
            </p>
          )
        ) : mobileGrid ? (
          (() => {
            const { grid, cols } = mobileGrid;
            const block = mobileBlockSize;
            const gap   = Math.max(2, Math.round(block * 0.28));
            return (
              <div style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch",
                            animation: "gh-fade-up 0.45s 0.05s ease both" }}>
                <div style={{ display: "inline-flex", gap }}>
                  {grid.map((col, ci) => (
                    <div key={ci} style={{ display: "flex", flexDirection: "column", gap }}>
                      {col.map((cell, ri) => {
                        const title  = cell ? fmt(cell.date, cell.count) : "No contributions";
                        const bg     = cell ? levelColor(cell.level) : isDark ? "#0d1520" : "#ebedf0";
                        const active = tooltip.visible && tooltip.text === title && !!cell;
                        return (
                          <div
                            key={ri}
                            role={cell ? "button" : "img"}
                            aria-label={title}
                            tabIndex={cell ? 0 : -1}
                            onMouseEnter={(e) => cell && showAt(e, title)}
                            onMouseLeave={hide}
                            onClick={(e) => {
                              if (!cell) return;
                              setTooltip((t) => (t.pinned ? T0 : { ...t, pinned: true, text: title }));
                              showAt(e, title, !tooltip.pinned);
                            }}
                            style={{
                              width: block, height: block, background: bg, borderRadius: 3,
                              cursor: cell ? "pointer" : "default",
                              transition: "transform 0.1s ease, box-shadow 0.1s ease",
                              transform:  active ? "scale(1.2)" : undefined,
                              boxShadow:  active
                                ? `0 0 0 1.5px ${isDark ? "#39d353" : "#30a14e"}` : undefined,
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
          <p style={{ fontSize: 13, color: "var(--gh-sub)", textAlign: "center", padding: "24px 0" }}>
            No recent activity.
          </p>
        )}
      </div>

      {/* Footer */}
      {!loading && isMobile && <Legend isDark={isDark} />}
      {!loading && !isMobile && data.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                      marginTop: 10, flexWrap: "wrap", gap: 8 }}>
          <Legend isDark={isDark} />
          <span className="gh-sub">
            {totalContributions.toLocaleString()} contributions in the last year
          </span>
        </div>
      )}

      {/* Tooltip island — isolated re-render surface */}
      <Tooltip state={tooltip} onPin={onPin} />
    </div>
  );
}
