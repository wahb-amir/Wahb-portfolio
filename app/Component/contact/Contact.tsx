"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Calendar, ChevronDown, ExternalLink } from "lucide-react";

const EMAIL = "wahbamir2010@gmail.com";
const GITHUB = "https://github.com/wahb-amir";
const CLIENT_PORTAL = "https://dashboard.wahb.space#request-quote";
const CAL_LINK = "https://cal.com/wahb-amir/15min";

// Expanded reasons for contact
const REASONS = [
  { value: "freelance", label: "Freelance / Contract Work" },
  { value: "collaboration", label: "Project Collaboration" },
  { value: "hiring", label: "Hiring / Full-time Opportunity" },
  { value: "hackathon", label: "Hackathon / Event Invite" },
  { value: "mentorship", label: "Mentorship / Advice" },
  { value: "bug_report", label: "Bug Report / Feedback" },
  { value: "question", label: "General Question" },
  { value: "other", label: "Other" },
];

const TICKER =
  "AVAILABLE FOR NEW PROJECTS · FULL-STACK ENGINEERING · BACKEND & APIS · SEO OPTIMIZATION · E-COMMERCE · SHIPS FAST · CLEAN CODE · TESTED & MAINTAINABLE · ";

const TERMINAL_ROWS = [
  ["STATUS", "AVAILABLE", true],
  ["REPLY", "< 24 HOURS", false],
  ["DELIVERY", "WEEKS, NOT MONTHS", false],
  ["OWNERSHIP", "DESIGN → DEPLOY", false],
] as const;

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    reason: "",
  });
  const [reasonOpen, setReasonOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reasonRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const upd =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const selectReason = (value: string) => {
    setForm((p) => ({ ...p, reason: value }));
    setReasonOpen(false);
  };

  React.useEffect(() => {
    if (!reasonOpen) return;
    const handler = (e: MouseEvent) => {
      if (reasonRef.current && !reasonRef.current.contains(e.target as Node)) {
        setReasonOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [reasonOpen]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.reason || !form.message) return; // Fallback safety

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "", reason: "" });
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

  const selectedReason = REASONS.find((r) => r.value === form.reason);

  return (
    <section
      ref={ref}
      id="contact"
      className="relative min-h-screen bg-gradient-to-b from-[#00b1ff15] to-[#00bfff05] dark:bg-transparent dark:from-transparent dark:to-transparent text-gray-900 dark:text-gray-100 overflow-hidden font-mono"
    >
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(#0088cc22_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#00b1ff15_1.5px,transparent_1.5px)] [background-size:28px_28px]" />

      <div
        className="overflow-hidden border-b border-gray-300 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm"
        aria-hidden
      >
        <div className="inline-flex whitespace-nowrap animate-[ticker_36s_linear_infinite] hover:[animation-play-state:paused] py-2.5 font-mono text-[10px] font-bold tracking-[0.18em] text-gray-600 dark:text-gray-400">
          {(TICKER + TICKER).repeat(2)}
        </div>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 py-16 pb-20">
        <motion.div {...fd(0)} className="mb-14">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-[7px] h-[7px] rounded-full shrink-0 bg-[#0088cc] dark:bg-[#00d4ff] animate-[pulse-ring_2.5s_ease-in-out_infinite]" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#0077b3] dark:text-[#00d4ff] font-bold">
              Available for new projects
            </span>
            <span className="text-[10px] tracking-[0.1em] text-gray-500 dark:text-gray-400 ml-2 hidden sm:inline">
              / {new Date().getFullYear()} / WAHB
            </span>
          </div>

          <div className="leading-[0.9] tracking-[0.01em] font-['Bebas_Neue',sans-serif] text-[clamp(52px,10.5vw,118px)]">
            <span className="block text-gray-900 dark:text-white">
              LET&apos;S BUILD
            </span>
            <span className="block text-[#0077b3] dark:text-[#00d4ff]">
              SOMETHING
            </span>
            <span className="block text-gray-400 dark:text-gray-500">
              DIFFERENT
              <span className="animate-[blink_1s_step-end_infinite] text-[#0077b3] dark:text-[#00d4ff]">
                _
              </span>
            </span>
          </div>

          <p className="mt-7 text-[13px] text-gray-700 dark:text-gray-300 tracking-[0.03em] leading-[2.0] max-w-[540px]">
            Full-stack engineer. Production-ready products, shipped fast.
            <br />
            Book a call to get started — or leave a message below.
          </p>
        </motion.div>

        <motion.div {...fd(0.06)} className="mb-16">
          <div className="text-[9px] tracking-[0.25em] uppercase text-gray-600 dark:text-gray-400 mb-5 font-bold">
            — Preferred: Schedule a call
          </div>
          <div className="border border-[#0077b3]/30 dark:border-[#00d4ff]/25 bg-[#0077b3]/5 dark:bg-[#00d4ff]/8 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-5 h-5 border-t-[1.5px] border-l-[1.5px] border-[#0077b3] dark:border-[#00d4ff]" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-[1.5px] border-r-[1.5px] border-[#0077b3] dark:border-[#00d4ff]" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="font-['Bebas_Neue',sans-serif] text-[22px] sm:text-[28px] text-gray-900 dark:text-white tracking-[0.03em] leading-tight mb-1.5">
                  BOOK A DEMO CALL
                </div>
                <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed max-w-[400px]">
                  15-min intro, 30-min deep-dive, or a full 60-min strategy
                  session. Fastest way to move your project forward.
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.1em] text-[#0077b3] dark:text-[#00d4ff] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0077b3] dark:bg-[#00d4ff] animate-pulse" />
                    Slots available this week
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-500 tracking-[0.08em]">
                    · Free · No commitment
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 shrink-0">
                <a
                  href={CAL_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#0077b3] dark:bg-[#00d4ff] text-white dark:text-[#0b1220] font-mono font-bold text-[12px] tracking-[0.12em] uppercase border-none transition-all duration-200 hover:bg-[#005f8f] dark:hover:bg-[#33ddff] hover:tracking-[0.18em] shadow-[0_4px_20px_rgba(0,119,179,0.35)] dark:shadow-[0_4px_20px_rgba(0,212,255,0.25)] hover:shadow-[0_6px_28px_rgba(0,119,179,0.5)] dark:hover:shadow-[0_6px_28px_rgba(0,212,255,0.35)]"
                >
                  <Calendar size={13} />
                  Schedule Now
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>
                <a
                  href={CLIENT_PORTAL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#0077b3]/50 dark:border-[#00d4ff]/40 text-[#0077b3] dark:text-[#00d4ff] font-mono font-bold text-[11px] tracking-[0.1em] uppercase bg-transparent transition-all hover:border-[#0077b3] dark:hover:border-[#00d4ff] hover:bg-[#0077b3]/8 dark:hover:bg-[#00d4ff]/10"
                >
                  <ExternalLink size={11} />
                  Request a Quote
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fd(0.1)} className="mb-12">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-800" />
            <span className="text-[9px] tracking-[0.25em] uppercase text-gray-600 dark:text-gray-200 font-bold whitespace-nowrap">
              Or send an async message
            </span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-800" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 md:gap-16 items-start">
          <motion.div {...fd(0.14)} className="flex flex-col gap-9">
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
              </div>
            </div>
          </motion.div>

          <motion.div {...fd(0.2)}>
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative border border-gray-300 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-6 sm:px-10 py-[72px] text-center"
                >
                  <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-[1.5px] border-l-[1.5px] border-[#0077b3] dark:border-[#00d4ff]" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-[1.5px] border-r-[1.5px] border-[#0077b3] dark:border-[#00d4ff]" />
                  <div className="font-['Bebas_Neue',sans-serif] text-[clamp(42px,7vw,80px)] leading-none mb-3.5 text-[#0077b3] dark:text-[#00d4ff]">
                    MESSAGE RECEIVED
                  </div>
                  <div className="text-[12px] text-gray-700 dark:text-gray-300 font-bold tracking-[0.1em] mb-8 uppercase">
                    Reply incoming within 24 hours.
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-gray-300 dark:border-gray-700 bg-white/95 dark:bg-gray-900/90 backdrop-blur-md shadow-sm dark:shadow-xl relative z-10"
                  aria-busy={status === "sending"}
                >
                  <div className="border-b border-gray-200 dark:border-gray-700 px-5 sm:px-7 py-3.5 flex justify-between items-center bg-gray-50/80 dark:bg-gray-950/80 gap-3 flex-wrap">
                    <span className="text-[9px] tracking-[0.25em] text-gray-600 dark:text-gray-400 uppercase font-bold">
                      Async Communication · {new Date().getFullYear()}
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.1em] border border-gray-400/50 dark:border-gray-700 px-2.5 py-[3px] uppercase text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/60">
                      Fallback Channel
                    </span>
                  </div>

                  <div className="px-5 sm:px-7 pt-8 pb-7 flex flex-col gap-9">
                    {/* 01 — Identity */}
                    <div className="relative z-10">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label
                              className="text-[10px] tracking-[0.15em] uppercase text-gray-700 dark:text-gray-300 block mb-2.5 font-bold"
                              htmlFor="ct-name"
                            >
                              Name *
                            </label>
                            <input
                              className="block w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-none px-3 py-3 font-mono text-[13px] font-semibold text-gray-900 dark:text-white outline-none transition-all focus:border-[#0077b3] focus:bg-white dark:focus:border-[#00d4ff] dark:focus:bg-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-600 placeholder:font-normal"
                              id="ct-name"
                              type="text"
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
                              className="block w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-none px-3 py-3 font-mono text-[13px] font-semibold text-gray-900 dark:text-white outline-none transition-all focus:border-[#0077b3] focus:bg-white dark:focus:border-[#00d4ff] dark:focus:bg-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-600 placeholder:font-normal"
                              id="ct-email"
                              type="email"
                              required
                              placeholder="you@company.com"
                              value={form.email}
                              onChange={upd("email")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 02 — Reason */}
                    {/* Fixed stack order. Needs to be higher than z-10 so the dropdown covers the next section */}
                    <div className="relative z-30">
                      <div
                        className="font-['Bebas_Neue',sans-serif] text-[96px] leading-none absolute -top-6 -left-1.5 pointer-events-none select-none z-0 text-gray-900 dark:text-white opacity-[0.04]"
                        aria-hidden
                      >
                        02
                      </div>
                      <div className="relative z-10">
                        <div className="text-[9px] tracking-[0.25em] uppercase text-gray-600 dark:text-gray-400 mb-5 font-bold">
                          Reason for contact *
                        </div>
                        <div ref={reasonRef} className="relative">
                          {/* Hidden input to hijack native form validation for the custom dropdown */}
                          <input
                            type="text"
                            tabIndex={-1}
                            value={form.reason}
                            required
                            className="absolute opacity-0 w-0 h-0 pointer-events-none"
                            onChange={() => {}}
                            onInvalid={(e) =>
                              (e.target as HTMLInputElement).setCustomValidity(
                                "Please select a reason",
                              )
                            }
                            onInput={(e) =>
                              (e.target as HTMLInputElement).setCustomValidity(
                                "",
                              )
                            }
                          />
                          <button
                            type="button"
                            onClick={() => setReasonOpen((p) => !p)}
                            className={`flex items-center justify-between w-full bg-gray-50 dark:bg-gray-800 border px-3 py-3 font-mono text-[13px] font-semibold text-left transition-all ${
                              reasonOpen
                                ? "border-[#0077b3] bg-white dark:border-[#00d4ff] dark:bg-gray-900"
                                : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                            } ${!selectedReason ? "text-gray-400 dark:text-gray-600" : "text-gray-900 dark:text-white"}`}
                          >
                            <span>
                              {selectedReason
                                ? selectedReason.label
                                : "Select a reason…"}
                            </span>
                            <ChevronDown
                              size={14}
                              className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${reasonOpen ? "rotate-180" : ""}`}
                            />
                          </button>

                          <AnimatePresence>
                            {reasonOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.16 }}
                                className="absolute left-0 right-0 top-[105%] z-[99] mt-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl dark:shadow-2xl overflow-hidden max-h-[220px] overflow-y-auto"
                              >
                                {REASONS.map((r) => (
                                  <button
                                    key={r.value}
                                    type="button"
                                    onClick={() => selectReason(r.value)}
                                    className={`block w-full text-left px-4 py-3 font-mono text-[12px] font-semibold tracking-[0.04em] transition-all ${
                                      form.reason === r.value
                                        ? "bg-[#0077b3] dark:bg-[#00d4ff] text-white dark:text-[#0b1220]"
                                        : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#0077b3] dark:hover:text-[#00d4ff]"
                                    }`}
                                  >
                                    {r.label}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* 03 — Message */}
                    <div className="relative z-10">
                      <div
                        className="font-['Bebas_Neue',sans-serif] text-[96px] leading-none absolute -top-6 -left-1.5 pointer-events-none select-none z-0 text-gray-900 dark:text-white opacity-[0.04]"
                        aria-hidden
                      >
                        03
                      </div>
                      <div className="relative z-10">
                        <div className="text-[9px] tracking-[0.25em] uppercase text-gray-600 dark:text-gray-400 mb-5 font-bold">
                          Message *
                        </div>
                        <label
                          className="text-[10px] tracking-[0.15em] uppercase text-gray-700 dark:text-gray-300 block mb-2.5 font-bold"
                          htmlFor="ct-msg"
                        >
                          Describe your request
                        </label>
                        <textarea
                          className="block w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-none px-3 py-3 font-mono text-[13px] font-semibold text-gray-900 dark:text-white outline-none transition-all focus:border-[#0077b3] focus:bg-white dark:focus:border-[#00d4ff] dark:focus:bg-gray-900 resize-none leading-loose placeholder:text-gray-400 dark:placeholder:text-gray-600 placeholder:font-normal"
                          id="ct-msg"
                          rows={4}
                          required
                          placeholder="Describe your idea, project, or context…"
                          value={form.message}
                          onChange={upd("message")}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className={`w-full p-[22px] font-mono text-[13px] font-bold tracking-[0.14em] uppercase flex items-center justify-center gap-3 border-none transition-all duration-300 ${
                      status === "sending"
                        ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-[#0077b3] text-white dark:bg-[#00d4ff] dark:text-[#0b1220] cursor-pointer hover:tracking-[0.22em] hover:bg-[#005f8f] dark:hover:bg-[#33ddff]"
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
                        SEND MESSAGE
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>

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
      </div>
    </section>
  );
}
