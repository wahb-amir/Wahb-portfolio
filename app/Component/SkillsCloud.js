"use client";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import {
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiFramer,
  SiGraphql,
  SiTypescript,
  SiPython,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
} from "react-icons/si";

const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), { ssr: false, loading: () => null });

// Core skills
const coreSkills = [
  { name: "HTML", icon: SiHtml5, color: "#E34F26", type: "frontend" },
  { name: "CSS", icon: SiCss3, color: "#1572B6", type: "frontend" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#38B2AC", type: "frontend" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E", type: "frontend" },
  { name: "React", icon: SiReact, color: "#61DAFB", type: "frontend" },
  { name: "Next.js", icon: SiNextdotjs, color: "#000000", type: "frontend" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933", type: "backend" },
  { name: "Express", icon: SiExpress, color: "#000000", type: "backend" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248", type: "backend" },
  { name: "Framer Motion", icon: SiFramer, color: "#0055FF", type: "frontend" },
  { name: "Python", icon: SiPython, color: "#3776AB", type: "backend" },
];

const learningSkills = [
  { name: "Pandas", icon: SiPandas, color: "#150458", type: "learning" },
  { name: "NumPy", icon: SiNumpy, color: "#013243", type: "learning" },
  { name: "Scikit-learn", icon: SiScikitlearn, color: "#F7931E", type: "learning" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6", type: "learning" },
];

export default function SkillsCloud() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState("cloud"); // cloud or grid
  const [filter, setFilter] = useState("all");
  const containerRef = useRef(null);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === "dark";
  const isInView = useInView(containerRef, { margin: "-150px", once: true });
  const radius = 180;
  const centerOffset = radius;

  const skillsFiltered = coreSkills.filter(skill =>
    filter === "all" ? true : skill.type === filter
  );

  const skillsWithPos = skillsFiltered.map((skill, i) => {
    const angle = (i / skillsFiltered.length) * 2 * Math.PI;
    return { ...skill, x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
  });

  return (
    <section
      id="skills"
      className={`relative flex flex-col items-center justify-center px-4 sm:px-6 pb-12 text-center overflow-hidden
        bg-[#f9fafb] dark:bg-[#0f172a]
    bg-gradient-to-b from-[#00b1ff88] to-[#00bfff44]
    text-black dark:text-white`}
    >
      {/* <LazyBackgroundEffect /> */}

      <h2 className={`z-20 text-3xl sm:text-4xl font-extrabold mb-4 mt-10 ${isDark ? "text-white" : "text-black"}`}>
        What I Work With
      </h2>

      {/* View & Filter Controls */}
      <div className="z-20 flex gap-3 mt-2 mb-6">
        <button
          onClick={() => setView("cloud")}
          className={`px-4 py-1 rounded ${view === "cloud" ? "bg-cyan-500 text-black" : isDark ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}
        >
          Cloud
        </button>
        <button
          onClick={() => setView("grid")}
          className={`px-4 py-1 rounded ${view === "grid" ? "bg-cyan-500 text-black" : isDark ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}
        >
          Grid
        </button>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`rounded px-2 ${isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
        >
          <option value="all">All</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="learning">Learning</option>
        </select>
      </div>

      {/* Cloud View */}
      {view === "cloud" ? (
        <div ref={containerRef} className="relative z-20 flex items-center justify-center mx-auto" style={{ width: radius * 2, height: radius * 2 }}>
          {skillsWithPos.map(({ name, icon: Icon, x, y, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
              animate={isInView ? { opacity: 1, scale: 1, x, y } : { opacity: 0, scale: 0.3, x: 0, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 140, damping: 20 }}
              whileHover={{ scale: 1.3 }}
              className="absolute flex flex-col items-center justify-center cursor-pointer p-2 rounded-full shadow-xl"
              style={{ top: centerOffset, left: centerOffset, backgroundColor: isDark ? "#1f2937" : "#e2e8f0" }}
              title={name}
            >
              <Icon className="text-[35px]" style={{ color }} />
            </motion.div>
          ))}

          {/* Learning / ML */}
          {learningSkills.map(({ name, icon: Icon, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
              animate={isInView ? { opacity: 1, scale: 1, x: radius * 0.5 * Math.cos(i / learningSkills.length * 2 * Math.PI), y: radius * 0.5 * Math.sin(i / learningSkills.length * 2 * Math.PI) } : { opacity: 0, scale: 0.3, x: 0, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="absolute flex items-center justify-center cursor-help rounded-full w-10 h-10"
              style={{ top: centerOffset, left: centerOffset, backgroundColor: isDark ? "#374151" : "#cbd5e1" }}
              title={`Learning: ${name}`}
            >
              <Icon className="text-[25px]" style={{ color }} />
            </motion.div>
          ))}
        </div>
      ) : (
        // Grid View
        <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 z-20`}>
          {skillsFiltered.map(({ name, icon: Icon, color }) => (
            <div key={name} className={`flex flex-col items-center rounded-lg p-3 hover:scale-105 transition ${isDark ? "bg-gray-800" : "bg-gray-300"}`} title={name}>
              <Icon className="text-3xl" style={{ color }} />
              <span className={`mt-2 text-sm ${isDark ? "text-white" : "text-black"}`}>{name}</span>
            </div>
          ))}
          {learningSkills.map(({ name, icon: Icon, color }) => (
            <div key={name} className={`flex flex-col items-center rounded-lg p-3 hover:scale-105 transition ${isDark ? "bg-gray-800" : "bg-gray-300"}`} title={`Learning: ${name}`}>
              <Icon className="text-3xl" style={{ color }} />
              <span className={`mt-2 text-sm ${isDark ? "text-white" : "text-black"}`}>Learning: {name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      <div className="relative z-10 flex flex-row items-center justify-center gap-6 mt-[3rem]">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll Up" className="hover:scale-110 transition-transform">
          <ChevronUpIcon className={`w-8 h-8 ${isDark ? "text-cyan-300" : "text-cyan-600"}`} />
        </button>
        <button
          onClick={() => document.getElementById("project-section")?.scrollIntoView({ behavior: "smooth" })}
          aria-label="Scroll Down"
          className="animate-pulse hover:scale-110 transition-transform"
        >
          <ChevronDownIcon className={`w-8 h-8 ${isDark ? "text-cyan-300" : "text-cyan-600"}`} />
        </button>
      </div>
    </section>
  );
}
