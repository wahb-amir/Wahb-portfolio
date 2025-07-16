"use client";

import { useRef, useEffect, useState } from "react";
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

const skills = [
  { name: "HTML", icon: <SiHtml5 color="#E34F26" /> },
  { name: "CSS", icon: <SiCss3 color="#1572B6" /> },
  { name: "Tailwind", icon: <SiTailwindcss color="#38B2AC" /> },
  { name: "JavaScript", icon: <SiJavascript color="#F7DF1E" /> },
  { name: "React", icon: <SiReact color="#61DAFB" /> },
  { name: "Next.js", icon: <SiNextdotjs color="#000000" /> },
  { name: "Node.js", icon: <SiNodedotjs color="#339933" /> },
  { name: "Express", icon: <SiExpress color="#000000" /> },
  { name: "MongoDB", icon: <SiMongodb color="#47A248" /> },
  { name: "Framer Motion", icon: <SiFramer color="#0055FF" /> },
];


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
  // only show blur overlay after client mount
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
      <CustomParticles
        fullScreen={true}
        className="absolute inset-0 z-0"
        colors={["#00dfd8", "#00bfff", "#00aaff", "#66fcf1", "#ffffff"]}
      />

      {/* Cinematic blur overlay—only on client */}
      {mounted && (
        <motion.div
          initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
          animate={{ backdropFilter: "blur(20px)", opacity: 1 }}
          exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 z-10 pointer-events-none"
        />
      )}

      <h2 className="relative z-20 text-4xl font-extrabold mb-10 text-white">
        What I Work With
      </h2>

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
              color: "#00dfd8",
              transition: { duration: 0.3 },
            }}
            className="absolute flex items-center justify-center cursor-pointer rounded-full shadow-lg"
            style={{
              backgroundColor: "#111827",
              color: "white",
              top: centerOffset,
              left: centerOffset,
              boxShadow:
                "0 0 10px rgba(0, 223, 216, 0.7), 0 0 20px rgba(0, 223, 216, 0.5)",
            }}
            title={name}
          >
            <div style={{ fontSize: 30 }}>{icon}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
