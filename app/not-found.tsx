"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center  bg-[#f9fafb] dark:bg-[#0f172a]
    bg-gradient-to-b from-[#00bfff44] to-[#00b1ff88]
    text-black dark:text-white
    overflow-hidden pt-[env(safe-area-inset-top)] overflow-hidden">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full" />

      <div className="relative z-10 text-center px-6">
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[12rem] md:text-[15rem] font-bold leading-none tracking-tighter dark:text-transparent text-gray-300/40 bg-clip-text bg-gradient-to-b from-white to-white/10 select-none"
        >
          404
        </motion.h1>

        {/* Messaging */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <h2 className="text-2xl md:text-3xl font-medium dark:text-slate-200 text-slate-500">
            I think you&apos;ve lost your way.
          </h2>
          <p className="mt-4 dark:text-slate-400 text-white max-w-md mx-auto leading-relaxed">
            The page you are looking for has either been moved to another dimension 
            or simply doesn&apos;t exist in this universe.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-row sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="group relative px-8 py-3 rounded-full bg-white text-black font-semibold transition-all hover:scale-105 active:scale-95"
          >
            Back to Safety
          </Link>
          
          <Link
            href="/#project-section"
            className="px-8 py-3 rounded-full border border-slate-700 dark:text-slate-300 font-medium hover:bg-slate-800/50 transition-all text-white"
          >
            View Projects
          </Link>
        </motion.div>
      </div>

      {/* Subtle Floating Elements */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 vertical-text">
          Error :: 0x000404
        </p>
      </div>
    </div>
  );
}