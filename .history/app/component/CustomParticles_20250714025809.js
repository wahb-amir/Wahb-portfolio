// components/CustomParticles.jsx
"use client";
import Particles from "react-tsparticles";
import { loadLinksPreset } from "tsparticles-preset-links";

export default function CustomParticles({
  colors = ["#00dfd8", "#00bfff", "#00aaff", "#66fcf1", "#ffffff"],
  fullScreen = false, // Important: default to false now
  className = "",
}) {
  const particlesInit = async (engine) => {
    await loadLinksPreset(engine);
  };

  const options = {
    preset: "links",
    fullScreen: { enable: fullScreen }, // Key fix 🔥
    background: { color: "transparent" },
    particles: {
      number: { value: 50 },
      color: { value: colors },
      links: {
        enable: true,
        distance: 80,
        color: colors[1],
        opacity: 0.4,
        width: 1.2,
      },
      move: { enable: true, speed: 1, outModes: { default: "bounce" } },
      size: { value: { min: 1.5, max: 3.5 } },
      shape: { type: "circle" },
      opacity: { value: 0.5 },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
        onClick: { enable: true, mode: "repulse" },
      },
      modes: {
        grab: { distance: 100, links: { opacity: 0.8 } },
        repulse: { distance: 100, duration: 0.4 },
      },
    },
  };

  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <Particles id="tsparticles" init={particlesInit} options={options} />
    </div>
  );
}
