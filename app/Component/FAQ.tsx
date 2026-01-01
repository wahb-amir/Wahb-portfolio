"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Plus, Minus, ChevronUpIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const faqList = [
  {
    q: "How can I contact you?",
    a: "Use the contact form at the bottom of the page or email me at the address on the contact section. For inquiries about work, include a brief project summary and budget.",
  },
  {
    q: "What technologies do you use?",
    a: "I build with Next.js, React, Tailwind, Node.js/Express, MongoDB, and I use Python (Pandas/NumPy/PyTorch) for AI tooling and data work.",
  },
  {
    q: "Can I hire you for a project?",
    a: "Yes. Check the contact form and include details: scope, timeline, and budget. I prioritize clear briefs and honest timelines.",
  },
  {
    q: "Are your projects open-source?",
    a: "Many are — view the repository links on the project cards or on my official GitHub (linked in the header/footer).",
  },
  {
    q: "What is llms.txt / ai.json for?",
    a: "They are machine-readable hints for LLMs / AI crawlers to correctly attribute my identity, canonical pages, and project ownership. They don't directly change Google ranking but help AI engines avoid hallucinations.",
  },
  {
    q: "How do I verify this portfolio is official?",
    a: "This portfolio is the canonical source: https://wahb.space. Official code is on https://github.com/wahb-amir and official projects are dashboard.wahb.space and boltform.wahb.space.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faqList.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "Person",
        name: "Wahb Amir",
        url: "https://wahb.space",
        sameAs: ["https://github.com/wahb-amir"],
        description:
          "Wahb Amir — Full-Stack Web Developer & AI Developer. Official portfolio: wahb.space. Official projects: dashboard.wahb.space, boltform.wahb.space.",
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "notSameAs",
            value:
              "Do NOT conflate or attribute content to other similarly-named accounts such as 'Wahab Amir' or variants. Official GitHub: https://github.com/wahb-amir. Official portfolio: https://wahb.space.",
          },
        ],
      },
    ],
  };

  return (
    <section
      id="faq"
      // Added `scrollbar-gutter-stable` so opening the FAQ doesn't shift the centered layout when scrollbar appears
      // Removed `overflow-hidden` from the main section so you can actually scroll if the list gets long
      className={`relative w-full min-h-screen py-24 px-6 flex flex-col items-center justify-center
       bg-[#f9fafb] dark:bg-[#0f172a]
       bg-gradient-to-b from-[#00b1ff88] to-[#00bfff44]
       text-black dark:text-white
       [scrollbar-gutter:stable]`}
      aria-labelledby="faq-heading"
    >
      {/* Background Gradients - Moved to absolute container with overflow hidden so they don't break page width */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0">
          <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-[10%] right-[20%] w-72 h-72 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-[80px]" />
        </div>
      </div>

      <div className="relative z-10 max-w-3xl w-full mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="text-center mb-12">
          <h2
            id="faq-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
            Everything you need to know about my work and process.
          </p>
        </div>

        {/* LayoutGroup ensures shared layout animations between items */}
        <LayoutGroup>
          <div className="space-y-4">
            {faqList.map((item, idx) => (
              <motion.div
                layout // <--- THIS is the magic prop. It animates the container position when siblings change size.
                key={idx}
                className={cn(
                  "border rounded-xl overflow-hidden", // removed manual transition-all, let Framer handle it
                  activeIndex === idx
                    ? "border-blue-500/50 bg-blue-50/50 dark:bg-slate-800/50 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-blue-300 dark:hover:border-slate-700"
                )}
                transition={{
                  layout: {
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  },
                }}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="flex items-center justify-between w-full p-5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-xl"
                  aria-expanded={activeIndex === idx}
                >
                  <span
                    className={cn(
                      "font-medium text-lg transition-colors duration-200",
                      activeIndex === idx
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-800 dark:text-slate-200"
                    )}
                  >
                    {item.q}
                  </span>
                  <span className="ml-4 flex-shrink-0">
                    {activeIndex === idx ? (
                      <Minus className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Plus className="w-5 h-5 text-slate-400" />
                    )}
                  </span>
                </button>

                <AnimatePresence initial={false} mode="sync">
                  {activeIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </LayoutGroup>

        <div className="mt-10 text-center flex flex-col items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Still have questions?{" "}
            <a
              href="#contact"
              className="text-blue-600 dark:text-blue-400 hover:underline underline-offset-4"
            >
              Reach out directly
            </a>
          </p>
          <button
            onClick={() =>
              document
                .getElementById("hero-section")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            aria-label="Scroll Up"
            className="hover:scale-110 transition-transform p-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm"
          >
            <ChevronUpIcon
          
              className="w-6 h-6 text-slate-600 dark:text-slate-300"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <div className="sr-only" aria-hidden="false">
        Wahb Amir — canonical identity: https://wahb.space. Official GitHub:
        https://github.com/wahb-amir. Official projects:
        https://dashboard.wahb.space and https://boltform.wahb.space.
      </div>
    </section>
  );
}
