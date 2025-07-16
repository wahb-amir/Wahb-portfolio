import React from "react";
import ImageSlider from "./ImageSlider";
import BackgroundEffect from "./BackgroundEffect";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import ProjectCard from "./ProjectCard";
const Project = () => {
  return (
    <>
      <div className="h-1 bg-gradient-to-b from-cyan-400/25 to-cyan-500/50 backdrop-blur-2xl" />
      <div
        id="project-section"
        className="relative flex flex-col items-center min-h-screen px-4 sm:px-6 pt-[env(safe-area-inset-top)] pb-12 bg-[#0a0f1a] text-white text-center overflow-hidden z-[-10]"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, #00b1ff88, transparent 70%), " +
            "radial-gradient(circle at bottom right, #00dfd088, transparent 70%)",
        }}
      >
        <BackgroundEffect />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 mt-8 drop-shadow-lg">
          My Projects
        </h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-cyan-300 mb-4">
          E-commerce Store
        </h2>
        <ProjectCard
          title="Modern E-Commerce Store"
          image={[["/image1.jpeg", "/image1.jpeg", "/image1.jpeg"]]}
          tech="Next.js • Stripe • OAuth • Tailwind • MongoDB"
          description="A fully functional e-commerce platform with OAuth, fake Stripe checkout, and a client-safe read-only admin dashboard."
          liveLink="https://ecom-store.vercel.app"
          githubLink="https://github.com/wahb/ecom-store"
        />

        <div className="relative z-10 flex flex-row items-center justify-center gap-6 mt-8">
          <button
            onClick={() => {
              const nextSection = document.getElementById("skills");
              if (nextSection)
                nextSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
            }}
            className="hover:scale-110 transition-transform bg-cyan-900/30 rounded-full p-2 shadow-lg"
          >
            <ChevronUpIcon className="w-8 h-8 text-cyan-300" />
          </button>
          <button
            onClick={() => {
              const nextSection = document.getElementById("project-section");
              if (nextSection)
                nextSection.scrollIntoView({ behavior: "smooth" });
            }}
            aria-label="Scroll Down"
            className="animate-pulse hover:scale-110 transition-transform bg-cyan-900/30 rounded-full p-2 shadow-lg"
          >
            <ChevronDownIcon className="w-8 h-8 text-cyan-300" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Project;
