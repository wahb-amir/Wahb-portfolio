"use client";
import { useEffect, useState, useRef } from "react";
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
} from "react-icons/si";
import BackgroundEffect from "./BackgroundEffect";

// 🎯 Skill Set
const skills = [
  { name: "HTML", icon: SiHtml5, color: "#E34F26" },
  { name: "CSS", icon: SiCss3, color: "#1572B6" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#38B2AC" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "Express", icon: SiExpress, color: "#000000" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "Framer Motion", icon: SiFramer, color: "#0055FF" },
];

// 👀 Responsive window size hook
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

export default function SkillsCloud() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { width } = useWindowSize();

  // 📐 Dynamically adjust container/radius based on screen size
  const containerSize = width < 480 ? 260 : width < 768 ? 320 : 420;
  const radius = containerSize / 2.5;
  const centerOffset = containerSize / 2 - 30;

  // 🌀 Calculate positions for circular layout
  const skillsWithPosition = skills.map((skill, i) => {
    const angle = (i / skills.length) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { ...skill, x, y };
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="skills"
      className="relative flex flex-col justify-start items-center min-h-screen px-4 sm:px-6 text-center bg-[#0a0f1a] text-white overflow-hidden pt-[env(safe-area-inset-top)]"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, #00bfff44, transparent 70%), " +
          "radial-gradient(circle at bottom right, #00dfd844, transparent 70%)",
      }}
    >
      <BackgroundEffect />
      {mounted && (
        <motion.div
          initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
          animate={{ backdropFilter: "blur(20px)", opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 z-10 pointer-events-none"
        />
      )}

      <h2 className="relative z-20 text-2xl sm:text-4xl font-extrabold mb-8 text-white top-8">
        What I Work With
      </h2>

      <div
        ref={containerRef}
        className="relative z-20 mx-auto top-10"
        style={{ width: containerSize, height: containerSize }}
      >
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
              delay: isInView ? i * 0.12 : 0,
              type: "spring",
              stiffness: 140,
              damping: 20,
            }}
            whileHover={{
              scale: 1.4,
              rotate: 10,
              transition: { duration: 0.3 },
            }}
            className="absolute flex items-center justify-center cursor-pointer rounded-full shadow-lg w-[40px] h-[40px] xs:w-[60px] xs:h-[60px] bg-gray-900"
            style={{
              top: centerOffset,
              left: centerOffset,
              boxShadow:
                "0 0 10px rgba(0, 223, 216, 0.7), 0 0 20px rgba(0, 223, 216, 0.5)",
            }}
            title={name}
          >
            {name === "React" ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              >
                <Icon className="text-[30px]" style={{ color }} />
              </motion.div>
            ) : (
              <Icon className="text-[30px]" style={{ color }} />
            )}
          </motion.div>
        ))}
      </div>
      {/* 🔼 Scroll Up Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 text-white text-2xl hover:scale-110 transition-all duration-300"
      >
        ⬆️
      </button>

      <button
        onClick={() => {
          const nextSection = document.getElementById("next-section");
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 text-white text-2xl hover:scale-110 transition-all duration-300"
      >
        ⬇️
      </button>
    </section>
  );
}
