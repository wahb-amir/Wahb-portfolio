"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import PageTransition from "./Component/PageTransition";

type LayoutClientProps = {
  children: ReactNode;
};

export default function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname();
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={pathname}>{children}</PageTransition>
      </AnimatePresence>
    </ThemeProvider>
  );
}
