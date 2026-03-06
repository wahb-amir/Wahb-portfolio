"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useReducedMotion, useInView } from "framer-motion";
import { Engine,IOptions,RecursivePartial } from "@tsparticles/engine";

const Particles = dynamic(
  () =>
    import("@tsparticles/react").then(
      (mod) => (mod as any).Particles ?? (mod as any).default
    ),
  { ssr: false, loading: () => null }
) as unknown as React.ComponentType<any>;

interface CustomParticlesProps {
  colors?: string[];
  fullScreen?: boolean;
  className?: string;
}

export default function CustomParticles({
  colors = ["#00dfd8", "#00bfff", "#00aaff", "#66fcf1", "#ffffff"],
  fullScreen = false,
  className = "",
}: CustomParticlesProps) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { once: true, margin: "-50px" });

  // Respect reduced motion & only run when in view
  if (reduceMotion || !inView) return null;

  const particleColors =
    theme === "dark"
      ? ["#00fff7", "#00bfff", "#0099ff", "#00ddff", "#00ffaa"]
      : colors;

  const particlesInit = async (engine: Engine) => {
    // scoped preset package for tsparticles v3+
    const { loadLinksPreset } = await import("@tsparticles/preset-links");
    await loadLinksPreset(engine);
  };

  const options: RecursivePartial<IOptions> = {
    preset: "links",
    fullScreen: fullScreen ? { enable: true, zIndex: 0 } : { enable: false },
    background: { color: "transparent" },
    fpsLimit: 30,
    detectRetina: false,
    particles: {
      number: { value: 25 },
      color: { value: particleColors },
      links: {
        enable: true,
        distance: 100,
        color: particleColors,
        opacity: 0.3,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.5,
        outModes: { default: "bounce" as any }, // cast if your TS complains about string literal
      },
      size: { value: { min: 1.5, max: 2.5 } },
      shape: { type: "circle" },
      opacity: { value: 0.4 },
    },
    interactivity: {
      events: { onHover: { enable: false }, onClick: { enable: false } },
    },
  };

  return (
    <div
      ref={containerRef}
      className={`absolute top-0 left-0 w-full ${
        fullScreen ? "h-[100vh]" : "h-full"
      } pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Particles is typed as any above to avoid runtime typing friction */}
      <Particles id="tsparticles" init={particlesInit} options={options} />
    </div>
  );
}
