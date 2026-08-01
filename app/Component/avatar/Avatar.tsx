import React from "react";
import Image from "next/image";

export default function Avatar() {
  return (
    <div className="relative group isolate">
      {/* Glow ring */}
      <div
        className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      <figure
        className="relative mx-auto rounded-full p-1 bg-white dark:bg-slate-900 ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <Image
          src="/Avatar.webp"
          alt="Wahb"
          width={300}
          height={300}
          priority
          fetchPriority="high"
          sizes="(max-width: 480px) 120px, 150px"
          className="rounded-full object-cover w-full h-full"
        />
      </figure>

      {/* Badge 1 — Hack for Humanity (top right) */}
      <div
        aria-label="3rd Place — Hack for Humanity 2026"
        title="3rd Place — Hack for Humanity 2026"
        className="
    absolute -top-1 -right-1
    inline-flex items-center gap-0.5
    px-1.5 py-0.5
    rounded-full
    text-[10px] font-black leading-none
    border border-yellow-300/80 dark:border-amber-500/40
    bg-yellow-400 dark:bg-amber-950
    text-yellow-950 dark:text-yellow-300
    shadow-md shadow-yellow-400/50 dark:shadow-amber-500/20
    select-none pointer-events-none
  "
        style={{
          zIndex: 50,
          animation: "trophy-pop 0.4s cubic-bezier(0.22,1,0.36,1) 0.9s both",
        }}
      >
        🏆 3rd
      </div>

      {/* Badge 2 — Hackonomics Technical Award (top left) */}
      <div
        aria-label="Technical Award — Hackonomics 2026"
        title="Technical Award — Hackonomics 2026"
        className="
          absolute -top-1 -left-1
          inline-flex items-center gap-0.5
          px-1.5 py-0.5
          rounded-full
          text-[10px] font-black leading-none
          border border-blue-600/80 dark:border-blue-700/60
          bg-blue-600 dark:bg-blue-700
          text-white
          shadow-md shadow-blue-600/50
          select-none pointer-events-none
        "
        style={{
          zIndex: 50,
          animation: "trophy-pop-2 0.4s cubic-bezier(0.22,1,0.36,1) 1.1s both",
        }}
      >
        🏆 Tech
      </div>
    </div>
  );
}
