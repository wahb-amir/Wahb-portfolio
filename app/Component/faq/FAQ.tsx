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
    q: "How do I track the progress of my project in real-time?",
    a: "Every client gets access to my custom-built Client Portal (dashboard.wahb.space). You can track development sprints, view task status, sync GitHub progress, and provide feedback directly in one centralized place.",
  },
  {
    q: "Can you integrate AI or Computer Vision into my existing web app?",
    a: "Absolutely. I specialize in merging modern web frontends (Next.js/React) with AI capabilities, specifically lightweight computer vision models for object recognition or image processing that run efficiently on standard hardware.",
  },
  {
    q: "Do you handle hosting and server management for me?",
    a: "Yes. I provide a 'hands-off' experience for my clients. Whether it's managing Linux servers via Nginx and Docker or deploying to serverless platforms like Vercel/AWS, I handle the DevOps so you can focus on your business.",
  },
  {
    q: "What is the typical timeline for an MVP (Minimum Viable Product)?",
    a: "While timelines vary by complexity, I typically aim to deliver a fully functional MVP within 8 to 12 weeks. This includes core features, a secure database, and a polished user interface ready for launch.",
  },
  {
    q: "How do you ensure the security of e-commerce and payment systems?",
    a: "Security is non-negotiable. I use industry-standard protocols like Stripe for PCI-compliant payments and JWT (JSON Web Tokens) for secure authentication, ensuring that sensitive user data never touches your server directly.",
  },
  {
    q: "Will I be able to update my own website content without coding?",
    a: "Yes. Depending on your preference, I can build a custom Admin Dashboard tailored to your workflow or integrate a Headless CMS (like Sanity or Strapi). You'll have total control over your blogs, products, and media.",
  },
  {
    q: "What happens if something breaks after the project is finished?",
    a: "I provide a standard 30-day bug-fix guarantee to ensure everything runs smoothly post-launch. For peace of mind, I also offer monthly maintenance retainers to keep your server secure and your dependencies updated.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => setActiveIndex(activeIndex === index ? null : index);

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
      // person block (kept as before)
    ],
  };

  return (
    // Quick inline font fallback so you see results immediately.
    // For production, prefer loading fonts in head and adding font families to tailwind config.
    <section
      id="faq"
      className={`relative w-full min-h-screen py-24 px-6 flex flex-col items-center justify-center
        bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
       [scrollbar-gutter:stable]`}
      aria-labelledby="faq-heading"
      style={{
        // prefer Poppins for headings, Inter for body; fallbacks ensure no flash of unknown font
        fontFamily: "Poppins, Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
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
          {/* Heading uses a subtle horizontal gradient and heavier weight */}
         <h2
  id="faq-heading"
  className="
  text-3xl md:text-4xl font-extrabold tracking-tight mb-4
  bg-gradient-to-r 
  from-sky-600 via-blue-600 to-indigo-700
  dark:from-cyan-400 dark:via-sky-400 dark:to-blue-500
  bg-clip-text text-transparent
"
>
  Frequently Asked Questions
</h2>

          {/* Subheading/body text uses a warm-slate tone (not pure black) for better readability */}
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base font-normal">
            Everything you need to know about my work and process.
          </p>
        </div>

        <LayoutGroup>
          <div className="space-y-4">
            {faqList.map((item, idx) => (
              <motion.div
                layout
                key={idx}
                className={cn(
                  "border rounded-xl overflow-hidden",
                  activeIndex === idx
                    ? "border-sky-300/40 bg-sky-50/60 dark:bg-slate-800/40 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 hover:border-sky-300/40"
                )}
                transition={{
                  layout: {
                    duration: 0.28,
                    type: "spring",
                    stiffness: 300,
                    damping: 28,
                  },
                }}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="flex items-center justify-between w-full p-5 text-left focus:outline-none focus:ring-2 focus:ring-sky-400/30 rounded-xl"
                  aria-expanded={activeIndex === idx}
                >
                  <span
                    className={cn(
                      "font-semibold text-lg transition-colors duration-200",
                      activeIndex === idx
                        ? "text-sky-700 dark:text-sky-300" // active: brighter accent
                        : "text-slate-800 dark:text-slate-200" // inactive: warm slate
                    )}
                  >
                    {item.q}
                  </span>
                  <span className="ml-4 flex-shrink-0">
                    {activeIndex === idx ? (
                      <Minus className="w-5 h-5 text-sky-600" />
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
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-0 text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
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
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Still have questions?{" "}
            <a
              href="#contact"
              className="text-sky-600 dark:text-sky-300 hover:underline underline-offset-4 font-medium"
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
            className="hover:scale-105 transition-transform p-2 bg-white/60 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm"
          >
            <ChevronUpIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" aria-hidden="true" />
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