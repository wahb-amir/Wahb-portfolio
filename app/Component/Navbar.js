"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
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

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  const darkMode = resolvedTheme === "dark";

  const handleClick = (id) => {
    const elm = document.getElementById(id);
    if (elm) {
      elm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="relative z-50">
      <div
        className="flex justify-between items-center rounded-xl px-4 py-2"
        style={{
          backgroundImage: darkMode
            ? "radial-gradient(circle at top left, #00b1ff33, transparent 70%), radial-gradient(circle at bottom right, #00dfd033, transparent 70%)"
            : "radial-gradient(circle at top left, #7f5af022, transparent 70%), radial-gradient(circle at bottom right, #00dfd822, transparent 70%)",
          backgroundColor: darkMode ? "#0f172a" : "#f9fafb",
          color: darkMode ? "#ffffff" : "#000000",
        }}
      >
        <Image
          src="/logo.png"
          alt="wahb logo"
          width={50}
          height={50}
          className="rounded-full cursor-pointer"
        />

        {/* Desktop menu */}
        {!smallWidth && (
          <ul className="hidden md:flex flex-row items-center">
            {["skills", "projects", "about", "contact"].map((id) => (
              <li key={id} onClick={() => handleClick(id)}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </li>
            ))}

            <li>
              <a
                href="https://github.com/coder101-js"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <FontAwesomeIcon icon={faGithub} className="scale-150" />
              </a>
            </li>

            <li onClick={toggleTheme}>
              <button>
                <FontAwesomeIcon
                  icon={darkMode ? faSun : faMoon}
                  className="scale-150"
                />
              </button>
            </li>
          </ul>
        )}

        {/* Hamburger Button */}
        {smallWidth && (
          <button
            className="md:hidden flex items-center justify-center p-2 rounded"
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

      {/* Mobile menu - fixed to viewport */}
      {smallWidth && menuOpen && (
        <ul
          className="fixed top-[64px] left-0 w-full flex flex-col items-start px-4 py-4 z-40 rounded-b-xl transition-all duration-300 shadow-lg md:hidden" 
        >
          {["skills", "projects", "about", "contribution", "contact"].map(
            (id) => (
              <li
                key={id}
                onClick={() => {
                  handleClick(id);
                  setMenuOpen(false);
                }}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </li>
            )
          )}

          <li>
            <a
              href="https://github.com/coder101-js"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} className="scale-150" />
            </a>
          </li>

          <li
            onClick={() => {
              toggleTheme();
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

      {/* Optional: sticky nav padding */}
      <style jsx global>{`
        html {
          scroll-padding-top: 70px;
        }
      `}</style>

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
