const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        'comic-sans': ['"Comic Sans MS"', '"Comic Sans"', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'translateX(0%)' },
          '15%': { transform: 'translateX(-25%) rotate(-5deg)' },
          '30%': { transform: 'translateX(20%) rotate(3deg)' },
          '45%': { transform: 'translateX(-15%) rotate(-3deg)' },
          '60%': { transform: 'translateX(10%) rotate(2deg)' },
          '75%': { transform: 'translateX(-5%) rotate(-1deg)' },
          '76%, 99%': { transform: 'translateX(0%)' }, // Ajout d'une pause
        },
        'bounce-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.8)'
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.05)'
          },
          '100%': {
            transform: 'scale(1)'
          },
        }
      },
      animation: {
        'wobble': 'wobble 3s ease-in-out infinite', // Modifié pour inclure la pause
        'bounce-in': 'bounce-in 0.5s ease-out'
      },
      colors: {
        primary: {
          DEFAULT: '#3490dc',
          '50': '#f0f9ff',
          '100': '#e0f2fe',
          '200': '#bae6fd',
          '300': '#7dd3fc',
          '400': '#38bdf8',
          '500': '#0ea5e9',
          '600': '#0284c7',
          '700': '#0369a1',
          '800': '#075985',
          '900': '#0c4a6e',
          '950': '#082f49',
        },
        secondary: {
          DEFAULT: '#ffed4a',
          '50': '#fefce8',
          '100': '#fef9c3',
          '200': '#fef08a',
          '300': '#fde047',
          '400': '#facc15',
          '500': '#eab308',
          '600': '#ca8a04',
          '700': '#a16207',
          '800': '#854d0e',
          '900': '#713f12',
          '950': '#422006',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}