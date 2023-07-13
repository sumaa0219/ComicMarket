import { initializeApp, apps } from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


// Firebaseの初期化
const firebaseConfig = {
  apiKey: "AIzaSyBSs5JZCLyQKUVH_mtng2xln4E3NwmhyFw",
  authDomain: "comicmarket-fd197.firebaseapp.com",
  projectId: "comicmarket-fd197",
  storageBucket: "comicmarket-fd197.appspot.com",
  messagingSenderId: "404228243322",
  appId: "1:404228243322:web:bb816ee97db4c9cfec60c3",
  measurementId: "G-0YQY1JR976"
};


// Firebaseの初期化と初期化済みのインスタンスの再利用
if (!apps.length) {
  initializeApp(firebaseConfig);
}

const database = firebase.database();
const auth = firebase.auth();

export { auth, database };
