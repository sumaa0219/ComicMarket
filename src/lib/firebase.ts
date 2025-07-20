import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import { getPerformance } from "firebase/performance";

export const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyDQJFlRmGUyykofbHt-6EalwIcU6zFEP1Y",
    authDomain: "comicmarket-fork-2.firebaseapp.com",
    projectId: "comicmarket-fork-2",
    storageBucket: "comicmarket-fork-2.appspot.com",
    messagingSenderId: "1034233345680",
    appId: "1:1034233345680:web:e1451144aaa03640bbca15",
    measurementId: "G-WDH291H66W"
};

export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const firestore = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)
export const storage = getStorage(firebaseApp)
export const storageRef = ref(storage);
export const performance = global?.window ? getPerformance(firebaseApp) : null
