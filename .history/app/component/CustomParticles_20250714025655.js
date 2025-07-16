// components/CustomParticles.jsx
"use client";

import Particles from "react-tsparticles";
import { loadLinksPreset } from "tsparticles-preset-links";

export default function CustomParticles({
  colors = ["#00dfd8", "#00bfff", "#00aaff", "#66fcf1", "#ffffff"],
  fullScreen = true,   // default is full-screen
  className = "",      // allow custom wrapper classes
}) {
  const particlesInit = async (engine) => {
    await loadLinksPreset(engine);
  };

  const options = {
    preset: "links",
    fullScreen: { enable: fullScreen },
    background: { color: "transparent" },
    particles: {
      number: { value: 50, density: { enable: true, area: 800 } },
      color: { value: colors },
      links: {
        enable: true,
        distance: 60,
        color: colors[1] || colors[0],
        opacity: 0.3,
        width: 1,
      },
      move: { enable: true, speed: 1.2, outModes: { default: "bounce" } },
      opacity: { value: 0.5 },
      size: { value: { min: 2, max: 3.5 } },
      shape: { type: "circle" },
    },
    interactivity: {
      events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: true, mode: "repulse" } },
      modes: { grab: { distance: 100, links: { opacity: 0.8 } }, repulse: { distance: 150, duration: 0.4 } },
    },
  };

  // If not fullScreen, you must wrap <Particles> in a positioned container
  return (
    <div className={className}>
      <Particles id="tsparticles" init={particlesInit} options={options} />
    </div>
  );
}
