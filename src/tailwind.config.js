/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-moss-green': '#606c38',
        'pakistan-green': '#283618',
        'cornsilk': '#fefae0',
        'earth-yellow': '#dda15e',
        'tigers-eye': '#bc6c25',
      },
    },
  },
  plugins: [],
}
