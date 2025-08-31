// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // keep it here, no need to repeat inside theme
  theme: {
    extend: {
      colors: {
        primary: "#7f5af0",
        secondary: "#00dfd8",
        bgDark: "#0f0f14",
        textLight: "#2d3436",
        textDark: "#e4e4e7",
      },
      screens: {
        xs: "480px",
        "3xl": "1920px",
        "max-xs": { max: "480px" },
        "max-md": { max: "680px" },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },

      // ✅ Gradient backgrounds (now you can use bg-light-gradient / bg-dark-gradient)
      backgroundImage: {
        "light-gradient":
          "radial-gradient(circle at top left, #7f5af022, transparent 70%), radial-gradient(circle at bottom right, #00dfd822, transparent 70%)",
        "dark-gradient":
          "radial-gradient(circle at top left, #00b1ff33, transparent 70%), radial-gradient(circle at bottom right, #00dfd033, transparent 70%)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar"),
  ],
};
