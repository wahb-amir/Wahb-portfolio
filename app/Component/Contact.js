"use client";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useTheme } from "next-themes";

const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
  ssr: false,
  loading: () => null,
});

export default function ContactForm() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState("idle");
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section
      id="contact"
      ref={ref}
      className="relative w-full h-fit pb-12 py-16 px-6 flex flex-col items-center justify-center overflow-hidden text-gray-900 dark:text-gray-100"
      aria-labelledby="contact-heading"
      style={{
        backgroundImage: isDark
          ? "radial-gradient(circle at top left, #00b1ff33, transparent 70%), radial-gradient(circle at bottom right, #00dfd033, transparent 70%)"
          : "radial-gradient(circle at top left, #7f5af022, transparent 70%), radial-gradient(circle at bottom right, #00dfd822, transparent 70%)",
        backgroundColor: isDark ? "#0f172a" : "#f9fafb",
      }}
    >
      <LazyBackgroundEffect />

      <motion.h2
        id="contact-heading"
        className="text-3xl font-semibold mb-6 text-center"
        initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Contact
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-xl space-y-5 z-10"
        initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 dark:placeholder-gray-400 transition"
        />
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 dark:placeholder-gray-400 transition"
        />
        <textarea
          id="message"
          name="message"
          rows={6}
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 dark:placeholder-gray-400 transition"
        />

        {/* Button with smooth status transitions */}
        <div className="relative h-14 overflow-hidden rounded-full">
          <button
            type="submit"
            disabled={status === "sending"}
            className={`w-full h-full py-3 rounded-full font-medium tracking-wide transition
              ${
                status === "sending"
                  ? "bg-gray-200 dark:bg-gray-800 cursor-not-allowed text-gray-900 dark:text-gray-100"
                  : "bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white"
              }
              focus:outline-none focus:ring-2 focus:ring-cyan-500 relative`}
          >
            <AnimatePresence mode="wait">
              {status === "sending" && (
                <motion.span
                  key="sending"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10"
                >
                  Sending...
                </motion.span>
              )}
              {status === "error" && (
                <motion.span
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 text-red-600"
                >
                  Error sending message
                </motion.span>
              )}
              {status === "sent" && (
                <motion.span
                  key="sent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 text-green-800 dark:text-green-400"
                >
                  ✅ Sent!
                </motion.span>
              )}
              {status === "idle" && (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10"
                >
                  Send message
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Optional subtle shimmer during sending */}
          {!reduceMotion && status === "sending" && (
            <motion.div
              className="absolute inset-0 bg-white/10"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "linear" }}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Success Confirmation */}
        {!reduceMotion && status === "sent" && (
          <motion.p
            className="mt-2 text-center text-green-600 dark:text-green-400"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            role="status"
          >
            Thanks — I’ll get back to you soon!
          </motion.p>
        )}
      </motion.form>
    </section>
  );
}
