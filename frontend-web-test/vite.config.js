import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'pdfjs-dist/build/pdf.mjs': 'pdfjs-dist/legacy/build/pdf.mjs',
      'pdfjs-dist/build/pdf.worker.min.mjs': 'pdfjs-dist/legacy/build/pdf.worker.mjs',
      'pdfjs-dist/build/pdf.worker.mjs': 'pdfjs-dist/legacy/build/pdf.worker.mjs',
    },
  },
  server: {
    proxy: {
      '/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        credentials: true,
      },
    },
  },
})
