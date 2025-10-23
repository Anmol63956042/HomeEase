import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on mode (development/production)
  const env = loadEnv(mode, process.cwd(), '')

  const isProduction = mode === 'production'

  return {
    plugins: [react()],
    base: isProduction ? './' : '/',
    build: {
      outDir: 'dist', // Ensure Vercel uses dist
    },
    server: {
      port: 5173, // Local dev port
    },
    define: {
      // Make the backend URL available globally in your frontend
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL),
    },
  }
})
