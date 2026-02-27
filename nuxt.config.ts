// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-vuefire'],

  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL,
      appName: process.env.APP_NAME
    }
  },

  css: ["@/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  vuefire: {
    auth: {
      enabled: true
    },
    config: {
      apiKey: process.env.FB_API_KEY,
      authDomain: process.env.FB_AUTH_DOMAIN,
      projectId: process.env.FB_PROJECT_ID,
      storageBucket: process.env.FB_STORAGE_BUCKET,
      messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
      appId: process.env.FB_APP_ID,
      measurementId: process.env.FB_MEASUREMENT_ID,
    },
  },

  compatibilityDate: '2025-06-18',
})