/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "green": "#1db954",
        "black-base": "#121212",
        "light-black": "#282828",
        "black-base": "#121212",
        "black-primary": "#191414",
        "black-secondary": "#171818",
        "primary": "#ffffff",
        "secondary": "#b3b3b3",
        "gray": "#535353"
      }
    },

    gridTemplateColumns: {
      "auto-fill-cards": "repeat(auto-fill, minmax(200px ,1fr))"
    }
  },
  plugins: [],
}
