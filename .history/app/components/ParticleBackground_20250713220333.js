"use client";

import Particles from "@tsparticles/react";
import { loadFull } from "@tsparticles/engine";

const ParticleBackground = () => {
  const particlesInit = async (engine) => {
    // This works with @tsparticles/engine!
    await loadFull(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -2,
        },
        background: {
          color: "#0d0d0d",
        },
        particles: {
          number: {
            value: 40,
          },
          shape: {
            type: "char",
            character: {
              value: ["React", "Next.js", "Tailwind", "Node.js"],
              font: "Arial",
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
