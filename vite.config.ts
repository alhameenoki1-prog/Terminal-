import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size warning limit to avoid warnings with large libs
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'leaflet': ['leaflet', 'react-leaflet'],
          'charts': ['lightweight-charts'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['leaflet', 'react-leaflet', 'lightweight-charts', 'zustand', 'lucide-react', 'date-fns'],
  },
  server: {
    proxy: {
      // Proxy Yahoo Finance to avoid CORS in dev
      '/api/yahoo': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
      },
      // Proxy Binance REST (Binance already allows CORS, but proxy as fallback)
      '/api/binance': {
        target: 'https://api.binance.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/binance/, ''),
      },
    },
  },
})
