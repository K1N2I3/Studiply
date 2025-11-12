/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'floating': 'floating 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s infinite',
        'morphing': 'morphing 8s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      backdropBlur: {
        'xl': '24px',
      },
      backgroundSize: {
        '200%': '200% 200%',
      }
    },
  },
  plugins: [],
}
