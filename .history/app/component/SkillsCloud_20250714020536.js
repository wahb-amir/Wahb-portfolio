import { motion } from "framer-motion";

const skills = [
  "HTML",
  "CSS",
  "Tailwind",
  "JS",
  "React",
  "Next.js",
  "Node",
  "Express",
  "MongoDB",
  "Framer Motion",
];

// Calculate position in a circle
const radius = 120; 
export function SkillsCloud() {
  return (
    <section id="skills" className="py-16 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8">What I Work With</h2>
      <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
        {skills.map((skill, i) => {
          const angle = (i / skills.length) * 2 * Math.PI;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <motion.div
              key={skill}
              initial={{ opacity: 0, x: x * 1.5, y: y * 1.5 }}
              animate={{ opacity: 1, x, y }}
              transition={{
                delay: 0.2 + i * 0.1,
                type: "spring",
                stiffness: 120,
              }}
              whileHover={{ scale: 1.2, color: "#00dfd8" }}
              className="absolute bg-white dark:bg-[#1e1e28] px-4 py-2 rounded-xl shadow-md cursor-pointer select-none text-gray-800 dark:text-gray-200 text-sm sm:text-base"
            >
              {skill}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
