"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";

import NavLinks from "./NavLinks";
import type { NavItem } from "./navConfig";

const ThemeToggle = dynamic(() => import("./ThemeToggle"), { ssr: false });
const MobileMenu = dynamic(() => import("./MobileMenu"), { ssr: false });

interface Props {
  navItems: NavItem[];
  githubUrl: string;
  navHeight: number;
  linkdinUrl: string;
  xUrl: string;
}

export default function NavbarShell({
  navItems,
  githubUrl,
  navHeight,
  linkdinUrl,
  xUrl,
}: Props) {
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
        className={`fixed left-0 w-full z-50 transition-[transform,opacity] duration-500 ease-in-out px-4 py-4 ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div
          className={`mx-auto max-w-6xl flex items-center justify-between transition-[background-color,box-shadow,border-color,transform] duration-300 rounded-2xl border backdrop-blur-xl ${
            compact
              ? "py-2 px-4 shadow-lg bg-white/82 dark:bg-slate-900/80 border-slate-200/70 dark:border-white/10 shadow-slate-200/60 dark:shadow-none"
              : "py-3 px-6 bg-white/20 dark:bg-white/5 border-slate-300/40 dark:border-white/10"
          }`}
        >
          {/* LEFT – Logo */}
          <div className="flex-1 flex justify-start">
            <a
              href={process.env.NEXT_PUBLIC_SITE_URL}
              aria-label="Home"
              className="relative w-10 h-10"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-10 h-10 cursor-pointer"
              >
                <Image
                  src="/logo.webp"
                  alt="Home"
                  fill
                  sizes="(max-width: 768px) 100vw, 200px"
                  priority
                  className="rounded-full object-cover border-2 border-cyan-400 shadow-md"
                />
              </motion.div>
            </a>
          </div>

          {/* CENTER – Desktop nav links */}
          <div className="hidden md:flex flex-[2] justify-center">
            <NavLinks items={navItems} />
          </div>

          {/* RIGHT – Theme toggle + GitHub (desktop) + Hamburger (mobile) */}
          <div className="flex-1 flex justify-end items-center gap-3">
            <div className="hidden md:flex gap-2">
              {/* Pass xUrl so ThemeToggle can render the X/Twitter icon */}
              <ThemeToggle githubUrl={githubUrl} xUrl={xUrl} />
            </div>

            {/* xUrl forwarded so MobileMenu can render the X/Twitter icon */}
            <MobileMenu
              navItems={navItems}
              githubUrl={githubUrl}
              linkdinUrl={linkdinUrl}
              xUrl={xUrl}
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
