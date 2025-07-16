'use client";';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <>
      <nav>
        <ul className={`flex justify-between items-center rounded-xl p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <li>Skill</li>
          <li>Projects</li>
          <li>About</li>
          <li>Contribution</li>
          <li>Contact </li>
          <li>
            {" "}
            <button onClick={() => setDarkMode(!darkMode)}>
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>
          </li>
        </ul>
        <style jsx>{`
          nav {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </nav>
    </>
  );
};

export default Navbar;
