import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://HARDCODED_IP_HERE',
        changeOrigin: true,
        secure: false, 
      },
    },
  },
  plugins: [react(), basicSsl()],
})
