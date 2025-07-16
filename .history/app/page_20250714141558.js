"use client";

import { AnimatePresence } from "framer-motion";
import Hero from "./Component/Hero";
import SkillsCloud from "./Component/SkillsCloud";
import PageTransition from "./Component/PageTransition";

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
this is my landing page?"use client";

import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Avatar from "./Avatar";
import CustomParticles from "./CustomParticles";
import BackgroundEffect from "./BackgroundEffect";

const Hero = () => {
  const handleScrollToSkills = () => {
    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
      if ("scrollIntoView" in skillsSection) {
        skillsSection.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({
          top: skillsSection.offsetTop,
          behavior: "smooth",
        });
      }
    } else {
      console.warn("Skills section not found!");
    }
  };

  return (
    <main
      className="
      relative flex flex-col justify-start items-center
      min-h-screen px-4 xs:px-6 text-center bg-[#0a0f1a] text-white overflow-hidden
      pt-[env(safe-area-inset-top)]
      "
    >
      <CustomParticles
        colors={["#00dfd8", "#00bfff", "#00aaff", "#66fcf1", "#ffffff"]}
      />

      <BackgroundEffect />

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="z-10 mt-8 max-w-xl mx-auto"
        style={{ marginTop: "max(1rem, 10vh)" }}
      >
        <div className="mx-auto w-[150px] xs:w-[200px] 3xl:w-[300px] p-2">
          <Avatar />
        </div>

        <h1 className="text-3xl xs:text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-lg mt-4">
          Hey, I&apos;m{" "}
          <span className="text-4xl xs:text-5xl sm:text-7xl text-cyan-300 font-black">
            ~ Wahb
          </span>
        </h1>

        <h2 className="text-base xs:text-lg sm:text-2xl mt-6 font-medium max-w-screen-3xl mx-auto text-slate-200">
          <Typewriter
            words={[
              "Full-Stack Developer | Crafting Scalable, Efficient Web Applications",
              "Specializing in Clean, Maintainable Code & Intuitive UX",
              "Expertise in Modern Frontend & Backend Technologies",
              "Focused on Performance, Security, and Reliability",
              "Driven by Innovation and Continuous Improvement",
            ]}
            loop
            cursor
            cursorStyle="_"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={1500}
          />
        </h2>

        <p className="text-base mt-6 max-w-2xl mx-auto text-slate-300">
          Fast, secure, scalable web apps — built to ship, built to last
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 cursor-pointer z-10 hover:scale-110 transition"
        onClick={handleScrollToSkills}
      >
        <ChevronDownIcon className="w-8 h-8 text-cyan-300 animate-pulse mt-10" />
      </motion.div>
    </main>
  );
};

export default Hero;
