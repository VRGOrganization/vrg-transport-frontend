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
        primary: "#003f87",
        "primary-container": "#0056b3",
        secondary: "#a33e00",
        "secondary-container": "#ff7f41",
        surface: "#f8f9fa",
        "surface-container-low": "#f3f4f5",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#e7e8e9",
        "on-surface": "#191c1d",
        "on-surface-variant": "#424752",
        outline: "#727784",
        "outline-variant": "#c2c6d4",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      screens: {
        xs: "475px",
      },
    },
  },
  plugins: [],
};

export default config;