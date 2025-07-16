"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundEffect from "./BackgroundEffect";
import { useTheme } from "next-themes";

export default function ContactForm() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null; // avoid hydration mismatch

  return (
    <div
      className="relative w-full min-h-screen py-24 px-6 overflow-hidden flex flex-col items-center justify-center"
      style={{
        backgroundImage: isDark
          ? "radial-gradient(circle at top left, #00b1ff33, transparent 70%), radial-gradient(circle at bottom right, #00dfd033, transparent 70%)"
          : "radial-gradient(circle at top left, #7f5af022, transparent 70%), radial-gradient(circle at bottom right, #00dfd822, transparent 70%)",
        backgroundColor: isDark ? "#0f172a" : "#f9fafb",
      }}
    >
      <h2 className="text-3xl font-semibold mb-6 text-center tracking-tight text-black dark:text-white">
        Contact
      </h2>
      <BackgroundEffect />
      <form
        onSubmit={handleSubmit}
        className="space-y-5 relative z-10 max-w-xl w-full"
      >
        {/* inputs */}
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
        ? "bg-cyan-400 dark:bg-cyan-900 cursor-not-allowed text-black dark:text-white"
        : "bg-cyan-500 hover:bg-cyan-600 text-white dark:bg-cyan-700 dark:hover:bg-cyan-600"
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
                  className="absolute bottom-2 text-xl z-20"
                  initial={{ left: "90%" }}
                  animate={{ left: "20%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  exit={{ opacity: 0 }}
                  style={{ transform: "translateX(-100%)" }}
                >
                  🚚
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

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
