import { defineNuxtPlugin } from "#app";

import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { initializeAuth, browserLocalPersistence, browserSessionPersistence, 
  indexedDBLocalPersistence, Auth} from "firebase/auth";

declare module "#app" {
  interface NuxtApp {
    $firebaseApp: FirebaseApp;
    $firebaseAuth: Auth;
    $firebaseDB: Firestore;
  }
};

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId,
  };

  const app = initializeApp(firebaseConfig);
  const auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserSessionPersistence, browserLocalPersistence],
  });
  const db = getFirestore(app);

  nuxtApp.provide("firebaseApp", app);
  nuxtApp.provide("firebaseAuth", auth);
  nuxtApp.provide("firebaseDB", db);
});