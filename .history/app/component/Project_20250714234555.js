import React from "react";
import ImageSlider from "./ImageSlider";
const Project = () => {
  return (
    <div id="project-section">
      <h2 className="text-4xl font-bold text-white mb-6 text-center">Projects</h2>
      <p className="text-lg text-gray-300 mb-8 text-center max-w-2xl mx-auto">
        Explore some of my featured projects below. Each project showcases my skills in web development, design, and problem-solving.
      </p>
      <div className="flex flex-col items-center mb-10">
        <div className="bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 rounded-xl shadow-lg p-6 w-full max-w-3xl">
          <h3 className="text-2xl font-semibold text-white mb-2">Awesome Portfolio Website</h3>
          <p className="text-gray-200 mb-4">
            A modern, responsive portfolio built with React and Tailwind CSS. Features smooth animations, interactive components, and a clean UI.
          </p>
          <a
            href="https://github.com/yourusername/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-white text-blue-700 font-medium rounded hover:bg-blue-100 transition"
          >
            View Code
          </a>
        </div>
      </div>
      <ImageSlider
        images={[
          "/image1.jpeg",
          "/image1.jpeg",
          "/image1.jpeg",
        ]}
      />
    </div>
  );
};

export default Project;
