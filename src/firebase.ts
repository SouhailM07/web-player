// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// Import the functions you need from the SDKs you need

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAO3rZNrasb8dPTBl3BtgV3OOWXWubjMH0",
  authDomain: "web-player-2020d.firebaseapp.com",
  projectId: "web-player-2020d",
  storageBucket: "web-player-2020d.appspot.com",
  messagingSenderId: "961230523176",
  appId: "1:961230523176:web:b8ef4ed3a98b6afcbede1d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
