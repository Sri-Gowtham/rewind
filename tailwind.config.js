/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0D1B2A',
        card: '#1B3A4B',
        border: '#2A4A5A',
        primary: '#F2EDD8',
        secondary: '#7EC8D4',
        muted: '#6B8FA0',
        warm1: '#E8682A',
        warm2: '#F0A050',
        warm3: '#F5C878',
        cool1: '#4A9BAF',
        cool2: '#7EC8D4',
        amber: {
          DEFAULT: '#E8682A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      borderRadius: {
        card: '12px',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
    },
  },
  plugins: [],
}
