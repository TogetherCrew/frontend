/** @type {import('tailwindcss').Config} */

const colors = {
  primary: {
    DEFAULT: '#5E4F96',
    50: '#F8F6FF',
    100: '#E4DCFF',
    200: '#BBA9FF',
    300: '#8D7CD0',
    400: '#7564B3',
  },
  secondary: {
    DEFAULT: '#804EE1',
    50: '#F6FDFF',
    75: '#CCB8F3',
    100: '#E3F8FF',
    200: '#BCEEFF',
    300: '#8CD3EA',
    400: '#4E90A6',
    500: '#225262',
  },
  info: {
    DEFAULT: '#1DA1F2',
    600: '#313671',
  },
  error: {
    DEFAULT: '#B6435B',
    50: '#FFF0F3',
    100: '#FFC5D1',
    200: '#FD98AE',
    300: '#F06885',
    400: '#D3546F',
    500: '#FB3E56',
    600: '#EB3E56',
  },
  warning: {
    DEFAULT: '#BB6842',
    50: '#FFF5F0',
    100: '#FFD6C3',
    200: '#FFB897',
    300: '#F59467',
    400: '#D87D53',
    500: '#FF9022',
  },
  yellow: {
    DEFAULT: '#FBD13E',
    50: '#FFFAEA',
    100: '#FFEEBD',
    200: '#FFE28F',
    300: '#FFD761',
    400: '#FFCB33',
  },
  green: {
    DEFAULT: '#3AAE2B',
    100: '#DBF6D7',
    600: '#3A9E2B',
  },
  lite: '#F8F8F8',
  'lite-black': '#3E3E3E',
  'gray-background': '#EDEDED',
  'lite-gray': '#515151',
  'gray-custom': '#222222',
  'border-gray': '#B4B4B4',
  'border-gray-darken': '#C6C6C6',
  aqua: '#35B9B7',
  success: '#56C054',
  'gray-hover': '#F7F7F7',
  'purple-light': '#8474C0',
  'gray-white': '#F3F3F3',
  'gray-light': '#E3E9FF',
  'blue-light': '#C5D2FF',
  'blue-dark': '#9CB1FF',
  'purple-light': '#9971E7',
  'purple-dark': '#673FB5',
  'purple-darker': '#35205E',
  'gray-subtitle': '#767676',
  orange: '#FF8022',
  'gray-border-box': '#AAAAAA',
};

const backgroundImage = {
  'gradient-mantle':
    'linear-gradient(90.64deg, #FFFFFF 69.92%, #D1D0DA 99.54%)',
};

const boxShadow = {
  base: '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(138, 138, 138, 0.16)',
  box: '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 4px 10px rgba(138, 138, 138, 0.1)',
};

const screens = {
  sm: '760px',
  // => @media (min-width: 576px) { ... }

  md: '1023px',
  // => @media (min-width: 768px) { ... }

  lg: '1200px',
  // => @media (min-width: 992px) { ... }

  xl: '1600px',
  // => @media (min-width: 1200px) { ... }
};

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**.{js,ts,jsx,tsx}',
  ],
  important: true,
  theme: {
    extend: {
      screens: {
        ...screens,
      },
      colors: {
        ...colors,
      },
      backgroundImage: {
        ...backgroundImage,
      },
      boxShadow: {
        ...boxShadow,
      },
      height: {
        128: '36rem',
        130: '38rem',
        140: '40rem',
        150: '50rem',
      },
      container: {
        center: true,
        screens: {
          sm: '760px',
          md: '1023px',
          lg: '1200px',
          xl: '1400px',
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["light"],
  },
};
