import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Neumorphic dark theme palette - nested for organization
        dark: {
          bg: "#1A1A1A",      // Main background
          card: "#282828",    // Raised card background
          pressed: "#1F1F1F", // Pressed element background
        },
        text: {
          primary: "#FFFFFF",   // Primary text
          secondary: "#AAAAAA", // Secondary text
        },
        accent: {
          red: "#E43A5F",      // Vibrant red accent
          redHover: "#FF0055", // Hover state red
        },
        // Keep industrial colors for backward compatibility but update to match dark theme
        industrial: {
          900: "#1A1A1A",
          800: "#282828",
          700: "#2D2D2D",
          300: "#AAAAAA",
          200: "#CCCCCC",
          100: "#FFFFFF"
        },
        // Flat color names for Tailwind classes (text-text-primary, bg-dark-bg, etc.)
        'text-primary': '#FFFFFF',
        'text-secondary': '#AAAAAA',
        'dark-bg': '#1A1A1A',
        'dark-card': '#282828',
        'dark-pressed': '#1F1F1F',
      },
      fontFamily: {
        sans: ['Montserrat', 'Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neumorphic-raised': '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.05)',
        'neumorphic-pressed': 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.05)',
        'neumorphic-button': '4px 4px 8px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.05)',
        'neumorphic-button-pressed': 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(255, 255, 255, 0.05)',
      },
      borderRadius: {
        'neumorphic': '20px',
        'neumorphic-lg': '24px',
      }
    }
  },
  plugins: []
};

export default config;
