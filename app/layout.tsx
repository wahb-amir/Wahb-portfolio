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
 title: "Wahb Amir | Full-Stack Engineer & AI Developer",
  description:
    "Wahb Amir is a full-stack engineer and AI developer building high-performance web applications, practical AI tools, and scalable systems — from idea to production.",
  metadataBase: new URL("https://wahb.space"),
  keywords: [
    "Wahb Amir",
    "full-stack engineer",
    "AI developer",
    "Next.js",
    "React",
    "Node.js",
    "Tailwind CSS",
    "web performance",
    "machine learning",
    "portfolio",
  ],
  authors: [{ name: "Wahb Amir", url: "https://wahb.space" }],
  creator: "Wahb Amir",
  applicationName: "Wahb Amir Portfolio",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#071126" },
  ],
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
      "Portfolio of Wahb Amir — building high-performance web applications, practical AI tools, and scalable systems from idea to production.",
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
      "Portfolio of Wahb Amir — building high-performance web apps and practical AI tools.",
    images: ["https://wahb.space/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://wahb.space/#person",
        name: "Wahb Amir",
        alternateName: "Wahb",
        url: "https://wahb.space",
        image: "https://wahb.space/og-image.png",
        email: "mailto:wahbamir2010@gmail.com",
        jobTitle: "Full-Stack Engineer & AI Developer",
        description:
          "Full-stack engineer building high-performance web applications, applied AI tools and production-ready systems from idea to deployment.",
        sameAs: ["https://github.com/wahb-amir"],
        worksFor: { "@id": "https://buttnetworks.com/#org" },
        knowsAbout: [
          "Full-stack web development",
          "React.js",
          "Next.js",
          "Node.js",
          "MongoDB",
          "API development",
          "AI integration",
          "Machine learning",
          "Performance optimization",
          "DevOps basics",
          "SEO",
        ],
      },

      {
        "@type": "Organization",
        "@id": "https://buttnetworks.com/#org",
        name: "Butt Networks",
        url: "https://buttnetworks.com",
      },

      {
        "@type": "WebSite",
        "@id": "https://wahb.space/#website",
        url: "https://wahb.space",
        name: "Wahb Amir Portfolio",
        publisher: { "@id": "https://wahb.space/#person" },
        inLanguage: "en",
      },

      {
        "@type": "ProfilePage",
        "@id": "https://wahb.space/#home",
        url: "https://wahb.space",
        name: "Wahb Amir — Portfolio",
        description:
          "Portfolio homepage of Wahb Amir — full-stack engineer and AI developer showcasing projects, skills, timeline and contact options.",
        mainEntity: { "@id": "https://wahb.space/#person" },
        about: [
          "Full-stack development",
          "Artificial Intelligence",
          "Web applications",
          "Backend systems",
          "Machine learning",
        ],
        inLanguage: "en",
      },

      {
        "@type": "ContactPage",
        "@id": "https://wahb.space/#contact",
        url: "https://wahb.space/#contact",
        name: "Contact Wahb",
        description:
          "Contact page for inquiries, client portal access, or project quotes. Email and client portal available.",
        contactOption: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "mailto:wahbamir2010@gmail.com",
            availableLanguage: ["English"],
          },
        ],
        mainEntity: { "@id": "https://wahb.space/#person" },
        potentialAction: [
          {
            "@type": "CommunicateAction",
            name: "Send message",
            target: "https://wahb.space/#contact",
          },
          {
            "@type": "CommunicateAction",
            name: "Request a quote",
            target: "https://projects.buttnetworks.com#request-quote",
          },
        ],
      },

      {
        "@type": "ItemList",
        "@id": "https://wahb.space/#projects",
        name: "Projects — Wahb Amir",
        url: "https://wahb.space/#projects",
        numberOfItems: 2,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: { "@id": "https://wahb.space/#project-dev-dashboard" },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: { "@id": "https://wahb.space/#project-ecom" },
          },
        ],
      },

      {
        "@type": "SoftwareApplication",
        "@id": "https://wahb.space/#project-dev-dashboard",
        name: "Client & Developer Collaboration Platform",
        url: "https://projects.buttnetworks.com",
        description:
          "A unified workspace where clients request quotes, track progress, message developers, and see real-time updates with GitHub automation.",
        applicationCategory: "WebApplication",
        operatingSystem: "Web",
        programmingLanguage: ["JavaScript", "TypeScript", "Node.js"],
        softwareRequirements: [
          "Next.js",
          "React",
          "Node.js",
          "MongoDB",
          "Tailwind CSS",
          "GitHub API",
        ],
        author: { "@id": "https://wahb.space/#person" },
        sameAs: [
          "https://github.com/wahb-amir/dev-dashboard",
          "https://github.com/wahb-amir/dashboard",
        ],
        datePublished: "2025-10-01",
      },

      {
        "@type": "SoftwareApplication",
        "@id": "https://wahb.space/#project-ecom",
        name: "Modern Online Store",
        url: "https://boltform.buttnetworks.com/",
        description:
          "Demo e-commerce store with secure checkout, admin view and performance optimizations — demonstrates full checkout funnel and Stripe integration.",
        applicationCategory: "ECommercePlatform",
        operatingSystem: "Web",
        programmingLanguage: ["JavaScript", "Node.js"],
        softwareRequirements: ["Next.js", "Stripe", "Tailwind CSS", "MongoDB"],
        author: { "@id": "https://wahb.space/#person" },
        sameAs: ["https://github.com/wahb-amir/Ecommer-Store"],
        datePublished: "2025-12-10",
      },

      {
        "@type": "SoftwareSourceCode",
        "@id": "https://wahb.space/#code",
        name: "Selected source code — Wahb Amir",
        codeRepository: [
          "https://github.com/wahb-amir/dev-dashboard",
          "https://github.com/wahb-amir/dashboard",
          "https://github.com/wahb-amir/Ecommer-Store",
          "https://github.com/wahb-amir/Wahb-portfolio",
        ],
        creator: { "@id": "https://wahb.space/#person" },
      },

      {
        "@type": "Service",
        "@id": "https://wahb.space/#service-fullstack",
        name: "Full Stack Web Development",
        serviceType: "Full Stack Development",
        provider: { "@id": "https://wahb.space/#person" },
        areaServed: "Worldwide",
        description:
          "Building fast, secure, and scalable web applications using modern technologies (React, Next.js, Node.js, MongoDB).",
        keywords: ["React", "Next.js", "Node.js", "MongoDB", "Tailwind"],
      },

      {
        "@type": "Service",
        "@id": "https://wahb.space/#service-frontend",
        name: "Frontend Development & UI/UX",
        serviceType: "Frontend Development",
        provider: { "@id": "https://wahb.space/#person" },
        areaServed: "Worldwide",
        description:
          "Pixel-perfect responsive frontends, component-driven UI, animations and accessibility with React, Next.js and Tailwind CSS.",
        keywords: [
          "React",
          "Next.js",
          "Tailwind",
          "Framer Motion",
          "Accessibility",
        ],
      },

      {
        "@type": "Service",
        "@id": "https://wahb.space/#service-backend",
        name: "Backend & API Development",
        serviceType: "Backend Development",
        provider: { "@id": "https://wahb.space/#person" },
        areaServed: "Worldwide",
        description:
          "Designing and implementing scalable REST/GraphQL APIs, authentication, database schema and business logic using Node.js and MongoDB.",
        keywords: ["Node.js", "Express", "MongoDB", "REST", "GraphQL"],
      },

      {
        "@type": "Service",
        "@id": "https://wahb.space/#service-api",
        name: "API Design & Integrations",
        serviceType: "API Development",
        provider: { "@id": "https://wahb.space/#person" },
        areaServed: "Worldwide",
        description:
          "API design, third-party integrations (Stripe, GitHub, OAuth), webhooks and realtime features using WebSockets or serverless functions.",
        keywords: ["Stripe", "GitHub API", "OAuth", "WebSocket"],
      },

      {
        "@type": "Service",
        "@id": "https://wahb.space/#service-seo",
        name: "Technical SEO & Performance",
        serviceType: "SEO",
        provider: { "@id": "https://wahb.space/#person" },
        areaServed: "Worldwide",
        description:
          "Technical SEO, structured data (JSON-LD), site performance optimization, CLS/LCP improvements and search engine indexability auditing.",
        keywords: [
          "SEO",
          "structured data",
          "performance",
          "Lighthouse",
          "indexability",
        ],
      },

      {
        "@type": "Service",
        "@id": "https://wahb.space/#service-ecom",
        name: "E-commerce Development",
        serviceType: "E-commerce Development",
        provider: { "@id": "https://wahb.space/#person" },
        areaServed: "Worldwide",
        description:
          "E-commerce storefronts, secure checkout, payments (Stripe), admin dashboards and order management systems.",
        keywords: ["Stripe", "Checkout", "E-commerce", "Admin Dashboard"],
      },

      {
        "@type": "Service",
        "@id": "https://wahb.space/#service-devops",
        name: "DevOps & Deployment",
        serviceType: "DevOps",
        provider: { "@id": "https://wahb.space/#person" },
        areaServed: "Worldwide",
        description:
          "VPS + NGINX deployments, CI/CD pipelines, container basics, PM2 process management and SSL automation (Let's Encrypt).",
        keywords: ["NGINX", "PM2", "CI/CD", "Let's Encrypt", "VPS"],
      },

      {
        "@type": "Service",
        "@id": "https://wahb.space/#service-mobile",
        name: "Mobile & Progressive Web Apps",
        serviceType: "PWA / Mobile",
        provider: { "@id": "https://wahb.space/#person" },
        areaServed: "Worldwide",
        description:
          "Progressive Web Apps and responsive mobile experiences with offline support, installability and performance-first design.",
        keywords: ["PWA", "Responsive", "Offline", "Mobile Performance"],
      },

      {
        "@type": "Service",
        "@id": "https://wahb.space/#service-ai",
        name: "AI Integration for Web Applications",
        serviceType: "AI Integration",
        provider: { "@id": "https://wahb.space/#person" },
        areaServed: "Worldwide",
        description:
          "Integrating applied AI tools and models into production web systems for enhanced user experience and automation.",
        keywords: ["AI", "Machine Learning", "Embedding", "NLP"],
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD structured data (keeps your existing graph) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Extra manual tags to complement next's Metadata output */}
        {metadata.keywords && (
          <meta
            name="keywords"
            content={
              Array.isArray(metadata.keywords)
                ? metadata.keywords.join(", ")
                : metadata.keywords
            }
          />
        )}
        {metadata.alternates?.canonical && (
          <link
            rel="canonical"
            href={
              typeof metadata.alternates.canonical === "string"
                ? metadata.alternates.canonical
                : metadata.alternates.canonical instanceof URL
                ? metadata.alternates.canonical.toString()
                : undefined
            }
          />
        )}
        <meta
          name="theme-color"
          content="#071126"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />

        {/* Prefer preconnect for external services used often (CDNs, analytics etc.) */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        {/* Small favicons / manifest (Next will also use the metadata.icons field) */}
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
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
