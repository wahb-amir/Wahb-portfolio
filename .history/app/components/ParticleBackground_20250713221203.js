"use client";

import Particles from "@tsparticles/react";
import { loadFull } from "@tsparticles/engine";

const ParticleBackground = () => {
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  return (
    <div className="absolute top-0 left-0 w-screen h-screen -z-10">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: {
            enable: false, // ✅ disable built-in fullscreen
          },
          background: {
            color: "transparent",
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
    </div>
  );
};

export default ParticleBackground;
