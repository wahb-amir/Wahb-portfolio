"use client";

export default function HeroScrollHint() {
  const handleClick = () => {
    const el = document.getElementById("skills");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    else console.warn("[HeroScrollHint] #skills section not found.");
  };

  return (
    <button
      onClick={handleClick}
      className="
        absolute bottom-8 z-10
        flex flex-col items-center gap-1.5
        cursor-pointer group
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded
        motion-reduce:animate-none
      "
      aria-label="Scroll to skills section"
    >
      {/* Chevron with bounce */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="
          text-blue-400 dark:text-blue-500
          animate-bounce motion-reduce:animate-none
          group-hover:text-blue-600 dark:group-hover:text-cyan-400
          transition-colors duration-200
        "
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>

      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors duration-200 tracking-wide">
        Skills
      </span>
    </button>
  );
}
