/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121214',
        textBase: '#C4C4CC',
        igniteLight: '#00B37E',
        shapeSecondary: '#29292E',
        brandRed: '#F75A68',
        titles: '#E1E1E6',
        white: '#FFFFFF',
        igniteMid: '#00875F',
        shapeTertiary: '#323238',
        igniteDark: '#015F43',
        placeholder: '#7C7C8A',
        gray100: '#E1E1E6',
        gray300: '#8D8D99',
        shapePrimary: '#202024',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'text-md': ['16px', {
          lineHeight: '1.6',
          fontWeight: '400',
        }],
        'headline-lg': ['32px', {
          lineHeight: '1.4',
          fontWeight: '700',
        }],
      },
    },
  },
  plugins: [],
}