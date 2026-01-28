/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        heading: ['Unbounded', 'sans-serif'],
      },
      colors: {
        'gray-light': '#f5f5f7',
        'gray-medium': '#86868b',
        'gray-dark': '#1d1d1f',
      },
      maxWidth: {
        container: '1200px',
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.05)',
        'glass-hover': '0 8px 40px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
