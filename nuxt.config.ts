// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@pinia/nuxt', '@nuxt/ui'],
  css: ['~/assets/style/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  eslint: {},
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
})
