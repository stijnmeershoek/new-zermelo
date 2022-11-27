import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/new-zermelo/',
  build: {
    target: 'esnext'
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'mstile-150x150.png', 'safari-pinned-tab.svg', '/fonts/HelveticaNow/*.woff2'],
      manifest: {
        start_url: "/new-zermelo/",
        name: 'Zermelo',
        short_name: 'Zermelo',
        description: 'Zermelo but Better',
        theme_color: '#ffffff',
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
              src: "android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
          }
        ]
      },
    }),
  ]
})
