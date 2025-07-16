"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false); // 🛡️ Fix hydration issues
  const [smallWidth, setSmallWidth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true); // 👀 Prevent SSR mismatch

    const handleResize = () => {
      setSmallWidth(window.innerWidth < 768);
    };

    handleResize(); // Set initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const darkMode = resolvedTheme === "dark";

  const handleClick = (id) => {
    try {
      const elm = document.getElementById(id);
      if (!elm) {
        console.error(`Element with id ${id} not found`);
        return;
      }
      elm.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <nav>
      <div
        className={`flex justify-between items-center rounded-xl px-4 py-2 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <Image
          src="/logo.png"
          alt="wahb logo"
          width={50}
          height={50}
          className="rounded-full cursor-pointer"
        />

        {isMounted && !smallWidth && (
          <ul className="hidden md:flex flex-row items-center">
            <li onClick={() => handleClick("skills")}>Skill</li>
            <li onClick={() => handleClick("projects")}>Projects</li>
            <li onClick={() => handleClick("about")}>About</li>
            <li onClick={() => handleClick("contribution")}>Contribution</li>
            <li onClick={() => handleClick("contact")}>Contact</li>
            <li onClick={() => setTheme(darkMode ? "light" : "dark")}>
              <button>
                <FontAwesomeIcon
                  icon={darkMode ? faSun : faMoon}
                  className="scale-150"
                />
              </button>
            </li>
          </ul>
        )}

        {isMounted && smallWidth && (
          <button
            className="md:hidden block focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {/* hamburger menu icon */}
            <svg
              className={`w-8 h-8 ${darkMode ? "text-white" : "text-black"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </svg>
          </button>
        )}
      </div>

      {isMounted && smallWidth && menuOpen && (
        <ul
          className={`md:hidden flex flex-col items-start rounded-xl mt-2 px-4 py-2 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <li onClick={() => setMenuOpen(false)}>Skill</li>
          <li onClick={() => setMenuOpen(false)}>Projects</li>
          <li onClick={() => setMenuOpen(false)}>About</li>
          <li onClick={() => setMenuOpen(false)}>Contribution</li>
          <li onClick={() => setMenuOpen(false)}>Contact</li>
          <li
            onClick={() => {
              setTheme(darkMode ? "light" : "dark");
              setMenuOpen(false);
            }}
          >
            <button>
              <FontAwesomeIcon
                icon={darkMode ? faSun : faMoon}
                className="scale-150"
              />
            </button>
          </li>
        </ul>
      )}

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
          ul {
            width: 100%;
          }
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
