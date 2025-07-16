import React from "react";
import ImageSlider from "./ImageSlider";
import BackgroundEffect from "./BackgroundEffect";
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
      <h1 className="text- font-bold text-white mb-8 top-5">My Projects</h1>
      <ImageSlider images={["/image1.jpeg", "/image1.jpeg", "/image1.jpeg"]} />
    </div>
  );
};

export default Project;
