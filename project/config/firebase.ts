// Firebase configuration for client-side authentication
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration with your actual project values
const firebaseConfig = {
  apiKey: "AIzaSyAnZJbk6hCAHzGbw3qDZOsG0SlHZB99igA",
  authDomain: "burjcode-profile-dev.firebaseapp.com",
  projectId: "burjcode-profile-dev",
  storageBucket: "burjcode-profile-dev.firebasestorage.app",
  messagingSenderId: "497988055501",
  appId: "1:497988055501:web:aad698c976ae37f920d484",
  measurementId: "G-52Q6NSQPGL"
};

// Initialize Firebase (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export default app;
