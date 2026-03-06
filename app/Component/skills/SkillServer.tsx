// SkillServer.tsx (server component)
import Skills from "./Skills";
import React from "react";

const name = "Wahb Amir";
const siteUrl = "https://wahb.space";

const skills = [
  "HTML",
  "CSS",
  "Tailwind",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Framer Motion",
  "Node.js",
  "Express",
  "Python",
  "Pandas",
  "NumPy",
  "Scikit-learn",
  "PyTorch",
  "OpenCV",
  "C++",
  "MongoDB",
  "MySQL",
  "Docker",
  "Nginx",
  "GitHub",
  "GitHub Actions",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: name,
  alternateName: "Wahb",
  url: siteUrl,
  description:
    "Full-stack web developer and ML enthusiast. Skilled in modern frontend and backend technologies, containerization and CI/CD.",
  // high-level fields useful for indexing & topical relevance
  knowsAbout: skills,
  mainEntity: {
    "@type": "ItemList",
    name: "Tech Stack",
    itemListElement: skills.map((skill, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: skill,
    })),
  },
};

export default function SkillServer() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Skills />
    </>
  );
}
