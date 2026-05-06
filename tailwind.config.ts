// tailwind.config.ts
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-sora)", "Sora", "sans-serif"],
        body: ["var(--font-dm)", "DM Sans", "sans-serif"],
        geist: ["Geist", "sans-serif"],
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [],
};
export default config;
