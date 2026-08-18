import React, { Suspense } from "react";

import Hero from "./Component/hero/Hero";
import SkillsServer from "./Component/skills/SkillServer";
import ProjectServer from "./Component/projects/ProjectServer";
import AboutServer from "./Component/about/AboutServer";
import ContactForm from "./Component/contact/ContactClient";
import FAQ from "./Component/faq/FAQ";
import Footer from "./Component/footer/Footer";

// ─── Skeleton fallbacks ────────────────────────────────────────────────────────
function SectionSkeleton({ height = 400 }: { height?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{ minHeight: height, width: "100%", contain: "layout size" }}
    />
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main>
      <Hero />
      <Suspense fallback={<SectionSkeleton height={320} />}>
        <SkillsServer />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height={600} />}>
        <ProjectServer />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height={400} />}>
        <AboutServer />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height={480} />}>
        <ContactForm />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height={320} />}>
        <FAQ />
      </Suspense>

      <footer className="h-fit overflow-hidden">
        <Suspense fallback={<SectionSkeleton height={120} />}>
          <Footer />
        </Suspense>
      </footer>
    </main>
  );
}

