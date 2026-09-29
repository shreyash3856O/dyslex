/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8E8",
        ink: "#2B2118",
        berry: "#6C3CE0",
        moss: "#2E7D5B",
        gold: "#F5B301",
        sky: "#7CC6E6",
        blush: "#FFD9E3"
      },
      borderRadius: { '4xl': '2rem' },
      fontFamily: {
        lex: ["Lexend", "Atkinson Hyperlegible", "OpenDyslexic", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
