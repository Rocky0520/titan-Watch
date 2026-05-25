import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration using environment variables
// Sensible fallbacks are provided so the application loads without crashing
// if keys are not yet configured in the .env file.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "placeholder-api-key-replace-me",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "titan-watch-auth.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "titan-watch-auth",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "titan-watch-auth.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
