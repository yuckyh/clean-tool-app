import type { Config } from 'tailwindcss'
import containerQueries from '@tailwindcss/container-queries'

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {},
  plugins: [containerQueries],
} satisfies Config

