import React from "react";
import ImageSlider from "./ImageSlider";
import BackgroundEffect from "./BackgroundEffect";
const Project = () => {
  return (
    <>
      <BackgroundEffect />
      {/* it only have absolute div with cool animate but why does after adding it,it leave empty space below */}
      {/* code */}
      {/* <>
      <div className="absolute inset-0 bg-gradient-radial from-[#00dfd844] via-[#00000000] to-[#00000000] blur-2xl z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[250px] h-[250px] xs:w-[300px] xs:h-[300px] bg-[#00bfff] blur-3xl opacity-30 rounded-full z-0 animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[250px] h-[250px] xs:w-[300px] xs:h-[300px] bg-[#00dfd8] blur-3xl opacity-30 rounded-full z-0 animate-pulse" />
    </> */}
      <BackgroundEffect />
      <div className="relative">
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
      </div>
    </>
  );
};

export default Project;
