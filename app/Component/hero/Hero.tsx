import dynamic from "next/dynamic";
import Avatar from "../avatar/Avatar";
import GitHubActivity from "../github/GitHubActivity";
import HeroCTAs from "./HeroCTAs";
import HeroScrollHint from "./HeroScrollHint";
import HeroProof from "./HeroProof";

const LazyBackgroundEffect = dynamic(() => import("../effects/BackgroundEffect"), {
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

        .h-fade-up  { animation: hero-fade-up  0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .h-scale-in { animation: hero-scale-in 0.55s cubic-bezier(0.22,1,0.36,1) both; }

        .h-d1  { animation-delay: 0.05s; }
        .h-d2  { animation-delay: 0.15s; }
        .h-d3  { animation-delay: 0.28s; }
        .h-d4  { animation-delay: 0.42s; }
        .h-d5  { animation-delay: 0.56s; }
        .h-d6  { animation-delay: 0.70s; }
        .h-d7  { animation-delay: 0.84s; }

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

        {/* Client-only decorative effects */}
        <LazyBackgroundEffect aria-hidden="true" />

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
            {/* Gradient border ring */}
            <div
              className="w-full h-full rounded-full p-[2.5px]"
              style={{
                background:
                  "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #6366f1 100%)",
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-900">
                <Avatar />
              </div>
            </div>
          </div>

          {/* ── Availability badge (server-rendered) ── */}
          <div className="h-fade-up h-d2 mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-300/60 dark:border-emerald-700/50 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
            <span className="avail-dot w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" aria-hidden="true" />
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
            <span
              className="font-serif text-5xl xs:text-6xl sm:text-7xl font-black leading-none text-blue-600 dark:text-blue-400 name-glow"
            >
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

          {/* ── Proof line (client — animated entrance) ── */}
          <HeroProof />

          {/* ── CTAs (client — needs onClick scroll) ── */}
          <HeroCTAs />
        </div>

        {/* GitHub activity strip */}
        <GitHubActivity />

        {/* Scroll hint (client — needs onClick) */}
        <HeroScrollHint />
      </main>
    </>
  );
}
