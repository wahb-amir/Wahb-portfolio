"use client";

import { useState, useEffect, useRef } from "react";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

const BASE_CAL = "https://cal.com/wahb-amir";

// Cleaned up options & mapped theme classes directly to decouple from custom properties
const MEETING_OPTIONS = [
  {
    duration: 15,
    label: "Quick Chat",
    desc: "Intro & first impressions",
    theme: {
      border: "border-blue-500/20",
      bg: "bg-blue-500/[0.03]",
      text: "text-blue-400",
      iconBg: "bg-blue-500/10",
      iconBorder: "border-blue-500/20",
      hoverBorder: "hover:border-blue-500/40",
      selectedBg: "bg-blue-500/[0.08]",
      selectedBorder: "border-blue-400",
      checkBg: "bg-blue-500",
      shadow: "shadow-blue-500/10",
    },
    icon: (
      <svg className="w-[16px] height-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    duration: 30,
    label: "Deep Dive",
    desc: "Walk through your project",
    theme: {
      border: "border-violet-500/20",
      bg: "bg-violet-500/[0.03]",
      text: "text-violet-400",
      iconBg: "bg-violet-500/10",
      iconBorder: "border-violet-500/20",
      hoverBorder: "hover:border-violet-500/40",
      selectedBg: "bg-violet-500/[0.08]",
      selectedBorder: "border-violet-400",
      checkBg: "bg-violet-500",
      shadow: "shadow-violet-500/10",
    },
    icon: (
      <svg className="w-[16px] height-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
];

export default function HeroCTAs() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const calLink = `${BASE_CAL}/${MEETING_OPTIONS[selected].duration}min`;

  // Close on outside click
  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [modalOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2.5 justify-center text-sm font-medium tracking-wide">
      {/* PRIMARY: Book a Demo */}
      <button
        onClick={() => setModalOpen(true)}
        className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-[0_4px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_24px_rgba(37,99,235,0.4)] transition-all duration-200 active:scale-[0.98] overflow-hidden"
        aria-label="Book a demo call"
      >
        {/* Subtle Google-style high-tech gloss line overlay */}
        <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        
        <svg className="w-4 height-4 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="3" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        
        <span>Book Demo Call</span>
        
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/15 text-[10px] font-bold tracking-tight text-white/90 group-hover:bg-white/20 transition-colors">
          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          {MEETING_OPTIONS[selected].duration}m
        </span>

        <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      {/* SECONDARY: See my work */}
      <a
        href="/#project-section"
        onClick={(e) => { e.preventDefault(); scrollTo("project-section"); }}
        className="group inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all duration-200 active:scale-[0.98]"
        aria-label="See my work"
      >
        <svg className="w-3.5 h-3.5 opacity-60 group-hover:translate-y-0.5 group-hover:opacity-100 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <span>See my work</span>
      </a>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-200" role="dialog" aria-modal="true">
          <div 
            ref={modalRef}
            className="relative w-full max-w-[340px] rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-[0_24px_60px_rgba(0,0,0,0.8),_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Top clean tech glow edge line */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

            <div className="p-5 pb-0 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-zinc-100 tracking-tight">Choose duration</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Pick what fits your schedule best</p>
              </div>
              <button 
                onClick={() => setModalOpen(false)} 
                className="p-1 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/80 transition-all"
                aria-label="Close"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-5">
              <div className="space-y-2">
                {MEETING_OPTIONS.map((opt, i) => {
                  const isSelected = selected === i;
                  const isHovered = hoveredOption === i;
                  const t = opt.theme;
                  
                  return (
                    <div
                      key={opt.duration}
                      className={`group/card relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all duration-150 
                        ${isSelected ? `${t.selectedBorder} ${t.selectedBg} ${t.shadow}` : `border-zinc-800/60 bg-zinc-900/20 ${t.hoverBorder}`} 
                        ${isHovered && !isSelected ? "translate-x-0.5 bg-zinc-900/40" : ""}`}
                      onClick={() => {
                        setSelected(i);
                        setTimeout(() => {
                          setModalOpen(false);
                          window.open(`${BASE_CAL}/${opt.duration}min`, "_blank", "noreferrer");
                        }, 150);
                      }}
                      onMouseEnter={() => setHoveredOption(i)}
                      onMouseLeave={() => setHoveredOption(null)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { setSelected(i); setModalOpen(false); } }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border transition-transform duration-200 group-hover/card:scale-105 ${t.iconBg} ${t.iconBorder} ${t.text}`}>
                        {opt.icon}
                      </div>
                      
                      <div className="flex-1 min-width-0">
                        <div className="text-xs font-bold text-zinc-200">{opt.label}</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5 truncate">{opt.desc}</div>
                      </div>

                      <div className={`text-xs font-bold ${t.text} opacity-80 pr-1`}>{opt.duration}m</div>
                      
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-150
                        ${isSelected ? `${t.checkBg} border-transparent` : "border-zinc-700 bg-transparent"}`}
                      >
                        {isSelected && (
                          <svg className="w-2.5 h-2.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="my-4 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

              <a
                href={calLink}
                target="_blank"
                rel="noreferrer"
                onClick={() => setModalOpen(false)}
                className="block"
              >
                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(37,99,235,0.2)] transition-all duration-150 active:scale-[0.98]">
                  <svg className="w-3.5 h-3.5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="3" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>Book {MEETING_OPTIONS[selected].duration}m · {MEETING_OPTIONS[selected].label}</span>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </a>

              <p className="text-[10px] text-zinc-600 text-center mt-3 tracking-normal">Opens cal.com · Free · No spam</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}