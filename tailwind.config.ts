import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        industrial: {
          900: "#0f1b26",
          800: "#152634",
          700: "#1d3242",
          300: "#9ca3af",
          200: "#cdd6df",
          100: "#e6ebf0"
        },
        accent: {
          600: "#1f6feb"
        }
      }
    }
  },
  plugins: []
};

export default config;
