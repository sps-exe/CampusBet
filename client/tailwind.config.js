/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Legacy purple theme (kept for backward compat)
        bg: {
          primary: '#0A0A0F',
          secondary: '#111118',
          card: '#16161F',
          elevated: '#1C1C27',
        },
        // NEW: Dark wine-red gaming palette (reference image)
        wine: {
          deepest: '#0F0508',
          darkest: '#150A0A',
          main:    '#1A0810',
          panel:   '#250D12',
          card:    '#321318',
          elevated:'#3D1A1F',
          border:  'rgba(180,40,40,0.25)',
        },
        crimson: {
          DEFAULT: '#C0392B',
          light:   '#E74C3C',
          dark:    '#96281B',
          glow:    'rgba(192,57,43,0.35)',
        },
        credits: {
          DEFAULT: '#E8A020',
          light:   '#F5B942',
          dark:    '#C47D0E',
          glow:    'rgba(232,160,32,0.12)',
        },
        purple: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        // Status colors
        success:  '#4CAF50',
        ingame:   '#FF6B35',
        error:    '#EF4444',
        warning:  '#F59E0B',
        // Text tokens (legacy compat)
        text: {
          primary:   '#F4F4F5',
          secondary: '#A1A1AA',
          muted:     '#52525B',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
        'wine-grid':    "url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(192,57,43,0.07)'/%3E%3C/svg%3E\")",
        'crimson-glow': 'radial-gradient(ellipse at center, rgba(192,57,43,0.18) 0%, transparent 70%)',
        'credits-glow': 'radial-gradient(ellipse at center, rgba(232,160,32,0.15) 0%, transparent 70%)',
        'hero-fade':    'linear-gradient(to right, #321318 30%, transparent 100%)',
        'sidebar-glow': 'radial-gradient(ellipse at left, rgba(192,57,43,0.12) 0%, transparent 60%)',
      },
      boxShadow: {
        'glow-crimson':    '0 0 20px rgba(192, 57, 43, 0.45)',
        'glow-crimson-sm': '0 0 10px rgba(192, 57, 43, 0.3)',
        'glow-credits':    '0 0 20px rgba(232, 160, 32, 0.4)',
        'glow-purple':     '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-cyan':       '0 0 20px rgba(6, 182, 212, 0.4)',
        'glow-purple-sm':  '0 0 10px rgba(139, 92, 246, 0.3)',
        'card':            '0 4px 24px rgba(0,0,0,0.5)',
        'card-lg':         '0 8px 40px rgba(0,0,0,0.6)',
        'wine-card':       '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      animation: {
        'pulse-crimson': 'pulseCrimson 2s ease-in-out infinite',
        'pulse-glow':    'pulseGlow 2s ease-in-out infinite',
        'float':         'float 3s ease-in-out infinite',
        'shimmer':       'shimmer 1.5s infinite',
        'spin-slow':     'spin 3s linear infinite',
      },
      keyframes: {
        pulseCrimson: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(192,57,43,0.3)' },
          '50%':      { boxShadow: '0 0 28px rgba(192,57,43,0.7)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)' },
          '50%':      { boxShadow: '0 0 25px rgba(139, 92, 246, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
