import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class'],
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}
export default config
