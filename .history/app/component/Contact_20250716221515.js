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
    <div className="max-w-xl mx-auto mt-20 bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-[0_0_30px_rgba(0,255,255,0.2)] text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">🛸 Contact Me</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="what do your homies call you?"
          className="w-full p-3 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="ur email (no spam I swear 😇)"
          className="w-full p-3 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="drop ur message here 🚀"
          className="w-full p-3 h-32 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className={`w-full p-3 rounded-xl transition-all duration-300 text-black font-bold
            ${
              status === "sending"
                ? "bg-yellow-300 animate-pulse"
                : "bg-cyan-300 hover:bg-pink-300"
            }`}
        >
          {status === "sending"
            ? "Sending... 🚀"
            : status === "sent"
            ? "Sent! ✅"
            : "Send it! 💌"}
        </button>
        {status === "sent" && (
          <p className="text-center mt-3 text-green-400 animate-bounce">
            Gotcha! I’ll hit u back soon 👾
          </p>
        )}
      </form>
    </div>
  );
}
