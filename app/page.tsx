import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const Hero = dynamic(() => import("./Component/hero/Hero"), {
  ssr: true,
  loading: () => null,
});

// ─── Skeleton fallbacks ────────────────────────────────────────────────────────
function SectionSkeleton({ height = 400 }: { height?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{ minHeight: height, width: "100%", contain: "layout size" }}
    />
  );
}



// const SkillsServer = dynamic(() => import("./Component/skills/SkillServer"), {
//   loading: () => <SectionSkeleton height={320} />,
// });

// const ProjectServer = dynamic(
//   () => import("./Component/projects/ProjectServer"),
//   {
//     loading: () => <SectionSkeleton height={600} />,
//   },
// );

// const AboutServer = dynamic(() => import("./Component/about/AboutServer"), {
//   loading: () => <SectionSkeleton height={400} />,
// });

// const ContactForm = dynamic(() => import("./Component/contact/Contact"), {
//   ssr: true,
//   loading: () => <SectionSkeleton height={480} />,
// });

// const FAQ = dynamic(() => import("./Component/faq/FAQ"), {
//   loading: () => <SectionSkeleton height={320} />,
// });

// const Footer = dynamic(() => import("./Component/footer/Footer"), {
//   loading: () => <SectionSkeleton height={120} />,
// });

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <Suspense fallback={null}>
      <main>
        <Hero />
        {/* <Suspense fallback={<SectionSkeleton height={320} />}>
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
        */}
        </main>
        
        {/* <footer className="h-fit overflow-hidden">
       <Suspense fallback={<SectionSkeleton height={120} />}>
         <Footer />
         </Suspense>
         </footer>  */}
        
    </Suspense>
  );
}
