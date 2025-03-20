// tailwind.config.js
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(240 5.9% 90%)",
        input: "hsl(240 5.9% 90%)",
        ring: "hsl(240 3.7% 15.9%)",
        background: "#0F172A", // Dark background
        foreground: "#FFFFFF", // White text
        primary: {
          DEFAULT: "#0EA5E9", // Teal
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#1E293B", // Dark blue
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F59E0B", // Amber
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#EF4444", // Red
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#22C55E", // Green
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F97316", // Orange
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#334155", // Slate 700
          foreground: "#E2E8F0",
        },
        card: {
          DEFAULT: "#1E293B", // Dark blue (secondary)
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#1E293B", // Dark blue (secondary)
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
