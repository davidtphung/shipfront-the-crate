import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/shipfront-the-crate/',
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: '../public',
    emptyOutDir: false,
    assetsDir: 'app',
  },
})
