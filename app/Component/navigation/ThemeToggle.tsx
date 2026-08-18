"use client";

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
      {/*
       * Social links rendered as plain <a> tags — fully SSR-safe.
       * Googlebot will crawl and index these outbound links.
       * motion.button was removed: it added framer-motion JS weight and
       * prevented SSR (framer-motion reads window during initialisation).
       */}
      <SocialLink label="GitHub" href={githubUrl} aria-label="GitHub profile">
        <FontAwesomeIcon icon={faGithub} className="text-lg" />
      </SocialLink>

      <SocialLink label="LinkedIn" href={LINKEDIN_URL} aria-label="LinkedIn profile">
        <FontAwesomeIcon icon={faLinkedin} className="text-lg" />
      </SocialLink>

      <SocialLink label="X / Twitter" href={xUrl} aria-label="X (Twitter) profile">
        <FontAwesomeIcon icon={faXTwitter} className="text-lg" />
      </SocialLink>

      {/* ── Day / Night pill toggle — client-only, needs mounted guard ── */}
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

function SocialLink({
  children,
  href,
  label,
}: {
  children: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 transition-[background-color,transform] duration-200 hover:bg-cyan-500/20 hover:scale-110 active:scale-90"
    >
      {children}
    </a>
  );
}
