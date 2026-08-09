import "./globals.css";
import { Geist, Geist_Mono, Fira_Code } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "./Component/navigation/Navbar";
import { siteMetadata } from "./Seo.config";
import { structuredData } from "./data/structured-data";
import StarfieldBackground from "./Component/effects/StarfieldBackgroundClient";
import SpatialNavigation from "./Component/effects/SpatialNavigationClient";
import JsonLdScript from "./Component/shared/JsonLdScript";

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
const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-fira-code",
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
        {/* Same-origin preconnect — speeds up the very first request. */}
        <link rel="preconnect" href="https://wahb.space" crossOrigin="anonymous" />
        {/* LCP image preload — browser starts fetching before HTML parses. */}
        <link
          rel="preload"
          as="image"
          href="/Avatar.webp"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${firaCode.variable}`}
      >
        <JsonLdScript id="site-structured-data" data={structuredData} />
        <div className="relative z-0 min-h-screen bg-transparent dark:bg-[#080e1a]">
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