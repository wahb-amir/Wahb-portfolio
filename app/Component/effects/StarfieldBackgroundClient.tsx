"use client";

/**
 * StarfieldBackgroundClient
 *
 * Thin "use client" wrapper so that the layout.tsx (a Server Component) can
 * safely defer StarfieldBackground to the client bundle with ssr:false.
 * Renders an instant CSS backdrop so FCP/LCP are not blocked by the canvas chunk.
 */

import dynamic from "next/dynamic";

const StarfieldBackground = dynamic(() => import("./StarfieldBackground"), {
  ssr: false,
  loading: () => null,
});

/** Static gradients — identical to StarfieldBackground's CSS layers (no JS). */
function StarfieldCssFallback() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
    >
      {/* Dark mode */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 18% 20%, rgba(67,56,202,0.11) 0%, transparent 70%)," +
            "radial-gradient(ellipse 55% 40% at 78% 12%, rgba(124,58,237,0.09) 0%, transparent 65%)," +
            "radial-gradient(ellipse 70% 30% at 50% 5%, rgba(0,120,255,0.05) 0%, transparent 60%)," +
            "radial-gradient(ellipse 40% 25% at 85% 80%, rgba(6,182,212,0.04) 0%, transparent 60%)," +
            "#080e1a",
        }}
      />
      {/* Light mode */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background:
            "linear-gradient(180deg, #dde6f0 0%, #e8eef5 18%, #edf2f7 42%, #f1f5f9 68%, #f5f8fc 85%, #f8fafc 100%)",
        }}
      />
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] sm:w-[900px] sm:h-[900px] pointer-events-none dark:hidden"
        style={{
          background:
            "radial-gradient(circle at 72% 22%, rgba(253,244,202,0.55) 0%, rgba(253,230,138,0.30) 18%, rgba(251,191,96,0.12) 38%, rgba(248,159,60,0.04) 58%, transparent 72%)",
          transform: "translate(22%, -22%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}

export default function StarfieldBackgroundClient() {
  return (
    <>
      <StarfieldCssFallback />
      <StarfieldBackground />
    </>
  );
}
