/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
      },
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
        liquid: '0 4px 30px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
        'liquid-hover': '0 8px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      borderRadius: {
        liquid: '20px',
        'liquid-lg': '28px',
      },
      transitionDuration: {
        liquid: '350ms',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'ripple': 'ripple 0.6s linear',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        ripple: {
          to: { transform: 'scale(4)', opacity: '0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
