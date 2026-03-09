"use client";

/**
 * HeroProof.tsx — CLIENT COMPONENT
 * Animated entrance + subtle gradient cycling text.
 * Client because it reads prefers-reduced-motion and manages mount state.
 */
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const PROOF = "Next.js frontends · Node.js backends · GitHub automation";

export default function HeroProof() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Respect user motion preferences
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq) {
      setReduceMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, []);

  useEffect(() => {
    // Tiny delay so the CSS transition fires after hydration
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Gradient text animation only if motion is okay */}
      {!reduceMotion && (
        <style>{`
          @keyframes proof-gradient-shift {
            0%   { background-position: 0%   50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0%   50%; }
          }
          .proof-gradient {
            background: linear-gradient(
                90deg,
                #64748b,
                #3b82f6,
                #06b6d4,
                #6366f1,
                #64748b
                );
            background-size: 300% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: proof-gradient-shift 6s ease infinite;
          }
            .proof-gradient-dark {
              background: linear-gradient(
                90deg,
                #94a3b8,
                #60a5fa,
                #22d3ee,
                #a5b4fc,
                #94a3b8
              );
              background-size: 300% auto;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
        `}</style>
      )}

      <p
        ref={ref}
        className={`
          mt-4 text-sm font-medium tracking-wide select-none
          transition-all duration-700 ease-out
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
          ${isDark ? "proof-gradient-dark" : "proof-gradient"}
        `}
        style={{ transitionDelay: mounted ? "0ms" : "900ms" }}
        aria-label="Tech stack: Next.js frontends, Node.js backends, GitHub automation"
      >
        {PROOF}
      </p>
    </>
  );
}
