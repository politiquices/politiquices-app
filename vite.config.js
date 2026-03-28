import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  optimizeDeps: {
    include: ['recharts'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
