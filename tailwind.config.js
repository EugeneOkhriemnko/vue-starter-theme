const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./index.html', './client-app/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    fontFamily: {
      'lato': ['Lato', 'sans-serif'],
      'roboto': ['Roboto', 'sans-serif']
    },
    extend: {
      colors: {
        yellow: {
          '500': '#F0AD4E'
        },
        red: {
          '500': '#FF4A4A'
        },
        cyan: {
          ...colors.cyan,
          '500': '#5294AD',
          '700': '#00739E'
        },
        blueGray: {
          ...colors.blueGray,
          '300': '#C2C9E0'
        },
        trueGray: colors.trueGray,
        warmGray: colors.warmGray
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}