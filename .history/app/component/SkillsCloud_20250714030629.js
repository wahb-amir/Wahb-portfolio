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

// 👇 Icons styled with Tailwind
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

// 💫 Precomputed positions
const containerSize = 350;
const radius = 40;
const centerOffset = containerSize / 2 - 30;
const skillsWithPosition = skills.map((skill, i) => {
  const angle = (i / skills.length) * 2 * Math.PI;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  return { ...skill, x, y };
});

export default function SkillsCloud() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="skills"
      className="relative flex flex-col justify-start items-center
        min-h-screen px-4 xs:px-6 text-center bg-[#0a0f1a] text-white overflow-hidden
        pt-[env(safe-area-inset-top)]"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, #00bfff44, transparent 70%), " +
          "radial-gradient(circle at bottom right, #00dfd844, transparent 70%)",
      }}
    >
      {/* 🎇 Particles Background */}
      <CustomParticles
        fullScreen
        className="absolute inset-0 z-0"
        colors={["#00dfd8", "#00bfff", "#00aaff", "#66fcf1", "#ffffff"]}
      />

      {/* 🎥 Cinematic blur overlay */}
      {mounted && (
        <motion.div
          initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
          animate={{ backdropFilter: "blur(20px)", opacity: 1 }}
          exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 z-10 pointer-events-none"
        />
      )}

      {/* 🧠 Section Heading */}
      <h2 className="relative z-20 text-4xl font-extrabold mb-10 text-white">
        What I Work With
      </h2>

      {/* 🔘 Skill Icons */}
      <div
        className="relative z-20"
        style={{ width: containerSize, height: containerSize }}
      >
        {skillsWithPosition.map(({ name, icon, x, y }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, x, y }}
            transition={{
              delay: i * 0.15,
              type: "spring",
              stiffness: 120,
              damping: 10,
            }}
            whileHover={{
              scale: 1.4,
              rotate: 10,
              transition: { duration: 0.3 },
            }}
            className="absolute flex items-center justify-center cursor-pointer 
              rounded-full shadow-lg w-[60px] h-[60px] 
              bg-[#111827] text-white hover:text-cyan-300"
            title={name}
          >
            <div className="text-[30px]">{icon}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
