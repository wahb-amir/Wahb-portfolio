"use client";

// ─── Client Island: Mobile Menu ───────────────────────────────────────────────

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
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

import type { NavItem } from "./navConfig";

const ICON_MAP: Record<string, IconDefinition> = {
  skills:            faCode,
  "project-section": faBriefcase,
  about:             faUser,
  contact:           faEnvelope,
  faq:               faQuestion,
};

interface Props {
  navItems:  NavItem[];
  githubUrl: string;
  isOpen:    boolean;
  onToggle:  () => void;
}

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function MobileMenu({ navItems, githubUrl, isOpen, onToggle }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  // Drive bar color through framer-motion's animate so it interpolates
  // instead of snapping — className swaps are instant, motion values aren't.
  const barColor = isDark ? "#ffffff" : "#000000";

  // Per-bar animation targets
  const barAnims = [
    isOpen ? { rotate: 45,  y: 8,  opacity: 1 } : { rotate: 0, y: 0, opacity: 1 },
    isOpen ? { opacity: 0,  x: -10            } : { opacity: 1, x: 0            },
    isOpen ? { rotate: -45, y: -8, opacity: 1 } : { rotate: 0, y: 0, opacity: 1 },
  ];

  return (
    <>
      {/* ── Hamburger / X ────────────────────────────────────────────────── */}
      <button
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-drawer"
        className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50 relative"
        onClick={onToggle}
      >
        {barAnims.map((anim, i) => (
          <motion.span
            key={i}
            animate={{ ...anim, backgroundColor: barColor }}
            transition={{
              duration: 0.2,
              // Give the color its own longer ease so it doesn't snap
              backgroundColor: { duration: 0.4, ease: "easeInOut" },
            }}
            className="block w-6 h-0.5 rounded-full"
          />
        ))}
      </button>

      {/* ── Drawer ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, y: -40 }}
            animate={{
              opacity: 1,
              y: 0,
              // framer-motion interpolates backgroundColor, unlike Tailwind dark: which snaps
              backgroundColor: isDark
                ? "rgba(2, 6, 23, 0.97)"     // slate-950
                : "rgba(255, 255, 255, 0.97)",
            }}
            exit={{ opacity: 0, y: -40 }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
              backgroundColor: { duration: 0.4, ease: "easeInOut" },
            }}
            style={{ height: "100dvh" }}
            className="fixed inset-x-0 top-0 z-40 md:hidden backdrop-blur-2xl pt-28 pb-10 px-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-3 max-w-sm mx-auto">

              {/* Nav items */}
              {navItems.map((item, idx) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => { scrollTo(item.id); onToggle(); }}
                  className="flex items-center gap-4 p-5 rounded-2xl text-lg font-bold shadow-sm
                             transition-colors duration-300
                             bg-slate-100 dark:bg-white/5
                             text-slate-800 dark:text-slate-100
                             hover:bg-cyan-500 hover:text-white"
                >
                  <FontAwesomeIcon icon={ICON_MAP[item.id]} className="w-6" />
                  {item.name}
                </motion.button>
              ))}

              {/* Action row */}
              <div className="grid grid-cols-2 gap-3 mt-4">

                {/* Theme toggle — icon cross-fades on switch */}
                <button
                  onClick={toggleTheme}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  className="flex items-center justify-center gap-2 p-5 rounded-2xl font-bold shadow-sm
                             transition-colors duration-300
                             bg-slate-100 dark:bg-white/5
                             text-slate-800 dark:text-slate-100"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={isDark ? "sun" : "moon"}
                      initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0,   scale: 1   }}
                      exit={{    opacity: 0, rotate:  30, scale: 0.6 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="inline-flex"
                    >
                      <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
                    </motion.span>
                  </AnimatePresence>
                  <span>Theme</span>
                </button>

                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-5 rounded-2xl font-bold shadow-sm
                             transition-colors duration-300
                             bg-slate-100 dark:bg-white/5
                             text-slate-800 dark:text-slate-100"
                >
                  <FontAwesomeIcon icon={faGithub} />
                  <span>GitHub</span>
                </a>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}