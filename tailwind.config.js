/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        // Up Bank's color palette
        up: {
          // Main colors
          dark: "#292F3F", // Dark background
          darker: "#1E2230", // Darker sections
          orange: "#FF7A64", // Up's signature orange
          blue: "#00A5CF", // Up's accent blue
          // Additional UI colors
          card: "#343B4F", // Card background
          hover: "#3D455C", // Hover state
          text: {
            primary: "#FFFFFF",
            secondary: "#A0A7B8",
            muted: "#6B7280",
          },
        },
      },
    },
  },
  plugins: [],
};
