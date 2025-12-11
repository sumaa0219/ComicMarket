import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import { getPerformance } from "firebase/performance";
import { Buffer } from 'buffer';

// Helper function to decode base64-encoded Firebase config
const getFirebaseConfig = (): FirebaseOptions => {
  // Try to get base64-encoded config from environment variable
  const base64Config = process.env.NEXT_PUBLIC_FIREBASE_CONFIG_BASE64;
  
  if (base64Config) {
    try {
      // Decode base64 string
      const decodedConfig = Buffer.from(base64Config, 'base64').toString('utf-8');
      // Parse JSON
      const config = JSON.parse(decodedConfig) as FirebaseOptions;
      return config;
    } catch (error) {
      console.error('Failed to decode NEXT_PUBLIC_FIREBASE_CONFIG:', error);
      // Fall through to individual environment variables
    }
  }
  
  // Fallback to individual environment variables
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAnbSmGHcxySKrU4cmWPP0XdrznmVvgXQQ",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "c106database.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "c106database",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "c106database.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "14463714830",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:14463714830:web:6856e5db415a5a0cb15e5f",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-JS12EYLG2Z"
  };
};

export const firebaseConfig: FirebaseOptions = getFirebaseConfig();

export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const firestore = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)
export const storage = getStorage(firebaseApp)
export const storageRef = ref(storage);
export const performance = global?.window ? getPerformance(firebaseApp) : null
