/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        patriotic: {
          red: '#DA251D',
          gold: '#FFCD00',
          darkred: '#991B1B',
          cream: '#FFFBEB'
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
