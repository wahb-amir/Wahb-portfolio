"use client";
import { useEffect, useState, useRef } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { motion, useInView } from "framer-motion";
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
} from "react-icons/si";
import BackgroundEffect from "./BackgroundEffect";

const allSkills = [
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
];

const learningSkills = [
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
];

function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

export default function SkillsCloud() {
  const [view, setView] = useState("cloud");
  const [filter, setFilter] = useState("all");
  const containerRef = useRef(null);

  const isInView = useInView(containerRef, { margin: "-100px" });

  const { width } = useWindowSize();
  const containerSize = width < 480 ? 260 : width < 768 ? 320 : 420;
  const radius = containerSize / 2.5;
  const centerOffset = containerSize / 2 - 30;

  const skills = allSkills.filter((skill) =>
    filter === "all" ? true : skill.type === filter
  );

  const skillsWithPosition = skills.map((skill, i) => {
    const angle = (i / skills.length) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { ...skill, x, y };
  });

  const learningPositions = learningSkills.map((skill, i) => {
    const angle = (i / learningSkills.length) * 2 * Math.PI;
    const x = radius * 0.5 * Math.cos(angle);
    const y = radius * 0.5 * Math.sin(angle);
    return { ...skill, x, y };
  });

  return (
    <section
      id="skills"
      className="relative flex flex-col items-center min-h-screen px-4 sm:px-6 pt-[env(safe-area-inset-top)] pb-12 bg-[#0a0f1a] text-white text-center overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, #00bfff44, transparent 70%), " +
          "radial-gradient(circle at bottom right, #00dfd844, transparent 70%)",
      }}
    >
      <BackgroundEffect />

      <h2 className="z-20 text-3xl sm:text-4xl font-extrabold mb-4 mt-10">
        What I Work With
      </h2>

      <div className="z-20 flex gap-3 mt-2 mb-6">
        <button
          onClick={() => setView("cloud")}
          className={`px-4 py-1 rounded ${
            view === "cloud" ? "bg-cyan-500 text-black" : "bg-gray-800"
          }`}
        >
          Cloud
        </button>
        <button
          onClick={() => setView("grid")}
          className={`px-4 py-1 rounded ${
            view === "grid" ? "bg-cyan-500 text-black" : "bg-gray-800"
          }`}
        >
          Grid
        </button>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-800 rounded px-2"
        >
          <option value="all">All</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
        </select>
      </div>

      {/* Toggle View */}
      {view === "cloud" ? (
        <div
          ref={containerRef}
          className="relative z-20 mx-auto"
          style={{ width: containerSize, height: containerSize }}
        >
          {/* Main Skills */}
          {skillsWithPosition.map(({ name, icon: Icon, x, y, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1, x, y }
                  : { opacity: 0, scale: 0.3, x: 0, y: 0 }
              }
              transition={{
                delay: isInView ? i * 0.1 : 0,
                type: "spring",
                stiffness: 140,
                damping: 20,
              }}
              whileHover={{ scale: 1.3 }}
              className="absolute flex flex-col items-center justify-center cursor-pointer p-2 bg-gray-900 rounded-full shadow-xl"
              style={{ top: centerOffset, left: centerOffset }}
            >
              <Icon className="text-[28px]" style={{ color }} />
            </motion.div>
          ))}

          {/* Learning Skills (inner orbit) */}
          {learningPositions.map(({ name, icon: Icon, x, y, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1, x, y }
                  : { opacity: 0, scale: 0.3, x: 0, y: 0 }
              }
              transition={{ delay: i * 0.2 }}
              className="absolute flex items-center justify-center cursor-help bg-[#1e293b] rounded-full w-10 h-10"
              style={{ top: centerOffset, left: centerOffset }}
              title={`Learning: ${name}`}
            >
              <Icon className="text-[20px]" style={{ color }} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 z-20">
          {skills.map(({ name, icon: Icon, color }) => (
            <div
              key={name}
              className="flex flex-col items-center bg-gray-800 rounded-lg p-3 hover:scale-105 transition"
              title={name}
            >
              <Icon className="text-3xl" style={{ color }} />
              <span className="mt-2 text-sm">{name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Arrows */}
      <div className="relative z-10 flex flex-row items-center justify-center gap-6 mt-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll Up"
          className="hover:scale-110 transition-transform"
        >
          <ChevronUpIcon className="w-8 h-8 text-cyan-300" />
        </button>
        <button
          onClick={() => {
            const nextSection = document.getElementById("project-section");
            if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
          }}
          aria-label="Scroll Down"
          className="animate-pulse hover:scale-110 transition-transform"
        >
          <ChevronDownIcon className="w-8 h-8 text-cyan-300" />
        </button>
      </div>
    </section>
  );
}
