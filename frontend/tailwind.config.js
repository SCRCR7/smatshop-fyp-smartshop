/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    orange: '#6366f1', // Maps legacy orange to premium Indigo
                    navy: '#07070c',   // Obsidian body background
                    dark: '#0a0a14',   // Deep Obsidian surface
                    card: 'rgba(15, 14, 23, 0.75)',
                    border: 'rgba(99, 102, 241, 0.12)',
                    muted: '#64748b',
                    gray: '#cbd5e1',
                },
                accent: {
                    indigo: '#6366f1',
                    emerald: '#10b981',
                    rose: '#f43f5e',
                    amber: '#f59e0b',
                }
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
            },
            boxShadow: {
                'card': '0 0 0 1px rgba(99, 102, 241, 0.12)',
                'card-hover': '0 0 0 1px rgba(99, 102, 241, 0.3)',
                'glow': '0 0 24px rgba(99, 102, 241, 0.08)',
                'glow-emerald': '0 0 24px rgba(16, 185, 129, 0.1)',
            },
            animation: {
                'fadeIn': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                'slideUp': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                'pulse-slow': 'pulse 3s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(6px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}

