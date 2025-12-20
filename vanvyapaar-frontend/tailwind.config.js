/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#fbd7a5',
          300: '#f8bc6d',
          400: '#f59532',
          500: '#f2760a',
          600: '#e35d00',
          700: '#bc4502',
          800: '#953608',
          900: '#792e09',
        },
        tribal: {
          50: '#f8f6f0',
          100: '#ede7d3',
          200: '#dccfa9',
          300: '#c6b176',
          400: '#b4984f',
          500: '#a58640',
          600: '#8f6d37',
          700: '#76552f',
          800: '#62472c',
          900: '#533d29',
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}