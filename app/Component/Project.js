// use client
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import ProjectCard from "./ProjectCard";
import { motion } from "framer-motion";

const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
  ssr: false,
  loading: () => null,
});

const projects = [
  {
    id: "ecom-1",
    title: "Modern E-Commerce Store",
    role: "Full-Stack Developer",
    images: [
      "/Project/light-shop.png",
      "/Project/light-men.png",
      "/Project/light-women.png",
      "/Project/light-product.png",
      "/Project/stripe.png",
    ],
    tech: ["Next.js", "Stripe", "OAuth", "Tailwind", "MongoDB"],
    short: "A fully functional e-commerce platform with OAuth, fake Stripe checkout, and a client-safe read-only admin dashboard.",
    liveLink: "https://boltform.buttnetworks.com/",
    githubLink: "https://github.com/coder101-js/Ecommer-Store",
    problem:
      "Customers needed a lightweight store with easy checkout and an admin view that doesn't require exposing sensitive keys.",
    process: [
      "Designed product pages and cart UX with Tailwind and responsive-first approach",
      "Implemented OAuth-based auth and session handling",
      "Connected Stripe sandbox for payments and built a read-only admin dashboard",
      "Deployed on a Linux VPS with PM2 + Nginx reverse proxy",
    ],
    outcome:
      "Deployed MVP with a responsive store, Stripe sandbox working, and an admin dashboard. Reduced TTFB by optimizing image sizes & server-side rendering.",
    stats: { pagespeed: "Bumped 15→82" },
    category: "Web",
  },

  // ML placeholder project coming soon
  {
    id: "ml-coming-soon",
    title: "ML Project Coming Soon",
    role: "ML Engineer",
    images: ["/project/ml/placeholder.jpg"],
    tech: ["Python", "scikit-learn", "pandas"],
    short: "Exciting machine learning project under development. Stay tuned!",
    liveLink: null,
    githubLink: null,
    problem: "Project in progress — details will be updated soon.",
    process: ["Data collection & preprocessing", "Model training", "Evaluation & optimization"],
    outcome: "Results will be shared once the project is complete.",
    stats: {},
    category: "ML",
  },
];

const Project = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && theme === "dark";

  return (
    <>
      <div id="projects" />

      <section
        id="project-section"
        className={`relative flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden z-10  bg-[#f9fafb] dark:bg-[#0f172a]
    bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
    text-black dark:text-white`}
      >
        <LazyBackgroundEffect />

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`mb-4 font-extrabold tracking-tight ${isDark ? "text-white" : "text-gray-800"
            } text-[36px] sm:text-[44px]`}
        >
          My Projects
        </motion.h1>

        <p className={`max-w-2xl mx-auto mb-8 text-sm sm:text-base ${isDark ? "text-slate-300" : "text-gray-700"}`}>
          Real apps I built & shipped — each entry includes the problem I solved, the approach I took, and the outcome. Click any card to read the case study.
        </p>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 w-full max-w-6xl px-2 items-start">
          {projects.map((p) => (
            // NOTE: we do NOT pass any isOpen/onToggle here — cards are independent
            <ProjectCard key={p.id} {...p} />
          ))}
        </div>

        <div className="relative z-10 flex items-center gap-6 mt-10">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll Up"
            className="p-2 rounded hover:scale-105 transition"
          >
            <ChevronUpIcon className={`w-8 h-8 ${isDark ? "text-cyan-300" : "text-cyan-600"}`} />
          </button>

          <button
            onClick={() => {
              const sec = document.getElementById("about");
              sec?.scrollIntoView({ behavior: "smooth" });
            }}
            aria-label="Scroll Down"
            className="p-2 rounded animate-pulse hover:scale-105 transition"
          >
            <ChevronDownIcon className={`w-8 h-8 ${isDark ? "text-cyan-300" : "text-cyan-600"}`} />
          </button>
        </div>
      </section>
    </>
  );
};

export default Project;
