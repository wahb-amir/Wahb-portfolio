"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { useClientTheme } from "@/app/hooks/useClientTheme";
import { LINKEDIN_URL } from "./navConfig";

interface Props {
  githubUrl: string;
  xUrl: string;
}

export default function ThemeToggle({ githubUrl, xUrl }: Props) {
  const { isDark, mounted, toggleTheme } = useClientTheme();

  return (
    <>
      <IconButton
        label="GitHub"
        onClick={() => window.open(githubUrl, "_blank")}
      >
        <FontAwesomeIcon icon={faGithub} className="text-lg" />
      </IconButton>

      <IconButton
        label="LinkedIn"
        onClick={() => window.open(LINKEDIN_URL, "_blank")}
      >
        <FontAwesomeIcon icon={faLinkedin} className="text-lg" />
      </IconButton>

      <IconButton
        label="X / Twitter"
        onClick={() => window.open(xUrl, "_blank")}
      >
        <FontAwesomeIcon icon={faXTwitter} className="text-lg" />
      </IconButton>

      <IconButton
        label={
          mounted
            ? isDark
              ? "Switch to light mode"
              : "Switch to dark mode"
            : "Toggle theme"
        }
        onClick={toggleTheme}
      >
        <span
          className="relative flex items-center justify-center w-[1em] h-[1em]"
          suppressHydrationWarning
        >
          {!mounted && (
            <FontAwesomeIcon
              icon={faMoon}
              className="text-lg opacity-0"
              aria-hidden
            />
          )}

          <AnimatePresence mode="wait" initial={false}>
            {mounted && (
              <motion.span
                key={isDark ? "sun" : "moon"}
                initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <FontAwesomeIcon
                  icon={isDark ? faSun : faMoon}
                  className="text-lg"
                />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </IconButton>
    </>
  );
}

function IconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <motion.button
      aria-label={label}
      whileHover={{ scale: 1.1, backgroundColor: "rgba(6, 182, 212, 0.2)" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 transition-colors duration-300"
    >
      {children}
    </motion.button>
  );
}