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
// i have hosted 3 full stack site on linux vps and , also contributed in backend for my friend (3 site) , and i am also building a (demo) e-com store with next js , and fake strip intergation with fake card to show how would the payment proccess look like ? and also a going to show a read only admin panel , which will have a option to perform curd opertion but will not be allow for normal client?