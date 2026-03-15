"use client";

function scrollTo(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export default function HeroCTAs() {
  return (
    <div className="mt-8 flex items-center gap-3 justify-center flex-wrap">
      {/* Primary CTA */}
      <a
        href="/#project-section"
        onClick={(e) => {
          e.preventDefault();
          scrollTo("project-section");
        }}
        className="
          inline-flex items-center gap-2
          px-6 py-3 rounded-xl
          bg-blue-600 hover:bg-blue-500
          text-white font-semibold text-sm
          shadow-[0_4px_20px_rgba(59,130,246,0.35)]
          hover:shadow-[0_6px_28px_rgba(59,130,246,0.5)]
          transition-all duration-200
          focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300
          active:scale-[0.97]
        "
        aria-label="See my work"
      >
        See my work
        {/* Arrow icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>

      {/* Secondary CTA */}
      <a
        href="/#contact"
        onClick={(e) => {
          e.preventDefault();
          scrollTo("contact");
        }}
        className="
          inline-flex items-center justify-center
          px-5 py-3 rounded-xl
          border border-slate-300/70 dark:border-slate-600/60
          text-slate-700 dark:text-slate-300
          font-semibold text-sm
          bg-white/70 dark:bg-slate-800/50
          hover:border-blue-400 hover:text-blue-600
          dark:hover:border-cyan-500 dark:hover:text-cyan-300
          shadow-sm hover:shadow-md
          transition-all duration-200
          focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300
          active:scale-[0.97]
        "
        aria-label="Contact Wahb"
      >
        Contact
      </a>
    </div>
  );
}
