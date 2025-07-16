import React from "react";
import ImageSlider from "./ImageSlider";
import BackgroundEffect from "./BackgroundEffect";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
const Project = () => {
  return (
    <div
      id="project-section"
      className="relative flex flex-col items-center min-h-screen px-4 sm:px-6 pt-[env(safe-area-inset-top)] pb-12 bg-[#0a0f1a] text-white text-center overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, #00bfff54, transparent 70%), " +
          "radial-gradient(circle at bottom right, #00dfd044, transparent 70%)",
      }}
    >
      <BackgroundEffect />
      <h1 className="text-[45px] font-bold text-white mb-8 top-5">
        My Projects
      </h1>
      <h2>E-commerce Store</h2>
      <ImageSlider images={["/image1.jpeg", "/image1.jpeg", "/image1.jpeg"]} />
      {/* Arrow */}
      <div className="relative z-10 flex flex-row items-center justify-center gap-6 mt-8">
        <button
          onClick={() => {
            const nextSection = document.getElementById("skills");
            if (nextSection) nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="hover:scale-110 transition-transform"
        >
          <ChevronUpIcon className="w-8 h-8 text-cyan-300" />
        </button>
        <button
          onClick={() => {
            const nextSection = document.getElementById("pro");
            if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
          }}
          aria-label="Scroll Down"
          className="animate-pulse hover:scale-110 transition-transform"
        >
          <ChevronDownIcon className="w-8 h-8 text-cyan-300" />
        </button>
      </div>
    </div>
  );
};

export default Project;
