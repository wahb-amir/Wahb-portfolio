import React from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "./Component/Hero";
import SkillsServer from "./Component/SkillServer";
import ProjectServer from "./Component/ProjectServer";
import AboutServer from "./Component/AboutServer";
import ContactForm from "./Component/Contact";
import FAQ from "./Component/FAQ";
import Footer from "./Component/Footer";
import PageTransition from "./Component/PageTransition";

export default function Home() {
  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition>
          <main>
            <Hero />
            <SkillsServer />
            <ProjectServer />
            <AboutServer />
            <FAQ />
            <ContactForm />
          </main>
          <footer className="h-fit overflow-hidden">
            <Footer />
          </footer>
        </PageTransition>
      </AnimatePresence>
    </>
  );
}
