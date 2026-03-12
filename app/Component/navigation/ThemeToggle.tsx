"use client";

// ─── Client Island: Theme Toggle + GitHub ────────────────────────────────────
// Reactive surface: only useTheme(). Isolated so theme re-renders never
// touch NavLinks or MobileMenu.

import { useTheme } from "next-themes";
import { motion }   from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { faGithub }      from "@fortawesome/free-brands-svg-icons";

interface Props {
  githubUrl: string;
}

export default function ThemeToggle({ githubUrl }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <>
      <IconButton
        label="GitHub"
        onClick={() => window.open(githubUrl, "_blank")}
      >
        <FontAwesomeIcon icon={faGithub} className="text-lg" />
      </IconButton>

      <IconButton
        label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggleTheme}
      >
        <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="text-lg" />
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
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 transition-colors"
    >
      {children}
    </motion.button>
  );
}
