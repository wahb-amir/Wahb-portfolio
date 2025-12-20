import "./globals.css";
import "./tailwind-out.css";
import { Geist, Geist_Mono } from "next/font/google";
import LayoutClient from "./layout-client";
import { ThemeProvider } from "next-themes";
import Preloader from "./Component/Preloader";
import Navbar from "./Component/Navbar";
import { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Wahb Amir | Full-Stack Web Developer & Next.js Expert",
  description:
    "Wahb Amir is a full-stack developer building blazing-fast, modern web apps.",
  authors: [{ name: "Wahb Amir", url: "https://wahb.space" }],
  creator: "Wahb Amir",
  publisher: "Wahb Amir",
  metadataBase: new URL("https://wahb.space"),
  openGraph: {
    title: "Wahb Amir | Full-Stack Web Developer",
    description: "Explore the portfolio of Wahb Amir, a full-stack developer.",
    url: "https://wahb.space",
    siteName: "Wahb Amir Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wahb Amir | Web Developer Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wahb Amir | Full-Stack Web Dev",
    description: "Check out my projects and portfolio.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-96x96.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};
type RootLayoutProps = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#00bfff" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ...`}>
        <div className="min-h-screen ...">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Preloader />
            <Navbar />
            <LayoutClient>{children}</LayoutClient>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
