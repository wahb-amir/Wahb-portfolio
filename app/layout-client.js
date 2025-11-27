// app/layout-client.js
"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import PageTransition from "./Component/PageTransition";
import { ThemeProvider } from "next-themes";

export default function LayoutClient({ children }) {
  const pathname = usePathname();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={pathname}>{children}</PageTransition>
      </AnimatePresence>
    </ThemeProvider>
  );
}