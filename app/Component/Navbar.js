"use client";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [smallWidth, setSmallWidth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [compact, setCompact] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const NAV_HEIGHT = 64;

  useEffect(() => {
    const handleResize = () => setSmallWidth(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const DELTA = 8;
    const MIN_Y_TO_HIDE = 100;
    const MIN_TO_COMPACT = 140;

    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const prevY = lastScrollY.current;

        if (menuOpen) {
          setVisible(true);
          setCompact(currentY > MIN_TO_COMPACT);
          lastScrollY.current = currentY;
          ticking.current = false;
          return;
        }

        if (currentY <= 0) {
          setVisible(true);
          setCompact(false);
        } else if (currentY - prevY > DELTA && currentY > MIN_Y_TO_HIDE) {
          setVisible(false);
          setCompact(false);
        } else if (prevY - currentY > DELTA) {
          setVisible(true);
          setCompact(currentY > MIN_TO_COMPACT);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

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

  const handleKeyActivate = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(id);
    }
  };

  const navIds = ["skills", "projects", "about", "contact"];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transform transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div
          className={`flex items-center justify-between rounded-xl px-4 ${compact ? "py-1" : "py-2"
            } backdrop-blur-md bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88] text-black dark:text-white transition-all duration-200`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src="/logo.png"
                alt="wahb logo"
                width={48}
                height={48}
                className="block w-full h-full rounded-full cursor-pointer"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {!smallWidth && (
            <ul className="hidden md:flex items-center gap-3">
              {navIds.map((id) => (
                <li
                  key={id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleClick(id)}
                  onKeyDown={(e) => handleKeyActivate(e, id)}
                  className={`px-3 rounded hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors cursor-pointer ${compact ? "py-1 text-sm" : "py-2"
                    }`}
                  aria-label={`Go to ${id}`}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </li>
              ))}

              <li>
                <a href="https://github.com/coder101-js" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
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

          {smallWidth && (
            <button className="md:hidden p-2 rounded" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 20 20" className={darkMode ? "text-white" : "text-black"}>
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </nav>

      <div style={{ height: NAV_HEIGHT }} aria-hidden="true" />

      {/* mobile menu */}
      <ul
        className={`fixed left-0 w-full flex flex-col items-start px-4 py-4 z-40 rounded-b-xl shadow-lg ${darkMode ? "bg-[#0f172a]/95" : "bg-white/95"
          } backdrop-blur-md transition-all duration-300 md:hidden`}
        style={{
          top: NAV_HEIGHT,
          maxHeight: menuOpen ? "100vh" : 0,
          opacity: menuOpen ? 1 : 0,
          overflow: "hidden",
        }}
      >
        {navIds.map((id) => (
          <li
            key={id}
            role="button"
            tabIndex={0}
            onClick={() => handleClick(id)}
            onKeyDown={(e) => handleKeyActivate(e, id)}
            className="w-full mb-2"
          >
            <div className="w-full text-left px-3 py-3 rounded hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors cursor-pointer">
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </div>
          </li>
        ))}

        <li className="mt-2 w-full">
          <a
            href="https://github.com/coder101-js"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-3 w-full rounded hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors"
          >
            <FontAwesomeIcon icon={faGithub} className="scale-150" />
            GitHub
          </a>
        </li>

        <li className="mt-2 w-full">
          <button
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-3 w-full rounded hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="scale-150" />
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </li>
      </ul>

      <style jsx global>{`html { scroll-padding-top: 70px; }`}</style>

      <style jsx>{`
        li {
          margin: 0 15px;
          border-radius: 5px;
          padding: 6px;
          border: 2px solid transparent;
          transition: background-color 0.3s, color 0.3s, border-color 0.3s;
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
    </>
  );
};

export default Navbar;
