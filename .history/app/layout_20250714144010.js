"use client"; // 👑 always first when using hooks/client-only code

import "./globals.css";
import "./tailwind-out.css";
import { Geist, Geist_Mono } from "next/font/google";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import PageTransition from "./Component/PageTransition"; // <-- make sure this exists!
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata = {
  title: "Wahb | Full-Stack Dev",
  description:
    "15 y/o full-stack dev building modern web apps with Next.js, MongoDB, and more.",
  openGraph: {
    title: "Wahb | Full-Stack Dev",
    description:
      "15 y/o full-stack dev building modern web apps with Next.js, MongoDB, and more.",
    images: ["/preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wahb | Full-Stack Dev",
    description:
      "15 y/o full-stack dev building modern web apps with Next.js, MongoDB, and more.",
    images: ["/preview.png"],
  },
};

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-black dark:bg-black dark:text-white transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={pathname}>{children}</PageTransition>
          </AnimatePresence>
        </ThemeProvider>
      </body>
    </html>
  );
}
