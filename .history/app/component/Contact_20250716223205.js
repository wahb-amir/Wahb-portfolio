"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

    // Simulate sending delay
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 3000); // Reset after 3s
    }, 2800);
  };

  return (
    <div className="max-w-xl mx-auto mt-20 bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-[0_0_30px_rgba(0,255,255,0.1)] text-white">
      <h2 className="text-3xl font-semibold mb-6 text-center tracking-tight">
        Contact
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <input
          type="text"
          name="name"
          placeholder="Full name"
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-gray-300"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-gray-300"
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your message"
          className="w-full p-3 h-32 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-gray-300"
          onChange={handleChange}
          required
        />

        <div className="relative h-12 w-full">
          <button
            type="submit"
            disabled={status === "sending"}
            className={`w-full h-full rounded-full font-medium tracking-wide transition-all duration-300 text-white relative z-10
    ${
      status === "sending"
        ? "bg-gray-900 cursor-not-allowed"
        : "bg-gray-800 hover:bg-gray-700"
    }`}
          >
            {status === "sending"
              ? ""
              : status === "sent"
              ? "Message sent ✅"
              : "Send message"}

            {/* Road lane stripe */}
            {stat<div className="absolute top-1/4 left-0 w-full h-1 bg-white/20 translate-y-[-50%] z-0" />}
          </button>

          {/* Mail Truck Animation */}
          <AnimatePresence>
            {status === "sending" && (
              <>
                <motion.div
                  className="absolute bottom-2 left-0 w-full h-1 bg-white/30 rounded-full z-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.div
                  className="absolute bottom-1 text-xl z-20"
                  initial={{ left: "90%" }}
                  animate={{ left: "20%" }}
                  transition={{ duration: 2.5, ease: "easeIn" }}
                  exit={{ opacity: 0 }}
                  style={{ transform: "translateX(-100%)" }}
                >
                  🚚📨
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {status === "sent" && (
          <p className="text-center mt-3 text-green-400 animate-fade-in">
            Thanks — I’ll get back to you soon.
          </p>
        )}
      </form>
    </div>
  );
}
