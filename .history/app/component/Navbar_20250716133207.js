"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [smallWidth, setSmallWidth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      setSmallWidth(window.innerWidth < 768);
    };

    handleResize(); // Run immediately
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    try {
      const theme = localStorage.getItem("theme") || false;
      if (!theme) {
        return setTheme("dark");
      } else {
        return setTheme(JSON.parse(theme));
      }
    } catch (err) {
      console.error("❌ Error:", err.message);
    }
  }, []);
  useEffect(() => {

  if (!mounted) return null;

  const darkMode = resolvedTheme === "dark";

  const handleClick = (id) => {
    const elm = document.getElementById(id);
    if (elm) {
      elm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="relative">
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

        {!smallWidth && (
          <ul className="hidden md:flex flex-row items-center">
            {["skills", "projects", "about", "contribution", "contact"].map(
              (id) => (
                <li key={id} onClick={() => handleClick(id)}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </li>
              )
            )}
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

        {smallWidth && (
          <button
            className="md:hidden block focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              width="32"
              height="32"
              fill="currentColor"
              viewBox="0 0 20 20"
              className={`${darkMode ? "text-white" : "text-black"}`}
            >
              <path
                d="M3 6h14M3 10h14M3 14h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {smallWidth && menuOpen && (
        <ul
          className={`md:hidden flex flex-col items-start rounded-xl px-4 py-2 absolute top-full left-0 w-full z-50 transition-all duration-300 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          {["skills", "projects", "about", "contribution", "contact"].map(
            (id) => (
              <li key={id} onClick={() => setMenuOpen(false)}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </li>
            )
          )}
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
