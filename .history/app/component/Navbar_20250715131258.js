'use client";'
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <>
      <nav>
        <ul>
          <li>Skill</li>
          <li>Projects</li>
          <li>About</li>
          <li>Contribution</li>
          <li>Contact </li>
          <li>Resume</li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
