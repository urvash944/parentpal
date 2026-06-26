import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2zdMxqYK4P521RjOnDHVjbhjrUVTItlw",
  authDomain: "parentpal-ef1bb.firebaseapp.com",
  projectId: "parentpal-ef1bb",
  storageBucket: "parentpal-ef1bb.firebasestorage.app",
  messagingSenderId: "191480750319",
  appId: "1:191480750319:web:d4bfd6bb2fa1e3ac997b1a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;