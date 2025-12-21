// app/layout.tsx (server component)
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
  // ...other metadata you already have
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
        url: "https://wahb.space",
        image: "https://wahb.space/og-image.png",
        email: "mailto:wahbamir2010@gmail.com",
        jobTitle: "Full-Stack Engineer & AI Developer",
        description:
          "Full-stack engineer building high-performance web applications, applied AI tools and production-ready systems from idea to deployment.",
        sameAs: ["https://github.com/wahb-amir"],
        skills: [
          "HTML",
          "CSS",
          "Tailwind CSS",
          "JavaScript",
          "TypeScript",
          "React",
          "Next.js",
          "Node.js",
          "Express",
          "MongoDB",
          "Framer Motion",
          "Python",
          "Pandas",
          "NumPy",
          "Scikit-learn",
          "PyTorch",
          "OpenCV",
          "C++",
          "MySQL",
        ],
        worksFor: {
          "@type": "Organization",
          "@id": "https://buttnetworks.com/#org",
        },
      },

      {
        "@type": "Organization",
        "@id": "https://buttnetworks.com/#org",
        name: "Butt Networks",
        url: "https://buttnetworks.com",
        sameAs: ["https://github.com/buttnetworks"],
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
            item: {
              "@type": "CreativeWork",
              name: "Client & Developer Collaboration Platform",
              url: "https://projects.buttnetworks.com",
              description:
                "A single workspace where clients request quotes, track progress, message developers and see real-time updates; includes GitHub integration and automated notifications.",
              author: { "@id": "https://wahb.space/#person" },
              keywords: [
                "Next.js",
                "React",
                "Node.js",
                "MongoDB",
                "Tailwind",
                "GitHub Automation",
              ],
              sameAs: [
                "https://github.com/wahb-amir/dev-dashboard",
                "https://github.com/wahb-amir/dashboard",
              ],
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@type": "CreativeWork",
              name: "Modern Online Store",
              url: "https://boltform.buttnetworks.com/",
              description:
                "A demo e-commerce store with secure checkout, admin view and performance optimizations — demonstrates full checkout funnel and Stripe integration.",
              author: { "@id": "https://wahb.space/#person" },
              keywords: ["Next.js", "Stripe", "Tailwind", "MongoDB"],
              sameAs: ["https://github.com/wahb-amir/Ecommer-Store"],
              datePublished: "2025-12-10",
            },
          },
        ],
      },

      // Optional: link out to code repos as SoftwareSourceCode entries
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
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
