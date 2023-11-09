// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
      '@nuxt/devtools',
      'nuxt-vuefire',
      '@nuxtjs/tailwindcss',
    ],
    // hiding config until we setup DB security 🔒
    vuefire: {
      auth: {
        enabled: true
      },
      config: {
          apiKey: process.env.FIREBASE_API_KEY || "XXXXXXXXXXXXXXXXX",
          authDomain: process.env.FIREBASE_AUTH_DOMAIN || "XXXXXXXXXXXXXXXXX",
          projectId: process.env.FIREBASE_PROJECT_ID || "XXXXXXXXXXXXXXXXX",
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "XXXXXXXXXXXXXXXXX",
          messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "XXXXXXXXXXXXXXXXX",
          appId: process.env.FIREBASE_APP_ID || "XXXXXXXXXXXXXXXXX",
          measurementId: process.env.FIREBASE_MEASUREMENT_ID || "XXXXXXXXXXXXXXXXX"
      },
    },
	postcss: {
		plugins: {
		  tailwindcss: {},
		  autoprefixer: {},
		}
	  }
})
