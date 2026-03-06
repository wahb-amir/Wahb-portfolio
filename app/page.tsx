import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "./Component/Hero";

// ─── Skeleton fallbacks ────────────────────────────────────────────────────────
// Sized to match each section so there's zero layout shift (CLS ≈ 0)
function SectionSkeleton({ height = 400 }: { height?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{ minHeight: height, width: "100%", contain: "layout size" }}
    />
  );
}


const PageTransition = dynamic(() => import("./Component/PageTransition"), {
  loading: () => null
});

const SkillsServer = dynamic(() => import("./Component/SkillServer"), {
  loading: () => <SectionSkeleton height={320} />,
});

const ProjectServer = dynamic(() => import("./Component/ProjectServer"), {
  loading: () => <SectionSkeleton height={600} />,
});

const AboutServer = dynamic(() => import("./Component/AboutServer"), {
  loading: () => <SectionSkeleton height={400} />,
});

const ContactForm = dynamic(() => import("./Component/Contact"), {
  ssr: true,
  loading: () => <SectionSkeleton height={480} />,
});

const FAQ = dynamic(() => import("./Component/FAQ"), {
  loading: () => <SectionSkeleton height={320} />,
});

const Footer = dynamic(() => import("./Component/Footer"), {
  loading: () => <SectionSkeleton height={120} />,
});

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <Suspense fallback={null}>
      <PageTransition>
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
        </main>

        <footer className="h-fit overflow-hidden">
          <Suspense fallback={<SectionSkeleton height={120} />}>
            <Footer />
          </Suspense>
        </footer>
      </PageTransition>
    </Suspense>
  );
}