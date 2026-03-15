"use client";

/**
 * Contact.tsx
 * Theme is 100% CSS custom-property driven.
 *
 * The core fix: instead of computing tokens in JS as
 *   const accent = isDark ? "#38bdf8" : "#0284c7"
 * and writing style={{ color: accent }}, we define CSS vars:
 *   .contact-root { --ct-accent: #0284c7 }
 *   .dark .contact-root { --ct-accent: #38bdf8 }
 * and write style={{ color: "var(--ct-accent)" }}.
 *
 * The inline style VALUE is now the literal string "var(--ct-accent)"
 * on BOTH server and client — identical, no hydration mismatch.
 * The browser resolves the var at paint time, reading .dark from <html>.
 *
 * isDark is completely removed from this file.
 * The only state that changes before/after mount is `mounted` which
 * gates the LazyBackgroundEffect (correct) — nothing else.
 */

import React, { useEffect, useRef, useState } from "react";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { SiGithub } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
  cubicBezier,
} from "framer-motion";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowUpRight,
  Sparkles,
  Code2,
  Globe,
  ShoppingCart,
  Wrench,
  Zap,
  Clock,
  Layers,
  ShieldCheck,
  Check,
  ChevronsUpDown,
  DollarSign,
  CalendarClock,
  User,
  AtSign,
  MessageSquare,
} from "lucide-react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});
const dmSans = DM_Sans({ subsets: ["latin"] });

const CONTACT_EMAIL = "wahbamir2010@gmail.com";
const CLIENT_PORTAL = "https://dashboard.wahb.space";
const CLIENT_QUOTE = `${CLIENT_PORTAL}#request-quote`;

const SERVICES = [
  {
    value: "Full-Stack Web Application",
    label: "Full-Stack Web App",
    icon: Globe,
  },
  { value: "Backend Development", label: "Backend & APIs", icon: Code2 },
  { value: "SEO Optimization", label: "SEO & Performance", icon: Sparkles },
  { value: "E-commerce Store", label: "E-commerce Store", icon: ShoppingCart },
  { value: "Custom Web Solution", label: "Custom Solution", icon: Wrench },
];

const BUDGET_OPTIONS = [
  { value: "under-1k", label: "Under $1,000" },
  { value: "1k-3k", label: "$1,000 – $3,000" },
  { value: "3k-8k", label: "$3,000 – $8,000" },
  { value: "8k-plus", label: "$8,000+" },
  { value: "not-sure", label: "Not sure yet" },
];

const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP" },
  { value: "1-month", label: "Within 1 month" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "flexible", label: "Flexible" },
];

const TRUST_ITEMS = [
  { icon: Zap, text: "Reply within 24 hours" },
  { icon: Clock, text: "MVPs shipped in weeks, not months" },
  { icon: Layers, text: "Full ownership from design to deploy" },
  { icon: ShieldCheck, text: "Clean code, tested & maintainable" },
];

/* ─── CSS-var-aware Custom Select ─────────────────────────────── */
interface SelectOption {
  value: string;
  label: string;
}

const CustomSelect: React.FC<{
  id: string;
  value: string;
  options: SelectOption[];
  onChange: (val: string) => void;
  icon: React.ReactNode;
}> = ({ id, value, options, onChange, icon }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="ct-select-root relative" id={id}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`ct-select-btn w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${open ? "ct-select-btn--open" : ""}`}
      >
        <span className="ct-accent-text" style={{ flexShrink: 0 }}>
          {icon}
        </span>
        <span className="flex-1 text-left truncate ct-text-primary">
          {selected?.label ?? "Select…"}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ct-muted-text"
          style={{ flexShrink: 0 }}
        >
          <ChevronsUpDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="ct-dropdown absolute z-50 left-0 right-0 mt-1.5 rounded-xl border overflow-hidden py-1 shadow-xl"
            style={{ transformOrigin: "top" }}
          >
            {options.map((opt) => {
              const isActive = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`ct-dropdown-item w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-100 ${isActive ? "ct-dropdown-item--active" : ""}`}
                  >
                    <span className="font-medium">{opt.label}</span>
                    {isActive && (
                      <Check className="w-3.5 h-3.5 ct-accent-text" />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Icon Input ──────────────────────────────────────────────── */
const IconInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }
> = ({ icon, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={`ct-field flex items-center gap-3 w-full px-4 py-3 rounded-xl border transition-all duration-200 ${focused ? "ct-field--focused" : ""}`}
    >
      <span
        className={focused ? "ct-accent-text" : "ct-muted-text"}
        style={{ flexShrink: 0 }}
      >
        {icon}
      </span>
      <input
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400 ct-text-primary"
      />
    </div>
  );
};

/* ─── Icon Textarea ───────────────────────────────────────────── */
const IconTextarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { icon: React.ReactNode }
> = ({ icon, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={`ct-field flex gap-3 w-full px-4 py-3 rounded-xl border transition-all duration-200 ${focused ? "ct-field--focused" : ""}`}
    >
      <span
        className={`mt-0.5 ${focused ? "ct-accent-text" : "ct-muted-text"}`}
        style={{ flexShrink: 0 }}
      >
        {icon}
      </span>
      <textarea
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        className="flex-1 bg-transparent text-sm outline-none resize-none placeholder:text-slate-500 dark:placeholder:text-slate-400 ct-text-primary"
      />
    </div>
  );
};

/* ─── Main component ──────────────────────────────────────────── */
export default function Contact() {
  const reduceMotion = useReducedMotion();

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [copied, setCopied] = useState(false);
  const [selectedService, setSelectedService] = useState(
    "Full-Stack Web Application",
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    budget: "not-sure",
    timeline: "flexible",
  });

  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, interest: selectedService }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
      setStatus("sent");
      setFormData({
        name: "",
        email: "",
        message: "",
        budget: "not-sure",
        timeline: "flexible",
      });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  const ease = cubicBezier(0.22, 1, 0.36, 1);
  const fadeUp = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 32 },
          animate: inView ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.65, delay, ease },
        };

  const isSubmitting = status === "sending";
  const isSent = status === "sent";

  return (
    <section
      ref={ref}
      className={`contact-root ${dmSans.className} relative min-h-screen flex flex-col items-center justify-center overflow-hidden
        bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
        dark:from-[#00bfff18] dark:to-[#0078aa2e]
        text-black dark:text-white`}
      id="contact"
    >
      {/* ── CSS custom properties: all theme tokens in one place ── */}
      <style>{`
        /* ─── Light tokens ─────────────────────────────────────── */
        .contact-root {
          --ct-accent:        #0284c7;
          --ct-accent-muted:  rgba(2,132,199,0.1);
          --ct-text-primary:  #0f172a;
          --ct-text-muted:    #475569;
          --ct-card-bg:       rgba(255,255,255,0.85);
          --ct-card-border:   rgba(0,0,0,0.1);
          --ct-field-bg:      rgba(255,255,255,0.7);
          --ct-field-border:  rgba(0,0,0,0.15);
          --ct-field-focus-ring: rgba(2,132,199,0.15);
          --ct-select-bg:     rgba(255,255,255,0.95);
          --ct-dropdown-bg:   #ffffff;
          --ct-hover-bg:      rgba(14,165,233,0.1);
          --ct-glow-1-opacity: 0.18;
          --ct-glow-2-opacity: 0.14;
          --ct-shimmer-line:  "linear-gradient(90deg, transparent 0%, #024f80 30%, #0369a1 70%, transparent 100%)";
        }

        /* ─── Dark tokens ──────────────────────────────────────── */
        .dark .contact-root,
        :is(.dark) .contact-root {
          --ct-accent:        #38bdf8;
          --ct-accent-muted:  rgba(56,189,248,0.15);
          --ct-text-primary:  #f8fafc;
          --ct-text-muted:    #cbd5e1;
          --ct-card-bg:       rgba(15,23,42,0.75);
          --ct-card-border:   rgba(255,255,255,0.15);
          --ct-field-bg:      rgba(255,255,255,0.08);
          --ct-field-border:  rgba(255,255,255,0.15);
          --ct-field-focus-ring: rgba(56,189,248,0.25);
          --ct-select-bg:     rgba(15,23,42,0.85);
          --ct-dropdown-bg:   #0f172a;
          --ct-hover-bg:      rgba(56,189,248,0.15);
          --ct-glow-1-opacity: 0.06;
          --ct-glow-2-opacity: 0.05;
        }

        /* ─── Utility classes (all var-driven) ─────────────────── */
        .ct-accent-text   { color: var(--ct-accent); }
        .ct-text-primary  { color: var(--ct-text-primary); }
        .ct-muted-text    { color: var(--ct-text-muted); }

        /* ─── Glow blobs ───────────────────────────────────────── */
        .ct-glow-1 {
          top: -5%; left: -8%;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(14,165,233,var(--ct-glow-1-opacity)) 0%, transparent 70%);
          filter: blur(55px);
        }
        .ct-glow-2 {
          bottom: -10%; right: -5%;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(14,165,233,var(--ct-glow-2-opacity)) 0%, transparent 70%);
          filter: blur(55px);
        }

        /* ─── Card ─────────────────────────────────────────────── */
        .ct-card {
          background:     var(--ct-card-bg);
          border-color:   var(--ct-card-border);
          backdrop-filter: blur(16px);
        }
        .ct-form-card {
          background:     var(--ct-card-bg);
          border-color:   var(--ct-card-border);
          backdrop-filter: blur(20px);
        }
        .dark .ct-form-card,
        :is(.dark) .ct-form-card {
          box-shadow: 0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .ct-form-card {
          box-shadow: 0 20px 60px rgba(14,165,233,0.12), inset 0 1px 0 rgba(255,255,255,0.95);
        }

        /* ─── Field (input/textarea wrapper) ───────────────────── */
        .ct-field {
          background:   var(--ct-field-bg);
          border-color: var(--ct-field-border);
          box-shadow:   none;
        }
        .ct-field--focused {
          border-color: var(--ct-accent);
          box-shadow:   0 0 0 3px var(--ct-field-focus-ring);
        }

        /* ─── Select ───────────────────────────────────────────── */
        .ct-select-btn {
          background:   var(--ct-select-bg);
          border-color: var(--ct-field-border);
          color:        var(--ct-text-primary);
          box-shadow:   none;
        }
        .ct-select-btn--open {
          border-color: var(--ct-accent);
          box-shadow:   0 0 0 3px var(--ct-field-focus-ring);
        }
        .ct-dropdown {
          background:   var(--ct-dropdown-bg);
          border-color: var(--ct-field-border);
        }
        .ct-dropdown-item {
          background: transparent;
          color:      var(--ct-text-primary);
        }
        .ct-dropdown-item:hover,
        .ct-dropdown-item--active {
          background: var(--ct-hover-bg);
          color:      var(--ct-accent);
        }

        /* ─── Service buttons ──────────────────────────────────── */
        .ct-service-btn {
          border-color: var(--ct-card-border);
          background:   transparent;
          color:        var(--ct-text-muted);
        }
        .ct-service-btn--active {
          border-color: color-mix(in srgb, var(--ct-accent) 50%, transparent);
          background:   var(--ct-accent-muted);
          color:        var(--ct-accent);
        }
        .ct-service-icon {
          background: var(--ct-card-border);
        }
        .ct-service-icon--active {
          background: var(--ct-accent-muted);
        }

        /* ─── Trust strip ──────────────────────────────────────── */
        .ct-trust-icon {
          background:   var(--ct-accent-muted);
          border: 1px solid color-mix(in srgb, var(--ct-accent) 20%, transparent);
        }

        /* ─── Email copy chip ──────────────────────────────────── */
        .ct-email-chip {
          border-color:    color-mix(in srgb, var(--ct-accent) 30%, transparent);
          background:      color-mix(in srgb, var(--ct-accent) 10%, transparent);
          color:           var(--ct-accent);
          backdrop-filter: blur(8px);
        }
        .ct-copy-pill {
          background: rgba(0,0,0,0.06);
          color:      var(--ct-text-muted);
        }
        .dark .ct-copy-pill,
        :is(.dark) .ct-copy-pill {
          background: rgba(255,255,255,0.1);
          color:      var(--ct-text-muted);
        }
        .ct-copy-pill--copied {
          background: rgba(22,163,74,0.12);
          color: #15803d;
        }
        .dark .ct-copy-pill--copied,
        :is(.dark) .ct-copy-pill--copied {
          background: rgba(34,197,94,0.2);
          color: #86efac;
        }

        /* ─── GitHub link ──────────────────────────────────────── */
        .ct-gh-link {
          border-color:    var(--ct-card-border);
          background:      rgba(0,0,0,0.05);
          color:           var(--ct-text-muted);
          backdrop-filter: blur(8px);
        }
        .dark .ct-gh-link,
        :is(.dark) .ct-gh-link {
          background: rgba(255,255,255,0.08);
        }

        /* ─── Scroll buttons ────────────────────────────────────  */
        .ct-scroll-btn {
          border-color:    var(--ct-card-border);
          background:      rgba(0,0,0,0.05);
          color:           var(--ct-accent);
          backdrop-filter: blur(8px);
        }
        .dark .ct-scroll-btn,
        :is(.dark) .ct-scroll-btn {
          background: rgba(255,255,255,0.08);
        }

        /* ─── Availability badge ───────────────────────────────── */
        .ct-avail-badge {
          color:        var(--ct-accent);
          border-color: var(--ct-accent-muted);
          background:   var(--ct-accent-muted);
        }
        .ct-avail-dot {
          background: var(--ct-accent);
          box-shadow: 0 0 5px var(--ct-accent);
        }

        /* ─── Service pill (active indicator) ──────────────────── */
        .ct-service-pill {
          background:   var(--ct-accent-muted);
          color:        var(--ct-accent);
          border: 1px solid color-mix(in srgb, var(--ct-accent) 25%, transparent);
        }

        /* ─── Submit button disabled state ─────────────────────── */
        .ct-submit-disabled {
          background: rgba(0,0,0,0.08);
          color:      var(--ct-text-muted);
        }
        .dark .ct-submit-disabled,
        :is(.dark) .ct-submit-disabled {
          background: rgba(255,255,255,0.1);
        }
      `}</style>

      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }}
      />

      {/* Ambient glows — opacity from CSS vars, no isDark branching */}
      <div
        className="ct-glow-1 pointer-events-none absolute rounded-full"
        aria-hidden
      />
      <div
        className="ct-glow-2 pointer-events-none absolute rounded-full"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* ══ HEADING ══ */}
        <div className="mb-14 md:mb-20">
          <motion.div {...fadeUp(0)}>
            <span className="ct-avail-badge mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] px-3.5 py-1.5 rounded-full border">
              <span className="ct-avail-dot w-1.5 h-1.5 rounded-full animate-pulse" />
              Available for new projects
            </span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.09)}
            className={`${playfair.className} font-black leading-[0.9] tracking-tight mt-3`}
            style={{ fontSize: "clamp(2.9rem, 8.5vw, 7rem)" }}
          >
            <span className="ct-text-primary block">Got an idea?</span>
            <span
              style={{
                display: "block",
                background:
                  "linear-gradient(105deg, #0ea5e9 0%, #38bdf8 48%, #7dd3fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontStyle: "italic",
              }}
            >
              Let&apos;s ship it.
            </span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.18)}
            className="ct-muted-text mt-5 max-w-lg text-base md:text-lg leading-relaxed"
          >
            I&apos;m Wahb — a full-stack developer who turns rough ideas into
            production-ready products. Tell me what you&apos;re building.
          </motion.p>

          {/* Action row */}
          <motion.div
            {...fadeUp(0.26)}
            className="mt-8 flex items-center gap-3 flex-wrap"
          >
            {/* Email copy chip */}
            <button
              type="button"
              onClick={copyEmail}
              aria-label={`Copy email ${CONTACT_EMAIL}`}
              className="ct-email-chip group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 hover:scale-[1.02]"
            >
              <MdEmail className="w-4 h-4" />
              <span className="hidden sm:inline">{CONTACT_EMAIL}</span>
              <span className="sm:hidden">Email me</span>

              <AnimatePresence mode="wait">
                <motion.span
                  key={copied ? "c" : "u"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.14 }}
                  className={`text-xs px-2 py-0.5 rounded-md ${copied ? "ct-copy-pill--copied" : "ct-copy-pill"}`}
                  role="status"
                  aria-live="polite"
                >
                  {copied ? "Copied ✓" : "Copy"}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* GitHub */}
            <a
              href="https://github.com/wahb-amir"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="ct-gh-link inline-flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 hover:scale-105"
            >
              <SiGithub className="w-4 h-4" />
            </a>

            {/* CTA */}
            <a
              href={CLIENT_QUOTE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-[1.03] hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                color: "#fff",
                boxShadow: "0 6px 22px rgba(14,165,233,0.4)",
              }}
            >
              Request a quote
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* ══ GRID ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* ── LEFT ── */}
          <motion.div
            {...fadeUp(0.2)}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* Service picker */}
            <div className="ct-card rounded-2xl border p-5">
              <p className="ct-text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                What do you need?
              </p>
              <div className="flex flex-col gap-2">
                {SERVICES.map(({ value, label, icon: Icon }, i) => {
                  const active = selectedService === value;
                  return (
                    <motion.button
                      key={value}
                      type="button"
                      onClick={() => setSelectedService(value)}
                      initial={reduceMotion ? {} : { opacity: 0, x: -14 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        duration: 0.4,
                        delay: 0.24 + i * 0.06,
                        ease,
                      }}
                      whileHover={{ x: 4 }}
                      className={`ct-service-btn ${active ? "ct-service-btn--active" : ""} flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium border transition-colors duration-150`}
                    >
                      <span
                        className={`${active ? "ct-service-icon--active" : "ct-service-icon"} w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 ${active ? "ct-accent-text" : "ct-muted-text"}`}
                        />
                      </span>
                      <span className="flex-1">{label}</span>
                      {active && (
                        <motion.span
                          layoutId="service-tick"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ct-accent-text"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Trust strip */}
            <div className="ct-card rounded-2xl border p-5">
              <p className="ct-text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                Working with me
              </p>
              <div className="space-y-3">
                {TRUST_ITEMS.map(({ icon: TIcon, text }, i) => (
                  <motion.div
                    key={text}
                    initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.32 + i * 0.07, ease }}
                    className="flex items-center gap-3"
                  >
                    <span className="ct-trust-icon w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TIcon className="w-4 h-4 ct-accent-text" />
                    </span>
                    <span className="ct-muted-text text-sm font-medium">
                      {text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: FORM ── */}
          <motion.div {...fadeUp(0.3)} className="lg:col-span-3">
            <div className="ct-form-card rounded-2xl border relative overflow-hidden">
              {/* Top shimmer — fixed colour, no isDark branching */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, #0ea5e9 40%, #38bdf8 60%, transparent 100%)",
                  opacity: 0.85,
                }}
              />

              <AnimatePresence mode="wait">
                {!isSent ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="p-7 md:p-9 space-y-6"
                    aria-busy={isSubmitting}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <h3
                        className={`${playfair.className} ct-text-primary text-2xl md:text-3xl font-bold leading-snug`}
                      >
                        Tell me about your project
                        <span style={{ color: "#0ea5e9" }}>.</span>
                      </h3>
                      <p className="ct-muted-text mt-1.5 text-sm">
                        All fields optional except name &amp; email.
                      </p>
                    </div>

                    {/* Name */}
                    <div className="space-y-1.5">
                      <label
                        className="ct-text-primary text-[10px] font-bold uppercase tracking-[0.18em]"
                        htmlFor="name"
                      >
                        Your name
                      </label>
                      <IconInput
                        id="name"
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Alex Johnson"
                        value={formData.name}
                        onChange={handleChange}
                        icon={<User className="w-4 h-4" />}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label
                        className="ct-text-primary text-[10px] font-bold uppercase tracking-[0.18em]"
                        htmlFor="email"
                      >
                        Your email
                      </label>
                      <IconInput
                        id="email"
                        type="email"
                        name="email"
                        required
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        icon={<AtSign className="w-4 h-4" />}
                      />
                    </div>

                    {/* Budget + Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          className="ct-text-primary text-[10px] font-bold uppercase tracking-[0.18em]"
                          htmlFor="budget"
                        >
                          Budget
                        </label>
                        <CustomSelect
                          id="budget"
                          value={formData.budget}
                          options={BUDGET_OPTIONS}
                          onChange={(val) =>
                            setFormData((p) => ({ ...p, budget: val }))
                          }
                          icon={<DollarSign className="w-4 h-4" />}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          className="ct-text-primary text-[10px] font-bold uppercase tracking-[0.18em]"
                          htmlFor="timeline"
                        >
                          Timeline
                        </label>
                        <CustomSelect
                          id="timeline"
                          value={formData.timeline}
                          options={TIMELINE_OPTIONS}
                          onChange={(val) =>
                            setFormData((p) => ({ ...p, timeline: val }))
                          }
                          icon={<CalendarClock className="w-4 h-4" />}
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label
                        className="ct-text-primary text-[10px] font-bold uppercase tracking-[0.18em]"
                        htmlFor="message"
                      >
                        Project details{" "}
                        <span
                          className="ct-muted-text"
                          style={{ textTransform: "none", letterSpacing: 0 }}
                        >
                          (optional)
                        </span>
                      </label>
                      <IconTextarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="What are you building? Any tech preferences? What's the main goal?"
                        value={formData.message}
                        onChange={handleChange}
                        icon={<MessageSquare className="w-4 h-4" />}
                      />
                    </div>

                    {/* Active service pill */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="ct-muted-text text-xs font-medium">
                        Service:
                      </span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={selectedService}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={{ duration: 0.2 }}
                          className="ct-service-pill inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                        >
                          {React.createElement(
                            SERVICES.find((s) => s.value === selectedService)
                              ?.icon ?? Globe,
                            { className: "w-3 h-3" },
                          )}
                          {SERVICES.find((s) => s.value === selectedService)
                            ?.label ?? selectedService}
                        </motion.span>
                      </AnimatePresence>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`group relative w-full py-4 rounded-xl font-bold text-sm overflow-hidden transition-all duration-300 hover:scale-[1.015] active:scale-[0.99] ${isSubmitting ? "ct-submit-disabled" : ""}`}
                      style={
                        isSubmitting
                          ? {}
                          : {
                              background:
                                "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                              color: "#fff",
                              boxShadow: "0 8px 28px rgba(14,165,233,0.38)",
                            }
                      }
                    >
                      {!isSubmitting && (
                        <span
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background:
                              "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
                          }}
                        />
                      )}
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <motion.span
                              className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 0.75,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </>
                        )}
                      </span>
                    </button>

                    <AnimatePresence>
                      {status === "error" && (
                        <motion.p
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-center text-sm font-medium"
                          style={{ color: "#f87171" }}
                        >
                          Something went wrong. Try emailing me directly.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="p-9 flex flex-col items-center justify-center gap-5 text-center min-h-[360px]"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 16,
                        delay: 0.12,
                      }}
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: "rgba(34,197,94,0.15)",
                        border: "1px solid rgba(34,197,94,0.3)",
                        boxShadow: "0 0 32px rgba(34,197,94,0.15)",
                      }}
                    >
                      <Check className="w-7 h-7" style={{ color: "#4ade80" }} />
                    </motion.div>

                    <div>
                      <h3
                        className={`${playfair.className} ct-text-primary text-2xl font-bold mb-2`}
                      >
                        Message sent!
                      </h3>
                      <p className="ct-muted-text">
                        Thanks{formData.name ? `, ${formData.name}` : ""}.
                        I&apos;ll reply within 24 hours.
                      </p>
                    </div>

                    <button
                      onClick={() => setStatus("idle")}
                      className="ct-accent-text text-sm underline underline-offset-2 font-medium"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Scroll nav */}
        <div className="flex justify-center gap-4 mt-16">
          {[
            { id: "about", Icon: ChevronUpIcon, label: "Scroll Up", extra: "" },
            {
              id: "faq",
              Icon: ChevronDownIcon,
              label: "Scroll Down",
              extra: "animate-bounce",
            },
          ].map(({ id, Icon, label, extra }) => (
            <button
              key={id}
              onClick={() =>
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              aria-label={label}
              className={`ct-scroll-btn hover:scale-110 transition-transform p-2.5 rounded-full border ${extra}`}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
