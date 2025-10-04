// Firebase configuration for client-side authentication
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

export default app;
