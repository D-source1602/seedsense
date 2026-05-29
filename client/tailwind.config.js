/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Crop / agriculture palette
        leaf: {
          50:  '#f3faf0',
          100: '#e3f4d9',
          200: '#c4e6b0',
          300: '#9fd283',
          400: '#7abe57',
          500: '#5aa838',
          600: '#458829',
          700: '#386b22',
          800: '#2f5520',
          900: '#27451c',
        },
        soil: {
          50:  '#faf5ee',
          100: '#f0e2cc',
          200: '#dec39b',
          300: '#c39d68',
          400: '#a87c46',
          500: '#8c6336',
          600: '#704d2c',
          700: '#553a23',
          800: '#3d2a1a',
          900: '#291c11',
        },
        wheat: {
          50:  '#fff8e6',
          100: '#fdecb8',
          200: '#fcdc7d',
          300: '#fbc945',
          400: '#f6b119',
          500: '#dd9408',
          600: '#b67307',
          700: '#92580a',
          800: '#76450f',
          900: '#5e3811',
        },
        saffron: {
          400: '#ff9b3d',
          500: '#f4801c',
          600: '#d8650f',
        },
        cream: '#f8f5ef',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        sproutUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) scaleY(0.6)' },
          '100%': { opacity: '1', transform: 'translateY(0) scaleY(1)' },
        },
        breathe: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        sway: 'sway 6s ease-in-out infinite',
        floatY: 'floatY 5s ease-in-out infinite',
        sproutUp: 'sproutUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        breathe: 'breathe 2.4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
      boxShadow: {
        leaf: '0 12px 30px -12px rgba(58, 130, 50, 0.45)',
        soft: '0 8px 24px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'field-radial':
          'radial-gradient(circle at 20% 10%, rgba(154,210,131,0.35) 0%, rgba(255,255,255,0) 50%), radial-gradient(circle at 80% 0%, rgba(252,217,69,0.25) 0%, rgba(255,255,255,0) 45%), radial-gradient(circle at 50% 100%, rgba(58,130,50,0.20) 0%, rgba(255,255,255,0) 55%)',
        'shimmer-gold':
          'linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(252,217,69,0.55) 50%, rgba(255,255,255,0) 100%)',
      },
    },
  },
  plugins: [],
};
