import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy Yahoo Finance to avoid CORS in dev
      '/api/yahoo': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
      },
      '/api/binance': {
        target: 'https://api.binance.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/binance/, ''),
      },
      '/api/fred': {
        target: 'https://api.stlouisfed.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fred/, ''),
      },
      // Stooq.com — free sovereign yield data (JP 2Y, DE 10Y, UK 10Y, etc.)
      '/api/stooq': {
        target: 'https://stooq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stooq/, ''),
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NEXUS/5.0)' },
      },
      // CFTC public Socrata API — free COT positioning data, no key required
      '/api/cftc': {
        target: 'https://publicreporting.cftc.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cftc/, ''),
      },
      // CBOE CDN — daily put/call ratio JSON, no key required
      '/api/cboe': {
        target: 'https://cdn.cboe.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cboe/, ''),
      },
    },
  },
  worker: {
    format: 'es',
  },
})
