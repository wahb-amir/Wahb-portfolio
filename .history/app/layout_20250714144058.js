import "./globals.css";
import "./tailwind-out.css";
import { Geist, Geist_Mono } from "next/font/google";
import LayoutClient from "./layout-client";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
