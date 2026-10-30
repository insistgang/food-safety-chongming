/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cm: {
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b'
          },
          blue: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            500: '#0284c7',
            600: '#0369a1',
            700: '#075985',
            800: '#0c4a6e',
            900: '#082f49'
          }
        }
      }
    },
  },
  plugins: [],
}
