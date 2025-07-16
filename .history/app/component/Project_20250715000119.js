import React from "react";
import ImageSlider from "./ImageSlider";
import BackgroundEffect from "./BackgroundEffect";
const Project = () => {
  return (
    <div
      id="project-section"
      className="flex flex-col items-center justify-center bg-gray-950 p-6 min-h-screen"
    >
      {/* <BackgroundEffect /> */}
      <h1 className="text-4xl font-bold text-white mb-8">My Projects</h1>
      <ImageSlider images={["/image1.jpeg", "/image1.jpeg", "/image1.jpeg"]} />
    </div>
  );
};

export default Project;
