"use client";
import React from "react";
import { useReducedMotion } from "framer-motion";

export default function BackgroundEffect() {
  const reduceMotion = useReducedMotion();

  // pulsing animation only if not reduced motion
  const pulseClass = reduceMotion ? "" : "animate-pulse";

  return (
    <>
      {/* full‐screen radial gradient */}
      <div
        aria-hidden="true"
        className={`
          absolute inset-0
          bg-gradient-radial
          from-[#00bfff33] via-transparent to-transparent
          dark:from-[#00dfd844] dark:via-transparent dark:to-transparent
          blur-2xl
          z-[-10]
          transition-colors duration-1000
        `}
      />

      {/* top-left blob */}
      <div
        aria-hidden="true"
        className={`
          absolute top-[-20%] left-[-10%]
          w-[250px] h-[250px] xs:w-[300px] xs:h-[300px]
          rounded-full blur-3xl opacity-30
          ${pulseClass}
          z-[-10]
          transition-colors duration-1000
          bg-[#7f5af033] dark:bg-[#00bfff33]
        `}
        style={{ animationDuration: "6s" }}
      />

      {/* bottom-right blob */}
      <div
        aria-hidden="true"
        className={`
          absolute bottom-[-15%] right-[-10%]
          w-[250px] h-[250px] xs:w-[300px] xs:h-[300px]
          rounded-full blur-3xl opacity-30
          ${pulseClass}
          z-[-10]
          transition-colors duration-1000
          bg-[#00dfd8aa] dark:bg-[#00dfd8]
        `}
        style={{ animationDuration: "5s" }}
      />
    </>
  );
}
