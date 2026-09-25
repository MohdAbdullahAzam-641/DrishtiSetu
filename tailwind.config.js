/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        soil: {
          DEFAULT: '#3B2A1E',
          light: '#594232',
          dark: '#261A12',
          border: '#D6CEC2',
        },
        paddy: {
          DEFAULT: '#2F6B3A',
          light: '#E6F0E8',
          dark: '#1F4A27',
        },
        water: {
          DEFAULT: '#2A6F97',
          light: '#E5F0F6',
          dark: '#1C4E6B',
        },
        turmeric: {
          DEFAULT: '#E3A72F',
          light: '#FDF5E6',
          dark: '#B57F15',
        },
        clay: {
          DEFAULT: '#9E3B22',
          light: '#FBECE8',
          dark: '#752916',
        },
        offwhite: '#FBFAF6',
        paper: '#F2EFE9',
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
