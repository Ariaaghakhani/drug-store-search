// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@vite-pwa/nuxt',
  ],
  css: ['~/assets/style/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  eslint: {},
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'دارو پلاس',
      short_name: 'داروپلاس',
      theme_color: '#2C7A7B',
      background_color: '#ffffff',
      icons: [
        {
          src: '/seo/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/seo/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/seo/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
})
