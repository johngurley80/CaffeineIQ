/** @type {import('tailwindcss').Config} */
const tokens = require('./tokens.json');

module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{md,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: tokens.colors.background,
        surface: tokens.colors.surface,
        'surface-muted': tokens.colors['surface-muted'],
        border: tokens.colors.border,
        'border-strong': tokens.colors['border-strong'],
        accent: {
          DEFAULT: tokens.colors.accent,
          hover: tokens.colors['accent-hover'],
          dim: tokens.colors['accent-dim'],
          soft: tokens.colors['accent-soft'],
        },
        ink: {
          DEFAULT: tokens.colors.ink,
          dim: tokens.colors['ink-dim'],
        },
        warning: {
          DEFAULT: tokens.colors.warning,
          dim: tokens.colors['warning-dim'],
        },
        danger: {
          DEFAULT: tokens.colors.danger,
          dim: tokens.colors['danger-dim'],
        },
        text: {
          primary: tokens.colors['text-primary'],
          secondary: tokens.colors['text-secondary'],
          tertiary: tokens.colors['text-tertiary'],
          'on-accent': tokens.colors['text-on-accent'],
        },
      },
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        ui: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        eyebrow: ['11px', { lineHeight: '1.55', letterSpacing: '0.16em' }],
        label: ['12px', { lineHeight: '1.4' }],
        body: ['14px', { lineHeight: '1.55' }],
        base: ['16px', { lineHeight: '1.6' }],
        lg: ['18px', { lineHeight: '1.55' }],
        xl: ['22px', { lineHeight: '1.4' }],
        '2xl': ['28px', { lineHeight: '1.1' }],
        '3xl': ['32px', { lineHeight: '1.05' }],
        number: ['64px', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'number-time': ['56px', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
      },
      spacing: {
        section: '96px',
        'section-sm': '64px',
        hero: '88px',
        'hero-sm': '56px',
        wrap: '28px',
        'wrap-sm': '18px',
      },
      maxWidth: {
        wrap: '1200px',
      },
      borderRadius: {
        xs: '8px',
        sm: '10px',
        md: '12px',
        lg: '14px',
        xl: '16px',
        '2xl': '18px',
        '3xl': '20px',
      },
      borderWidth: {
        DEFAULT: '1px',
        thick: '3px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,25,23,0.025), 0 8px 24px -16px rgba(28,25,23,0.08)',
        pill: '0 1px 2px rgba(28,25,23,0.025)',
        thumb: '0 1px 2px rgba(28,25,23,0.12), 0 0 0 4px rgba(30,45,74,0.12)',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(.22, .61, .36, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
