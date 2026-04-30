/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Mono', 'monospace'],
        mono: ['IBM Plex Mono', 'monospace'],
        display: ['Bebas Neue', 'sans-serif'],
        space: ['Space Mono', 'monospace'],
      },
      colors: {
        background: '#0a0a0a',
        card: '#1a1a1a',
        surface: '#2a2a2a',
        accent: '#f5e642',
        danger: '#ff2b2b',
        success: '#00ff88',
        info: '#0062ff',
        muted: '#3a3a3a',
      },
    },
  },
  plugins: [],
}
