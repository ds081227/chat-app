import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "react-chat-app-6d97e.firebaseapp.com",
  projectId: "react-chat-app-6d97e",
  storageBucket: "react-chat-app-6d97e.appspot.com",
  messagingSenderId: "812417670893",
  appId: "1:812417670893:web:bb81a91abd39e6e32276e4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
