"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function useClientTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before mount: pretend it's light so server HTML === first client render
  const isDark = mounted ? resolvedTheme === "dark" : false;

  return {
    isDark,
    mounted,
    resolvedTheme: mounted ? resolvedTheme : "light",
    setTheme,
    toggleTheme: () => setTheme(isDark ? "light" : "dark"),
  };
}