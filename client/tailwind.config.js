/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- ESTA LÍNEA ES LA QUE ACTIVA EL BOTÓN DE SOL/LUNA
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}