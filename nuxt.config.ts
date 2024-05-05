// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
      '@nuxt/devtools',
      '@nuxtjs/tailwindcss',
      '@nuxt/image',
      'nuxt-vuefire',
    ],
    css: ["@/assets/css/main.css"],
    // hiding config until we setup DB security 🔒
    vuefire: {
      auth: {
        enabled: true
      },
      config: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      },
    },
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      }
    },
})
