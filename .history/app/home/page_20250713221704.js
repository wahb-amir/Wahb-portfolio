import React from "react";
import ParticleBackground from "../components/ParticleWrapper.js";

const page = () => {
  return (
    <main className="relative w-full h-screen overflow-hidden text-white">
      <ParticleBackground />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold drop-shadow-md">
          Yo, I’m <span className="text-secondary">Wahb</span>
        </h1>
        <p className="mt-4 text-lg sm:text-2xl">
          Web wizard. Full-stack vibes. 🔮
        </p>
      </div>
    </main>
  );
};

export default page;
