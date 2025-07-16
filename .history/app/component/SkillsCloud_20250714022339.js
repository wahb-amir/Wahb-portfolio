"use client";

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

const containerSize = 350; // width & height of container
const radius = 140; // radius of the circle where icons will sit

export default function SkillsCloud() {
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
        colors={["#00dfd8", "#00bfff", "#00aaff", "#66fcf1", "#ffffff"]}
      />

      <h2 className="text-4xl font-extrabold mb-10 text-white">What I Work With</h2>

      <div
        className="relative"
        style={{
          width: containerSize,
          height: containerSize,
          margin: "0 auto",
        }}
      >
        {skills.map((skill, i) => {
          // Calculate angle for each skill evenly spaced on the circle
          const angle = (i / skills.length) * 2 * Math.PI;
          // Calculate x and y based on radius and angle
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, x, y, scale: 1 }}
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
                width: 60,
                height: 60,
                backgroundColor: "#111827",
                color: "white",
                top: containerSize / 2 - 30,
                left: containerSize / 2 - 30,
                boxShadow:
                  "0 0 10px rgba(0, 223, 216, 0.7), 0 0 20px rgba(0, 223, 216, 0.5)",
              }}
              title={skill.name}
            >
              <div style={{ fontSize: 30 }}>{skill.icon}</div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
