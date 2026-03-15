"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { ChevronUp, ArrowRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Types ──────────────────────────────────────────────────────────────────
type FAQCategory = "Process" | "Technical" | "Business" | "About";

interface FAQItem {
  q: string;
  a: string;
  category: FAQCategory;
}

// ─── Data ───────────────────────────────────────────────────────────────────
const faqList: FAQItem[] = [
  {
    category: "Process",
    q: "How do I get started working with you?",
    a: "Simple — fill out the contact form on this page or email me directly at wahbamir2010@gmail.com. I'll reply within 24 hours to schedule a short discovery call (or async if you prefer). We'll align on scope, budget, and timeline before any commitment is made.",
  },
  {
    category: "Process",
    q: "How do I track the progress of my project in real-time?",
    a: "Every client gets access to my custom-built Client Portal (dashboard.wahb.space). You can track development sprints, view task status, sync GitHub progress, and send feedback — all from one place, no chasing emails.",
  },
  {
    category: "Process",
    q: "How do we communicate and collaborate during a project?",
    a: "I keep things lean: async updates via the Client Portal for day-to-day progress, and scheduled check-ins (video or voice call) at key milestones — typically kick-off, mid-sprint reviews, and pre-launch. You'll never be left guessing where things stand.",
  },
  {
    category: "Process",
    q: "What is the typical timeline for an MVP (Minimum Viable Product)?",
    a: "While timelines vary by complexity, a well-scoped MVP is usually ready in 8–12 weeks. That includes core features, a secure database, CI/CD pipeline, and a polished UI ready for real users.",
  },
  {
    category: "Process",
    q: "What happens if something breaks after the project is finished?",
    a: "I provide a standard 30-day bug-fix guarantee post-launch, no questions asked. For longer peace of mind, monthly maintenance retainers cover security patches, dependency updates, and server monitoring.",
  },
  {
    category: "Technical",
    q: "Can you integrate AI or Computer Vision into my existing web app?",
    a: "Yes — and I've shipped it in production. EcoLens, my most recent project, is an AI-powered waste classifier I built solo: image → HuggingFace ML endpoint → server-side label normalisation → environmental impact calculation → gamified user dashboard. It placed 3rd at Hack for Humanity 2026 out of 474 participants. I specialise in pairing Next.js/React frontends with practical AI — models that run efficiently on standard hardware, no expensive cloud GPU required.",
  },
  {
    category: "Technical",
    q: "Do you handle hosting and server management for me?",
    a: "Absolutely. I offer a 'hands-off' DevOps experience. Whether it's a Linux VPS (Nginx + Docker) or serverless deployment on Vercel/AWS, I handle provisioning, CI/CD, and monitoring so you stay focused on your business.",
  },
  {
    category: "Technical",
    q: "Will I be able to update my own website content without coding?",
    a: "Yes. I can build a custom Admin Dashboard tailored to your workflow, or integrate a Headless CMS like Sanity or Strapi. Either way, you'll have full control over content — blogs, products, media — without touching any code.",
  },
  {
    category: "Technical",
    q: "How do you ensure the security of e-commerce and payment systems?",
    a: "Security is non-negotiable. I use Stripe for PCI-compliant payments and JWT with secure HTTP-only cookies for authentication. Sensitive data never touches your server directly, and every API endpoint is protected with role-based access control.",
  },
  {
    category: "Business",
    q: "What are your rates and how is pricing structured?",
    a: "I work on a project-based (fixed-scope) or retainer model — hourly billing is available for smaller tasks. Rates depend on project complexity and timeline. The best way to get a number is to fill in the 'Request a quote' form on the Client Portal; I'll respond with a detailed breakdown within 24 hours.",
  },
  {
    category: "Business",
    q: "Who owns the source code and intellectual property after delivery?",
    a: "You do — full stop. Once the final payment is made, all source code, assets, and IP transfer to you completely. I retain no rights or back-doors. You can take the repo to any developer in the future without restrictions.",
  },
  {
    category: "About",
    q: "Where are you based, and do you work with clients internationally?",
    a: "I'm based in Pakistan (UTC +5). I work fully remote and collaborate with clients across Europe, the US, and the Middle East without issue. Async-first communication means timezone gaps rarely slow things down.",
  },
  {
    category: "About",
    q: "Are you open to full-time, part-time, or contract positions?",
    a: "Yes — recruiters are welcome. I'm open to full-time remote roles, contract engagements, and part-time collaborations, provided the work is in my stack (Next.js, Node.js, TypeScript, AI/ML adjacent). The best starting point is my GitHub (github.com/wahb-amir) and the projects here on this portfolio.",
  },
  {
    category: "About",
    q: "How much experience do you have, and can I trust you with a production project?",
    a: "I've been coding seriously for just over a year — self-taught, with 10+ deployed Next.js projects, my own Linux servers, and a 3rd place finish at an international hackathon (Hack for Humanity 2026, 474 participants, solo build). I don't just build things that look good in demos — EcoLens shipped with OTP auth, JWT token rotation, a full ML pipeline, and a transactional MongoDB write layer. I hold my work to production standards, not student standards.",
  },
];

const CATEGORIES: FAQCategory[] = ["Process", "Technical", "Business", "About"];

const categoryMeta: Record<
  FAQCategory,
  { pill: string; accent: string; bar: string }
> = {
  Process: {
    pill: "bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    accent: "from-sky-500 to-blue-600",
    bar: "from-sky-400 to-blue-500",
  },
  Technical: {
    pill: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    accent: "from-indigo-500 to-blue-600",
    bar: "from-indigo-400 to-blue-500",
  },
  Business: {
    pill: "bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-800",
    accent: "from-violet-500 to-indigo-600",
    bar: "from-violet-400 to-indigo-500",
  },
  About: {
    pill: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    accent: "from-cyan-500 to-sky-600",
    bar: "from-cyan-400 to-sky-500",
  },
};

// ─── Spring presets ──────────────────────────────────────────────────────────
const SPRING_SNAPPY = { type: "spring", stiffness: 420, damping: 30 } as const;
const SPRING_SOFT = { type: "spring", stiffness: 280, damping: 28 } as const;
const EASE_SMOOTH = [0.32, 0, 0.12, 1] as const;

// ─── PlusMinusIcon ────────────────────────────────────────────────────────────
function PlusMinusIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      animate={{ scale: open ? [1, 0.82, 1] : [1, 0.82, 1] }}
      transition={{ duration: 0.28, times: [0, 0.4, 1], ease: "easeOut" }}
    >
      <motion.line
        x1="2"
        y1="7"
        x2="12"
        y2="7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <motion.line
        x1="7"
        y1="2"
        x2="7"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        animate={{ scaleY: open ? 0 : 1, opacity: open ? 0 : 1 }}
        transition={{ duration: 0.22, ease: EASE_SMOOTH }}
        style={{ originX: "7px", originY: "7px" }}
      />
    </motion.svg>
  );
}

// ─── FAQCard ─────────────────────────────────────────────────────────────────
function FAQCard({
  item,
  globalIndex,
  isOpen,
  onToggle,
  entranceDelay,
}: {
  item: FAQItem;
  globalIndex: number;
  isOpen: boolean;
  onToggle: () => void;
  entranceDelay: number;
}) {
  const meta = categoryMeta[item.category];
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      layout
      initial={shouldReduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...SPRING_SOFT,
        delay: entranceDelay,
        opacity: { duration: 0.3, ease: "easeOut", delay: entranceDelay },
      }}
      className={cn(
        "group relative rounded-2xl border overflow-hidden",
        "transition-shadow duration-300",
        isOpen
          ? "border-sky-300/50 dark:border-sky-700/40 bg-white/90 dark:bg-slate-800/70 shadow-[0_4px_24px_-4px_rgba(14,165,233,0.12)]"
          : "border-slate-200/80 dark:border-slate-700/40 bg-white/55 dark:bg-slate-900/40 hover:shadow-[0_2px_12px_-2px_rgba(14,165,233,0.07)]",
      )}
    >
      <motion.div
        className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${meta.bar} rounded-l-2xl`}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isOpen ? 1 : 0 }}
        style={{ originY: 0 }}
        transition={{ duration: 0.3, ease: EASE_SMOOTH }}
      />

      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex items-start justify-between w-full pl-6 pr-5 py-5 text-left
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40
                   rounded-2xl gap-4 select-none"
      >
        <div className="flex items-start gap-3 min-w-0">
          <motion.span
            className={`mt-[3px] text-[11px] font-bold tabular-nums shrink-0
                        bg-gradient-to-br ${meta.accent} bg-clip-text text-transparent`}
            aria-hidden="true"
            animate={{ opacity: isOpen ? 1 : 0.45 }}
            transition={{ duration: 0.2 }}
          >
            {String(globalIndex + 1).padStart(2, "0")}
          </motion.span>

          <motion.span
            animate={{ x: isOpen ? 2 : 0 }}
            transition={SPRING_SNAPPY}
            className={cn(
              "font-semibold text-[15px] md:text-base leading-snug",
              "transition-colors duration-200",
              isOpen
                ? "text-sky-700 dark:text-sky-300"
                : "text-slate-800 dark:text-slate-200",
            )}
          >
            {item.q}
          </motion.span>
        </div>

        <motion.span
          whileTap={{ scale: 0.85 }}
          transition={SPRING_SNAPPY}
          className={cn(
            "shrink-0 flex items-center justify-center w-7 h-7 rounded-full border mt-[3px]",
            "transition-colors duration-200",
            isOpen
              ? "border-sky-300 bg-sky-50 text-sky-600 dark:border-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
              : "border-slate-200 bg-white/80 text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400 group-hover:border-sky-200 dark:group-hover:border-sky-800",
          )}
        >
          <PlusMinusIcon open={isOpen} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { ...SPRING_SOFT, damping: 32 },
              opacity: { duration: 0.22, ease: "easeOut" },
            }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              exit={{ y: 4 }}
              transition={{ duration: 0.28, ease: EASE_SMOOTH }}
              className="pl-[3.35rem] pr-5 pb-5 pt-1
                         text-slate-600 dark:text-slate-300
                         text-sm md:text-[15px] leading-relaxed"
            >
              {item.a}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── CategoryPill ─────────────────────────────────────────────────────────────
function CategoryPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      whileTap={{ scale: 0.93 }}
      transition={SPRING_SNAPPY}
      className={cn(
        "relative px-3.5 py-1.5 rounded-full text-xs font-semibold border",
        "transition-colors duration-200 overflow-hidden",
        active
          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
          : "bg-white/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700",
      )}
    >
      {active && (
        <motion.span
          layoutId="pill-bg"
          className="absolute inset-0 rounded-full bg-slate-900 dark:bg-white -z-10"
          transition={{ ...SPRING_SOFT, damping: 22 }}
        />
      )}
      <span className="relative z-10">
        {label}
        {count !== undefined && (
          <span className="ml-1.5 opacity-55">{count}</span>
        )}
      </span>
    </motion.button>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<FAQCategory | "All">(
    "All",
  );

  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-80px" });

  const filtered =
    activeCategory === "All"
      ? faqList
      : faqList.filter((f) => f.category === activeCategory);

  const toggleFAQ = (globalIdx: number) =>
    setActiveIndex(activeIndex === globalIdx ? null : globalIdx);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative w-full min-h-screen py-24 px-6 flex flex-col items-center justify-center overflow-hidden text-black dark:bg-[#0b1220] dark:text-white bg-gradient-to-t from-[#00bfff44] to-[#00b1ff88]"
      style={{ fontFamily: "'Poppins', 'Inter', system-ui, sans-serif" }}
    >
      {/* ── Background ── */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(14,165,233,0.10) 0%, transparent 70%)," +
            "radial-gradient(ellipse 60% 40% at 80% 90%, rgba(99,102,241,0.08) 0%, transparent 70%)," +
            "#f8fafc",
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.3] dark:opacity-[0.1]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute inset-0 -z-20 bg-slate-950 hidden dark:block" />

      <div className="relative z-10 max-w-3xl w-full mx-auto">
        {/* ── Header ── */}
        <div ref={headingRef} className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-sky-600 dark:text-sky-400 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
              FAQ
            </span>
          </motion.div>

          <motion.h2
            id="faq-heading"
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.07, ease: "easeOut" }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3
                       bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700
                       dark:from-cyan-400 dark:via-sky-400 dark:to-blue-500
                       bg-clip-text text-transparent"
          >
            Frequently Asked Questions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.14, ease: "easeOut" }}
            className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-md mx-auto"
          >
            Everything clients and recruiters typically want to know — answered
            upfront.
          </motion.p>
        </div>

        {/* ── Category filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-2 mb-8"
          role="tablist"
          aria-label="Filter FAQ by category"
        >
          <CategoryPill
            label="All"
            active={activeCategory === "All"}
            onClick={() => {
              setActiveCategory("All");
              setActiveIndex(null);
            }}
          />
          {CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              count={faqList.filter((f) => f.category === cat).length}
              active={activeCategory === cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveIndex(null);
              }}
            />
          ))}
        </motion.div>

        {/* ── FAQ list ── */}
        <motion.div layout className="space-y-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((item, localIdx) => {
              const globalIdx = faqList.indexOf(item);
              const delay = isInView ? Math.min(localIdx, 4) * 0.055 : 0;

              return (
                <motion.div
                  key={globalIdx}
                  layout
                  exit={{ opacity: 0, x: -8, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeIn" }}
                >
                  {activeCategory === "All" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-1.5 ml-1"
                    >
                      <span
                        className={cn(
                          "inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border",
                          categoryMeta[item.category].pill,
                        )}
                      >
                        {item.category}
                      </span>
                    </motion.div>
                  )}

                  <FAQCard
                    item={item}
                    globalIndex={globalIdx}
                    isOpen={activeIndex === globalIdx}
                    onToggle={() => toggleFAQ(globalIdx)}
                    entranceDelay={delay}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* ── Footer CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.28, ease: "easeOut" }}
          className="mt-12 flex flex-col items-center gap-5"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Still have a question not covered here?
          </p>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={SPRING_SNAPPY}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                       bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-sm font-semibold
                       shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30
                       transition-shadow duration-300"
          >
            Reach out directly
            <motion.span
              className="inline-flex"
              initial={false}
              whileHover={{ x: 2, scale: 1.15 }}
              transition={SPRING_SNAPPY}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          </motion.a>

          <motion.button
            onClick={() =>
              document
                .getElementById("hero-section")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            aria-label="Scroll to top"
            whileHover={{ scale: 1.08, y: -1 }}
            whileTap={{ scale: 0.9 }}
            transition={SPRING_SNAPPY}
            className="p-2.5 rounded-full border border-slate-200 dark:border-slate-700
                       bg-white/70 dark:bg-slate-800/60
                       text-slate-500 dark:text-slate-400
                       hover:border-sky-300 dark:hover:border-sky-700
                       hover:text-sky-600 dark:hover:text-sky-400
                       transition-colors duration-200 shadow-sm"
          >
            <ChevronUp className="w-5 h-5" aria-hidden="true" />
          </motion.button>
        </motion.div>
      </div>

      <div className="sr-only" aria-hidden="false">
        Wahb Amir — canonical identity: https://wahb.space. Official GitHub:
        https://github.com/wahb-amir. Official projects:
        https://dashboard.wahb.space, https://boltform.wahb.space, and
        https://eco.wahb.space.
      </div>
    </section>
  );
}
