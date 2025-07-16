import React from "react";
import ImageSlider from "./ImageSlider";

const ProjectCard = ({
  title,
  image,
  tech,
  description,
  liveLink,
  githubLink,
}) => (
  <div className="mt-8 flex flex-col items-center bg-white rounded-lg shadow-md p-6">
    <div className="w-full h-48 relative mb-4">
      <ImageSlider images={[...image]} />
    </div>
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p className="text-gray-600 mb-2">{tech}</p>
    <p className="text-gray-700 mb-4">{description}</p>
    <div className="flex space-x-4">
      <a
        href={liveLink}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Live Demo
      </a>
      <a
        href={githubLink}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
      >
        GitHub
      </a>
    </div>
  </div>
);

export default ProjectCard;
