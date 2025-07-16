"use client";

import { AnimatePresence } from "framer-motion";
import Hero from "./Component/Hero";
import SkillsCloud from "./Component/SkillsCloud";
import PageTransition from "./Component/PageTransition";
import Project from "./Component/Project";
import Navbar from "./Component/Navbar";
import About from "./Component/About";
// import Contribution from "./Component/Contribution";
import ContactForm from "./Component/Contact";
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
        <ContactForm />
      </PageTransition>
    </AnimatePresence>
  );
}
