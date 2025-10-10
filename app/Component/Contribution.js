"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

// Lazy-load for client-only effects
const LazyParticles = dynamic(() => import("./CustomParticles"), {
  ssr: false,
  loading: () => null,
});

export default function Contribution() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hydrated, setHydrated] = useState(false);

  // Client-only hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  const contributions = [
    {
      title: "Open Source Project",
      description: "Contributed features and bug fixes to popular React libraries.",
      link: "https://github.com/",
    },
    {
      title: "Portfolio Website",
      description: "Built a fully responsive, animated portfolio using Next.js & Tailwind.",
      link: "#",
    },
    {
      title: "Tech Blog Articles",
      description: "Authored articles on performance optimization and modern web tools.",
      link: "#",
    },
  ];

  return (
    <section
      id="contributions"
      className={`relative flex flex-col items-center justify-center min-h-[60vh] px-6 py-16 text-center overflow-hidden bg-[#f9fafb] dark:bg-[#0f172a]
        bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
        text-black dark:text-white
         pt-[env(safe-area-inset-top)]
        `}
      aria-label="My Contributions"
    >
      {hydrated && <LazyParticles />}

      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl font-bold mb-12 drop-shadow-md"
      >
        My Contributions 🚀
      </motion.h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full mx-auto">
        {contributions.map((item, index) => (
          <motion.a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`p-6 rounded-xl shadow-lg hover:scale-105 transition transform ${isDark ? "bg-[#1e293b] hover:bg-[#334155]" : "bg-white hover:bg-blue-50"
              }`}
          >
            <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
            <p className="text-sm sm:text-base">{item.description}</p>
          </motion.a>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="mt-12 text-sm sm:text-base text-gray-700 dark:text-slate-300 drop-shadow-sm"
      >
        Check out my work and contributions to the web development ecosystem 🌐💻
      </motion.p>
    </section>
  );
}
