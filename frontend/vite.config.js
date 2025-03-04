import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  server:{
    host: '0.0.0.0',
    port: 5173,
    proxy:{
      '/api':{
        target:'http://localhost:4000',
        ws:true
      }
    }
  },
  plugins: [react(),basicSsl()],
})
