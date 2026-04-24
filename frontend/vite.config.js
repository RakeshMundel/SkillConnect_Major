import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/allprofiles': 'http://localhost:4000',
      '/record-hiring': 'http://localhost:4000',
      '/check-hiring': 'http://localhost:4000',
      '/retrieve-session': 'http://localhost:4000',
      '/propage': 'http://localhost:4000',
      '/create-checkout-session': 'http://localhost:4000',
      '/hired-professionals': 'http://localhost:4000',
      '/search': 'http://localhost:4000',
      '/topprofessional': 'http://localhost:4000',
      '/upload': 'http://localhost:4000',
      '/addprofile': 'http://localhost:4000',
      '/images': 'http://localhost:4000',
    }
  }
})
