"use client";

import { motion } from "framer-motion";

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
}
