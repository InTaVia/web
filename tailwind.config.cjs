const preset = require('@intavia/ui/dist/tailwind-preset.config.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.@(css|ts|tsx)', './node_modules/@intavia/ui/dist/**/*.js'],
  /** Disable dark mode. */
  darkMode: '',
  preset: [preset],
  theme: {
    extend: {
      colors: {
        'intavia-brand': {
          50: '#edfbf3',
          100: '#dbf6e7',
          200: '#b9edd0',
          300: '#98e5bb',
          400: '#7adca6',
          500: '#5ed393',
          600: '#43ca81',
          700: '#2bc26f',
          800: '#15b95f',
          900: '#00b050',
        },
        'intavia-green': {
          50: '#f4fbee',
          100: '#eaf6de',
          200: '#d5eebf',
          300: '#c4e5a4',
          400: '#b4dc90',
          500: '#a8d47f',
          600: '#9dcb73',
          700: '#94c269',
          800: '#8bba61',
          900: '#84b15b',
        },
        'intavia-neutral': {
          50: '#f2f2f2',
          100: '#e5e5e5',
          200: '#cbcbcb',
          300: '#b1b1b1',
          400: '#979797',
          500: '#7d7d7d',
          600: '#636363',
          700: '#494949',
          800: '#2e2e2e',
          900: '#141414',
        },
        'intavia-blue': {
          50: '#e6f5fc',
          100: '#d0edfc',
          200: '#a5dffc',
          300: '#80d2fb',
          400: '#62c8fa',
          500: '#4cbff9',
          600: '#3bb8f7',
          700: '#2fb2f4',
          800: '#28adef',
          900: '#23a8eb',
        },
        'intavia-red': {
          50: '#feebeb',
          100: '#fed7d7',
          200: '#fcb0b1',
          300: '#f88e90',
          400: '#f47375',
          500: '#ed5d60',
          600: '#e54d50',
          700: '#db4144',
          800: '#d1393c',
          900: '#c73436',
        },
        'intavia-purple': {
          50: '#f7eefe',
          100: '#efddfd',
          200: '#debcf9',
          300: '#ce9ff4',
          400: '#bf87ec',
          500: '#b073e2',
          600: '#a162d4',
          700: '#9255c4',
          800: '#844ab3',
          900: '#7741a3',
        },
        'intavia-highland': {
          50: '#f2f7f2',
          100: '#e0edde',
          200: '#c2dac0',
          300: '#95c095',
          400: '#639c65',
          500: '#47824b',
          600: '#346738',
          700: '#2a522f',
          800: '#234226',
          900: '#1d3720',
          950: '#101e13',
        },
        'intavia-apple': {
          50: '#f6faf3',
          100: '#eaf5e3',
          200: '#d5e9c9',
          300: '#b2d79e',
          400: '#87bd6b',
          500: '#639c45',
          600: '#518336',
          700: '#41682d',
          800: '#375328',
          900: '#2d4522',
          950: '#14250e',
        },
        'intavia-conifer': {
          50: '#f4fbea',
          100: '#e6f6d1',
          200: '#ceeda9',
          300: '#aee076',
          400: '#92d050',
          500: '#71b42e',
          600: '#568f21',
          700: '#426e1d',
          800: '#38581c',
          900: '#304b1c',
          950: '#17290a',
        },
        'intavia-tumbleweed': {
          50: '#fbf6f1',
          100: '#f6ebde',
          200: '#ecd3bc',
          300: '#dbac85',
          400: '#d19066',
          500: '#c77548',
          600: '#b9603d',
          700: '#9a4c34',
          800: '#7c3f30',
          900: '#653529',
          950: '#361914',
        },
        'intavia-wistful': {
          50: '#f7f7fb',
          100: '#f1eff8',
          200: '#e5e2f2',
          300: '#d2cbe7',
          400: '#b4a7d6',
          500: '#9f8ac8',
          600: '#8c70b7',
          700: '#7b5da4',
          800: '#664e89',
          900: '#554171',
          950: '#372a4b',
        },
        'intavia-salmon': {
          50: '#fef5f2',
          100: '#ffe8e1',
          200: '#ffd5c8',
          300: '#ffb8a2',
          400: '#fc9272',
          500: '#f4693f',
          600: '#e14e21',
          700: '#be3e17',
          800: '#9d3617',
          900: '#82321a',
          950: '#471708',
        },
        'intavia-bermuda': {
          50: '#edfcf4',
          100: '#d3f8e4',
          200: '#abefcd',
          300: '#78e2b4',
          400: '#3ccb92',
          500: '#18b178',
          600: '#0c8f61',
          700: '#0a7251',
          800: '#0a5b41',
          900: '#0a4a37',
          950: '#042a20',
        },
        'intavia-downy': {
          50: '#eefbf4',
          100: '#d6f5e3',
          200: '#b1e9cb',
          300: '#7dd8ae',
          400: '#65c99e',
          500: '#25a472',
          600: '#17845b',
          700: '#13694b',
          800: '#11543d',
          900: '#0f4533',
          950: '#07271d',
        },
        'intavia-silver-tree': {
          50: '#f0f9f4',
          100: '#daf1e3',
          200: '#b7e3cc',
          300: '#87cead',
          400: '#52b087',
          500: '#34956e',
          600: '#237857',
          700: '#1c6047',
          800: '#194c3a',
          900: '#153f31',
          950: '#0b231b',
        },
        'intavia-cornflower': {
          50: '#f1f5fd',
          100: '#dee8fb',
          200: '#c5d9f8',
          300: '#9dc1f3',
          400: '#6d9eeb',
          500: '#4d7de4',
          600: '#3861d8',
          700: '#2f4ec6',
          800: '#2c40a1',
          900: '#283a80',
          950: '#1d254e',
        },
        'intavia-gray': {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#9a9a9a',
          600: '#828282',
          700: '#6a6a6a',
          800: '#5a5a5a',
          900: '#4e4e4e',
          950: '#282828',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
};
