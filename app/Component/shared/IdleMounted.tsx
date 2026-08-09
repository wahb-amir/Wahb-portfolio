"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * IdleMounted
 * -----------
 * Renders `children` only after the browser is idle (or after a short
 * fallback timeout). Use it to defer expensive client components —
 * like the GitHub activity calendar — until *after* LCP has fired,
 * so the JS chunk never competes for the critical network/main-thread
 * budget on first paint.
 */
export default function IdleMounted({
  children,
  fallback = null,
  timeout = 1500,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  timeout?: number;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const show = () => setReady(true);

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(show, { timeout });
      return () => window.cancelIdleCallback(id);
    }

    const t = window.setTimeout(show, Math.min(timeout, 200));
    return () => window.clearTimeout(t);
  }, [timeout]);

  return <>{ready ? children : fallback}</>;
}