/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ─── Deep forest / dark crop palette ─── */
        leaf: {
          50:  '#eafff0',
          100: '#c8f7d5',
          200: '#9bedb1',
          300: '#6cdc88',
          400: '#46c468',
          500: '#22a04a',
          600: '#177a39',
          700: '#125e2e',
          800: '#0e4524',
          900: '#0a2e19',
          950: '#06180e',
        },
        moss: {
          400: '#5b8c5a',
          500: '#3e6a4a',
          600: '#2d4f37',
          700: '#1f3826',
          800: '#152a1c',
          900: '#0d1d12',
          950: '#070f08',
        },
        soil: {
          400: '#a87c46',
          500: '#8c6336',
          600: '#704d2c',
          700: '#553a23',
          800: '#3d2a1a',
          900: '#291c11',
        },
        wheat: {
          200: '#fcdc7d',
          300: '#fbc945',
          400: '#f6b119',
          500: '#dd9408',
          600: '#b67307',
        },
        saffron: {
          400: '#ff9b3d',
          500: '#f97316',
          600: '#d8650f',
        },
        lime: {
          400: '#a3e635',
          500: '#84cc16',
        },
        cream: '#f8f5ef',
        'forest-night': '#020a05',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
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
          '0%, 100%': { opacity: '0.7', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 18px rgba(132, 204, 22, 0.3), 0 0 40px rgba(132, 204, 22, 0.15)' },
          '50%':      { boxShadow: '0 0 28px rgba(132, 204, 22, 0.55), 0 0 60px rgba(132, 204, 22, 0.25)' },
        },
        gradientPan: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        orbDrift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':      { transform: 'translate(40px, -30px) scale(1.1)' },
          '66%':      { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.4)' },
        },
        spinSlow: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        rise: {
          '0%':   { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100vh)' },
        },
      },
      animation: {
        sway:        'sway 6s ease-in-out infinite',
        floatY:      'floatY 5s ease-in-out infinite',
        sproutUp:    'sproutUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        breathe:     'breathe 3s ease-in-out infinite',
        shimmer:     'shimmer 1.6s linear infinite',
        glow:        'glow 2.4s ease-in-out infinite',
        gradientPan: 'gradientPan 8s ease-in-out infinite',
        orbDrift:    'orbDrift 18s ease-in-out infinite',
        scanline:    'scanline 3s linear infinite',
        twinkle:     'twinkle 3s ease-in-out infinite',
        spinSlow:    'spinSlow 20s linear infinite',
      },
      boxShadow: {
        leaf:        '0 12px 30px -12px rgba(34, 160, 74, 0.55)',
        soft:        '0 8px 24px rgba(0, 0, 0, 0.18)',
        glow:        '0 0 24px rgba(132, 204, 22, 0.35)',
        'glow-lg':   '0 0 60px rgba(132, 204, 22, 0.45)',
        'glow-amber':'0 0 30px rgba(251, 201, 69, 0.35)',
        'inner-deep':'inset 0 2px 6px rgba(0, 0, 0, 0.45)',
        '3d':        '0 24px 50px -12px rgba(0, 0, 0, 0.45), 0 4px 12px rgba(132, 204, 22, 0.10)',
        '3d-lift':   '0 38px 80px -20px rgba(0, 0, 0, 0.55), 0 8px 24px rgba(132, 204, 22, 0.18)',
      },
      backgroundImage: {
        'mesh-night':
          'radial-gradient(at 12% 18%, rgba(34, 160, 74, 0.35) 0px, transparent 45%),' +
          'radial-gradient(at 88% 12%, rgba(132, 204, 22, 0.25) 0px, transparent 50%),' +
          'radial-gradient(at 50% 95%, rgba(249, 115, 22, 0.20) 0px, transparent 55%),' +
          'radial-gradient(at 78% 68%, rgba(34, 160, 74, 0.20) 0px, transparent 45%),' +
          'linear-gradient(180deg, #06180e 0%, #0d1d12 50%, #06180e 100%)',
        'shimmer-gold':
          'linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(252,217,69,0.55) 50%, rgba(255,255,255,0) 100%)',
        'border-glow':
          'linear-gradient(135deg, rgba(132,204,22,0.7), rgba(34,160,74,0.3), rgba(252,217,69,0.5))',
      },
      perspective: {
        '1000': '1000px',
        '1500': '1500px',
        '2000': '2000px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.perspective-1000':  { perspective: '1000px' },
        '.perspective-1500':  { perspective: '1500px' },
        '.perspective-2000':  { perspective: '2000px' },
        '.preserve-3d':       { transformStyle: 'preserve-3d' },
        '.backface-hidden':   { backfaceVisibility: 'hidden' },
        '.transform-gpu':     { transform: 'translateZ(0)' },
      });
    },
  ],
};
