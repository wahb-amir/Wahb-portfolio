"use client";

import { AnimatePresence } from "framer-motion";
import Hero from "./Component/Hero";
import SkillsCloud from "./Component/SkillsCloud";
import PageTransition from "./Component/PageTransition";
import Project from "./Component/Project";
import Navbar from "./Component/Navbar";
import About from "./Component/About";
import ContributionCard from "./Component/ContributionCard";
export default function Home() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <Navbar />
        <Hero />
        <SkillsCloud />
        <Project />
        <About />
        <ContributionCard
          project="My Homie's Portfolio"
          role="Backend Dev, Infra"
          stack="Node.js, Express, MongoDB, NGINX, PM2"
          description="Built the full backend, set up secure APIs, deployed on VPS, configured domain routing."
          highlight="🚀 Full stack connected, deployed, and humming on a $5/mo server."
          links={{
            live: "https://myhomie.site",
            repo: "https://github.com/homie/backend",
          }}
        />
      </PageTransition>
    </AnimatePresence>
  );
}
