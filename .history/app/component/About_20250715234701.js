'use client'
import React, { useEffect, useState } from "react";


const About = () => {
  const [timeSinceStart, setTimeSinceStart] = useState("");

  useEffect(() => {
    const startDate = new Date("2025-03-22T00:00:00Z"); // 👈 your dev start date

    const updateTimer = () => {
      const now = new Date();
      const diff = now - startDate;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeSinceStart(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer(); // init
    const interval = setInterval(updateTimer, 1000); // update every second

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <>
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-4">👋 Meet The Dev</h2>
        <p className="text-center text-lg text-gray-300 mb-12">
          Self-taught dev on a 115-day coding quest. From HTML to full-stack
          with React, Node, Mongo & hosted on my own Linux VPS. Still learning,
          still building, always shipping. 🚀
        </p>

        {/* ⏱️ Useless But Cool Timer */}
        <div className="bg-gray-800 p-6 rounded-lg text-center mb-16">
          <h3 className="text-xl font-semibold mb-2">
            🧠 Time Since I Started Web Dev
          </h3>
          <p className="text-pink-400 text-lg font-mono">{timeSinceStart}</p>
        </div>

        {/* 📊 Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">115</p>
            <p className="text-sm text-gray-400">Days Since I Started</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-gray-400">Full-stack Projects Shipped</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">Linux VPS</p>
            <p className="text-sm text-gray-400">Self-Hosted 🔥</p>
          </div>
        </div>

        {/* 🤪 Fun Facts */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-4">😜 Fun Facts</h3>
          <ul className="list-disc pl-5 text-gray-300 space-y-2">
            <li>Fuelled by mango juice & late-night bugs</li>
            <li>Lo-fi beats while coding = ✨flow mode✨</li>
            <li>Debugs better after a snack break</li>
          </ul>
        </div>

        {/* 🛣️ Real Dev Journey */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-4">🛣️ My Dev Journey</h3>
          <div className="space-y-4 border-l-2 border-pink-500 pl-4">
            <div>
              <span className="font-bold">Mar 2025:</span> Learned HTML/CSS
            </div>
            <div>
              <span className="font-bold">Week 2:</span> JavaScript clicked 👀
            </div>
            <div>
              <span className="font-bold">Day 40:</span> React & Tailwind joined
              the party
            </div>
            <div>
              <span className="font-bold">Day 70:</span> First full-stack app
              deployed 💾
            </div>
            <div>
              <span className="font-bold">Now:</span> 3 projects online, living
              on a Linux VPS 💻
            </div>
          </div>
        </div>

        <blockquote className="text-center italic text-pink-400 text-xl">
          &quot;Still a beginner — but I’m building like I mean it.&quot;
        </blockquote>
      </section>
    </>
  );
};

export default About;
