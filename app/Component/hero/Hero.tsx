import dynamic from "next/dynamic";
import Avatar from "../avatar/Avatar";
import HeroCTAs from "./HeroCTAs";
import HeroScrollHint from "./HeroScrollHint";
import HeroProof from "./HeroProof";

const GitHubActivity = dynamic(() => import("../github/index"), {
  ssr: true,
  loading: () => null,
});

const STACK = [
  "Next.js",
  "Node.js",
  "TypeScript",
  "PostgreSQL",
  "GitHub APIs",
] as const;

export default function Hero() {
  return (
    <>
      {/* ── Keyframes (injected once, server-rendered) ───────────────── */}
      <style>{`
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes hero-scale-in {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes hero-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes hero-pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.35); }
          50%       { box-shadow: 0 0 0 10px rgba(59,130,246,0);  }
        }
        @keyframes hero-dot-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes trophy-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(234,179,8,0.3); }
          50%       { box-shadow: 0 0 12px 3px rgba(234,179,8,0.18); }
        }

        .h-fade-up  { animation: hero-fade-up  0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .h-scale-in { animation: hero-scale-in 0.55s cubic-bezier(0.22,1,0.36,1) both; }

        .h-d1  { animation-delay: 0.05s; }
        .h-d2  { animation-delay: 0.15s; }
        .h-d3  { animation-delay: 0.28s; }
        .h-d4  { animation-delay: 0.42s; }
        .h-d5  { animation-delay: 0.56s; }
        .h-d6  { animation-delay: 0.70s; }
        .h-d7  { animation-delay: 0.84s; }
        .h-d8  { animation-delay: 0.96s; }

        /* Name glow */
        .name-glow {
          text-shadow:
            0 0 28px rgba(59,130,246,0.5),
            0 0 72px rgba(59,130,246,0.18);
        }

        /* Avatar ring pulse */
        .avatar-ring {
          animation: hero-pulse-ring 2.8s ease-in-out infinite;
        }

        /* Chip hover shimmer */
        .stack-chip {
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }
        .stack-chip::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.18) 50%,
            transparent 100%
          );
          background-size: 200% auto;
          opacity: 0;
          transition: opacity 0.2s;
          animation: hero-shimmer 2s linear infinite;
        }
        .stack-chip:hover::after { opacity: 1; }
        .stack-chip:hover { transform: translateY(-1px); }

        /* Availability dot */
        .avail-dot { animation: hero-dot-pulse 2s ease-in-out infinite; }

        /* Trophy badge */
        .trophy-badge {
          animation: trophy-glow 3s ease-in-out infinite;
          transition: transform 0.2s;
        }
        .trophy-badge:hover { transform: translateY(-1px) scale(1.02); }
      `}</style>

      {/* ── Skip link ───────────────────────────────────────────────── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white dark:bg-slate-800 px-3 py-2 rounded text-sm font-medium"
      >
        Skip to content
      </a>

      {/* ── Root section ────────────────────────────────────────────── */}
      <main
        id="hero-section"
        className="
          relative flex flex-col items-center justify-start
          min-h-[65vh] sm:min-h-[72vh]
          px-4 xs:px-6 text-center
          pb-28 overflow-hidden
          pt-[env(safe-area-inset-top)]
          bg-white text-black dark:bg-[#0b1220] dark:text-white bg-gradient-to-b from-[#00b1ff88] to-[#00bfff44]
        "
        aria-label="Hero Section"
        role="banner"
      >
        {/* Ambient gradient — static, no JS */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(160deg, rgba(0,191,255,0.07) 0%, rgba(0,112,243,0.12) 60%, transparent 100%)",
          }}
        />

        {/* Decorative circle blur — pure CSS depth */}
        <div
          aria-hidden="true"
          className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* ── Content ─────────────────────────────────────────────── */}
        <div
          className="relative z-10 mt-10 max-w-lg mx-auto px-4 flex flex-col items-center"
          id="main-content"
          role="main"
          aria-labelledby="hero-heading"
        >
          {/* ── Avatar ── */}
          <div
            className="h-scale-in h-d1 avatar-ring rounded-full"
            style={{ width: 150, height: 150 }}
            role="img"
            aria-label="Portrait of Wahb"
          >
            <div
              className="w-full h-full rounded-full p-[2.5px]"
              style={{
                background:
                  "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #6366f1 100%)",
              }}
            >
              {/* Removed 'overflow-hidden' from this div */}
              <div className="relative w-full h-full rounded-full bg-white dark:bg-slate-900">
                <Avatar />
              </div>
            </div>
          </div>

          {/* ── Availability badge ── */}
          <div className="h-fade-up h-d2 mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-300/60 dark:border-emerald-700/50 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
            <span
              className="avail-dot w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"
              aria-hidden="true"
            />
            Available for new projects
          </div>

          {/* ── H1: Name ── */}
          <h1
            id="hero-heading"
            className="h-fade-up h-d3 mt-5 flex items-baseline justify-center gap-3"
          >
            <span className="text-2xl xs:text-3xl sm:text-4xl font-medium tracking-tight text-gray-500 dark:text-slate-400">
              Hey, I&apos;m
            </span>
            <span className="font-serif text-5xl xs:text-6xl sm:text-7xl font-black leading-none text-blue-600 dark:text-blue-400 name-glow">
              Wahb
            </span>
          </h1>

          {/* ── H2: Value prop ── */}
          <h2 className="h-fade-up h-d4 mt-3 text-base xs:text-lg sm:text-xl font-semibold text-slate-700 dark:text-slate-200 max-w-md mx-auto leading-snug">
            I ship production-ready SaaS &amp; developer tools.
          </h2>

          {/* ── Tech stack chips ── */}
          <div
            className="h-fade-up h-d5 mt-5 flex flex-wrap justify-center gap-2"
            aria-label="Core technologies"
          >
            {STACK.map((tech) => (
              <span
                key={tech}
                className="stack-chip px-3 py-1 text-xs font-semibold rounded-full border border-blue-200/70 dark:border-blue-700/50 text-blue-700 dark:text-cyan-300 bg-blue-50/80 dark:bg-blue-950/40 select-none"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* ── Hackathon trophy badge ── */}
          <a
            href="#project-section"
            className="h-fade-up h-d6 trophy-badge mt-5 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-yellow-300/70 dark:border-yellow-600/50 bg-yellow-50/80 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300 no-underline"
            aria-label="View EcoLens — 3rd Place Hack for Humanity 2026"
          >
            {/* Trophy icon */}
            <span className="text-base leading-none" aria-hidden="true">
              🏆
            </span>

            {/* Text */}
            <span className="flex flex-col items-start leading-tight">
              <span className="text-xs font-black tracking-wide uppercase">
                3rd Place · Hack for Humanity 2026
              </span>
              <span className="text-[10px] font-medium opacity-75">
                EcoLens · AI waste classifier · 775 participants
              </span>
            </span>

            {/* Arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3 h-3 opacity-60 shrink-0"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </a>

          {/* ── Proof line ── */}
          <HeroProof />

          {/* ── CTAs ── */}
          <HeroCTAs />
        </div>

        {/* GitHub activity strip */}
        <GitHubActivity />

        {/* Scroll hint */}
        <HeroScrollHint />
      </main>
    </>
  );
}
