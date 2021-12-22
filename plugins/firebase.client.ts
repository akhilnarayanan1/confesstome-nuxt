//import { defineNuxtPlugin, useState } from '#app'
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import firebaseConfig from '@/assets/js/firebase';
import { initializeAuth, browserLocalPersistence, browserSessionPersistence, indexedDBLocalPersistence, 
  getAuth, onAuthStateChanged, Auth, signInAnonymously, User } from "firebase/auth";

//const firebaseApp = (getApps().length === 0) ? initializeApp(firebaseConfig) : getApp()

const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const auth = initializeAuth(firebaseApp, {
  persistence: [indexedDBLocalPersistence, browserSessionPersistence, browserLocalPersistence] ,
});


export default defineNuxtPlugin(() => {
  useState('firebaseApp', () => firebaseApp)
  useState('auth', () => auth)
})