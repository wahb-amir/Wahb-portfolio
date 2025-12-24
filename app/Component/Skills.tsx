"use client";

import React, { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
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
  SiOpencv,
  SiTypescript,
  SiMysql,
  SiDocker,
  SiGithub,
  SiNginx,
  SiGithubactions,
} from "react-icons/si";

type Category = "frontend" | "backend" | "devops" | "database";

type Skill = {
  id: string;
  name: string;
  icon: any;
  color?: string;
};

const SKILLS: Record<string, Skill> = {
  html: { id: "html", name: "HTML", icon: SiHtml5, color: "#E34F26" },
  css: { id: "css", name: "CSS", icon: SiCss3, color: "#1572B6" },
  tailwind: {
    id: "tailwind",
    name: "Tailwind",
    icon: SiTailwindcss,
    color: "#38B2AC",
  },
  js: { id: "js", name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  ts: { id: "ts", name: "TypeScript", icon: SiTypescript, color: "#007ACC" },
  react: { id: "react", name: "React", icon: SiReact, color: "#61DAFB" },
  next: { id: "next", name: "Next.js", icon: SiNextdotjs, color: "#000000" },
  framer: { id: "framer", name: "Framer", icon: SiFramer, color: "#0055FF" },
  node: { id: "node", name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  express: {
    id: "express",
    name: "Express",
    icon: SiExpress,
    color: "#000000",
  },
  python: { id: "python", name: "Python", icon: SiPython, color: "#3776AB" },
  mongodb: {
    id: "mongodb",
    name: "MongoDB",
    icon: SiMongodb,
    color: "#47A248",
  },
  mysql: { id: "mysql", name: "MySQL", icon: SiMysql, color: "#00758F" },
  docker: { id: "docker", name: "Docker", icon: SiDocker, color: "#2496ED" },
  nginx: { id: "nginx", name: "Nginx", icon: SiNginx, color: "#009639" },
  github: { id: "github", name: "GitHub", icon: SiGithub, color: "#181717" },
  gha: { id: "gha", name: "Actions", icon: SiGithubactions, color: "#2088FF" },
  pandas: { id: "pandas", name: "Pandas", icon: SiPandas, color: "#2b7bb9" },
  numpy: { id: "numpy", name: "NumPy", icon: SiNumpy, color: "#0b7adb" },
  sklearn: {
    id: "sklearn",
    name: "Scikit",
    icon: SiScikitlearn,
    color: "#F7931E",
  },
  pytorch: {
    id: "pytorch",
    name: "PyTorch",
    icon: SiPytorch,
    color: "#EE4C2C",
  },
  opencv: { id: "opencv", name: "OpenCV", icon: SiOpencv, color: "#4C8BF5" },
  cpp: { id: "cpp", name: "C++", icon: SiCplusplus, color: "#00599C" },
};

const GROUPS: { key: Category; title: string; ids: string[] }[] = [
  {
    key: "frontend",
    title: "Frontend",
    ids: ["html", "css", "tailwind", "js", "ts", "react", "next", "framer"],
  },
  {
    key: "backend",
    title: "Backend",
    ids: [
      "node",
      "express",
      "python",
      "pandas",
      "numpy",
      "sklearn",
      "pytorch",
      "cpp",
    ],
  },
  { key: "devops", title: "DevOps", ids: ["docker", "nginx", "github", "gha"] },
  { key: "database", title: "Database", ids: ["mongodb", "mysql"] },
];

export default function SkillsGrouped() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const groups = useMemo(() => {
    return GROUPS.map((g) => ({ ...g, skills: g.ids.map((id) => SKILLS[id]) }));
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 260, damping: 20 },
    },
  };

  return (
    <section
      id="skills"
      className="relative flex flex-col justify-start items-center px-4 py-12 bg-[#f9fafb] dark:bg-[#0f172a] bg-gradient-to-b from-[#00b1ff88] to-[#00bfff44] text-black dark:text-white"
    >
      <div className="text-center mb-8">
        <h3 className="text-3xl font-extrabold tracking-tight mb-3">
          Tech Stack
        </h3>
        <p className="text-md text-slate-600 dark:text-slate-300">
          Tools & technologies I use to build fast, maintainable web apps.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        {/* Layout Strategy:
           - On Mobile: 1 Column for groups
           - On Desktop: 2 Columns for groups (Masonry-ish look)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((g) => (
            <motion.div
              key={g.key}
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className={`
                rounded-xl p-4 border shadow-sm transition-all
                ${
                  dark
                    ? "bg-[#071427]/50 border-[#123a]"
                    : "bg-white/60 border-gray-100"
                }
              `}
            >
              <div className="flex items-center justify-between mb-3 border-b border-gray-200 dark:border-white/5 pb-2">
                <h4 className="font-bold text-lg">{g.title}</h4>
                <span className="text-[10px] uppercase tracking-wider opacity-60 font-semibold">
                  {g.skills.length} skills
                </span>
              </div>

              {/* Skill Grid Strategy:
                 - grid-cols-3: Fits 3 items per row on tiny screens (iPhone SE)
                 - sm:grid-cols-4: Fits 4 items per row on larger phones/tablets
              */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {g.skills.map((s) => (
                  <motion.div
                    key={s.id}
                    variants={item}
                    className={`
                      flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border cursor-default
                      hover:scale-105 transition-transform duration-200
                      ${
                        dark
                          ? "bg-[#082235]/60 border-[#0e2b44]"
                          : "bg-white border-gray-100"
                      }
                    `}
                  >
                    <div className="p-1.5 rounded-full bg-black/5 dark:bg-white/5">
                      <s.icon
                        className="text-xl md:text-2xl"
                        style={{ color: s.color }}
                      />
                    </div>
                    {/* Truncate text to keep it on one line, use smaller font */}
                    <span className="text-[10px] xs:text-xs font-medium text-center truncate w-full opacity-90">
                      {s.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex gap-6 mt-10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="hover:scale-110 transition-transform p-2 bg-white/10 rounded-full"
        >
          <ChevronUpIcon className="w-6 h-6 text-cyan-700 dark:text-cyan-300" />
        </button>
        <button
          onClick={() =>
            document
              .getElementById("project-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="animate-bounce hover:scale-110 transition-transform p-2 bg-white/10 rounded-full"
        >
          <ChevronDownIcon className="w-6 h-6 text-cyan-700 dark:text-cyan-300" />
        </button>
      </div>
    </section>
  );
}
