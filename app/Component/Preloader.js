"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col gap-4 items-center justify-center bg-[#3664d0] text-white"
        >
          <motion.div
            className="w-10 h-10 border-4 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "linear",
            }}
          />

          <p className="text-sm opacity-70">Loading your experience...</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
