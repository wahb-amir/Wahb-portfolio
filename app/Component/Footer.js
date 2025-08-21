"use client";
import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { motion, useInView } from "framer-motion";

// Lazy background effect
const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
  ssr: false,
  loading: () => null,
});

export default function Footer() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <footer className="h-32 w-full" />;

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`
    w-full px-6 py-10 text-center text-sm md:text-base
    bg-[#f9fafb] dark:bg-[#0f172a]
    bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
    text-black dark:text-white
    backdrop-blur-[100px]
    overflow-hidden
  `}
      role="contentinfo"
      aria-label="Footer"
    >
      <LazyBackgroundEffect />

      <nav
        className="mb-4 flex justify-center gap-6 flex-wrap"
        aria-label="Footer links"
      >
        <a
          href="https://github.com/coder101-js"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit my GitHub"
          className="hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          GitHub
        </a>
        <a
          href="#contact"
          aria-label="Go to contact section"
          className="hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          Contact
        </a>
      </nav>

      <p className="text-xs opacity-70 bg-transparent pt-4 border-t border-white/20 mt-6">
        © {new Date().getFullYear()} Wahb. Crafted with 💻 using Next.js,
        Tailwind, & Framer Motion.
      </p>
    </motion.footer>
  );
}
