"use client";
import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export default function BackgroundEffect() {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // pulsing animation only if not reduced motion, and disabled on mobile for performance
  const pulseClass = reduceMotion || isMobile ? "" : "animate-pulse";
  
  // Reduce CSS blur intensity on mobile to prevent GPU compositing lag
  const mainBlurClass = isMobile ? "blur-xl" : "blur-2xl";
  const blobBlurClass = isMobile ? "blur-2xl" : "blur-3xl";

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
          ${mainBlurClass}
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
          rounded-full ${blobBlurClass} opacity-30
          ${pulseClass}
          z-[-10]
          transition-colors duration-1000
          bg-[#7f5af033] 
        `}
        style={pulseClass ? { animationDuration: "6s" } : undefined}
      />

      {/* bottom-right blob */}
      <div
        aria-hidden="true"
        className={`
          absolute bottom-[-15%] right-[-10%]
          w-[250px] h-[250px] xs:w-[300px] xs:h-[300px]
          rounded-full ${blobBlurClass} opacity-30
          ${pulseClass}
          z-[-10]
          transition-colors duration-1000
          bg-[#00dfd8aa] 
        `}
        style={pulseClass ? { animationDuration: "5s" } : undefined}
      />
    </>
  );
}
