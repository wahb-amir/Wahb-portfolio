"use client";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faUser,
  faCode,
  faBriefcase,
  faEnvelope,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
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

  const navItems = [
    { name: "Skills", id: "skills", icon: faCode },
    { name: "Projects", id: "project-section", icon: faBriefcase },
    { name: "About", id: "about", icon: faUser },
    { name: "Contact", id: "contact", icon: faEnvelope },
    { name: "FAQ", id: "faq", icon: faQuestion },
  ];

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

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  const darkMode = resolvedTheme === "dark";

  const handleClick = (id: string) => {
    const elm = document.getElementById(id);
    if (elm) elm.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const handleKeyActivate = (
    e: React.KeyboardEvent<HTMLLIElement>,
    id: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(id);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transform transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div
          className={`flex items-center rounded-xl px-4 ${
            compact ? "py-1" : "py-2"
          } backdrop-blur-md bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88] text-black dark:text-white transition-all duration-200`}
          style={{ height: NAV_HEIGHT }}
        >
          {/* LEFT: logo */}
          <div className="flex items-center flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/logo.png"
                alt="wahb logo"
                width={40}
                height={40}
                className="block w-full h-full rounded-full cursor-pointer"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          {/* CENTER: nav items (centered) */}
          <div className="flex-1 flex justify-center">
            {/* hidden on small screens */}
            <ul className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <li
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleClick(item.id)}
                  onKeyDown={(e) =>
                    handleKeyActivate(e as React.KeyboardEvent<HTMLLIElement>, item.id)
                  }
                  className={`px-3 py-2 rounded-md hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors cursor-pointer ${
                    compact ? "text-sm" : "text-base"
                  }`}
                  aria-label={`Go to ${item.name}`}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: actions (github, theme, mobile toggle) */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* desktop actions */}
            {!smallWidth && (
              <>
                <a
                  href="https://github.com/wahb-amir"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <FontAwesomeIcon icon={faGithub} className="text-xl" />
                </a>

                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <FontAwesomeIcon
                    icon={darkMode ? faSun : faMoon}
                    className="text-xl"
                  />
                </button>
              </>
            )}

            {/* mobile menu toggle */}
            {smallWidth && (
              <button
                className="md:hidden p-2 rounded-md"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  className={darkMode ? "text-white" : "text-black"}
                >
                  <path
                    d="M3 7h18M3 12h18M3 17h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* spacer to avoid content behind fixed nav */}
      <div style={{ height: NAV_HEIGHT }} aria-hidden="true" />

      {/* MOBILE MENU */}
      <ul
        className={`fixed left-0 w-full flex flex-col items-start px-4 py-4 z-40 rounded-b-xl shadow-lg ${
          darkMode ? "bg-[#0f172a]/95" : "bg-white/95"
        } backdrop-blur-md transition-all duration-300 md:hidden`}
        style={{
          top: NAV_HEIGHT,
          maxHeight: menuOpen ? "100vh" : 0,
          opacity: menuOpen ? 1 : 0,
          overflow: "hidden",
        }}
      >
        {navItems.map((item) => (
          <li
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => handleClick(item.id)}
            onKeyDown={(e) =>
              handleKeyActivate(e as React.KeyboardEvent<HTMLLIElement>, item.id)
            }
            className={`flex items-center gap-4 px-3 w-full rounded hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors cursor-pointer ${
              compact ? "py-2 text-sm" : "py-3"
            }`}
            aria-label={`Go to ${item.name}`}
          >
            <div className="w-6 flex justify-center">
              <FontAwesomeIcon icon={item.icon} className="scale-125" />
            </div>
            <span className="font-medium">{item.name}</span>
          </li>
        ))}

        <li className="mt-2 w-full">
          <a
            href="https://github.com/wahb-amir"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-3 py-3 w-full rounded hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors"
          >
            <div className="w-6 flex justify-center">
              <FontAwesomeIcon icon={faGithub} className="text-lg" />
            </div>
            <span className="font-medium">GitHub</span>
          </a>
        </li>

        <li className="mt-2 w-full">
          <button
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
            }}
            className="flex items-center gap-4 px-3 py-3 w-full rounded hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors"
          >
            <div className="w-6 flex justify-center">
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-lg" />
            </div>
            <span className="font-medium">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </li>
      </ul>

      <style>{`html { scroll-padding-top: ${NAV_HEIGHT}px; }`}</style>
    </>
  );
};

export default Navbar;
