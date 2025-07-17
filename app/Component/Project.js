"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import BackgroundEffect from "./BackgroundEffect";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import ProjectCard from "./ProjectCard";
import dynamic from "next/dynamic";
const Project = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // mark “we’re on the client now”
  useEffect(() => {
    setMounted(true);
  }, []);

  // only true *after* hydration
  const isDark = mounted && theme === "dark";
  const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
    ssr: false,
    loading: () => null,
  });
  // inline styles only once mounted
  const sectionStyle = mounted
    ? {
        backgroundImage: isDark
          ? "radial-gradient(circle at top left, #00b1ff33, transparent 70%), radial-gradient(circle at bottom right, #00dfd033, transparent 70%)"
          : "radial-gradient(circle at top left, #7f5af022, transparent 70%), radial-gradient(circle at bottom right, #00dfd822, transparent 70%)",
        backgroundColor: isDark ? "#0f172a" : "#f9fafb",
      }
    : {};

  // if you wanna hide until ready, you can uncomment this:
  // if (!mounted) return null;

  return (
    <>
      <div
        id="projects"
        className="h-1 bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88] backdrop-blur-[100px]"
      />
      <div
        id="project-section"
        className={`relative flex flex-col items-center min-h-screen px-4 sm:px-6 pt-[env(safe-area-inset-top)] pb-12 text-center overflow-hidden z-[-10]
          ${isDark ? "bg-[#0a0f1a] text-white" : "bg-white text-black"}
        `}
        style={sectionStyle}
      >
        <LazyBackgroundEffect />

        <h1
          className={`text-[45px] font-bold mb-8 top-5 ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          My Projects
        </h1>

        <h2
          className={`text-xl sm:text-2xl font-semibold mb-4 ${
            isDark ? "text-cyan-300" : "text-blue-600"
          }`}
        >
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
              const sec = document.getElementById("skills");
              sec?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="hover:scale-110 transition-transform"
          >
            <ChevronUpIcon
              className={`w-8 h-8 ${
                isDark ? "text-cyan-300" : "text-cyan-600"
              }`}
            />
          </button>
          <button
            onClick={() => {
              const sec = document.getElementById("about");
              sec?.scrollIntoView({ behavior: "smooth" });
            }}
            aria-label="Scroll Down"
            className="animate-pulse hover:scale-110 transition-transform"
          >
            <ChevronDownIcon
              className={`w-8 h-8 ${
                isDark ? "text-cyan-300" : "text-cyan-600"
              }`}
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Project;
