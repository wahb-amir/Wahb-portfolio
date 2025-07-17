"use client";
import React from "react";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";

// Dynamically import tsparticles on client only
const Particles = dynamic(
  () => import("react-tsparticles").then((mod) => mod.Particles),
  { ssr: false, loading: () => null }
);

export default function CustomParticles({
  colors = ["#00dfd8", "#00bfff", "#00aaff", "#66fcf1", "#ffffff"],
  fullScreen = false,
  className = "",
}) {
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-50px" });

  // Skip animation entirely if user prefers reduced motion
  if (reduceMotion || !inView) return null;

  // Adapt colors for dark mode
  const particleColors =
    theme === "dark"
      ? ["#00fff7", "#00bfff", "#0099ff", "#00ddff", "#00ffaa"]
      : colors;

  const particlesInit = async (engine) => {
    const { loadLinksPreset } = await import("tsparticles-preset-links");
    await loadLinksPreset(engine);
  };

  const options = {
    preset: "links",
    fullScreen,
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
        outModes: { default: "bounce" },
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
      className={`absolute top-0 left-0 w-full h-${
        fullScreen ? "[100vh]" : "full"
      } pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    >
      <Particles id="tsparticles" init={particlesInit} options={options} />
    </div>
  );
}
