// components/AboutServer.tsx
import About from "./About";
import getLatestAboutPayload from "@/lib/aboutService";

export default async function AboutServer() {
  const { payload } = await getLatestAboutPayload({
    clientVersion: null,
  });

  const { version, data: about } = payload;

  const jsonLd = about
    ? {
        "@context": "https://schema.org",
        "@type": "About",
        name: "Wahb",
        description: about.bio,
        jobTitle: "Full-Stack Developer / AI Enthusiast",
        url: "https://wahb.space",
        sameAs: ["https://github.com/wahb-amir"],
        knowsAbout: about.quickFacts ?? [],
        hasOccupation: {
          "@type": "Occupation",
          name: "Software Engineer / AI Developer",
          startDate: about.startDate,
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <About serverData={payload} />
    </>
  );
}
