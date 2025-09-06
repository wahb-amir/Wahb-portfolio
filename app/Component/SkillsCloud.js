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
  const [containerSize, setContainerSize] = useState(420); // px
  const [dotSize, setDotSize] = useState(56); // px
  const isDark = mounted && theme === "dark";
  const isInView = useInView(containerRef, { margin: "-150px", once: true });

  // responsive container + dot sizing
  useEffect(() => {
    setMounted(true);
    const calc = () => {
      const w = window.innerWidth;
      // pick container size based on viewport width
      if (w < 420) {
        setContainerSize(Math.max(220, Math.floor(w * 0.82))); // mobile: ~82% of width
        setDotSize(44);
      } else if (w < 640) {
        setContainerSize(320);
        setDotSize(50);
      } else if (w < 900) {
        setContainerSize(380);
        setDotSize(56);
      } else {
        setContainerSize(420);
        setDotSize(64);
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // compute center offset (top/left where each dot animation starts from)
  const centerOffset = containerSize / 2 - dotSize / 2;
  const radius = containerSize / 2.2; // a bit smaller than half to avoid clipping

  const skillsFiltered = coreSkills.filter((skill) => (filter === "all" ? true : skill.type === filter || skill.type === "backend" && filter === "backend" ? true : filter === "frontend" ? skill.type === "frontend" : false));

  // map with positions
  const skillsWithPos = skillsFiltered.map((skill, i) => {
    const angle = (i / skillsFiltered.length) * 2 * Math.PI;
    const x = Math.round(radius * Math.cos(angle));
    const y = Math.round(radius * Math.sin(angle));
    return { ...skill, x, y };
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
      <div className="z-20 flex flex-wrap gap-3 mt-2 mb-6 justify-center">
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
        <div
          ref={containerRef}
          className="relative z-20 flex items-center justify-center mx-auto"
          style={{
            width: `${containerSize}px`,
            height: `${containerSize}px`,
            maxWidth: "92vw",
            maxHeight: "92vw",
          }}
        >
          {skillsWithPos.map(({ name, icon: Icon, x, y, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
              animate={isInView ? { opacity: 1, scale: 1, x, y } : { opacity: 0, scale: 0.3, x: 0, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 120, damping: 18 }}
              whileHover={{ scale: 1.18 }}
              className="absolute flex flex-col items-center justify-center cursor-pointer rounded-full shadow-xl"
              style={{
                top: centerOffset,
                left: centerOffset,
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: isDark ? "#1f2937" : "#e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title={name}
              aria-hidden={false}
            >
              <Icon className={dotSize < 50 ? "text-[22px]" : "text-[28px] md:text-[35px]"} style={{ color }} />
            </motion.div>
          ))}

          {/* Learning / ML positioned closer to center */}
          {learningSkills.map(({ name, icon: Icon, color }, i) => {
            const angle = (i / learningSkills.length) * 2 * Math.PI;
            const lx = Math.round((radius * 0.45) * Math.cos(angle));
            const ly = Math.round((radius * 0.45) * Math.sin(angle));
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                animate={isInView ? { opacity: 1, scale: 1, x: lx, y: ly } : { opacity: 0, scale: 0.2, x: 0, y: 0 }}
                transition={{ delay: 0.15 + i * 0.12 }}
                className="absolute flex items-center justify-center cursor-help rounded-full"
                style={{
                  top: centerOffset,
                  left: centerOffset,
                  width: Math.round(dotSize * 0.7),
                  height: Math.round(dotSize * 0.7),
                  backgroundColor: isDark ? "#374151" : "#cbd5e1",
                }}
                title={`Learning: ${name}`}
              >
                <Icon className={dotSize < 50 ? "text-[16px]" : "text-[20px] md:text-[25px]"} style={{ color }} />
              </motion.div>
            );
          })}
        </div>
      ) : (
        // Grid View
        <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 z-20 px-2 max-w-6xl`}>
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
      <div className="relative z-10 flex flex-row items-center justify-center gap-6 mt-12">
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
