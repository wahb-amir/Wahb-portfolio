"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { useClientTheme } from "@/app/hooks/useClientTheme";
import { LINKEDIN_URL } from "./navConfig";
import DayNightToggle from "./DayNightToggle";

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

      {/* ── Day / Night pill toggle ───────────────────────────────────── */}
      {mounted ? (
        <DayNightToggle isDark={isDark} onToggle={toggleTheme} />
      ) : (
        /* SSR placeholder – exact same pill dimensions so layout doesn't shift */
        <div
          className="shrink-0 rounded-full bg-black/5 dark:bg-white/5 border border-white/10"
          style={{ width: 88, height: 44 }}
          aria-hidden
        />
      )}
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
