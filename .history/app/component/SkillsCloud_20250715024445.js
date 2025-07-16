import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

// ... your imports & data remain same ...

export default function SkillsCloud() {
  const [view, setView] = useState("cloud");
  const [filter, setFilter] = useState("all");
  const containerRef = useRef(null);

  // Detect visibility, triggerEvery time, no once
  const inView = useInView(containerRef, { once: false, margin: "-100px" });
  const [isVisible, setIsVisible] = useState(false);

  // When inView changes, update visibility state
  useEffect(() => {
    if (inView) setIsVisible(true);
    else setIsVisible(false);
  }, [inView]);

  // Reset visibility when filter or view changes to replay animation
  useEffect(() => {
    setIsVisible(false);
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, [filter, view]);

  // ... size, radius, skills filter logic same ...

  return (
    <section
      // ... your section styles & content ...
    >
      {/* Buttons for view & filter */}
      {/* ... same as before ... */}

      {view === "cloud" ? (
        <div
          ref={containerRef}
          className="relative z-20 mx-auto"
          style={{ width: containerSize, height: containerSize }}
        >
          {skillsWithPosition.map(({ name, icon: Icon, x, y, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
              animate={
                isVisible
                  ? { opacity: 1, scale: 1, x, y }
                  : { opacity: 0, scale: 0.3, x: 0, y: 0 }
              }
              transition={{
                delay: isVisible ? i * 0.1 : 0,
                type: "spring",
                stiffness: 140,
                damping: 20,
              }}
              whileHover={{ scale: 1.3 }}
              className="absolute flex flex-col items-center justify-center cursor-pointer p-2 bg-gray-900 rounded-full shadow-xl"
              style={{ top: centerOffset, left: centerOffset }}
            >
              <Icon className="text-[28px]" style={{ color }} />
            </motion.div>
          ))}

          {learningPositions.map(({ name, icon: Icon, x, y, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
              animate={
                isVisible
                  ? { opacity: 1, scale: 1, x, y }
                  : { opacity: 0, scale: 0.3, x: 0, y: 0 }
              }
              transition={{ delay: i * 0.2, type: "spring", stiffness: 140, damping: 20 }}
              className="absolute flex items-center justify-center cursor-help bg-[#1e293b] rounded-full w-10 h-10"
              style={{ top: centerOffset, left: centerOffset }}
              title={`Learning: ${name}`}
            >
              <Icon className="text-[20px]" style={{ color }} />
            </motion.div>
          ))}
        </div>
      ) : (
        // your grid view with similar visibility controls
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 z-20"
        >
          {skills.map(({ name, icon: Icon, color }) => (
            <motion.div
              key={name}
              className="flex flex-col items-center bg-gray-800 rounded-lg p-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              title={name}
            >
              <Icon className="text-3xl" style={{ color }} />
              <span className="mt-2 text-sm">{name}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Your arrows stuff */}
    </section>
  );
}
