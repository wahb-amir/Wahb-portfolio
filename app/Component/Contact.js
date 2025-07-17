"use client";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, useReducedMotion } from "framer-motion";

const LazyBackgroundEffect = dynamic(() => import("./BackgroundEffect"), {
  ssr: false,
  loading: () => null,
});

export default function ContactForm() {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState("idle");
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

      if (!res.ok) throw new Error(data.error || "Something went wrong 😬");

      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      alert(error.message || "Failed to send message.");
      setStatus("idle");
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative w-full min-h-screen py-24 px-6 flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      aria-labelledby="contact-heading"
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
        {/* Name */}
        <div>
          <label htmlFor="name" className="sr-only">
            Full name
          </label>
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
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
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
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="sr-only">
            Your message
          </label>
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
        </div>

        {/* Submit */}
        <div className="relative">
          <button
            type="submit"
            disabled={status === "sending"}
            className={`w-full py-3 rounded-full font-medium tracking-wide transition
              ${
                status === "sending"
                  ? "bg-cyan-400 dark:bg-cyan-800 cursor-not-allowed text-gray-900 dark:text-gray-100"
                  : "bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white"
              }
              focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            aria-live="polite"
            aria-busy={status === "sending"}
          >
            {status === "sending"
              ? "Sending..."
              : status === "sent"
              ? "Message sent ✅"
              : "Send message"}
          </button>

          {/* Sending indicator */}
          {!reduceMotion && status === "sending" && (
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "linear" }}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Confirmation */}
        {!reduceMotion && status === "sent" && (
          <motion.p
            className="mt-2 text-center text-green-600 dark:text-green-400"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            role="status"
          >
            Thanks — I’ll get back to you soon! 🙌
          </motion.p>
        )}
      </motion.form>
    </section>
  );
}
