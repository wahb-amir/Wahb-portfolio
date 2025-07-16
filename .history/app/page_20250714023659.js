"use client";
import Hero from "./Component/Hero";
import SkillsCloud from "./Component/SkillsCloud";
import PageTransition from "./Component/PageTransition";
export default function Home() {
  return (
    <>
      <PageTransition>
        <Hero />
        <SkillsCloud />
      </PageTransition>
    </>
  );
}
