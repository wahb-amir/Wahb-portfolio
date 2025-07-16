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
        <Project />
        {/* Add more components as needed */}
        {/* <CustomParticles /> Uncomment if you want to use CustomParticles */}
        {/* <Footer /> Uncomment if you have a Footer component */}
        {/* <ContactForm /> Uncomment if you have a ContactForm component */}
        {/* <BlogPosts /> Uncomment if you have a BlogPosts component */}
      </PageTransition>
    </AnimatePresence>
  );
}
