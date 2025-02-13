/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#020713",
        secondary: "#1C212A",
        teks: "#CED2D8",
      },
    },
  },
  plugins: [require("daisyui")],
};
