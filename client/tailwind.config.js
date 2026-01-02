/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        fontFamily: {
            sans: ['Amiri', 'serif'],
            serif: ['Amiri', 'serif'],
        },
        extend: {
            colors: {
                primary: '#b45309',
                secondary: '#1f2937',
                dark: {
                    bg: '#111827',
                    card: '#1f2937',
                    text: '#f3f4f6'
                }
            },
        },
    },
    plugins: [],
}
