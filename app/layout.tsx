import "./globals.css";
import "./tailwind-out.css";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "./Component/navigation/Navbar";
import { siteMetadata } from "./Seo.config";
import { structuredData } from "./data/structured-data";

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
        {/* Preconnect for Google Fonts (already loaded via next/font above) */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="min-h-screen bg-white dark:bg-[#0b1220] transition-colors duration-500">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Navbar />
            <main
              className="pt-20 md:pt-24 bg-[#f9fafb] dark:bg-[#0f172a]
                bg-gradient-to-b from-[#00b1ff88] to-[#00bfff44] rounded-lg
                border-t-4 border-cyan-500/50 text-black dark:text-white
                transition-colors duration-500"
            >
              {children}
            </main>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}