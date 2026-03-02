/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg:       '#050A14',
          surface:  '#0A0E1A',
          panel:    '#0F1623',
          border:   '#1F2937',
          muted:    '#374151',
          text:     '#F9FAFB',
          dim:      '#9CA3AF',
          faint:    '#4B5563',
          up:       '#10B981',
          down:     '#EF4444',
          accent:   '#F59E0B',
          blue:     '#3B82F6',
          purple:   '#8B5CF6',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Roboto Mono"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.65rem',
        xs:    '0.75rem',
      },
    },
  },
  plugins: [],
}
