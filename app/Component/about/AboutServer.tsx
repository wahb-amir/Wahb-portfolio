// components/AboutServer.tsx
import getLatestAboutPayload from "@/lib/aboutService";
import About from "./About";
import JsonLdScript from "../shared/JsonLdScript";
export default async function AboutServer() {
  const { payload } = await getLatestAboutPayload({
    clientVersion: null,
  });

  // You already did this part!
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
        },
      }
    : null;
  if (!about) return null;

  return (
    <>
      {jsonLd && <JsonLdScript id="about-jsonld" data={jsonLd} />}

      {/* Changed payload to about */}
      <About data={about} />
    </>
  );
}
