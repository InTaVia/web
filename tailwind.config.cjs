const preset = require('@intavia/ui/dist/tailwind-preset.config.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.@(css|ts|tsx)', './node_modules/@intavia/ui/dist/**/*.js'],
  /** Disable dark mode. */
  darkMode: '',
  preset: [preset],
  theme: {
    extend: {
      screens: {
        'vq-min': [{ raw: '(max-width: 1550px)' }, { raw: '(max-height: 980px)' }],
      },
    },
  },
};
