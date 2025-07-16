"use client";

import Particles from "@tsparticles/react";
import { loadFull } from "@tsparticles/engine";

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
          zIndex: 10, // keep it in the back
        },
        background: {
          color: "transparent", // don’t override your gradients
        },
        particles: {
          number: {
            value: 60,
            density: {
              enable: true,
              area: 800,
            },
          },
          shape: {
            type: "circle",
          },
          color: {
            value: "#00f0ff",
          },
          size: {
            value: 6,
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
