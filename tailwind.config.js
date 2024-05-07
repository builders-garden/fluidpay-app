/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF238C",
        revolut: "#FF5D8F",
        secondary: "#7209B7",
        white: "#F2F2F2",
        darkGrey: "#161618",
        mutedGrey: "#8F8F91",
        greyInput: "#232324",
      },
    },
  },
  plugins: [],
};
