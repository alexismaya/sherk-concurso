/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'shrek-green': '#5A8A00',
        'shrek-green-dark': '#3D5F00',
        'swamp-brown': '#7B5C2E',
        'onion-cream': '#F5EDD0',
        'fairytale-gold': '#E8A020',
        'bg-dark': '#1C2910',
        'text-light': '#F5EDD0',
      },
      fontFamily: {
        'luckiest': ['"Luckiest Guy"', 'cursive'],
        'nunito': ['Nunito', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
