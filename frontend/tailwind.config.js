import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'wa-green': '#00a884',
        'wa-green-dark': '#008069',
        'wa-green-light': '#d9fdd3',
        'wa-teal': '#128C7E',
        'wa-blue': '#34B7F1',
        'wa-gray': {
          50: '#f0f2f5',
          100: '#e9edef',
          200: '#d1d7db',
          300: '#8696a0',
          400: '#667781',
          500: '#54656f',
          600: '#3b4a54',
          700: '#202c33',
          800: '#111b21',
          900: '#0b141a',
        },
      },
      fontFamily: {
        sans: [
          'Segoe UI',
          'Helvetica Neue',
          'Helvetica',
          'Lucida Grande',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        '15': '3.75rem',
        '18': '4.5rem',
      },
      borderRadius: {
        'wa': '7.5px',
      },
      boxShadow: {
        'wa': '0 1px 0.5px rgba(0,0,0,0.13)',
        'wa-chat': '0 1px 3px rgba(11,20,26,0.08)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "dark",
    ],
  },
};
