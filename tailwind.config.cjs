const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.@(css|tsx)', './stories/**/*.@(css|tsx)'],
  theme: {
    extend: {
      // https://colorbox.io/?c0=%26p%24s%24%3D10%26p%24h%24st%24%3D91%26p%24h%24e%24%3D91%26p%24h%24c%24%3Deqo%26p%24sa%24st%24%3D0%26p%24sa%24e%24%3D0.49%26p%24sa%24r%24%3D1%26p%24sa%24c%24%3Deqo%26p%24b%24st%24%3D1%26p%24b%24e%24%3D0.69%26p%24b%24c%24%3Dl%26o%24n%24%3DGreen%26o%24ro%24%3Dcw%26o%24ms%24%3D0%26o%24lockHex%24%3D84b15b%26o%24minorStep%24%3D1&c1=%26p%24s%24%3D10%26p%24h%24st%24%3D147%26p%24h%24e%24%3D147%26p%24h%24c%24%3Deqo%26p%24sa%24st%24%3D0.0%26p%24sa%24e%24%3D1%26p%24sa%24r%24%3D1%26p%24sa%24c%24%3Dl%26p%24b%24st%24%3D1%26p%24b%24e%24%3D0.69%26p%24b%24c%24%3Dl%26o%24n%24%3DBrand%26o%24ro%24%3Dcw%26o%24ms%24%3D0%26o%24lockHex%24%3D%2300B050%26o%24minorStep%24%3D1&c2=%26p%24s%24%3D10%26p%24h%24st%24%3D60%26p%24h%24e%24%3D60%26p%24h%24c%24%3Deqo%26p%24sa%24st%24%3D0%26p%24sa%24e%24%3D0%26p%24sa%24r%24%3D1%26p%24sa%24c%24%3Deqo%26p%24b%24st%24%3D1%26p%24b%24e%24%3D0.08%26p%24b%24c%24%3Dl%26o%24n%24%3DGray%26o%24ro%24%3Dcw%26o%24ms%24%3D0%26o%24minorStep%24%3D1&c3=%26p%24s%24%3D10%26p%24h%24st%24%3D200%26p%24h%24e%24%3D200%26p%24h%24c%24%3Deqo%26p%24sa%24st%24%3D0%26p%24sa%24e%24%3D0.85%26p%24sa%24r%24%3D1%26p%24sa%24c%24%3Deqo%26p%24b%24st%24%3D0.99%26p%24b%24e%24%3D0.92%26p%24b%24c%24%3Deci%26o%24n%24%3DBlue%26o%24ro%24%3Dcw%26o%24ms%24%3D0%26o%24minorStep%24%3D1&c4=%26p%24s%24%3D10%26p%24h%24st%24%3D359%26p%24h%24e%24%3D359%26p%24h%24c%24%3Deqo%26p%24sa%24st%24%3D0%26p%24sa%24e%24%3D0.74%26p%24sa%24r%24%3D1%26p%24sa%24c%24%3Deqo%26p%24b%24st%24%3D1%26p%24b%24e%24%3D0.78%26p%24b%24c%24%3Deqi%26o%24n%24%3DRed%26o%24ro%24%3Dcw%26o%24ms%24%3D0%26o%24minorStep%24%3D1&c5=%26p%24s%24%3D10%26p%24h%24st%24%3D273%26p%24h%24e%24%3D273%26p%24h%24c%24%3Deqo%26p%24sa%24st%24%3D0%26p%24sa%24e%24%3D0.6%26p%24sa%24r%24%3D1%26p%24sa%24c%24%3Deqo%26p%24b%24st%24%3D1%26p%24b%24e%24%3D0.64%26p%24b%24c%24%3Deqi%26o%24n%24%3DPurple%26o%24ro%24%3Dcw%26o%24ms%24%3D0%26o%24minorStep%24%3D1
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
        'intavia-gray': {
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
        neutral: { 0: colors.white, ...colors.slate, 1000: colors.black },
      },
      zIndex: {
        dialog: 50,
      },
      screens: {
        'vq-min': [{ raw: '(max-width: 1550px)' }, { raw: '(max-height: 980px)' }],
      },
    },
  },
  plugins: [
    // @ts-expect-error Missing module declaration.
    require('@tailwindcss/line-clamp'),
  ],
};
