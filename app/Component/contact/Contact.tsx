"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EMAIL = "wahbamir2010@gmail.com";
const GITHUB = "https://github.com/wahb-amir";
const CLIENT_PORTAL = "https://dashboard.wahb.space#request-quote";

const SERVICES = [
  "Full-Stack Web App",
  "Backend & APIs",
  "SEO & Performance",
  "E-Commerce Store",
  "Custom Solution",
];

const BUDGETS = ["<$1K", "$1–3K", "$3–8K", "$8K+", "Open"];
const BUDGET_FULL = [
  "Under $1,000",
  "$1,000–$3,000",
  "$3,000–$8,000",
  "$8,000+",
  "Not sure yet",
];

const TIMELINES = ["ASAP", "~1 Mo.", "1–3 Mo.", "Flexible"];
const TIMELINE_FULL = ["ASAP", "Within 1 month", "1–3 months", "Flexible"];

const TICKER =
  "AVAILABLE FOR NEW PROJECTS · FULL-STACK ENGINEERING · BACKEND & APIS · SEO OPTIMIZATION · E-COMMERCE · SHIPS FAST · CLEAN CODE · TESTED & MAINTAINABLE · ";

const TERMINAL_ROWS = [
  ["STATUS", "AVAILABLE", true],
  ["REPLY", "< 24 HOURS", false],
  ["DELIVERY", "WEEKS, NOT MONTHS", false],
  ["OWNERSHIP", "DESIGN → DEPLOY", false],
] as const;

export default function Contact() {
  const [svc, setSvc] = useState(0);
  const [bud, setBud] = useState(4);
  const [tl, setTl] = useState(3);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const upd =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          service: SERVICES[svc],
          budget: BUDGET_FULL[bud],
          timeline: TIMELINE_FULL[tl],
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 8000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3500);
    }
  };

  const ease = [0.22, 1, 0.36, 1] as const;
  const fd = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    transition: { duration: 0.55, delay, ease },
  });

  return (
    <section
      ref={ref}
      id="contact"
      className="relative min-h-screen bg-gradient-to-b from-[#00b1ff15] to-[#00bfff05] dark:bg-transparent dark:from-transparent dark:to-transparent text-gray-900 dark:text-gray-100 overflow-hidden font-mono"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

        .ct-ticker-inner {
          display: inline-flex;
          white-space: nowrap;
          animation: ct-scroll 36s linear infinite;
        }
        .ct-ticker-inner:hover { animation-play-state: paused; }
        @keyframes ct-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .ct-cursor { animation: ct-blink 1s step-end infinite; }
        @keyframes ct-blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .ct-pulse-dot {
          animation: ct-pulse 2.5s ease-in-out infinite;
        }
        @keyframes ct-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.6); }
          70%  { box-shadow: 0 0 0 7px rgba(0, 212, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0); }
        }

        /* ── HIGH-CONTRAST INPUT PLACEHOLDERS ── */
        input::placeholder,
        textarea::placeholder {
          color: #6b7280;
          font-weight: 400;
          opacity: 1;
        }
        .dark input::placeholder,
        .dark textarea::placeholder {
          color: #9ca3af;
          font-weight: 400;
          opacity: 1;
        }

        input:focus,
        textarea:focus {
          outline: none;
        }
      `}</style>

      {/* Responsive Dot Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(#0088cc22_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#00b1ff15_1.5px,transparent_1.5px)] [background-size:28px_28px]" />

      {/* ─── Ticker ─── */}
      <div
        className="overflow-hidden border-b border-gray-300 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm"
        aria-hidden
      >
        <div className="ct-ticker-inner py-2.5 font-mono text-[10px] font-bold tracking-[0.18em] text-gray-600 dark:text-gray-400">
          {(TICKER + TICKER).repeat(2)}
        </div>
      </div>

      {/* ─── Main canvas ─── */}
      <div className="relative z-10">
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 py-16 pb-20">

          {/* ══ Hero ══ */}
          <motion.div {...fd(0)} className="mb-[52px]">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-[7px] h-[7px] rounded-full shrink-0 bg-[#0088cc] dark:bg-[#00d4ff] ct-pulse-dot" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#0077b3] dark:text-[#00d4ff] font-bold">
                Available for new projects
              </span>
              <span className="text-[10px] tracking-[0.1em] text-gray-500 dark:text-gray-400 ml-2 hidden sm:inline">
                / {new Date().getFullYear()} / WAHB
              </span>
            </div>

            <div className="leading-[0.9] tracking-[0.01em] font-['Bebas_Neue',sans-serif] text-[clamp(52px,10.5vw,118px)]">
              <span className="block text-gray-900 dark:text-white">LET&apos;S BUILD</span>
              <span className="block text-[#0077b3] dark:text-[#00d4ff]">
                SOMETHING
              </span>
              <span className="block text-gray-400 dark:text-gray-500">
                DIFFERENT
                <span className="ct-cursor text-[#0077b3] dark:text-[#00d4ff]">_</span>
              </span>
            </div>

            <p className="mt-7 text-[13px] text-gray-700 dark:text-gray-300 tracking-[0.03em] leading-[2.0] max-w-[540px]">
              Full-stack engineer. Production-ready products, shipped fast.
              <br />
              Tell me what you&apos;re building.
            </p>
          </motion.div>

          {/* ══ Service selector ══ */}
          <motion.div {...fd(0.08)} className="mb-14">
            <div className="text-[9px] tracking-[0.25em] uppercase text-gray-600 dark:text-gray-400 mb-5 font-bold">
              — What do you need?
            </div>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map((sv, i) => (
                <button
                  key={sv}
                  className={`font-mono text-[11px] font-bold tracking-[0.08em] uppercase px-[18px] py-[10px] border transition-all duration-150 ${
                    svc === i
                      ? "border-[#0077b3] bg-[#0077b3] text-white dark:border-[#00d4ff] dark:bg-[#00d4ff] dark:text-[#0b1220] shadow-sm"
                      : "border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:text-[#0077b3] hover:border-[#0077b3] hover:bg-[#0077b3]/5 dark:hover:text-[#00d4ff] dark:hover:border-[#00d4ff]/60 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSvc(i)}
                  type="button"
                >
                  {sv}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ══ Two-column grid ══ */}
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 md:gap-16 items-start">

            {/* ── Left: info panel ── */}
            <motion.div {...fd(0.14)} className="flex flex-col gap-9">

              {/* Terminal status */}
              <div>
                <div className="text-[9px] tracking-[0.25em] uppercase text-gray-600 dark:text-gray-400 mb-5 font-bold">
                  — Status
                </div>
                <div className="border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 overflow-hidden">
                  {TERMINAL_ROWS.map(([k, v, accent]) => (
                    <div
                      key={k}
                      className="flex gap-3.5 px-4 py-[9px] border-b border-gray-200 dark:border-gray-800 last:border-b-0 text-[11px] tracking-[0.04em]"
                    >
                      <span className="text-gray-600 dark:text-gray-400 min-w-[80px] shrink-0 font-bold">
                        {k}
                      </span>
                      <span
                        className={
                          accent
                            ? "text-[#0077b3] dark:text-[#00d4ff] font-bold"
                            : "text-gray-900 dark:text-gray-200 font-semibold"
                        }
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct contact links */}
              <div>
                <div className="text-[9px] tracking-[0.25em] uppercase text-gray-600 dark:text-gray-400 mb-5 font-bold">
                  — Reach out
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className={`block w-full border px-4 py-[12px] font-mono text-[11px] tracking-[0.06em] font-bold text-left uppercase transition-all ${
                      copied
                        ? "border-[#16a34a] text-[#16a34a] bg-green-50 dark:border-[#4ade80] dark:text-[#4ade80] dark:bg-green-900/30"
                        : "border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:border-[#0077b3] hover:text-[#0077b3] hover:bg-[#0077b3]/5 dark:hover:border-[#00d4ff]/60 dark:hover:text-[#00d4ff] dark:hover:bg-gray-700"
                    }`}
                    onClick={copy}
                    type="button"
                  >
                    {copied ? "✓ Copied to clipboard" : `@ ${EMAIL}`}
                  </button>
                  <a
                    href={GITHUB}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full border border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-[12px] font-mono text-[11px] font-bold tracking-[0.06em] text-left uppercase text-gray-800 dark:text-gray-200 transition-all hover:border-[#0077b3] hover:text-[#0077b3] hover:bg-[#0077b3]/5 dark:hover:border-[#00d4ff]/60 dark:hover:text-[#00d4ff] dark:hover:bg-gray-700"
                  >
                    GH / WAHB-AMIR ↗
                  </a>
                  <a
                    href={CLIENT_PORTAL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full border border-[#0077b3] dark:border-[#00d4ff]/50 bg-[#0077b3]/8 dark:bg-[#00d4ff]/10 px-4 py-[12px] font-mono text-[11px] font-bold tracking-[0.06em] text-left uppercase text-[#0077b3] dark:text-[#00d4ff] transition-all hover:border-[#0077b3] hover:bg-[#0077b3]/15 dark:hover:border-[#00d4ff] dark:hover:bg-[#00d4ff]/20"
                  >
                    Request Quote → Client Portal
                  </a>
                </div>
              </div>

              {/* Section navigation */}
              <div className="flex gap-2 pt-2 border-t border-gray-300 dark:border-gray-800">
                {[
                  { label: "↑ About", id: "about" },
                  { label: "↓ FAQ", id: "faq" },
                ].map(({ label, id }) => (
                  <button
                    key={id}
                    type="button"
                    className="font-mono text-[10px] font-bold tracking-[0.12em] uppercase text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 px-3.5 py-[8px] cursor-pointer transition-all hover:text-[#0077b3] hover:border-[#0077b3] dark:hover:text-[#00d4ff] dark:hover:border-[#00d4ff]/60 dark:hover:bg-gray-700"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ── Right: form ── */}
            <motion.div {...fd(0.2)}>
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  /* ── Success state ── */
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative border border-gray-300 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-6 sm:px-10 py-[72px] text-center"
                  >
                    <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-[1.5px] border-l-[1.5px] border-[#0077b3] dark:border-[#00d4ff] pointer-events-none" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-[1.5px] border-r-[1.5px] border-[#0077b3] dark:border-[#00d4ff] pointer-events-none" />

                    <div className="leading-none mb-3.5 font-['Bebas_Neue',sans-serif] text-[clamp(42px,7vw,80px)] text-[#0077b3] dark:text-[#00d4ff]">
                      BRIEF RECEIVED
                    </div>
                    <div className="text-[12px] text-gray-700 dark:text-gray-300 font-bold tracking-[0.1em] mb-8 uppercase">
                      Reply incoming within 24 hours.
                    </div>
                    <button
                      onClick={() => setStatus("idle")}
                      className="bg-transparent border-none text-[10px] tracking-[0.15em] font-bold text-gray-600 dark:text-gray-400 underline cursor-pointer uppercase font-mono hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      SEND ANOTHER →
                    </button>
                  </motion.div>
                ) : (
                  /* ── Form ── */
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border border-gray-300 dark:border-gray-700 bg-white/95 dark:bg-gray-900/90 backdrop-blur-md shadow-sm dark:shadow-xl"
                    aria-busy={status === "sending"}
                  >
                    {/* Form header bar */}
                    <div className="border-b border-gray-200 dark:border-gray-700 px-5 sm:px-7 py-3.5 flex justify-between items-center bg-gray-50/80 dark:bg-gray-950/80">
                      <span className="text-[9px] tracking-[0.25em] text-gray-600 dark:text-gray-400 uppercase font-bold">
                        Project Brief · {new Date().getFullYear()}
                      </span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={SERVICES[svc]}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.18 }}
                          className="text-[9px] font-bold tracking-[0.12em] border border-[#0077b3]/50 dark:border-[#00d4ff]/40 px-2.5 py-[3px] uppercase text-[#0077b3] dark:text-[#00d4ff] bg-[#0077b3]/8 dark:bg-[#00d4ff]/10"
                        >
                          {SERVICES[svc]}
                        </motion.span>
                      </AnimatePresence>
                    </div>

                    {/* Form body */}
                    <div className="px-5 sm:px-7 pt-9 pb-7 flex flex-col gap-11">

                      {/* 01 — Who are you */}
                      <div className="relative">
                        <div
                          className="font-['Bebas_Neue',sans-serif] text-[96px] leading-none absolute -top-6 -left-1.5 pointer-events-none select-none z-0 text-gray-900 dark:text-white opacity-[0.04]"
                          aria-hidden
                        >
                          01
                        </div>
                        <div className="relative z-10">
                          <div className="text-[9px] tracking-[0.25em] uppercase text-gray-600 dark:text-gray-400 mb-5 font-bold">
                            Who are you?
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                            <div>
                              <label
                                className="text-[10px] tracking-[0.15em] uppercase text-gray-700 dark:text-gray-300 block mb-2.5 font-bold"
                                htmlFor="ct-name"
                              >
                                Name *
                              </label>
                              <input
                                className="block w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-none px-3 py-3 font-mono text-[13px] font-semibold text-gray-900 dark:text-white outline-none transition-all focus:border-[#0077b3] focus:bg-white dark:focus:border-[#00d4ff] dark:focus:bg-gray-900"
                                id="ct-name"
                                type="text"
                                name="name"
                                required
                                placeholder="Alex Johnson"
                                value={form.name}
                                onChange={upd("name")}
                              />
                            </div>
                            <div>
                              <label
                                className="text-[10px] tracking-[0.15em] uppercase text-gray-700 dark:text-gray-300 block mb-2.5 font-bold"
                                htmlFor="ct-email"
                              >
                                Email *
                              </label>
                              <input
                                className="block w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-none px-3 py-3 font-mono text-[13px] font-semibold text-gray-900 dark:text-white outline-none transition-all focus:border-[#0077b3] focus:bg-white dark:focus:border-[#00d4ff] dark:focus:bg-gray-900"
                                id="ct-email"
                                type="email"
                                name="email"
                                required
                                placeholder="you@company.com"
                                value={form.email}
                                onChange={upd("email")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 02 — Budget & Timeline */}
                      <div className="relative">
                        <div
                          className="font-['Bebas_Neue',sans-serif] text-[96px] leading-none absolute -top-6 -left-1.5 pointer-events-none select-none z-0 text-gray-900 dark:text-white opacity-[0.04]"
                          aria-hidden
                        >
                          02
                        </div>
                        <div className="relative z-10">
                          <div className="text-[9px] tracking-[0.25em] uppercase text-gray-600 dark:text-gray-400 mb-5 font-bold">
                            Budget &amp; Timeline
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                              <div className="text-[10px] tracking-[0.15em] uppercase text-gray-700 dark:text-gray-300 mb-3 font-bold">
                                Budget
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {BUDGETS.map((b, i) => (
                                  <button
                                    key={b}
                                    type="button"
                                    className={`font-mono text-[11px] font-bold px-3.5 py-2 border transition-all tracking-[0.04em] ${
                                      bud === i
                                        ? "border-[#0077b3] text-white bg-[#0077b3] dark:border-[#00d4ff] dark:text-[#0b1220] dark:bg-[#00d4ff] shadow-sm"
                                        : "border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 hover:border-[#0077b3] hover:text-[#0077b3] hover:bg-[#0077b3]/5 dark:hover:border-[#00d4ff]/60 dark:hover:text-[#00d4ff] dark:hover:bg-gray-700"
                                    }`}
                                    onClick={() => setBud(i)}
                                  >
                                    {b}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] tracking-[0.15em] uppercase text-gray-700 dark:text-gray-300 mb-3 font-bold">
                                Timeline
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {TIMELINES.map((t, i) => (
                                  <button
                                    key={t}
                                    type="button"
                                    className={`font-mono text-[11px] font-bold px-3.5 py-2 border transition-all tracking-[0.04em] ${
                                      tl === i
                                        ? "border-[#0077b3] text-white bg-[#0077b3] dark:border-[#00d4ff] dark:text-[#0b1220] dark:bg-[#00d4ff] shadow-sm"
                                        : "border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 hover:border-[#0077b3] hover:text-[#0077b3] hover:bg-[#0077b3]/5 dark:hover:border-[#00d4ff]/60 dark:hover:text-[#00d4ff] dark:hover:bg-gray-700"
                                    }`}
                                    onClick={() => setTl(i)}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 03 — Project Details */}
                      <div className="relative">
                        <div
                          className="font-['Bebas_Neue',sans-serif] text-[96px] leading-none absolute -top-6 -left-1.5 pointer-events-none select-none z-0 text-gray-900 dark:text-white opacity-[0.04]"
                          aria-hidden
                        >
                          03
                        </div>
                        <div className="relative z-10">
                          <div className="text-[9px] tracking-[0.25em] uppercase text-gray-600 dark:text-gray-400 mb-5 font-bold">
                            Project Details
                          </div>
                          <label
                            className="text-[10px] tracking-[0.15em] uppercase text-gray-700 dark:text-gray-300 block mb-2.5 font-bold"
                            htmlFor="ct-msg"
                          >
                            Describe your project{" "}
                            <span className="normal-case tracking-normal text-gray-500 dark:text-gray-400 font-normal">
                              (optional)
                            </span>
                          </label>
                          <textarea
                            className="block w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-none px-3 py-3 font-mono text-[13px] font-semibold text-gray-900 dark:text-white outline-none transition-all focus:border-[#0077b3] focus:bg-white dark:focus:border-[#00d4ff] dark:focus:bg-gray-900 resize-none leading-loose"
                            id="ct-msg"
                            name="message"
                            rows={4}
                            placeholder="What are you building? Tech preferences? Main goals?"
                            value={form.message}
                            onChange={upd("message")}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className={`w-full p-[22px] font-mono text-[13px] font-bold tracking-[0.14em] uppercase flex items-center justify-center gap-3 cursor-pointer border-none transition-all duration-300 ${
                        status === "sending"
                          ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "bg-[#0077b3] text-white dark:bg-[#00d4ff] dark:text-[#0b1220] hover:tracking-[0.22em] hover:bg-[#005f8f] dark:hover:bg-[#33ddff]"
                      }`}
                    >
                      {status === "sending" ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 0.85,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="inline-block w-3.5 h-3.5 rounded-full border-2 border-gray-400 border-t-gray-700 dark:border-gray-600 dark:border-t-gray-300"
                          />
                          TRANSMITTING
                        </>
                      ) : (
                        <>
                          SEND BRIEF
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>

                    {/* Error message */}
                    <AnimatePresence>
                      {status === "error" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="px-7 py-3 text-[11px] font-bold tracking-[0.08em] text-red-700 dark:text-red-400 border-t border-gray-300 dark:border-gray-800 bg-red-50 dark:bg-red-900/20 uppercase"
                        >
                          ✗ Failed — email me directly: {EMAIL}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ══ Footer bar ══ */}
          <div className="border-t border-gray-300 dark:border-gray-800 mt-16 pt-6 flex justify-between items-center flex-wrap gap-3">
            <span className="text-[9px] tracking-[0.22em] text-gray-600 dark:text-gray-400 uppercase font-bold">
              Wahb · Full-Stack Engineer · {new Date().getFullYear()}
            </span>
            <span className="text-[9px] tracking-[0.15em] text-gray-600 dark:text-gray-400 uppercase font-bold">
              Available · Remote · Worldwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}