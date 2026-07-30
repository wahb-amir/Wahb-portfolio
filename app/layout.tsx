import "./globals.css";
import "./tailwind-out.css";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "./Component/navigation/Navbar";
import { siteMetadata } from "./Seo.config";
import { structuredData } from "./data/structured-data";
import StarfieldBackground from "./Component/effects/StarfieldBackgroundClient";
import SpatialNavigation from "./Component/navigation/SpatialNavigation";

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

export const metadata = siteMetadata;

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Preload LCP image — WebP */}
        <link
          rel="preload"
          as="image"
          href="/Avatar.webp"
          // @ts-ignore fetchpriority is a valid HTML attribute
          fetchpriority="high"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="relative z-0 min-h-screen bg-slate-100 dark:bg-[#080e1a]">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <StarfieldBackground />
            <SpatialNavigation />
            <Navbar />
            <main className="pt-20 md:pt-24 bg-transparent text-black dark:text-white">
              {children}
            </main>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
