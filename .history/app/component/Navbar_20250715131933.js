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
          li{
            margin: 0 15px;
            border-radius: 5px;
            padding: 5px 10px;
            border:2px solid transparent;
            transition: background-color 0.3s, color 0.3s;
            
            cursor: pointer;
          }
        `}</style>
      </nav>
    </>
  );
};

export default Navbar;
