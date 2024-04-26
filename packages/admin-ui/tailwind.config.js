const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,ts}'],
    theme: {
        colors: {
            accent: {
                50: '#effaff',
                100: '#dff3ff',
                200: '#b8eaff',
                300: '#78daff',
                400: '#17c1ff',
                500: '#06b1f1',
                600: '#008ece',
                700: '#0072a7',
                800: '#025f8a',
                900: '#084f72',
                950: '#06324b',
            },
            ...colors,
        },
        extend: {},
    },
    plugins: [],
};
