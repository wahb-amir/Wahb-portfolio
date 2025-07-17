import "./globals.css";
import "./tailwind-out.css";
import { Geist, Geist_Mono } from "next/font/google";
import LayoutClient from "./layout-client";
import { ThemeProvider } from "next-themes";
import Script from "next/script"; // <- import Script

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
  title: "Wahb Amir | Full-Stack Web Developer & Next.js Expert",
  description:
    "Wahb Amir is a 15 y/o full-stack developer building blazing-fast, modern web apps using Next.js, MongoDB, Tailwind CSS, and more. Explore my portfolio and projects.",
  keywords: [
    "Wahb Amir",
    "full stack developer",
    "Next.js developer",
    "portfolio",
    "MongoDB",
    "Tailwind CSS",
    "React",
    "JavaScript",
    "web development",
    "young developer",
  ],
  authors: [
    {
      name: "Wahb Amir",
      url: "https://wahb.buttnetworks.com",
    },
  ],
  creator: "Wahb Amir",
  publisher: "Wahb Amir",
  metadataBase: new URL("https://wahb.buttnetworks.com"),
  openGraph: {
    title: "Wahb Amir | Full-Stack Web Developer",
    description:
      "Explore the portfolio of Wahb Amir, a 15 y/o full-stack dev specializing in Next.js, Tailwind CSS, and modern web tech.",
    url: "https://wahb.buttnetworks.com",
    siteName: "Wahb Amir Portfolio",
    images: [
      {
        url: "/og-image.png", // ← You should make this! 1200x630 recommended
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
    description:
      "Check out my projects, skills, and what I'm building with Next.js & modern web tools 🚀",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-96x96.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  themeColor: "#00bfff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Wahb Amir | Full-Stack Web Developer & Next.js Expert</title>
        <meta
          name="description"
          content="Wahb Amir is a 15 y/o full-stack developer building blazing-fast, modern web apps using Next.js, MongoDB, Tailwind CSS, and more. Explore my portfolio and projects."
        />
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

        {/* JSON-LD Person Schema */}
        <Script
          id="jsonld-person"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Wahb Amir",
            url: "https://wahb.buttnetworks.com",
            sameAs: ["https://github.com/wahb", "https://linkedin.com/in/wahb"],
            jobTitle: "Full-Stack Web Developer",
          })}
        </Script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} transition-colors duration-500 ease-in-out min-h-screen overflow-x-hidden`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LayoutClient>{children}</LayoutClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
