

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

export const metadata = {
  title: "Wahb | Full-Stack Dev",
  description:
    "15 y/o full-stack dev building modern web apps with Next.js, MongoDB, and more.",
  openGraph: {
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

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AnimatePresence mode="wait" initial={false}>
        </AnimatePresence>
      </body>
    </html>
  );
}
