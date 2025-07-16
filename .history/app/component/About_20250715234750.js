"use client";
import React, { useEffect, useState } from "react";

const About = () => {
  const [timeSinceStart, setTimeSinceStart] = useState("");

  useEffect(() => {
    const startDate = new Date("2025-03-22T00:00:00Z"); // Your real dev journey start

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
          I’m a self-taught full-stack developer currently deep-diving into the
          modern web. In just 115 days, I’ve gone from writing basic HTML to
          building and deploying full-stack applications using React, Node.js,
          MongoDB, and more — hosted on my own Linux VPS.
        </p>

        {/* ⏱️ Live Timer */}
        <div className="bg-gray-800 p-6 rounded-lg text-center mb-16">
          <h3 className="text-xl font-semibold mb-2">
            ⏱ Time Since I Started Web Development
          </h3>
          <p className="text-pink-400 text-lg font-mono">{timeSinceStart}</p>
        </div>

        {/* 📊 Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">115</p>
            <p className="text-sm text-gray-400">Days of Learning</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-gray-400">
              Full-Stack Projects Deployed
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">Linux VPS</p>
            <p className="text-sm text-gray-400">Self-Hosted Deployments</p>
          </div>
        </div>

        {/* 🤓 Fun Facts */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-4">⚡ Quick Facts</h3>
          <ul className="list-disc pl-5 text-gray-300 space-y-2">
            <li>
              Currently focused on building clean, scalable full-stack apps
            </li>
            <li>Enjoys lo-fi playlists while coding for max focus</li>
            <li>Strong believer in learning by doing — and breaking things</li>
          </ul>
        </div>

        {/* 📈 Dev Journey */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-4">🚀 Learning Journey</h3>
          <div className="space-y-4 border-l-2 border-pink-500 pl-4">
            <div>
              <span className="font-bold">March 2025:</span> Started with
              HTML/CSS
            </div>
            <div>
              <span className="font-bold">April 2025:</span> Mastered JavaScript
              fundamentals
            </div>
            <div>
              <span className="font-bold">May 2025:</span> Built my first React
              app
            </div>
            <div>
              <span className="font-bold">June 2025:</span> Launched full-stack
              projects with Node & Mongo
            </div>
            <div>
              <span className="font-bold">Today:</span> Hosting apps on my own
              Linux VPS & learning every day
            </div>
          </div>
        </div>

        {/* 💬 Quote */}
        <blockquote className="text-center italic text-pink-400 text-xl">
          &quot;Still early in the journey — but I build like I mean it.&quot;
        </blockquote>
      </section>
    </>
  );
};

export default About;
