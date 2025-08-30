import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "DuesPay",
        short_name: "DuesPay",
        start_url: "/",
        display: "standalone",
        background_color: "#0f111f",
        theme_color: "#101828",
        orientation: "portrait",
        icons: [
          {
            src: "/duespay-logo-1.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/duespay-logo-1.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  base: '/', 
  server: {
    host: true,
    allowedHosts: [
      'c5a2096501ac.ngrok-free.app',
      'localhost',
      '127.0.0.1',
      'duespay.app',
      '*.duespay.app'
    ],
  },
})
