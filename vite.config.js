import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/peptide-tracker-app/',
  plugins: [
    react(),
    VitePWA({
      // Ship a self-destroying service worker: it unregisters any previously
      // installed worker and clears its caches, then gets out of the way so the
      // app always loads fresh from the network. This recovers users who were
      // stranded on a stale/broken cached shell (blank screen) without needing
      // them to manually clear site data.
      selfDestroying: true,
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.github\.com\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'github-api', networkTimeoutSeconds: 10 }
          }
        ]
      },
      manifest: {
        name: 'Peptide Tracker',
        short_name: 'PepTrack',
        description: 'Personal peptide protocol tracker',
        theme_color: '#0a0a0f',
        background_color: '#0a0a0f',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/peptide-tracker-app/',
        start_url: '/peptide-tracker-app/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
});
