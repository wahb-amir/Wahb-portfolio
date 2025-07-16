// components/ContactForm.jsx
"use client";
import { useState } from "react";

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

    // Fake delay like you're sending it to NASA 💫
    setTimeout(() => {
      setStatus("sent");
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto mt-20 bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-[0_0_30px_rgba(0,255,255,0.1)] text-white">
      <h2 className="text-3xl font-semibold mb-6 text-center tracking-tight">
        Contact
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
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
        <button
          type="submit"
          className={`w-full p-3 rounded-lg font-medium tracking-wide transition-all duration-300
        ${
          status === "sending"
            ? "bg-cyan-800 animate-pulse cursor-not-allowed"
            : "bg-cyan-500 hover:bg-cyan-400 text-black"
        }`}
        >
          {status === "sending"
            ? "Sending..."
            : status === "sent"
            ? "Message sent"
            : "Send message"}
        </button>

        {status === "sent" && (
          <p className="text-center mt-3 text-green-400 animate-fade-in">
            Thanks — I’ll get back to you soon.
          </p>
        )}
      </form>
    </div>
  );
}
