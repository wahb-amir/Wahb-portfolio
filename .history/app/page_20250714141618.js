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
// i am making my portfolio (i am 15year old) , i know ,const allSkills = [
//   {
//     name: "HTML",
 
//   },
//   {
//     name: "CSS",
     
//   },
//   {
//     name: "Tailwind",
    
//   },
//   {
//     name: "JavaScript",
   
//   },
//   {
//     name: "React",
     
//   },
//   {
//     name: "Next.js",
   
//   },
//   {
//     name: "Node.js",
     
//   },
//   {
//     name: "Express",
   
//   },
//   {
//     name: "MongoDB",
   
//   },
//   {
//     name: "Framer Motion",
   
//   },
// ];, but i don't have much exp?