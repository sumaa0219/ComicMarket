import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBSs5JZCLyQKUVH_mtng2xln4E3NwmhyFw",
    authDomain: "comicmarket-fd197.firebaseapp.com",
    databaseURL: "https://comicmarket-fd197-default-rtdb.firebaseio.com",
    projectId: "comicmarket-fd197",
    storageBucket: "comicmarket-fd197.appspot.com",
    messagingSenderId: "404228243322",
    appId: "1:404228243322:web:bb816ee97db4c9cfec60c3",
    measurementId: "G-0YQY1JR976"
};

export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const firestore = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)
export const storage = getStorage(firebaseApp)
export const storageRef = ref(storage);
