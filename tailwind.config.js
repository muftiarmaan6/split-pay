/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000', // Deep black
        card: '#0D0D0D', // Slightly elevated black
        primary: '#A855F7', // Vibrant purple
        secondary: '#D8B4FE', // Lighter purple
        accent: '#E879F9', // Pinkish purple for accents
        text: '#FFFFFF',
        textMuted: '#A1A1AA' // Zinc-400
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out',
      }
    },
  },
  plugins: [],
}
