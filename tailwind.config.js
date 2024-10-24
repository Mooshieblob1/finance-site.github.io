/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        // Up Bank's colors
        "up-orange": "#FF7A64",
        "up-blue": "#00A5CF",
      },
    },
  },
  plugins: [],
};
