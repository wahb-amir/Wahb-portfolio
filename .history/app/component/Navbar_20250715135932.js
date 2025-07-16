"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
const handleClick = () => {
  return (
    <>
      <nav>
        <ul
          className={`flex justify-between items-center rounded-xl p-4 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <li onClick={() => handleClick()}>
            <Image
              src="/logo.png"
              alt="wahb logo"
              widht={50}
              height={50}
              className="rounded-full"
              style={{ cursor: "pointer" }}
            />
          </li>
          <li>Skill</li>
          <li>Projects</li>
          <li>About</li>
          <li>Contribution</li>
          <li>Contact</li>
          <li onClick={() => setDarkMode(!darkMode)}>
            <button>
              <FontAwesomeIcon
                icon={darkMode ? faSun : faMoon}
                className="scale-150"
              />
            </button>
          </li>
        </ul>

        <style jsx>{`
          li {
            margin: 0 15px;
            border-radius: 5px;
            padding: 6px;
            border: 2px solid transparent;
            transition: background-color 0.3s, color 0.3s, border-color 0.3s;
            cursor: pointer;
          }

          li:hover {
            background-color: rgba(0, 0, 0, 0.1);
            color: ${darkMode ? "#00dfd8" : "#000"};
            border-color: ${darkMode ? "#00dfd8" : "#000"};
          }
        `}</style>
      </nav>
    </>
  );
};

export default Navbar;
