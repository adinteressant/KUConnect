import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://172.18.183.176:4000',
        changeOrigin: true,
        secure: false, 
        ws:true,
      },
    },
  },
  plugins: [react(), basicSsl()],
})
