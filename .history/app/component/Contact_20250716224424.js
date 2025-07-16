"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundEffect from "./BackgroundEffect";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    setTimeout(() => {
      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    }, 2800);
  };

  return (
    <div className="max-w-xl mx-auto mt-20 px-4 sm:px-6 bg-white/80 dark:bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-gray-200 dark:border-white/20 shadow-[0_0_30px_rgba(0,255,255,0.1)] text-black dark:text-white transition-colors">
      <h2 className="text-3xl font-semibold mb-6 text-center tracking-tight">
        Contact
      </h2>
      <BackgroundEffect />
      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={formData.name}
          className="w-full p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-gray-500 dark:placeholder:text-gray-300 transition-colors"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          className="w-full p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-gray-500 dark:placeholder:text-gray-300 transition-colors"
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your message"
          value={formData.message}
          className="w-full p-3 h-32 rounded-lg bg-white/50 dark:bg-white/5 border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-gray-500 dark:placeholder:text-gray-300 transition-colors"
          onChange={handleChange}
          required
        />

        <div className="relative h-12 w-full overflow-hidden rounded-full">
          <button
            type="submit"
            disabled={status === "sending"}
            className={`w-full h-full rounded-full font-medium tracking-wide transition-all duration-300 relative z-10
            ${
              status === "sending"
                ? "bg-gray-400 dark:bg-gray-900 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-black dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
            }`}
          >
            {status === "sending"
              ? ""
              : status === "sent"
              ? "Message sent ✅"
              : "Send message"}

            {status === "sending" && (
              <div className="absolute bottom-[7px] left-1/2 w-[90%] h-1 bg-white/20 translate-x-[-50%] translate-y-[-50%] z-0" />
            )}
          </button>

          <AnimatePresence>
            {status === "sending" && (
              <>
                <motion.div
                  className="absolute bottom-2 left-0 w-full h-1 bg-black/20 dark:bg-white/30 rounded-full z-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.div
                  className="absolute bottom-1 text-xl z-20"
                  initial={{ left: "90%" }}
                  animate={{ left: "10%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  exit={{ opacity: 0 }}
                  style={{ transform: "translateX(-100%)" }}
                >
                  🚚📨
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Message container with fixed height to avoid layout shift */}
        <div className="h-8 relative">
          <AnimatePresence>
            {status === "sent" && (
              <motion.p
                className="text-center text-green-600 dark:text-green-400"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.3 }}
              >
                Thanks — I’ll get back to you soon.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
