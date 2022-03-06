import { defineNuxtConfig } from "nuxt3";
import { config } from "dotenv";
config();

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({

    // hiding config until we setup DB security 🔒

    publicRuntimeConfig: {
        firebaseApiKey: process.env.FIREBASE_API_KEY || "XXXXXXXXXXXXXXXXX",
        firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || "XXXXXXXXXXXXXXXXX",
        firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "XXXXXXXXXXXXXXXXX",
        firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || "XXXXXXXXXXXXXXXXX",
        firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "XXXXXXXXXXXXXXXXX",
        firebaseAppId: process.env.FIREBASE_APP_ID || "XXXXXXXXXXXXXXXXX",
        firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID || "XXXXXXXXXXXXXXXXX",
    },
    build: {
        postcss: {
            postcssOptions: {
                plugins: {
                    tailwindcss: {},
                    autoprefixer: {},
                },
            }
        },
    },
    css: [
        "@/assets/css/main.css",
    ],
})
