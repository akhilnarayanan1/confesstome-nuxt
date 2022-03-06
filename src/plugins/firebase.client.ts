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
    apiKey: config.firebaseApiKey,
    authDomain: config.firebaseAuthDomain,
    projectId: config.firebaseProjectId,
    storageBucket: config.firebaseStorageBucket,
    messagingSenderId: config.firebaseMessagingSenderId,
    appId: config.firebaseAppId,
    measurementId: config.firebaseMeasurementId,
  };

  const app = initializeApp(firebaseConfig);
  const auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserSessionPersistence, browserLocalPersistence],
  });

  nuxtApp.provide("firebaseApp", app);
  nuxtApp.provide("firebaseAuth", auth);
  nuxtApp.provide("firebaseDB", getFirestore(app));
});