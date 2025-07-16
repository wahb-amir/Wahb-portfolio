"use client";

import { useEffect } from "react";

const ParticlesWrapper = () => {
  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS.load("particles-js", "/particles-config.json", () => {
        console.log("particles.js loaded 🔥");
      });
    }
  }, []);

  return (
    <div
      id="particles-js"
      className="absolute top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default ParticlesWrapper;
