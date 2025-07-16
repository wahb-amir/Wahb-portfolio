import ContributionCard from "./ContributionCard";

export default function ProjectSection() {
  return (
    <section
      id="project-section"
      className="px-6 py-12 bg-transparent flex flex-col items-center"
    >
      <h2 className="text-3xl font-extrabold mb-6">
        Projects I’ve Supercharged
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        <ContributionCard
          project="Homie’s Portfolio"
          role="Backend Dev, Infra"
          stack="Node.js, Express, MongoDB, PM2"
          description="Built backend APIs, auth, deployment & routing. Set up NGINX on VPS for uptime and SSL."
          highlight="🚀 Backend fully deployed + integrated with frontend on custom domain."
          links={{
            live: "https://myhomie.site",
            repo: "https://github.com/homie/backend",
          }}
        />
        {/* Add more <ContributionCard /> here */}
      </div>
    </section>
  );
}
