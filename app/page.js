"use client";

import { AnimatePresence } from "framer-motion";
import Hero from "./Component/Hero";
import SkillsCloud from "./Component/SkillsCloud";
import PageTransition from "./Component/PageTransition";
import Project from "./Component/Project";
import Navbar from "./Component/Navbar";
import About from "./Component/About";
import ContactForm from "./Component/Contact";
import Footer from './Component/Footer'
export default function Home() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <header>
          <Navbar />
        </header>

        <main>
          <Hero />
          <SkillsCloud />
          <Project />
          <About />
          <ContactForm />
        </main>

        <footer>
          <Footer />
        </footer>
      </PageTransition>
    </AnimatePresence>
  );
}
