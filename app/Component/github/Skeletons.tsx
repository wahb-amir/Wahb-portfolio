"use client";

// ─── Skeleton components ──────────────────────────────────────────────────────
// SKELETON_SKIP is pre-computed at module level (deterministic LCG) so the
// pattern is identical on server and client — no hydration mismatch.

import {
  SKELETON_COLS,
  SKELETON_ROWS,
  SKELETON_SKIP,
} from "./config";

// Individual shimmer cell — uses CSS class defined in the server shell
export function SkeletonBlock({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="gh-skel-block"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

// Full 53×7 desktop skeleton grid
export function SkeletonGrid() {
  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      {/* Month label placeholders */}
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="gh-skel-block"
            style={{
              height: 10,
              width: 28,
              borderRadius: 4,
              marginRight: Math.floor(SKELETON_COLS / 12) * 16 - 32,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Cell grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${SKELETON_COLS}, 12px)`,
          gridTemplateRows:    `repeat(${SKELETON_ROWS}, 12px)`,
          gap: 4,
        }}
      >
        {Array.from({ length: SKELETON_COLS * SKELETON_ROWS }).map((_, i) => {
          const col   = Math.floor(i / SKELETON_ROWS);
          const row   = i % SKELETON_ROWS;
          const delay = (col * 20 + row * 8) % 400;
          const skip  = SKELETON_SKIP[i];
          return (
            <div
              key={i}
              style={{
                width: 12, height: 12, borderRadius: 3,
                opacity: skip ? 0 : 1,
                overflow: "hidden",
              }}
            >
              {!skip && <SkeletonBlock delay={delay} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Three pulsing dots for mobile loading
export function PulsingDots() {
  return (
    <div className="gh-pulse-wrap">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="gh-pulse-dot"
          style={{ animationDelay: `${i * 180}ms` }}
        />
      ))}
    </div>
  );
}
