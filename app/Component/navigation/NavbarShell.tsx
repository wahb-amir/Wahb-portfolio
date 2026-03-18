"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import type { NavItem } from "./navConfig";

interface Props {
  navItems: NavItem[];
  githubUrl: string;
  navHeight: number;
  linkdinUrl: string;
}

export default function NavbarShell({ navItems, githubUrl, navHeight, linkdinUrl }: Props) {
  const [visible, setVisible] = useState(true);
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // ── Scroll handler ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;

        if (currentY < 10) {
          setVisible(true);
          setCompact(false);
        } else {
          // Stay visible while menu is open
          setVisible(currentY < lastScrollY.current || menuOpen);
          setCompact(currentY > 50);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  // ── Body scroll-lock when drawer open ──────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        aria-label="Main navigation"
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
          {/* LEFT – Logo */}
          <div className="flex-1 flex justify-start">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <Image
                src="/logo.png"
                alt="Home"
                fill
                priority
                className="rounded-full object-cover border-2 border-cyan-400 shadow-md"
              />
            </motion.div>
          </div>

          {/* CENTER – Desktop nav links */}
          <div className="hidden md:flex flex-[2] justify-center">
            <NavLinks items={navItems} />
          </div>

          {/* RIGHT – Theme toggle + GitHub (desktop) + Hamburger (mobile) */}
          <div className="flex-1 flex justify-end items-center gap-3">
            <div className="hidden md:flex gap-2">
              <ThemeToggle githubUrl={githubUrl} />
            </div>

            {/* linkdinUrl forwarded so MobileMenu can render the LinkedIn icon */}
            <MobileMenu
              navItems={navItems}
              githubUrl={githubUrl}
              linkdinUrl={linkdinUrl}
              isOpen={menuOpen}
              onToggle={() => setMenuOpen((prev) => !prev)}
            />
          </div>
        </div>
      </nav>

      {/* Global scroll-padding so anchors clear the fixed nav */}
      <style>{`html { scroll-padding-top: ${navHeight + 24}px; }`}</style>
    </>
  );
}