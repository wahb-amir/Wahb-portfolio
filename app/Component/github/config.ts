// ─── Shared static config ────────────────────────────────────────────────────
// No "use client" — safe to import from Server Components.

export const CALENDAR_THEME = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
} as const;

export const DAYS_MOBILE = Math.round(4.5 * 30.4375); // ~137
export const SKELETON_COLS = 53;
export const SKELETON_ROWS = 7;

// Pre-compute which skeleton cells are "skipped" at module-init time using a
// deterministic LCG so the pattern is stable across SSR & client hydration.
// Math.random() inside render caused hydration mismatches + unpredictable re-renders.
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}
const rand = lcg(42);
export const SKELETON_SKIP: boolean[] = Array.from(
  { length: SKELETON_COLS * SKELETON_ROWS },
  (_, i) => {
    const col = Math.floor(i / SKELETON_ROWS);
    return col < 2 && rand() > 0.92;
  },
);

export type DayItem = { date: string; count: number; level: number };
