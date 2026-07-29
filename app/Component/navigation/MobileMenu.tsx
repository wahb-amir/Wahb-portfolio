"use client";

// ─── Client Island: Mobile Menu ───────────────────────────────────────────────

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faCode,
  faBriefcase,
  faEnvelope,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

import type { NavItem } from "./navConfig";
import DayNightToggle from "./DayNightToggle";

const ICON_MAP: Record<string, IconDefinition> = {
  skills: faCode,
  "project-section": faBriefcase,
  about: faUser,
  contact: faEnvelope,
  faq: faQuestion,
};

interface Props {
  navItems: NavItem[];
  githubUrl: string;
  linkdinUrl: string;
  xUrl: string;
  isOpen: boolean;
  onToggle: () => void;
}

const scrollTo = (id: string) =>
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function MobileMenu({
  navItems,
  githubUrl,
  linkdinUrl,
  xUrl,
  isOpen,
  onToggle,
}: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <>
      {/* ── Hamburger / X ──────────────────────────────────────────────────
          Use CSS currentColor bars — no JS-driven backgroundColor animation  */}
      <button
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-drawer"
        className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50 relative
                   text-black dark:text-white"
        onClick={onToggle}
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <span
          className="block w-6 h-0.5 rounded-full bg-current origin-center"
          style={{
            transform: isOpen ? "rotate(45deg) translateY(5px)" : "none",
            transition: "transform 0.2s ease",
          }}
        />
        <span
          className="block w-6 h-0.5 rounded-full bg-current"
          style={{
            opacity: isOpen ? 0 : 1,
            transform: isOpen ? "translateX(-8px)" : "none",
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
        />
        <span
          className="block w-6 h-0.5 rounded-full bg-current origin-center"
          style={{
            transform: isOpen ? "rotate(-45deg) translateY(-5px)" : "none",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      {/* ── Drawer ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            /* ── GPU-composited: only opacity + transform animate via Framer
               Background colour handled by CSS class (instant via .dark class toggle) ── */
            className="fixed inset-x-0 top-0 z-40 md:hidden
                       backdrop-blur-md
                       bg-white/95 dark:bg-[#02061700]/97
                       pt-24 pb-10 px-6 overflow-y-auto
                       h-[100vh] supports-[height:100dvh]:h-[100dvh]"
            style={{ backgroundColor: isDark ? "rgba(2,6,23,0.97)" : "rgba(255,255,255,0.97)" }}
          >
            <div className="flex flex-col gap-3 max-w-sm mx-auto">

              {/* ── Theme toggle – full-width, prominently at the top ── */}
              <div className="flex items-center justify-between
                              p-4 rounded-2xl shadow-sm
                              bg-slate-100 dark:bg-white/5 mb-1">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Theme
                </span>
                <DayNightToggle isDark={isDark} onToggle={toggleTheme} />
              </div>

              {/* ── Divider ── */}
              <div className="h-px bg-slate-200 dark:bg-white/10 my-1" />

              {/* ── Nav items – plain buttons, CSS hover only ── */}
              {navItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollTo(item.id);
                    onToggle();
                  }}
                  className="flex items-center gap-4 p-5 rounded-2xl text-lg font-bold shadow-sm
                             bg-slate-100 dark:bg-white/5
                             text-slate-800 dark:text-slate-100
                             hover:bg-cyan-500 hover:text-white
                             active:scale-[0.98]"
                  style={{
                    /* Stagger via CSS animation-delay – no JS overhead */
                    animationName: "slideInLeft",
                    animationDuration: "0.3s",
                    animationTimingFunction: "ease-out",
                    animationFillMode: "both",
                    animationDelay: `${idx * 0.04}s`,
                    transition: "background-color 0.15s ease, color 0.15s ease, transform 0.1s ease",
                  }}
                >
                  <FontAwesomeIcon icon={ICON_MAP[item.id]} className="w-6" />
                  {item.name}
                </button>
              ))}

              {/* ── Social links grid ── */}
              <div className="grid grid-cols-3 gap-3 mt-2">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl font-bold shadow-sm
                             bg-slate-100 dark:bg-white/5
                             text-slate-800 dark:text-slate-100
                             hover:bg-slate-800 hover:text-white dark:hover:bg-white dark:hover:text-slate-900"
                  style={{ transition: "background-color 0.15s ease, color 0.15s ease" }}
                >
                  <FontAwesomeIcon icon={faGithub} className="text-xl" />
                  <span className="text-xs">GitHub</span>
                </a>

                <a
                  href={linkdinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl font-bold shadow-sm
                             bg-slate-100 dark:bg-white/5
                             text-slate-800 dark:text-slate-100
                             hover:bg-[#0077b5] hover:text-white"
                  style={{ transition: "background-color 0.15s ease, color 0.15s ease" }}
                >
                  <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
                  <span className="text-xs">LinkedIn</span>
                </a>

                <a
                  href={xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl font-bold shadow-sm
                             bg-slate-100 dark:bg-white/5
                             text-slate-800 dark:text-slate-100
                             hover:bg-black hover:text-white"
                  style={{ transition: "background-color 0.15s ease, color 0.15s ease" }}
                >
                  <FontAwesomeIcon icon={faXTwitter} className="text-xl" />
                  <span className="text-xs">X</span>
                </a>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
