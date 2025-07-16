"use client";

import { AnimatePresence } from "framer-motion";
import Hero from "./Component/Hero";
import SkillsCloud from "./Component/SkillsCloud";
import PageTransition from "./Component/PageTransition";
import Project from "./Component/Project";

export default function Home() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <Hero />
        <SkillsCloud />
      </PageTransition>
    </AnimatePresence>
  );
}
