import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import { getPerformance } from "firebase/performance";

export const firebaseConfig = {
  apiKey: "AIzaSyAnbSmGHcxySKrU4cmXWP0XdrznmVvgXQQ",
  authDomain: "c106database.firebaseapp.com",
  projectId: "c106database",
  storageBucket: "c106database.firebasestorage.app",
  messagingSenderId: "14463714830",
  appId: "1:14463714830:web:6856e5db415a5a0cb15e5f",
  measurementId: "G-JS12EYLG2Z"
};

export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const firestore = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)
export const storage = getStorage(firebaseApp)
export const storageRef = ref(storage);
export const performance = global?.window ? getPerformance(firebaseApp) : null
