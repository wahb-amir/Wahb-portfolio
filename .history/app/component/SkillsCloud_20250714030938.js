"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CustomParticles from "./CustomParticles";
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
} from "react-icons/si";

// 🧠 Skill set
const skills = [
  { name: "HTML", icon: <SiHtml5 className="text-[#E34F26]" /> },
  { name: "CSS", icon: <SiCss3 className="text-[#1572B6]" /> },
  { name: "Tailwind", icon: <SiTailwindcss className="text-[#38B2AC]" /> },
  { name: "JavaScript", icon: <SiJavascript className="text-[#F7DF1E]" /> },
  { name: "React", icon: <SiReact className="text-[#61DAFB]" /> },
  { name: "Next.js", icon: <SiNextdotjs className="text-black dark:text-white" /> },
  { name: "Node.js", icon: <SiNodedotjs className="text-[#339933]" /> },
  { name: "Express", icon: <SiExpress className="text-black dark:text-white" /> },
  { name: "MongoDB", icon: <SiMongodb className="text-[#47A248]" /> },
  { name: "Framer Motion", icon: <SiFramer className="text-[#0055FF]" /> },
];

export default function SkillsCloud() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="skills"
      className="relative flex flex-col items-center justify-center min-h-screen bg-[#0a0f1a] text-white overflow-hidden px-4 xs:px-6 pt-[env(safe-area-inset-top)]"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, #00bfff44, transparent 70%), radial-gradient(circle at bottom right, #00dfd844, transparent 70%)",
      }}
    >
      {/* Background particles */}
      <CustomParticles
        fullScreen
        className="absolute inset-0 z-0"
        colors={["#00dfd8", "#00bfff", "#00aaff", "#66fcf1", "#ffffff"]}
      />

      {/* Blur overlay */}
      {mounted && (
        <motion.div
          initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
          animate={{ backdropFilter: "blur(20px)", opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 z-10 pointer-events-none"
        />
      )}

      {/* Heading */}
      <h2 className="relative z-20 text-4xl font-extrabold mb-12 text-white">
        What I Work With
      </h2>

      {/* Centered Grid of Skills */}
      <div className="relative z-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 place-items-center">
        {skills.map(({ name, icon }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: i * 0.1,
              type: "spring",
              stiffness: 120,
              damping: 10,
            }}
            whileHover={{
              scale: 1.3,
              rotate: 5,
              transition: { duration: 0.3 },
            }}
            className="flex items-center justify-center w-[70px] h-[70px] bg-gray-900 rounded-full shadow-lg cursor-pointer hover:text-cyan-300 transition-colors"
            title={name}
          >
            <div className="text-[32px]">{icon}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
