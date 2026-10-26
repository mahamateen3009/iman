/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#0a3d24',
          900: '#0F5132',
          800: '#146a41',
          700: '#1b8052',
        },
        gold: {
          50: '#fbf6e9',
          100: '#f5ecd0',
          200: '#ecd9a0',
          300: '#e0c06a',
          400: '#d4a84a',
          500: '#c3983a',
          600: '#a87d2e',
        },
        cream: {
          50: '#FDFBF7',
          100: '#f7f2e8',
          200: '#efe7d4',
        },
        ink: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7cec8',
          300: '#9fa89e',
          400: '#717c71',
          500: '#525c52',
          600: '#3f483f',
          700: '#333b33',
          800: '#272d27',
          900: '#1a1f1a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Amiri"', 'Georgia', 'serif'],
        arabic: ['"Scheherazade New"', '"Amiri"', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(15, 81, 50, 0.08)',
        card: '0 4px 24px -6px rgba(15, 81, 50, 0.12)',
        glow: '0 0 0 1px rgba(212, 168, 74, 0.3), 0 8px 32px -8px rgba(15, 81, 50, 0.2)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
