const colors = require('tailwindcss/colors');

module.exports = {
    purge: {
        enabled: process.env.NODE_ENV === 'production',
        content: ['./layouts/**/*.html', './content/integration/**/*.md', './content/case-study/**/*.md'],
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            minHeight: {
               '25': '25vh',
               '50': '50vh',
               '70': '70vh',
             }
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            brand: '#17C1FF',
            black: colors.black,
            white: colors.white,
            gray: colors.trueGray,
            blue: colors.cyan,
            indigo: colors.indigo,
            red: colors.rose,
            green: colors.green,
            yellow: colors.amber,
        },
        fontFamily: {
            'sans': ['"Inter"', 'sans-serif'],
            'display': ['"Lexend Deca"', 'sans-serif'],
            'wordmark': ['"Didact Gothic"', 'sans-serif'],
        },
    },
    variants: {
        extend: {
            grayscale: ['group-hover']
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ],
}
