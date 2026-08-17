/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0056b3',
          dark: '#004494',
          light: '#0066d4',
        },
        secondary: {
          DEFAULT: '#2ecc71',
          dark: '#27ae60',
          light: '#58d68d',
        },
        accent: {
          DEFAULT: '#2ecc71',
          dark: '#27ae60',
          light: '#58d68d',
        },
        navy: {
          DEFAULT: '#001529',
          dark: '#000d1a',
          light: '#002845',
        },
        background: {
          DEFAULT: '#F8F9FA',
          dark: '#e9ecef',
        },
      },
      fontFamily: {
        sans: ['"Saira Semi Condensed"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
