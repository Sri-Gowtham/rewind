/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#1B1410',
        card: '#2A2019',
        border: '#4A3B2E',
        primary: '#F3E9D2',
        secondary: '#C9A876',
        muted: '#8A7860',
        warm1: '#C1502E',
        warm2: '#D4A017',
        warm3: '#E8C468',
        cool1: '#2F6F6E',
        cool2: '#6FA8A6',
        amber: {
          DEFAULT: '#C1502E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Fraunces"', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      borderRadius: {
        card: '6px',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
    },
  },
  plugins: [],
}
