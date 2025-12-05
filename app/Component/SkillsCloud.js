"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
  SiPython,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiPytorch,
  SiCplusplus,
  SiOpencv
} from "react-icons/si";

const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), { ssr: false, loading: () => null });

// Core skills
const coreSkills = [
  { name: "HTML", icon: SiHtml5, color: "#E34F26", type: "frontend" },
  { name: "CSS", icon: SiCss3, color: "#1572B6", type: "frontend" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#38B2AC", type: "frontend" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E", type: "frontend" },
  { name: "React", icon: SiReact, color: "#38B2AC", type: "frontend" },
  { name: "Next.js", icon: SiNextdotjs, color: "#000000", type: "frontend" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933", type: "backend" },
  { name: "Express", icon: SiExpress, color: "#000000", type: "backend" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248", type: "backend" },
  { name: "Framer Motion", icon: SiFramer, color: "#0055FF", type: "frontend" },
  { name: "Python", icon: SiPython, color: "#3776AB", type: "backend" },
  { name: "Scikit-learn", icon: SiScikitlearn, color: "#F7931E", type: "backend" },
];

// Learning skills
const learningSkills = [
  { name: "Pandas", icon: SiPandas, color: "#136bb9ff", type: "learning" },
  { name: "NumPy", icon: SiNumpy, color: "#0b7adb", type: "learning" },
  { name: "C++", icon: SiCplusplus, color: "#00599C", type: "learning" },
  { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C", type: "learning" },
  { name: "OpenCV", icon: SiOpencv, color: "#f27029", type: "learning" },
];

export default function SkillsCloud() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState("cloud");
  const [filter, setFilter] = useState("all");
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState(420);
  const [dotSize, setDotSize] = useState(56);
  const isDark = mounted && theme === "dark";
  const isInView = useInView(containerRef, { margin: "-150px", once: true });

  useEffect(() => {
    setMounted(true);
    const calc = () => {
      const w = window.innerWidth;
      if (w < 420) {
        setContainerSize(Math.max(220, Math.floor(w * 0.82)));
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

  const centerOffset = containerSize / 2 - dotSize / 2;
  const radius = containerSize / 2.2;

  const coreFiltered = coreSkills.filter((s) => {
    if (filter === "all") return true;
    if (filter === "frontend") return s.type === "frontend";
    if (filter === "backend") return s.type === "backend";
    return false;
  });

  const showLearning = filter === "all" || filter === "learning";

  const coreWithPos = coreFiltered.map((skill, i) => {
    const angle = (i / coreFiltered.length) * 2 * Math.PI;
    const x = Math.round(radius * Math.cos(angle));
    const y = Math.round(radius * Math.sin(angle));
    return { ...skill, x, y, idx: i };
  });

  const learnWithPos = showLearning
    ? learningSkills.map((skill, i) => {
      const angle = (i / learningSkills.length) * 2 * Math.PI;
      const lx = Math.round((radius * 0.45) * Math.cos(angle));
      const ly = Math.round((radius * 0.45) * Math.sin(angle));
      return { ...skill, x: lx, y: ly, idx: i };
    })
    : [];

  const cloudItems = filter === "learning" ? learnWithPos : [...coreWithPos, ...learnWithPos];

  const itemVariants = {
    initial: { opacity: 0, scale: 0.3 },
    animate: (pos) => ({ opacity: 1, scale: 1, x: pos.x, y: pos.y }),
    exit: { opacity: 0, scale: 0.2 },
  };

  const spring = { type: "spring", stiffness: 140, damping: 20 };

  return (
    <section
      id="skills"
      className={`relative flex flex-col items-center justify-center px-4 sm:px-6 pb-12 text-center overflow-hidden
        bg-[#f9fafb] dark:bg-[#0f172a]
        bg-gradient-to-b from-[#00b1ff88] to-[#00bfff44]
        text-black dark:text-white`}
    >
      <LazyBackgroundEffect />
      <h2 className={`z-20 text-3xl sm:text-4xl font-extrabold mb-4 mt-10 ${isDark ? "text-white" : "text-gray-800"}`}>
        What I Work With
      </h2>

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
          <AnimatePresence>
            {cloudItems.map(({ name, icon: Icon, x, y, color }) => (
              <motion.div
                key={name}
                custom={{ x, y }}
                variants={itemVariants}
                initial="initial"
                animate={isInView ? "animate" : "initial"}
                exit="exit"
                transition={{ ...spring, delay: 0 }}
                whileHover={{ scale: 1.14 }}
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
              >
                <motion.div
                  animate={name === "React" ? { rotate: 360 } : {}}
                  transition={name === "React" ? { repeat: Infinity, duration: 5, ease: "linear" } : {}}
                >
                  <Icon className={dotSize < 50 ? "text-[22px]" : "text-[28px] md:text-[35px]"} style={{ color }} />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 z-20 px-2 max-w-6xl`}>
          {filter === "learning"
            ? learningSkills.map(({ name, icon: Icon, color }) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.28 }}
                className={`flex flex-col items-center rounded-lg p-3 hover:scale-105 transition ${isDark ? "bg-gray-800" : "bg-gray-300"}`}
                title={`Learning: ${name}`}
              >
                <Icon className="text-3xl" style={{ color }} />
                <span className={`mt-2 text-sm ${isDark ? "text-white" : "text-black"}`}>Learning: {name}</span>
              </motion.div>
            ))
            : (
              <>
                {coreFiltered.map(({ name, icon: Icon, color }) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.28 }}
                    className={`flex flex-col items-center rounded-lg p-3 hover:scale-105 transition ${isDark ? "bg-gray-800" : "bg-gray-300"}`}
                    title={name}
                  >
                    <Icon className="text-3xl" style={{ color }} />
                    <span className={`mt-2 text-sm ${isDark ? "text-white" : "text-black"}`}>{name}</span>
                  </motion.div>
                ))}
                {filter === "all" && learnWithPos.map(({ name, icon: Icon, color }) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.28 }}
                    className={`flex flex-col items-center rounded-lg p-3 hover:scale-105 transition ${isDark ? "bg-gray-800" : "bg-gray-300"}`}
                    title={`Learning: ${name}`}
                  >
                    <Icon className="text-3xl" style={{ color }} />
                    <span className={`mt-2 text-sm ${isDark ? "text-white" : "text-black"}`}>Learning: {name}</span>
                  </motion.div>
                ))}
              </>
            )}
        </div>
      )}

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
