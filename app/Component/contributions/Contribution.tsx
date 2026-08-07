"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";

// ── Pure-CSS animated particle grid — replaces the entire @tsparticles bundle ─
function CSSParticleGrid() {
  return (
    <>
      <style>{`
        @keyframes contrib-float {
          0%   { transform: translateY(0)   scale(1);    opacity: 0.18; }
          50%  { transform: translateY(-14px) scale(1.2); opacity: 0.45; }
          100% { transform: translateY(0)   scale(1);    opacity: 0.18; }
        }
        .contrib-dot {
          position: absolute;
          border-radius: 50%;
          animation: contrib-float linear infinite;
          pointer-events: none;
          will-change: transform, opacity;
        }
      `}</style>

      {/* 22 lightweight dots — positions & delays baked in as inline styles */}
      {([
        [8,  12, 4,  0,    9],
        [18, 55, 5,  1.4,  11],
        [30, 28, 3,  2.8,  8],
        [45, 72, 6,  0.6,  13],
        [55, 18, 4,  3.5,  10],
        [62, 88, 3,  1.8,  9],
        [72, 42, 5,  0.3,  12],
        [82, 65, 4,  2.2,  10],
        [90, 10, 3,  4.1,  11],
        [14, 80, 5,  1.0,  8],
        [25, 46, 4,  3.0,  13],
        [38, 91, 3,  0.8,  9],
        [50, 35, 6,  2.5,  12],
        [67, 20, 4,  1.6,  10],
        [78, 78, 5,  3.8,  11],
        [92, 50, 3,  0.4,  8],
        [5,  60, 4,  2.9,  13],
        [42, 14, 3,  1.2,  9],
        [59, 58, 5,  4.4,  11],
        [75, 33, 4,  0.7,  10],
        [86, 90, 3,  2.1,  12],
        [20, 24, 5,  3.3,  8],
      ] as [number, number, number, number, number][]).map(([left, top, size, delay, dur], i) => (
        <span
          key={i}
          className="contrib-dot"
          style={{
            left:             `${left}%`,
            top:              `${top}%`,
            width:            `${size}px`,
            height:           `${size}px`,
            background:       "currentColor",
            animationDelay:   `${delay}s`,
            animationDuration:`${dur}s`,
          }}
        />
      ))}
    </>
  );
}

export default function Contribution() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const contributions = [
    {
      title: "Open Source Project",
      description:
        "Contributed features and bug fixes to popular React libraries.",
      link: "https://github.com/",
    },
    {
      title: "Portfolio Website",
      description:
        "Built a fully responsive, animated portfolio using Next.js & Tailwind.",
      link: "#",
    },
    {
      title: "Tech Blog Articles",
      description:
        "Authored articles on performance optimization and modern web tools.",
      link: "#",
    },
  ];

  return (
    <section
      id="contributions"
      className={`relative flex flex-col items-center justify-center min-h-[60vh] px-6 py-16 text-center overflow-hidden pt-[env(safe-area-inset-top)] text-black dark:text-white`}
      aria-label="My Contributions"
    >
      {/* Pure-CSS particle grid — zero JS weight */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 overflow-hidden pointer-events-none ${
          isDark ? "text-cyan-400" : "text-blue-400"
        }`}
      >
        <CSSParticleGrid />
      </div>

      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-4xl sm:text-5xl font-bold mb-12 drop-shadow-md"
      >
        My Contributions 🚀
      </motion.h2>

      <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full mx-auto">
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
            className={`p-6 rounded-xl shadow-lg hover:scale-105 transition transform ${
              isDark
                ? "bg-[#1e293b] hover:bg-[#334155]"
                : "bg-white hover:bg-blue-50"
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
        className="relative z-10 mt-12 text-sm sm:text-base text-gray-700 dark:text-slate-300 drop-shadow-sm"
      >
        Check out my work and contributions to the web development ecosystem
        🌐💻
      </motion.p>
    </section>
  );
}
