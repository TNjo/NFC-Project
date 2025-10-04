/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './contexts/**/*.{js,ts,jsx,tsx}',
    './types/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class', // Enable dark mode using class strategy
  theme: {
    extend: {},
  },
  plugins: [],
};
