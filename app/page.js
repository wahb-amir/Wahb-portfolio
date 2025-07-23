"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Component/Navbar";
import Hero from "./Component/Hero";
import SkillsCloud from "./Component/SkillsCloud";
import Project from "./Component/Project";
import About from "./Component/About";
import ContactForm from "./Component/Contact";
import Footer from "./Component/Footer";
import PageTransition from "./Component/PageTransition";

export default function Home() {
  const path = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={path}>
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

        <footer className=" h-fit overflow-hidden">
          <Footer />
        </footer>
      </PageTransition>
    </AnimatePresence>
  );
}
