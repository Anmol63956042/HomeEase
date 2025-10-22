import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // detect environment
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    plugins: [react()],
    base: isProduction ? './' : '/', // ✅ adjusts automatically
    build: {
      outDir: 'dist', // ✅ ensure Vercel uses dist
    },
    server: {
      port: 5173, // optional — set your local dev port
    },
  }
})
