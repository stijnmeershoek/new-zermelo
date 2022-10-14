import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/new-zermelo/',
  plugins: [react(), VitePWA({
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    manifest: {
      start_url: "/new-zermelo/",
      name: 'Zermelo',
      short_name: 'Zermelo',
      description: 'Zermelo but Better',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'favicon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    }
  })]
})
