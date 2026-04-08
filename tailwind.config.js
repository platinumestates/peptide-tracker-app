/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"DM Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#0a0a0f',
          card: '#111118',
          elevated: '#1a1a24',
        },
        border: '#2a2a3a',
        text: {
          primary: '#f0f0ff',
          secondary: '#8888aa',
        },
        accent: '#6366f1',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      }
    },
  },
  plugins: [],
}
