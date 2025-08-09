import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import the storage service

const firebaseConfig = {
  apiKey: "AIzaSyBDsoTEPcplN8cw6KtuoQfDonFA6XJBk3w",
  authDomain: "mybloggingapp-c3d04.firebaseapp.com",
  projectId: "mybloggingapp-c3d04",
  storageBucket: "mybloggingapp-c3d04.firebasestorage.app",
  messagingSenderId: "430252143768",
  appId: import.meta.env.VITE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Initialize and export storage
