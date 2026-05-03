import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Bypass the 500kb warning
    rollupOptions: {
      output: {
        manualChunks: undefined // Let Vite handle chunking to avoid Rolldown bugs
      }
    }
  },
  server: {
    port: 8080,
    strictPort: true,
    host: true
  }
});
