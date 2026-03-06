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
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [compact, setCompact] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  
  const NAV_HEIGHT = 72; 

  const navItems = [
    { name: "Skills", id: "skills", icon: faCode },
    { name: "Projects", id: "project-section", icon: faBriefcase },
    { name: "About", id: "about", icon: faUser },
    { name: "Contact", id: "contact", icon: faEnvelope },
    { name: "FAQ", id: "faq", icon: faQuestion },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          if (currentY < 10) {
            setVisible(true);
            setCompact(false);
          } else {
            // Only hide if menu is closed
            setVisible(currentY < lastScrollY.current || menuOpen);
            setCompact(currentY > 50);
          }
          lastScrollY.current = currentY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");
  const isDark = resolvedTheme === "dark";

  const handleClick = (id: string) => {
    const elm = document.getElementById(id);
    if (elm) elm.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed left-0 w-full z-50 transition-all duration-500 ease-in-out px-4 py-4 ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div
          className={`mx-auto max-w-6xl flex items-center justify-between transition-all duration-300 rounded-2xl border backdrop-blur-xl ${
            compact 
            ? "py-2 px-4 shadow-lg bg-white/70 dark:bg-slate-900/80 border-slate-200/50 dark:border-white/10" 
            : "py-3 px-6 bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10"
          }`}
        >
          {/* LEFT: Logo */}
          <div className="flex-1 flex justify-start">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="rounded-full object-cover border-2 border-cyan-400 shadow-md"
              />
            </motion.div>
          </div>

          {/* CENTER: Desktop Nav */}
          <div className="hidden md:flex flex-[2] justify-center">
            <ul className="flex items-center gap-2 p-1 bg-white/5 dark:bg-black/10 rounded-xl border border-white/10 backdrop-blur-md">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleClick(item.id)}
                    className="relative px-4 py-2 text-sm font-bold transition-all group rounded-lg"
                  >
                    <span className="relative z-10 text-slate-800 dark:text-slate-100 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                      {item.name}
                    </span>
                    {/* Floating Hover Background */}
                    <span className="absolute inset-0 bg-cyan-500/10 dark:bg-cyan-400/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out border border-cyan-500/20" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex-1 flex justify-end items-center gap-3">
            <div className="hidden md:flex gap-2">
              <IconButton icon={faGithub} onClick={() => window.open("https://github.com/wahb-amir", "_blank")} />
              <IconButton icon={isDark ? faSun : faMoon} onClick={toggleTheme} />
            </div>

            {/* ANIMATED HAMBURGER */}
            <button
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50 relative"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <motion.span 
                animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className={`w-6 h-0.5 rounded-full ${isDark || menuOpen ? 'bg-white' : 'bg-black'}`}
              />
              <motion.span 
                animate={menuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                className={`w-6 h-0.5 rounded-full ${isDark || menuOpen ? 'bg-white' : 'bg-black'}`}
              />
              <motion.span 
                animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className={`w-6 h-0.5 rounded-full ${isDark || menuOpen ? 'bg-white' : 'bg-black'}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 z-40 md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl pt-28 pb-10 px-6"
          >
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              {navItems.map((item, idx) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleClick(item.id)}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-slate-100 dark:bg-white/5 text-lg font-bold hover:bg-cyan-500 hover:text-white transition-all shadow-sm"
                >
                  <FontAwesomeIcon icon={item.icon} className="w-6" />
                  {item.name}
                </motion.button>
              ))}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button onClick={toggleTheme} className="flex items-center justify-center gap-2 p-5 rounded-2xl bg-slate-100 dark:bg-white/5 font-bold shadow-sm">
                  <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
                  <span>Theme</span>
                </button>
                <a href="https://github.com/wahb-amir" className="flex items-center justify-center gap-2 p-5 rounded-2xl bg-slate-100 dark:bg-white/5 font-bold shadow-sm">
                  <FontAwesomeIcon icon={faGithub} />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS Scroll Padding Fix */}
      <style>{`html { scroll-padding-top: ${NAV_HEIGHT + 24}px; }`}</style>
    </>
  );
};

const IconButton = ({ icon, onClick }: { icon: any; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.1, backgroundColor: "rgba(6, 182, 212, 0.2)" }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 transition-colors"
  >
    <FontAwesomeIcon icon={icon} className="text-lg" />
  </motion.button>
);

export default Navbar;