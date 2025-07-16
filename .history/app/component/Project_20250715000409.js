import React from "react";
import ImageSlider from "./ImageSlider";
import BackgroundEffect from "./BackgroundEffect";
const Project = () => {
  return (
    <>
      <BackgroundEffect /> {/* it only have absolute div with cool animate but why does after adding it,it leave empty space below */}
      {/* code */}
      

      <div
        id="project-section"
        className="flex flex-col items-center justify-center bg-gray-950 p-6 min-h-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, #00bfff44, transparent 70%), " +
            "radial-gradient(circle at bottom right, #00dfd844, transparent 70%)",
        }}
      >
        <h1 className="text-4xl font-bold text-white mb-8">My Projects</h1>
        <ImageSlider
          images={["/image1.jpeg", "/image1.jpeg", "/image1.jpeg"]}
        />
      </div>
    </>
  );
};

export default Project;
