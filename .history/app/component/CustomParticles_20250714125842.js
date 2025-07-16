"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { loadLinksPreset } from "tsparticles-preset-links";

// Dynamic import for tsparticles
const Particles = dynamic(
  () => import("react-tsparticles").then((mod) => mod.Particles),
  { ssr: false }
);

export default function CustomParticles({
  colors = ["#00dfd8", "#00bfff", "#00aaff", "#FFA509", "#FF0000"],
  className = "",
}) {
  const [mounted, setMounted] = useState(false);
  const [height, setHeight] = useState(0);
  const containerRef = useRef(null);

  // 👇 Get full document height
  useEffect(() => {
    const updateHeight = () => {
      setHeight(document.documentElement.scrollHeight);
    };

    updateHeight(); // on mount
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // 👇 Mount particles after scroll
  useEffect(() => {
    const handleScroll = () => {
      setMounted(true);
      window.removeEventListener("scroll", handleScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🧠 Init tsparticles with custom preset
  const particlesInit = async (engine) => {
    await loadLinksPreset(engine);
  };

  if (!mounted) return null;

  const options = {
    preset: "links",
    fullScreen: false,
    background: { color: "transparent" },
    fpsLimit: 30,
    detectRetina: true,
    particles: {
      number: { value: 30 },
      color: { value: colors },
      links: {
        enable: true,
        distance: 100,
        color: colors,
        opacity: 0.3,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        outModes: { default: "bounce" },
      },
      size: { value: { min: 1.5, max: 2.5 } },
      shape: { type: "circle" },
      opacity: { value: 0.4 },
    },
    interactivity: {
      events: {
        onHover: { enable: false },
        onClick: { enable: false },
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className={`fixed top-0 left-0 w-full pointer-events-none z-0 ${className}`}
      style={{ height: `${height}px` }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={options}
        canvasClassName="!h-full !w-full"
      />
    </div>
  );
}
