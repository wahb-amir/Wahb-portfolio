"use client";

import { useEffect, useRef, useState } from "react";

const PROOF = "Next.js frontends · Node.js backends · GitHub automation";

export default function HeroProof() {
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Tiny delay so the CSS transition fires after hydration
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* All theming is done in CSS using the .dark class on <html>.
          No JS branching means the className on <p> is always identical
          between server and client — hydration error is gone.            */}
      <style>{`
        .proof-text {
          /* Light mode */
          background: linear-gradient(
            90deg,
            #64748b, #3b82f6, #06b6d4, #6366f1, #64748b
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Dark mode — driven by next-themes class on <html>, not JS */
        .dark .proof-text {
          background: linear-gradient(
            90deg,
            #94a3b8, #60a5fa, #22d3ee, #a5b4fc, #94a3b8
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        ${
          !reduceMotion
            ? `
          @keyframes proof-gradient-shift {
            0%   { background-position: 0%   50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0%   50%; }
          }
          .proof-text {
            animation: proof-gradient-shift 6s ease infinite;
          }
          .dark .proof-text {
            animation: proof-gradient-shift 6s ease infinite;
          }
        `
            : ""
        }
      `}</style>

      <p
        ref={ref}
        // className is now 100% static — no isDark branching, no mismatch
        className="proof-text mt-4 text-sm font-medium tracking-wide select-none transition-all duration-700 ease-out"
        // opacity/translate driven by inline style so the static className
        // stays identical between server and client
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
          transitionDelay: mounted ? "0ms" : "900ms",
        }}
        aria-label="Tech stack: Next.js frontends, Node.js backends, GitHub automation"
      >
        {PROOF}
      </p>
    </>
  );
}
