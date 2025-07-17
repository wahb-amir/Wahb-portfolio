"use client";
import { useState, useEffect } from "react";

import { useTheme } from "next-themes";
const Footer = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";
  const sectionStyle = mounted
    ? {
        backgroundImage: isDark
          ? "radial-gradient(circle at top left, #00b1ff33, transparent 70%), radial-gradient(circle at bottom right, #00dfd033, transparent 70%)"
          : "radial-gradient(circle at top left, #7f5af022, transparent 70%), radial-gradient(circle at bottom right, #00dfd822, transparent 70%)",
        backgroundColor: isDark ? "#0f172a" : "#f9fafb",
      }
    : {};
  return (
    <footer
      className="w-full px-6 py-10 text-white text-center text-sm md:text-base bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88] backdrop-blur-[100px]"
      style={sectionStyle}
    >
      <div className="mb-4 flex justify-center gap-6 flex-wrap">
        <a
          href="https://github.com/coder101-js"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a href="mailto:wahb@buttnetworks.com?subject=Hello%20Wahb&body=I%20saw%20your%20portfolio%20and...">
          Email Me
        </a>
        <a href="#contact">Contact</a>
      </div>

      <p className="text-xs opacity-70 bg-transparent pt-4 border-t border-white/20 mt-6">
        © {new Date().getFullYear()} Wahb. Crafted with 💻 using Next.js,
        Tailwind, & Framer Motion.
      </p>
    </footer>
  );
};

export default Footer;
