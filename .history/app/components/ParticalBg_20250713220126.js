"use client";

import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticleBackground = () => {
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1,
        },
        background: {
          color: "#0d0d0d",
        },
        particles: {
          number: {
            value: 50,
            density: {
              enable: true,
              area: 800,
            },
          },
          shape: {
            type: "circle",
            character: {
              value: ["React", "Next.js", "Node.js", "Tailwind"],
              font: "Verdana",
              style: "",
              weight: "400",
              fill: true,
            },
          },
          color: {
            value: "#00f0ff",
          },
          size: {
            value: 16,
            random: true,
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            outModes: {
              default: "bounce",
            },
          },
        },
      }}
    />
  );
};

export default ParticleBackground;
