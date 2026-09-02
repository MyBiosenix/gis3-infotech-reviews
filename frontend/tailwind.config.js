/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        court: {
          DEFAULT: '#0E1524', // deep navy arena background
          panel: '#161F33', // raised panel
          line: '#2A3550', // hairline / divider
        },
        amber: {
          DEFAULT: '#FFB020', // scoreboard LED amber
          dim: '#8A5E12',
        },
        cyan: {
          DEFAULT: '#4FD6E8', // secondary data accent
          dim: '#2C6E78',
        },
        ink: {
          DEFAULT: '#F2F4F8',
          muted: '#8A93A6',
        },
        // Light dashboard chrome (reviews grid, matches reference layout)
        dash: {
          bg: '#F3F4F8',
          card: '#FFFFFF',
          sidebar: '#14161F',
          border: '#E7E8EF',
          text: '#1B1D27',
          muted: '#8B8D9B',
        },
        // Platform brand accents for the imported-review pages
        trustpilot: {
          DEFAULT: '#00B67A',
          dark: '#00834F',
          bg: '#F2FBF7',
        },
        glassdoor: {
          DEFAULT: '#0CAA8F',
          dark: '#087563',
          bg: '#F0FBF9',
        },
      },
      fontFamily: {
        display: ['var(--font-oswald)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
