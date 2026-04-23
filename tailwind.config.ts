import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: "#1A56DB",
        success: "#16a34a",
        warning: "#d97706",
        danger: "#dc2626",
        surface: "#F8FAFC",
        textPrimary: "#0F172A",
        textSecondary: "#64748B"
      },
      fontFamily: {
        sans: ["var(--font-noto-sans)", "sans-serif"],
        display: ["var(--font-instrument-serif)", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
