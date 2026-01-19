/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Ocean Ceylon Holdings Brand Palette (from logo)
                primary: {
                    DEFAULT: '#0056b3', // Logo Blue
                    dark: '#004494',
                    light: '#0066d4',
                },
                secondary: {
                    DEFAULT: '#2ecc71', // Logo Green
                    dark: '#27ae60',
                    light: '#58d68d',
                },
                accent: {
                    DEFAULT: '#2ecc71', // Aliased to Secondary (Green) to remove "Light Blue"
                    dark: '#27ae60',
                    light: '#58d68d',
                },
                navy: {
                    DEFAULT: '#001529', // Deep Navy (for dark sections)
                    dark: '#000d1a',
                    light: '#002845',
                },
                background: {
                    DEFAULT: '#F8F9FA', // Light Gray
                    dark: '#e9ecef',
                },
            },
            fontFamily: {
                sans: ['"Saira Semi Condensed"', 'system-ui', 'sans-serif'],
            },
            animation: {
                'buoyancy': 'buoyancy 6s ease-in-out infinite',
                'buoyancy-slow': 'buoyancy 8s ease-in-out infinite',
                'slide-down': 'slideDown 0.8s ease-out',
            },
            keyframes: {
                buoyancy: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
