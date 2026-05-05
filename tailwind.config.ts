// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#0B0B0F',
        lime: '#B6FF2E',
        'lime-dark': '#8FD420',
        surface: '#141418',
        surface2: '#1C1C22',
        surface3: '#242430',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'Syne', 'sans-serif'],
        body: ['var(--font-dm)', 'DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
