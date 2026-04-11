import { Metadata } from "next";

export const siteMetadata: Metadata = {
  title: "Wahb Amir | Full-Stack Engineer & AI Developer",
  description:
    "Wahb Amir is a full-stack engineer and AI developer building high-performance web applications, RAG pipelines, and production-ready systems — Technical Award at Hackonomics 2026 · 3rd Place at Hack for Humanity 2026.",
  metadataBase: new URL("https://wahb.space"),
  keywords: [
    "Wahb Amir",
    "full-stack engineer",
    "AI developer",
    "RAG pipeline",
    "LangChain",
    "Next.js",
    "React",
    "Node.js",
    "Fastify",
    "TypeScript",
    "Supabase",
    "pgvector",
    "Groq",
    "WebSocket",
    "Tailwind CSS",
    "web performance",
    "machine learning",
    "EconoQuest",
    "EcoLens",
    "Hackonomics 2026",
    "Hack for Humanity 2026",
    "portfolio",
  ],
  authors: [{ name: "Wahb Amir", url: "https://wahb.space" }],
  creator: "Wahb Amir",
  applicationName: "Wahb Amir Portfolio",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://wahb.space/",
    languages: {
      "en-US": "https://wahb.space/",
      en: "https://wahb.space/",
    },
  },
  openGraph: {
    title: "Wahb Amir | Full-Stack Engineer & AI Developer",
    description:
      "Portfolio of Wahb Amir — Technical Award at Hackonomics 2026 · 3rd Place at Hack for Humanity 2026. Building high-performance web apps, RAG pipelines, and scalable systems from idea to production.",
    url: "https://wahb.space",
    siteName: "Wahb Amir Portfolio",
    images: [
      {
        url: "https://wahb.space/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wahb Amir — Full-Stack Engineer & AI Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wahb Amir | Full-Stack Engineer & AI Developer",
    description:
      "Technical Award — Hackonomics 2026 · 3rd Place — Hack for Humanity 2026. Building high-performance web apps and practical AI tools.",
    images: ["https://wahb.space/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};
