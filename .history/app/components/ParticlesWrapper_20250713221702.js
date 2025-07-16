"use client";

import { useEffect } from "react";
import { load } from "particles.js";

const ParticlesWrapper = () => {
  useEffect(() => {
    load("particles-js", "/particles-config.json");
  }, []);

  return (
    <div
      id="particles-js"
      className="absolute top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default ParticlesWrapper;
