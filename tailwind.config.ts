import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ios: {
          blue: '#007AFF',
          green: '#34C759',
          orange: '#FF9500',
          red: '#FF3B30',
          purple: '#AF52DE',
          yellow: '#FFCC00',
          bg: '#F2F2F7',
          card: '#FFFFFF',
          'card-dark': '#2C2C2E',
          dark: '#1C1C1E',
          muted: '#8E8E93',
          'muted-dark': '#636366',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        ios: '16px',
        'ios-sm': '12px',
        'ios-lg': '24px',
        'ios-xl': '32px',
        pill: '999px',
      },
      boxShadow: {
        ios: '0 2px 10px rgba(0,0,0,0.05)',
        'ios-md': '0 4px 20px rgba(0,0,0,0.08)',
        'ios-lg': '0 8px 32px rgba(0,0,0,0.12)',
        'ios-xl': '0 16px 48px rgba(0,0,0,0.16)',
      },
      fontFamily: {
        ios: ['-apple-system', 'SF Pro Display', 'SF Pro Text', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'fade-in': 'fade-in 0.3s ease forwards',
      },
    },
  },
  plugins: [],
}

export default config
