import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // All colors reference CSS variables so changing the theme in
        // Admin → Site Settings updates every colour on the site instantly.
        primary: {
          DEFAULT: "var(--color-primary)",
          50:  "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          50:  "var(--color-secondary-50)",
          100: "var(--color-secondary-100)",
          200: "var(--color-secondary-200)",
          600: "var(--color-secondary-600)",
          700: "var(--color-secondary-700)",
        },
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "system-ui", "sans-serif"],
        serif:   ["Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
