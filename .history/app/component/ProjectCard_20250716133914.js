"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import ImageSlider from "./ImageSlider";

const ProjectCard = ({
  title,
  image,
  tech,
  description,
  liveLink,
  githubLink,
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // mark “we’re on the client now”
  useEffect(() => {
    setMounted(true);
  }, []);

  // before hydration, render nothing to avoid mismatch
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div
      className={`mt-8 flex flex-col items-center rounded-lg shadow-md p-4 sm:p-6 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto
        ${isDark ? "bg-gray-900 text-white" : "bg-white text-black"}
      `}
    >
      <div className="w-full h-40 sm:h-48 relative mb-4">
        <ImageSlider images={image} />
      </div>

      <h2 className="text-lg sm:text-2xl font-bold mb-2 text-center">
        {title}
      </h2>

      <p
        className={`mb-2 text-center text-sm sm:text-base ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {tech}
      </p>

      <p
        className={`mb-4 text-center text-sm sm:text-base ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {description}
      </p>

      <div className="flex flex-row space-x-4 justify-center items-center w-full">
        <button
          onClick={() => window.open(liveLink, "_blank", "noopener,noreferrer")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-[250px] text-center"
        >
          Live Demo
        </button>
        <button
          onClick={() =>
            window.open(githubLink, "_blank", "noopener,noreferrer")
          }
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition w-[250px] text-center"
        >
          GitHub
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
