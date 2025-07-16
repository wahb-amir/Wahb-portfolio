import React from "react";
import ImageSlider from "./ImageSlider";
import BackgroundEffect from "./BackgroundEffect";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import ProjectCard from "./ProjectCard";
const Project = () => {
  return (
    <>
      <div className="h-1 bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88] backdrop-blur-[100px]" />
      <div
        id="project-section"
        className="relative flex flex-col items-center min-h-screen px-4 sm:px-6 pt-[env(safe-area-inset-top)] pb-12 bg-[#0a0f1a] text-white text-center overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, #00b1ff88, transparent 70%), " +
            "radial-gradient(circle at bottom right, #00dfd088, transparent 70%)",
        }}
      >
        <BackgroundEffect />
        <h1 className="text-[45px] font-bold text-white mb-8 top-5">
          My Projects
        </h1>
        <h2>E-commerce Store</h2>
        <ProjectCard
          title="Modern E-Commerce Store"
          image="/image1"
          tech="Next.js • Stripe • OAuth • Tailwind • MongoDB"
          description="A fully functional e-commerce platform with OAuth, fake Stripe checkout, and a client-safe read-only admin dashboard."
          liveLink="https://ecom-store.vercel.app"
          githubLink="https://github.com/wahb/ecom-store"
        />

        {/* <ImageSlider
          images={["/image1.jpeg", "/image1.jpeg", "/image1.jpeg"]}
        /> */}
        {/* Arrow */}
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
            className="hover:scale-110 transition-transform"
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
            className="animate-pulse hover:scale-110 transition-transform"
          >
            <ChevronDownIcon className="w-8 h-8 text-cyan-300" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Project;
