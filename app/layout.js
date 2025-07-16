import "./globals.css";
import "./tailwind-out.css";
import { Geist, Geist_Mono } from "next/font/google";
import LayoutClient from "./layout-client";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://wahb.buttnetworks.com"
  ),
  title: "Wahb Amir | Full-Stack Web Developer & Next.js Expert",
  description:
    "Wahb Amir is a 15 y/o full-stack developer building blazing-fast, modern web apps using Next.js, MongoDB, Tailwind CSS, and more. Explore my portfolio and projects.",
  keywords: [
    "Wahb Amir",
    "Wahb developer",
    "Next.js developer",
    "Full stack web developer",
    "Portfolio website",
    "React developer",
    "Freelance developer",
    "Tailwind CSS portfolio",
    "MongoDB projects",
    "Wahb portfolio",
  ],
  authors: [{ name: "Wahb Amir", url: "https://wahb.buttnetworks.com" }],
  creator: "Wahb Amir",
  publisher: "Wahb Amir",
  openGraph: {
    type: "website",
    url: "https://wahb.buttnetworks.com",
    title: "Wahb Amir | Full-Stack Web Developer & Next.js Expert",
    description:
      "I'm Wahb Amir, a 15-year-old full-stack web dev building sleek, high-performance apps with the modern web stack. Check out my portfolio!",
    siteName: "Wahb's Dev Portfolio",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Wahb Amir Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wahb Amir | Full-Stack Web Dev",
    description:
      "Wahb Amir's portfolio – showcasing modern full-stack projects with Next.js, Tailwind CSS, and MongoDB.",
    images: ["/preview.png"],
  },
  alternates: {
    canonical: "https://wahb.buttnetworks.com",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="wahb amir " />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} transition-colors duration-500 ease-in-out min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LayoutClient>{children}</LayoutClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
