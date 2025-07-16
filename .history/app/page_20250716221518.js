"use client";

import { AnimatePresence } from "framer-motion";
import Hero from "./Component/Hero";
import SkillsCloud from "./Component/SkillsCloud";
import PageTransition from "./Component/PageTransition";
import Project from "./Component/Project";
import Navbar from "./Component/Navbar";
import About from "./Component/About";
import Contribution from "./Component/Contribution";
export default function Home() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <Navbar />
        <Hero />
        <SkillsCloud />
        <Project />
        <About />
        {/* <Contribution /> */}
      </PageTransition>
    </AnimatePresence>
  );
}
