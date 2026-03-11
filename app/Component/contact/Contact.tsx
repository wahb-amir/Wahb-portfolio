"use client";
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
import { useTheme } from "next-themes";
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
const CLIENT_QUOTE  = `${CLIENT_PORTAL}#request-quote`;

const SERVICES = [
  { value: "Full-Stack Web Application", label: "Full-Stack Web App", icon: Globe       },
  { value: "Backend Development",        label: "Backend & APIs",     icon: Code2       },
  { value: "SEO Optimization",           label: "SEO & Performance",  icon: Sparkles    },
  { value: "E-commerce Store",           label: "E-commerce Store",   icon: ShoppingCart },
  { value: "Custom Web Solution",        label: "Custom Solution",    icon: Wrench      },
];

const BUDGET_OPTIONS = [
  { value: "under-1k", label: "Under $1,000"    },
  { value: "1k-3k",    label: "$1,000 – $3,000"  },
  { value: "3k-8k",    label: "$3,000 – $8,000"  },
  { value: "8k-plus",  label: "$8,000+"           },
  { value: "not-sure", label: "Not sure yet"      },
];

const TIMELINE_OPTIONS = [
  { value: "asap",       label: "ASAP"           },
  { value: "1-month",    label: "Within 1 month" },
  { value: "1-3-months", label: "1–3 months"     },
  { value: "flexible",   label: "Flexible"       },
];

const TRUST_ITEMS = [
  { icon: Zap,          text: "Reply within 24 hours"               },
  { icon: Clock,        text: "MVPs shipped in weeks, not months"    },
  { icon: Layers,       text: "Full ownership from design to deploy" },
  { icon: ShieldCheck,  text: "Clean code, tested & maintainable"   },
];

/* ─────────────────── Custom Select ─────────────────────────── */
interface SelectOption { value: string; label: string }
interface CustomSelectProps {
  id: string;
  value: string;
  options: SelectOption[];
  onChange: (val: string) => void;
  icon: React.ReactNode;
  isDark: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id, value, options, onChange, icon, isDark,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected   = options.find((o) => o.value === value);
  const accent     = isDark ? "#38bdf8"            : "#0284c7";
  const border     = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
  const bg         = isDark ? "rgba(15,23,42,0.85)"   : "rgba(255,255,255,0.95)";
  const dropBg     = isDark ? "#0f172a"               : "#ffffff";
  const textCol    = isDark ? "#f8fafc"               : "#0f172a";
  const mutedCol   = isDark ? "#94a3b8"               : "#64748b";
  const hoverBg    = isDark ? "rgba(56,189,248,0.15)" : "rgba(14,165,233,0.1)";

  return (
    <div ref={ref} className="relative" id={id}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium border transition-all duration-200"
        style={{
          background: bg,
          borderColor: open ? accent : border,
          color: textCol,
          boxShadow: open
            ? `0 0 0 3px ${isDark ? "rgba(56,189,248,0.25)" : "rgba(2,132,199,0.15)"}`
            : "none",
        }}
      >
        <span style={{ color: accent, flexShrink: 0 }}>{icon}</span>
        <span className="flex-1 text-left truncate">{selected?.label ?? "Select…"}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: mutedCol, flexShrink: 0 }}
        >
          <ChevronsUpDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0,  scaleY: 1    }}
            exit={{    opacity: 0, y: -4,  scaleY: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ transformOrigin: "top", background: dropBg, borderColor: border }}
            className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl border overflow-hidden py-1 shadow-xl"
            
          >
            {options.map((opt) => {
              const isActive = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-100"
                    style={{
                      background: isActive ? hoverBg : "transparent",
                      color: isActive ? accent : textCol,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = isActive
                        ? hoverBg : "transparent";
                    }}
                  >
                    <span className="font-medium">{opt.label}</span>
                    {isActive && <Check className="w-3.5 h-3.5" style={{ color: accent }} />}
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

/* ─────────────────── Icon Input ─────────────────────────────── */
interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  isDark: boolean;
}
const IconInput: React.FC<IconInputProps> = ({ icon, isDark, ...props }) => {
  const [focused, setFocused] = useState(false);
  const accent = isDark ? "#38bdf8" : "#0284c7";
  return (
    <div
      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border transition-all duration-200"
      style={{
        background:   isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.7)",
        borderColor:  focused ? accent : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
        boxShadow:    focused
          ? `0 0 0 3px ${isDark ? "rgba(56,189,248,0.25)" : "rgba(2,132,199,0.15)"}`
          : "none",
      }}
    >
      <span style={{ color: focused ? accent : isDark ? "#94a3b8" : "#64748b", flexShrink: 0 }}>
        {icon}
      </span>
      <input
        {...props}
        onFocus={(e) => { setFocused(true);  props.onFocus?.(e); }}
        onBlur={(e)  => { setFocused(false); props.onBlur?.(e);  }}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400"
        style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
      />
    </div>
  );
};

/* ─────────────────── Icon Textarea ──────────────────────────── */
interface IconTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon: React.ReactNode;
  isDark: boolean;
}
const IconTextarea: React.FC<IconTextareaProps> = ({ icon, isDark, ...props }) => {
  const [focused, setFocused] = useState(false);
  const accent = isDark ? "#38bdf8" : "#0284c7";
  return (
    <div
      className="flex gap-3 w-full px-4 py-3 rounded-xl border transition-all duration-200"
      style={{
        background:  isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.7)",
        borderColor: focused ? accent : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
        boxShadow:   focused
          ? `0 0 0 3px ${isDark ? "rgba(56,189,248,0.25)" : "rgba(2,132,199,0.15)"}`
          : "none",
      }}
    >
      <span
        className="mt-0.5"
        style={{ color: focused ? accent : isDark ? "#94a3b8" : "#64748b", flexShrink: 0 }}
      >
        {icon}
      </span>
      <textarea
        {...props}
        onFocus={(e) => { setFocused(true);  props.onFocus?.(e); }}
        onBlur={(e)  => { setFocused(false); props.onBlur?.(e);  }}
        className="flex-1 bg-transparent text-sm outline-none resize-none placeholder:text-slate-500 dark:placeholder:text-slate-400"
        style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
      />
    </div>
  );
};

/* ─────────────────── Main Component ─────────────────────────── */
export default function Contact() {
  const { theme } = useTheme();
  const isDark    = theme === "dark";
  const reduceMotion = useReducedMotion();

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const [selectedService, setSelectedService] = useState("Full-Stack Web Application");
  const [formData, setFormData] = useState({
    name: "", email: "", message: "", budget: "not-sure", timeline: "flexible",
  });

  const ref    = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res  = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, interest: selectedService }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
      setStatus("sent");
      setFormData({ name: "", email: "", message: "", budget: "not-sure", timeline: "flexible" });
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
    reduceMotion ? {} : {
      initial:    { opacity: 0, y: 32 },
      animate:    inView ? { opacity: 1, y: 0 } : {},
      transition: { duration: 0.65, delay, ease },
    };

  const isSubmitting = status === "sending";
  const isSent       = status === "sent";

  /* Design tokens with improved contrast */
  const accent      = isDark ? "#38bdf8"                 : "#0284c7";
  const accentMuted = isDark ? "rgba(56,189,248,0.15)"   : "rgba(2,132,199,0.1)";
  const textPrimary = isDark ? "#f8fafc"                 : "#0f172a";
  const textMuted   = isDark ? "#cbd5e1"                 : "#475569";
  const cardBg      = isDark ? "rgba(15,23,42,0.75)"     : "rgba(255,255,255,0.85)";
  const cardBorder  = isDark ? "rgba(255,255,255,0.15)"  : "rgba(0,0,0,0.1)";

  return (
    <section
      ref={ref}
      className={`${dmSans.className} relative min-h-screen flex flex-col items-center justify-center overflow-hidden
        bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
        dark:from-[#00bfff18] dark:to-[#0078aa2e]
        text-black dark:text-white`}
      id="contact"
    >
      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }}
      />

      {/* Ambient glows */}
      {[
        { top: "-5%",  left: "-8%",  size: 700, opacity: isDark ? 0.06 : 0.18 },
        { bottom: "-10%", right: "-5%", size: 600, opacity: isDark ? 0.05 : 0.14 },
      ].map((g, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            ...g,
            width: g.size,
            height: g.size,
            background: `radial-gradient(circle, rgba(14,165,233,${g.opacity}) 0%, transparent 70%)`,
            filter: "blur(55px)",
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">

        {/* ══════════ HEADING ══════════ */}
        <div className="mb-14 md:mb-20">

          <motion.div {...fadeUp(0)}>
            <span
              className="mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] px-3.5 py-1.5 rounded-full border"
              style={{ color: accent, borderColor: accentMuted, background: accentMuted }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: accent, boxShadow: `0 0 5px ${accent}` }}
              />
              Available for new projects
            </span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.09)}
            className={`${playfair.className} font-black leading-[0.9] tracking-tight mt-3`}
            style={{ fontSize: "clamp(2.9rem, 8.5vw, 7rem)" }}
          >
            <span style={{ display: "block", color: textPrimary }}>Got an idea?</span>
            <span
              style={{
                display: "block",
                background: "linear-gradient(105deg, #0ea5e9 0%, #38bdf8 48%, #7dd3fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontStyle: "italic",
              }}
            >
              Let's ship it.
            </span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.18)}
            className="mt-5 max-w-lg text-base md:text-lg leading-relaxed"
            style={{ color: textMuted }}
          >
            I'm Wahb — a full-stack developer who turns rough ideas into
            production-ready products. Tell me what you're building.
          </motion.p>

          {/* Action row */}
          <motion.div {...fadeUp(0.26)} className="mt-8 flex items-center gap-3 flex-wrap">

            {/* Email copy chip */}
            <button
              type="button"
              onClick={copyEmail}
              aria-label={`Copy email ${CONTACT_EMAIL}`}
              className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 hover:scale-[1.02]"
              style={{
                borderColor: isDark ? "rgba(56,189,248,0.3)"  : "rgba(2,132,199,0.3)",
                background:  isDark ? "rgba(56,189,248,0.1)" : "rgba(2,132,199,0.1)",
                color:       isDark ? "#7dd3fc"               : "#0369a1",
                backdropFilter: "blur(8px)",
              }}
            >
              <MdEmail className="w-4 h-4" />
              <span className="hidden sm:inline">{CONTACT_EMAIL}</span>
              <span className="sm:hidden">Email me</span>

              <AnimatePresence mode="wait">
                <motion.span
                  key={copied ? "c" : "u"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1  }}
                  exit={{   opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.14 }}
                  className="text-xs px-2 py-0.5 rounded-md"
                  style={{
                    background: copied
                      ? isDark ? "rgba(34,197,94,0.2)"  : "rgba(22,163,74,0.12)"
                      : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
                    color: copied
                      ? isDark ? "#86efac" : "#15803d"
                      : isDark ? "#cbd5e1" : "#475569",
                  }}
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
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 hover:scale-105"
              style={{
                borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
                background:  isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                color:       isDark ? "#cbd5e1" : "#475569",
                backdropFilter: "blur(8px)",
              }}
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

        {/* ══════════ GRID ══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* ── LEFT ── */}
          <motion.div {...fadeUp(0.2)} className="lg:col-span-2 flex flex-col gap-5">

            {/* Service picker */}
            <div
              className="rounded-2xl border p-5"
              style={{ background: cardBg, borderColor: cardBorder, backdropFilter: "blur(16px)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: textPrimary }}>
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
                      transition={{ duration: 0.4, delay: 0.24 + i * 0.06, ease }}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium border transition-colors duration-150"
                      style={{
                        borderColor: active
                          ? isDark ? "rgba(56,189,248,0.5)" : "rgba(2,132,199,0.4)"
                          : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                        background: active
                          ? isDark ? "rgba(56,189,248,0.15)" : "rgba(14,165,233,0.1)"
                          : "transparent",
                        color: active
                          ? isDark ? "#7dd3fc" : "#0369a1"
                          : isDark ? "#94a3b8" : "#64748b",
                      }}
                    >
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150"
                        style={{
                          background: active
                            ? isDark ? "rgba(56,189,248,0.2)" : "rgba(14,165,233,0.15)"
                            : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                        }}
                      >
                        <Icon
                          className="w-3.5 h-3.5"
                          style={{ color: active ? accent : isDark ? "#94a3b8" : "#64748b" }}
                        />
                      </span>
                      <span className="flex-1">{label}</span>
                      {active && (
                        <motion.span
                          layoutId="service-tick"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{ color: accent }}
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
            <div
              className="rounded-2xl border p-5"
              style={{ background: cardBg, borderColor: cardBorder, backdropFilter: "blur(16px)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: textPrimary }}>
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
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: accentMuted,
                        border: `1px solid ${isDark ? "rgba(56,189,248,0.2)" : "rgba(2,132,199,0.2)"}`,
                      }}
                    >
                      <TIcon className="w-4 h-4" style={{ color: accent }} />
                    </span>
                    <span className="text-sm font-medium" style={{ color: textMuted }}>{text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: FORM ── */}
          <motion.div {...fadeUp(0.3)} className="lg:col-span-3">
            <div
              className="rounded-2xl border relative overflow-hidden"
              style={{
                background:    cardBg,
                borderColor:   cardBorder,
                backdropFilter: "blur(20px)",
                boxShadow: isDark
                  ? "0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)"
                  : "0 20px 60px rgba(14,165,233,0.12), inset 0 1px 0 rgba(255,255,255,0.95)",
              }}
            >
              {/* Top shimmer bar */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, #0ea5e9 40%, #38bdf8 60%, transparent 100%)",
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
                    {/* Form title */}
                    <div>
                      <h3
                        className={`${playfair.className} text-2xl md:text-3xl font-bold leading-snug`}
                        style={{ color: textPrimary }}
                      >
                        Tell me about your project
                        <span style={{ color: "#0ea5e9" }}>.</span>
                      </h3>
                      <p className="mt-1.5 text-sm" style={{ color: textMuted }}>
                        All fields optional except name & email.
                      </p>
                    </div>

                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: textPrimary }} htmlFor="name">
                        Your name
                      </label>
                      <IconInput
                        id="name" type="text" name="name" required
                        placeholder="e.g. Alex Johnson"
                        value={formData.name} onChange={handleChange}
                        isDark={isDark} icon={<User className="w-4 h-4" />}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: textPrimary }} htmlFor="email">
                        Your email
                      </label>
                      <IconInput
                        id="email" type="email" name="email" required
                        placeholder="you@company.com"
                        value={formData.email} onChange={handleChange}
                        isDark={isDark} icon={<AtSign className="w-4 h-4" />}
                      />
                    </div>

                    {/* Budget + Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: textPrimary }} htmlFor="budget">
                          Budget
                        </label>
                        <CustomSelect
                          id="budget" value={formData.budget}
                          options={BUDGET_OPTIONS}
                          onChange={(val) => setFormData((p) => ({ ...p, budget: val }))}
                          isDark={isDark} icon={<DollarSign className="w-4 h-4" />}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: textPrimary }} htmlFor="timeline">
                          Timeline
                        </label>
                        <CustomSelect
                          id="timeline" value={formData.timeline}
                          options={TIMELINE_OPTIONS}
                          onChange={(val) => setFormData((p) => ({ ...p, timeline: val }))}
                          isDark={isDark} icon={<CalendarClock className="w-4 h-4" />}
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: textPrimary }} htmlFor="message">
                        Project details{" "}
                        <span style={{ textTransform: "none", letterSpacing: 0, color: textMuted }}>
                          (optional)
                        </span>
                      </label>
                      <IconTextarea
                        id="message" name="message" rows={4}
                        placeholder="What are you building? Any tech preferences? What's the main goal?"
                        value={formData.message} onChange={handleChange}
                        isDark={isDark} icon={<MessageSquare className="w-4 h-4" />}
                      />
                    </div>

                    {/* Active service pill */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium" style={{ color: textMuted }}>
                        Service:
                      </span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={selectedService}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1   }}
                          exit={{   opacity: 0, scale: 0.85 }}
                          transition={{ duration: 0.2 }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                          style={{
                            background: accentMuted,
                            color: accent,
                            border: `1px solid ${isDark ? "rgba(56,189,248,0.25)" : "rgba(2,132,199,0.25)"}`,
                          }}
                        >
                          {React.createElement(
                            SERVICES.find((s) => s.value === selectedService)?.icon ?? Globe,
                            { className: "w-3 h-3" }
                          )}
                          {SERVICES.find((s) => s.value === selectedService)?.label ?? selectedService}
                        </motion.span>
                      </AnimatePresence>
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full py-4 rounded-xl font-bold text-sm overflow-hidden transition-all duration-300 hover:scale-[1.015] active:scale-[0.99]"
                      style={{
                        background: isSubmitting
                          ? isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"
                          : "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                        color: isSubmitting ? textMuted : "#fff",
                        boxShadow: isSubmitting ? "none" : "0 8px 28px rgba(14,165,233,0.38)",
                      }}
                    >
                      {!isSubmitting && (
                        <span
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)" }}
                        />
                      )}
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <motion.span
                              className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
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
                  /* ── Success ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1  }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="p-9 flex flex-col items-center justify-center gap-5 text-center min-h-[360px]"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.12 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: "rgba(34,197,94,0.15)",
                        border:     "1px solid rgba(34,197,94,0.3)",
                        boxShadow:  "0 0 32px rgba(34,197,94,0.15)",
                      }}
                    >
                      <Check className="w-7 h-7" style={{ color: "#4ade80" }} />
                    </motion.div>

                    <div>
                      <h3 className={`${playfair.className} text-2xl font-bold mb-2`} style={{ color: textPrimary }}>
                        Message sent!
                      </h3>
                      <p style={{ color: textMuted }}>
                        Thanks{formData.name ? `, ${formData.name}` : ""}. I'll reply within 24 hours.
                      </p>
                    </div>

                    <button
                      onClick={() => setStatus("idle")}
                      className="text-sm underline underline-offset-2 font-medium"
                      style={{ color: accent }}
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
            { id: "about", Icon: ChevronUpIcon,   label: "Scroll Up",   extra: "" },
            { id: "faq",   Icon: ChevronDownIcon, label: "Scroll Down", extra: "animate-bounce" },
          ].map(({ id, Icon, label, extra }) => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              aria-label={label}
              className={`hover:scale-110 transition-transform p-2.5 rounded-full border ${extra}`}
              style={{
                borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                background:  isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                color: accent,
                backdropFilter: "blur(8px)",
              }}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}