import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  // src/styles/lp.css ships its own reset and is shared with the standalone
  // preview build, so Tailwind's preflight would only fight it.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        ink: '#14181f',
        navy: '#1d3557',
        red: { DEFAULT: '#e63946', dark: '#c92b38' },
        mist: '#f6f7f9',
        paper: '#ffffff',
        line: '#e6e8ec',
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
      },
      maxWidth: { shell: '1180px' },
      borderRadius: { xl2: '18px' },
      boxShadow: {
        card: '0 1px 2px rgba(20,24,31,.04), 0 12px 32px -18px rgba(20,24,31,.28)',
        pop: '0 8px 28px -6px rgba(20,24,31,.18), 0 2px 6px rgba(20,24,31,.06)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: { 'fade-up': 'fade-up .6s cubic-bezier(.22,.61,.36,1) both' },
    },
  },
  plugins: [],
}

export default config
