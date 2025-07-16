import React from "react";
import ImageSlider from "./ImageSlider";
import BackgroundEffect from "./BackgroundEffect";
const Project = () => {
  return (
    <div
      id="project-section"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-6"
    >
      <BackgroundEffect />
      <h1 className="text-4xl font-bold text-white mb-8">
      <h2 className="text-3xl font-bold mb-6">Projects</h2>
      <ImageSlider images={["/image1.jpeg", "/image1.jpeg", "/image1.jpeg"]} />
    </div>
  );
};

export default Project;
