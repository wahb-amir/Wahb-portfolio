"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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

// Minimal, Rohit-inspired tech stack layout — compact chips, clear hierarchy, subtle framer-motion

type Category = "frontend" | "backend" | "devops" | "database";

type Skill = {
  id: string;
  name: string;
  icon: any;
  color?: string;
  level?: "expert" | "intermediate" | "learning";
};

const SKILLS: Record<string, Skill> = {
  html: {
    id: "html",
    name: "HTML",
    icon: SiHtml5,
    color: "#E34F26",
    level: "expert",
  },
  css: {
    id: "css",
    name: "CSS",
    icon: SiCss3,
    color: "#1572B6",
    level: "expert",
  },
  tailwind: {
    id: "tailwind",
    name: "Tailwind",
    icon: SiTailwindcss,
    color: "#38B2AC",
    level: "expert",
  },
  js: {
    id: "js",
    name: "JavaScript",
    icon: SiJavascript,
    color: "#F7DF1E",
    level: "expert",
  },
  ts: {
    id: "ts",
    name: "TypeScript",
    icon: SiTypescript,
    color: "#007ACC",
    level: "intermediate",
  },
  react: {
    id: "react",
    name: "React",
    icon: SiReact,
    color: "#61DAFB",
    level: "expert",
  },
  next: {
    id: "next",
    name: "Next.js",
    icon: SiNextdotjs,
    color: "#000000",
    level: "intermediate",
  },
  framer: {
    id: "framer",
    name: "Framer Motion",
    icon: SiFramer,
    color: "#0055FF",
    level: "intermediate",
  },
  node: {
    id: "node",
    name: "Node.js",
    icon: SiNodedotjs,
    color: "#339933",
    level: "intermediate",
  },
  express: {
    id: "express",
    name: "Express",
    icon: SiExpress,
    color: "#000000",
    level: "intermediate",
  },
  python: {
    id: "python",
    name: "Python",
    icon: SiPython,
    color: "#3776AB",
    level: "intermediate",
  },
  mongodb: {
    id: "mongodb",
    name: "MongoDB",
    icon: SiMongodb,
    color: "#47A248",
    level: "intermediate",
  },
  mysql: {
    id: "mysql",
    name: "MySQL",
    icon: SiMysql,
    color: "#00758F",
    level: "learning",
  },
  docker: {
    id: "docker",
    name: "Docker",
    icon: SiDocker,
    color: "#2496ED",
    level: "intermediate",
  },
  nginx: {
    id: "nginx",
    name: "Nginx",
    icon: SiNginx,
    color: "#009639",
    level: "intermediate",
  },
  github: {
    id: "github",
    name: "GitHub",
    icon: SiGithub,
    color: "#181717",
    level: "expert",
  },
  gha: {
    id: "gha",
    name: "GitHub Actions",
    icon: SiGithubactions,
    color: "#2088FF",
    level: "intermediate",
  },
  pandas: {
    id: "pandas",
    name: "Pandas",
    icon: SiPandas,
    color: "#2b7bb9",
    level: "learning",
  },
  numpy: {
    id: "numpy",
    name: "NumPy",
    icon: SiNumpy,
    color: "#0b7adb",
    level: "learning",
  },
  sklearn: {
    id: "sklearn",
    name: "Scikit-learn",
    icon: SiScikitlearn,
    color: "#F7931E",
    level: "learning",
  },
  pytorch: {
    id: "pytorch",
    name: "PyTorch",
    icon: SiPytorch,
    color: "#EE4C2C",
    level: "learning",
  },
  opencv: {
    id: "opencv",
    name: "OpenCV",
    icon: SiOpencv,
    color: "#4C8BF5",
    level: "learning",
  },
  cpp: {
    id: "cpp",
    name: "C++",
    icon: SiCplusplus,
    color: "#00599C",
    level: "learning",
  },
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

  const [cols, setCols] = useState(2);
  useEffect(() => {
    function onResize() {
      const w = window.innerWidth;
      if (w < 640) setCols(2);
      else if (w < 1024) setCols(3);
      else setCols(4);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const groups = useMemo(() => {
    return GROUPS.map((g) => ({ ...g, skills: g.ids.map((id) => SKILLS[id]) }));
  }, []);

  // subtle entrance animation
  const container = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.03, delayChildren: 0.05 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <section
      id="skills"
      className={`
    relative flex flex-col justify-start items-center
    px-4 xs:px-6 text-center pb-[6.25rem]
    bg-[#f9fafb] dark:bg-[#0f172a]
    bg-gradient-to-b from-[#00b1ff88] to-[#00bfff44]
    text-black dark:text-white
    overflow-hidden pt-[env(safe-area-inset-top)]
  `}
    >
      <div className="text-center">
        <h3
          className={`text-3xl font-extrabold tracking-tight m-4 mt-6${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          Tech Stack
        </h3>
        <p className="text-md text-slate-600  dark:text-slate-300 m-4 mt-4 mb-5">
          Tools & technologies I use to build fast, maintainable web apps.
        </p>
      </div>
      <div className="max-w-6xl mx-auto px-4">
        <div
          className={`
             rounded-2xl p-6 shadow-sm bg-[#f9fafb] dark:bg-[#0f172a]
    bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
    text-black dark:text-white`}
        >
          <div className="relative flex justify-center mb-6 h-8">
            <div className="absolute right-0 flex items-end gap-2">
              <motion.span
                className="w-2 h-2 rounded-full"
                initial={{ y: 0 }}
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 1.1 }}
                style={{ background: dark ? "#7DD3FC" : "#2563EB" }}
              />
              <motion.span
                className="w-2 h-2 rounded-full"
                initial={{ y: 0 }}
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 1.1, delay: 0.15 }}
                style={{ background: dark ? "#A78BFA" : "#7C3AED" }}
              />
              <motion.span
                className="w-2 h-2 rounded-full"
                initial={{ y: 0 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 1.1, delay: 0.3 }}
                style={{ background: dark ? "#86EFAC" : "#16A34A" }}
              />
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 "
          >
            {groups.map((g) => (
              <motion.div
                key={g.key}
                variants={item}
                className={`${
                  dark
                    ? "bg-[#071427]/40 border border-[#123a]"
                    : "bg-gray-50/60 border border-gray-100"
                } rounded-lg p-4`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div
                      className={`font-semibold ${
                        dark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {g.title}
                    </div>
                    <div
                      className={`text-xs text-slate-600 mt-1 dark:text-slate-300`}
                    >
                      {g.skills.length} tools
                    </div>
                  </div>
                </div>

                <div
                  className={`grid ${
                    cols === 2
                      ? "grid-cols-2"
                      : cols === 3
                      ? "grid-cols-3"
                      : "grid-cols-4"
                  } gap-3`}
                >
                  {g.skills.map((s) => (
                    <div
                      key={s.id}
                      className={`${
                        dark
                          ? "bg-[#082235]/60 hover:bg-[#0b3150]/60"
                          : "bg-white"
                      } flex items-center gap-3 px-3 py-2 rounded-lg border ${
                        dark ? "border-[#0e2b44]" : "border-gray-100"
                      } shadow-sm`}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{
                          background: dark
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(0,0,0,0.04)",
                        }}
                      >
                        <s.icon
                          className="text-xl"
                          style={{ color: s.color }}
                        />
                      </div>
                      <div className="text-sm font-medium">{s.name}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="relative z-10 flex justify-center items-center gap-6 mt-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll Up"
          className="hover:scale-110 transition-transform"
        >
          <ChevronUpIcon
            className={`w-8 h-8 dark:text-cyan-300 text-cyan-600`}
          />
        </button>
        <button
          onClick={() =>
            document
              .getElementById("project-section")
              ?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
          aria-label="Scroll Down"
          className="animate-pulse hover:scale-110 transition-transform"
        >
          <ChevronDownIcon
            className={`w-8 h-8 dark:text-cyan-300 text-cyan-600`}
          />
        </button>
      </div>
    </section>
  );
}
