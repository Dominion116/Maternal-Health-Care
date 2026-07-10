import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Frontend on 3001 (matches the backend's FRONTEND_URL default);
    // API requests proxy to the Express backend on 3000. Keeping both on
    // the same port made the proxy point at Vite itself, so every /api
    // call returned the SPA's HTML instead of reaching the backend.
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
