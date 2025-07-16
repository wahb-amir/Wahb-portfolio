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
  <div className="mt-8 flex flex-col items-center bg-white rounded-lg shadow-md p-4 sm:p-6 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
    <div className="w-full h-40 sm:h-48 relative mb-4">
      <ImageSlider images={[...image]} />
    </div>
    <h2 className="text-lg sm:text-2xl font-bold mb-2 text-center">{title}</h2>
    <p className="text-gray-600 mb-2 text-center text-sm sm:text-base">{tech}</p>
    <p className="text-gray-700 mb-4 text-center text-sm sm:text-base">{description}</p>
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full justify-center">
      <button
        onClick={() => window.open(liveLink, "_blank", "noopener,noreferrer")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full sm:w-auto"
      >
        Live Demo
      </button>
      <button
        onClick={() =>
          window.open(githubLink, "_blank", "noopener,noreferrer")
        }
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition w-full sm:w-auto"
      >
        GitHub
      </button>
    </div>
  </div>
);

export default ProjectCard;
