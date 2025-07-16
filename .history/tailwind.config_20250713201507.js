module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#7f5af0',
        secondary: '#00dfd8',
        bgDark: '#0f0f14',
        textLight: '#2d3436',
        textDark: '#e4e4e7',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}