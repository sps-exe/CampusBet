import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',  // use 'localhost' — avoids macOS EPERM on 127.0.0.1
    port: 5173,
    strictPort: false,  // fall back to next free port automatically
  },
})
