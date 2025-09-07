"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [smallWidth, setSmallWidth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setSmallWidth(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");
  const darkMode = resolvedTheme === "dark";

  const handleClick = (id) => {
    const elm = document.getElementById(id);
    if (elm) elm.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <nav className="relative z-50">
      <div
        className={`
          flex justify-between items-center rounded-xl px-4 py-2
          backdrop-blur-md
          bg-[#f9fafb] dark:bg-[#0f172a]
          bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
          text-black dark:text-white
        `}
      >
        <Image src="/logo.png" alt="wahb logo" width={50} height={50} className="rounded-full cursor-pointer" />

        {/* Desktop menu */}
        {!smallWidth && (
          <ul className="hidden md:flex flex-row items-center">
            {["skills", "projects", "about", "contact"].map((id) => (
              <li key={id}>
                <button
                  onClick={() => handleClick(id)}
                  className="w-full mb-2 px-3 py-2 rounded hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors"
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              </li>

            ))}

            <li>
              <a
                href="https://github.com/coder101-js"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit my GitHub"
              >
                <FontAwesomeIcon icon={faGithub} className="scale-150" />
              </a>

            </li>

            <li>
              <button onClick={toggleTheme} aria-label="Toggle theme">
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="scale-150" />
              </button>
            </li>

          </ul>
        )}

        {/* Hamburger button */}
        {smallWidth && (
          <button
            className="md:hidden flex items-center justify-center p-2 rounded"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 20 20" className={darkMode ? "text-white" : "text-black"}>
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile menu with reserved space */}
      <ul
        className={`
          fixed top-[64px] left-0 w-full flex flex-col items-start px-4 py-4 z-40 rounded-b-xl shadow-lg
          ${darkMode ? "bg-[#0f172a]/95" : "bg-white/95"} backdrop-blur-md
          transition-all duration-300 md:hidden
          ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"}
        `}
      >
        {["skills", "projects", "about", "contribution", "contact"].map((id) => (
          <li
            key={id}
            onClick={() => handleClick(id)}
            className="w-full mb-2 px-3 py-2 rounded hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors cursor-pointer"
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </li>
        ))}

        <li className="mt-2">
          <a href="https://github.com/coder101-js" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} className="scale-150" />
          </a>
        </li>

        <li className="mt-2">
          <button onClick={toggleTheme}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="scale-150" />
          </button>
        </li>
      </ul>

      {/* Sticky nav padding */}
      <style jsx global>{`html { scroll-padding-top: 70px; }`}</style>

      <style jsx>{`
        li {
          margin: 0 15px;
          border-radius: 5px;
          padding: 6px;
          border: 2px solid transparent;
          transition: background-color 0.3s, color 0.3s, border-color 0.3s;
          cursor: pointer;
        }
        li:hover {
          background-color: rgba(0, 0, 0, 0.1);
          color: ${darkMode ? "#00dfd8" : "#000"};
          border-color: ${darkMode ? "#00dfd8" : "#000"};
        }
        @media (max-width: 768px) {
          li {
            margin: 8px 0;
            width: 100%;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
