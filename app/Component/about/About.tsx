"use client";

/**
 * About.tsx — CLIENT COMPONENT
 * Theme is 100% CSS-driven via .dark selector on <html> (next-themes).
 * Zero isDark branching in JSX = zero hydration mismatch, zero flash.
 *
 * Pattern used throughout:
 *   - Static CSS classes / CSS variables handle light vs dark
 *   - useClientTheme() only used for the ONE place that genuinely needs
 *     a JS value post-mount: the animated dot glow on timeline items
 *     (box-shadow can't be expressed in plain Tailwind without a plugin)
 *   - Everything else: .dark .class { } in the <style> block
 */

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import { Syne, DM_Mono } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"] });

const LazyBackgroundEffect = dynamic(
  () => import("../effects/BackgroundEffect"),
  {
    ssr: false,
    loading: () => null,
  },
);

/* ─── types ──────────────────────────────────────────────────────────── */
export interface TimelineItemType {
  title: string;
  desc: string;
}
export interface AboutContent {
  bio: string;
  quickFacts: string[];
  timeline: TimelineItemType[];
  quote?: string;
  startDate?: string;
}

/* ─── animation variants ─────────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const slideLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};
const pillIn: Variants = {
  hidden: { opacity: 0, scale: 0.82 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── sub-components ─────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${mono.className} about-section-label flex items-center gap-3 mb-6`}
    >
      <span className="about-label-line w-8 h-px inline-block" />
      <span className="text-[11px] tracking-[0.2em] uppercase font-semibold about-label-text">
        {children}
      </span>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────────── */
export default function About({ data }: { data: AboutContent }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const heroRef = useRef(null);
  const factsRef = useRef(null);
  const timelineRef = useRef(null);
  const quoteRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-80px" });
  const factsInView = useInView(factsRef, { once: true, margin: "-60px" });
  const timelineInView = useInView(timelineRef, {
    once: true,
    margin: "-60px",
  });
  const quoteInView = useInView(quoteRef, { once: true, margin: "-60px" });

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="about-section relative w-full min-h-screen overflow-hidden   text-black  dark:text-white bg-gradient-to-b from-[#00b1ff88] to-[#00bfff44]"
    >
      <style>{`
        /* ── Section background — CSS only, no JS ── */
        
        .dark .about-scrim,
        :is(.dark) .about-scrim {
          background: rgba(5,12,24,0.45);
        }

        /* ── Glassmorphism cards ── */
        .about-glass {
          background: rgba(255,255,255,0.75);
          border-color: rgba(0,0,0,0.08);
          box-shadow: 0 4px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.6);
        }
        .dark .about-glass,
        :is(.dark) .about-glass {
          background: rgba(5,15,30,0.75);
          border-color: rgba(255,255,255,0.08);
          box-shadow: 0 4px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        /* ── Bio text ── */
        .about-bio-text {
          color: #1e293b;
        }
        .dark .about-bio-text,
        :is(.dark) .about-bio-text {
          color: #cbd5e1;
        }

        /* ── Quick-facts card ── */
        .about-facts-card {
          background: rgba(255,255,255,0.65);
          border-color: rgba(0,0,0,0.07);
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .dark .about-facts-card,
        :is(.dark) .about-facts-card {
          background: rgba(5,15,30,0.65);
          border-color: rgba(255,255,255,0.08);
          box-shadow: 0 4px 24px rgba(0,0,0,0.24);
        }

        /* ── Fact pill base ── */
        .fact-pill {
          transition: background 0.18s, color 0.18s, transform 0.18s, box-shadow 0.18s;
          background: rgba(15,23,42,0.06);
          border-color: rgba(15,23,42,0.12);
          color: #1e293b;
        }
        .dark .fact-pill,
        :is(.dark) .fact-pill {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.12);
          color: #e2e8f0;
        }
        .fact-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,229,195,0.2);
        }

        /* ── Fact pill accent (every 3rd) ── */
        .fact-pill-accent {
          background: rgba(0,229,195,0.15);
          border-color: rgba(0,229,195,0.4);
          color: #0e7490;
        }
        .dark .fact-pill-accent,
        :is(.dark) .fact-pill-accent {
          background: rgba(0,229,195,0.14);
          color: #2dd4bf;
        }

        /* ── Timeline card ── */
        .about-tl-card {
          background: rgba(255,255,255,0.65);
          border-color: rgba(0,0,0,0.07);
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .dark .about-tl-card,
        :is(.dark) .about-tl-card {
          background: rgba(5,15,30,0.65);
          border-color: rgba(255,255,255,0.08);
          box-shadow: 0 4px 24px rgba(0,0,0,0.24);
        }

        /* ── Timeline item divider ── */
        .about-tl-divider {
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .dark .about-tl-divider,
        :is(.dark) .about-tl-divider {
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        /* ── Timeline dot (regular) ── */
        .tl-dot {
          border-color: rgba(0,229,195,0.45);
          background: rgba(255,255,255,0.9);
        }
        .dark .tl-dot,
        :is(.dark) .tl-dot {
          background: rgba(5,15,30,0.9);
        }

        /* ── Timeline label (regular) ── */
        .tl-label-default {
          color: #94a3b8;
        }
        .dark .tl-label-default,
        :is(.dark) .tl-label-default {
          color: #64748b;
        }

        /* ── Timeline description text ── */
        .tl-desc {
          color: #475569;
        }
        .dark .tl-desc,
        :is(.dark) .tl-desc {
          color: #94a3b8;
        }

        /* ── Quote card ── */
        .about-quote-card {
          background: rgba(255,255,255,0.80);
          border-color: rgba(0,229,195,0.25);
          box-shadow: 0 0 60px -20px rgba(0,229,195,0.15), 0 4px 24px rgba(0,0,0,0.10);
        }
        .dark .about-quote-card,
        :is(.dark) .about-quote-card {
          background: linear-gradient(135deg, rgba(2,18,32,0.82), rgba(0,30,40,0.78));
          box-shadow: 0 0 60px -20px rgba(0,229,195,0.15), 0 4px 24px rgba(0,0,0,0.28);
        }

        /* ── Quote text ── */
        .about-quote-text {
          color: #0f172a;
        }
        .dark .about-quote-text,
        :is(.dark) .about-quote-text {
          color: #f1f5f9;
        }

        /* ── Section label ── */
        .about-label-line { background: #00e5c3; }
        .about-label-text { color: #00bfa0; }

        /* ── Timeline dot animation ── */
        @keyframes timeline-dot-pop {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); }
        }
        .tl-dot-animate {
          animation: timeline-dot-pop 0.4s cubic-bezier(.22,1,.36,1) both;
        }
      `}</style>

      {hydrated && <LazyBackgroundEffect />}

      {/* Scrim */}
      <div
        aria-hidden
        className="about-scrim absolute inset-0 pointer-events-none"
      />

      {/* Ambient blobs — decorative only, colour is fixed */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-400/[0.06] blur-[100px]" />
        <div className="absolute bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-sky-500/[0.07] blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 py-24">
        {/* ── SECTION HEADER ── */}
        <motion.div
          ref={heroRef}
          variants={stagger}
          initial="hidden"
          animate={heroInView ? "show" : "hidden"}
          className="mb-16"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>About me</SectionLabel>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Left: headline + availability */}
            <motion.div
              variants={fadeUp}
              className="flex-shrink-0 w-full lg:w-1/2 flex flex-col items-center"
            >
              <h2
                id="about-heading"
                className="w-full max-w-4xl mx-auto text-center font-extrabold tracking-tight leading-tight"
              >
                <span className="block text-[clamp(1.5rem,4vw,3.5rem)]">
                  Turning Ideas into
                </span>
                <span className="relative inline-block mx-auto text-[clamp(1.2rem,3vw,2.4rem)] mt-1">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
                    Shipped Products
                  </span>
                  <span
                    className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-60"
                    aria-hidden
                  />
                </span>
              </h2>

              <motion.div
                variants={fadeUp}
                className={`${mono.className} mt-5 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border`}
                style={{
                  background: "rgba(2,18,28,0.7)",
                  borderColor: "rgba(0,229,195,0.35)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#34d399" }}
                >
                  Available for work
                </span>
              </motion.div>
            </motion.div>

            {/* Right: bio */}
            <motion.div variants={fadeUp} className="flex-1 min-w-0">
              <div className="about-glass relative rounded-2xl p-6 sm:p-8 border backdrop-blur-xl">
                <span
                  aria-hidden
                  className={`${syne.className} absolute -top-4 left-4 text-7xl leading-none select-none pointer-events-none`}
                  style={{ color: "rgba(0,229,195,0.18)" }}
                >
                  "
                </span>
                <p className="about-bio-text relative text-base sm:text-[0.95rem] leading-[1.85] pt-2">
                  {data.bio}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── QUICK FACTS ── */}
        <motion.div
          ref={factsRef}
          variants={stagger}
          initial="hidden"
          animate={factsInView ? "show" : "hidden"}
          className="mb-14"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>Quick facts</SectionLabel>
          </motion.div>

          <div className="about-facts-card rounded-2xl p-6 border backdrop-blur-xl">
            <motion.div variants={stagger} className="flex flex-wrap gap-2.5">
              {data.quickFacts.map((fact, i) => (
                <motion.span
                  key={i}
                  variants={pillIn}
                  className={`fact-pill ${i % 3 === 0 ? "fact-pill-accent" : ""} inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-default border`}
                >
                  <span style={{ color: "#00e5c3", fontSize: "0.6rem" }}>
                    ◆
                  </span>
                  {fact}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* ── TIMELINE ── */}
        <motion.div
          ref={timelineRef}
          variants={stagger}
          initial="hidden"
          animate={timelineInView ? "show" : "hidden"}
          className="mb-14"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>Learning timeline</SectionLabel>
          </motion.div>

          <div className="about-tl-card rounded-2xl p-6 sm:p-8 border backdrop-blur-xl">
            <div className="relative">
              {/* Vertical rail */}
              <div
                className="absolute left-[7px] top-2 bottom-2 w-px"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(0,229,195,0.6) 15%, rgba(0,229,195,0.3) 85%, transparent)",
                }}
                aria-hidden
              />

              <motion.div variants={stagger} className="space-y-0">
                {data.timeline.map((t, idx) => {
                  const isNow = t.title === "Now";
                  const isNext = t.title === "Next";
                  return (
                    <motion.div
                      key={idx}
                      variants={slideLeft}
                      className="relative flex gap-6 pb-7"
                    >
                      {/* Dot */}
                      <div className="relative flex-shrink-0 mt-1">
                        <div
                          className={`tl-dot-animate w-[15px] h-[15px] rounded-full border-2 ${
                            isNow || isNext ? "" : "tl-dot"
                          }`}
                          style={{
                            // Special dots (Now/Next) have fixed colours — no theme dependency
                            ...(isNext
                              ? {
                                  borderColor: "#f59e0b",
                                  background: "rgba(245,158,11,0.25)",
                                  boxShadow: "0 0 10px rgba(245,158,11,0.6)",
                                }
                              : isNow
                                ? {
                                    borderColor: "#00e5c3",
                                    background: "rgba(0,229,195,0.25)",
                                    boxShadow: "0 0 10px rgba(0,229,195,0.6)",
                                  }
                                : {}),
                            animationDelay: `${idx * 80}ms`,
                          }}
                        />
                        {isNow && (
                          <div
                            className="absolute inset-0 rounded-full animate-ping"
                            style={{ background: "rgba(0,229,195,0.25)" }}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="about-tl-divider pb-4 flex-1">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span
                            className={`${mono.className} text-xs font-semibold tracking-wider uppercase ${
                              isNext ? "" : isNow ? "" : "tl-label-default"
                            }`}
                            style={
                              isNext
                                ? { color: "#f59e0b" }
                                : isNow
                                  ? { color: "#00e5c3" }
                                  : {}
                            }
                          >
                            {t.title}
                          </span>
                          {(isNow || isNext) && (
                            <span
                              className={`${mono.className} text-[10px] px-2 py-0.5 rounded-full`}
                              style={{
                                background: isNext
                                  ? "rgba(245,158,11,0.12)"
                                  : "rgba(0,229,195,0.1)",
                                color: isNext ? "#f59e0b" : "#00e5c3",
                                border: `1px solid ${
                                  isNext
                                    ? "rgba(245,158,11,0.28)"
                                    : "rgba(0,229,195,0.28)"
                                }`,
                              }}
                            >
                              {isNext ? "upcoming" : "active"}
                            </span>
                          )}
                        </div>
                        <p className="tl-desc text-sm leading-relaxed">
                          {t.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── PULL QUOTE ── */}
        {data.quote && (
          <motion.div
            ref={quoteRef}
            variants={fadeUp}
            initial="hidden"
            animate={quoteInView ? "show" : "hidden"}
            className="mb-14"
          >
            <div className="about-quote-card relative rounded-3xl px-8 sm:px-12 py-10 overflow-hidden border backdrop-blur-xl">
              <span
                aria-hidden
                className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full"
                style={{
                  background: "linear-gradient(to bottom, #00e5c3, #06b6d4)",
                }}
              />
              <span
                aria-hidden
                className={`${syne.className} absolute -top-4 left-8 text-[9rem] leading-none select-none pointer-events-none`}
                style={{ color: "rgba(0,229,195,0.1)" }}
              >
                "
              </span>
              <blockquote
                className={`${syne.className} about-quote-text relative z-10 text-xl sm:text-2xl font-bold text-center leading-snug`}
              >
                {data.quote}
              </blockquote>
              <p
                className={`${mono.className} text-center text-xs mt-4`}
                style={{ color: "#64748b" }}
              >
                — Wahb Amir
              </p>
            </div>
          </motion.div>
        )}

        {/* ── SCROLL ARROWS ── */}
        <div className="flex justify-center items-center gap-5">
          <button
            onClick={() =>
              document
                .getElementById("project-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label="Scroll up"
            className="p-3 rounded-full border border-cyan-500/20 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-200 hover:scale-110"
          >
            <ChevronUpIcon className="w-5 h-5 text-cyan-400" />
          </button>
          <button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label="Scroll down"
            className="p-3 rounded-full border border-cyan-500/20 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-200 hover:scale-110 animate-bounce"
          >
            <ChevronDownIcon className="w-5 h-5 text-cyan-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
