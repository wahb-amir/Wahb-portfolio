"use client"; // <-- THIS MUST BE FIRST LINE

import "./globals.css";
import "./tailwind-out.css";
import { Geist, Geist_Mono } from "next/font/google";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import PageTransition from "./Component/PageTransition";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
export const metaData
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={pathname}>{children}</PageTransition>
        </AnimatePresence>
      </body>
    </html>
  );
}
