// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth }     from 'firebase/auth'
import { getFirestore }from 'firebase/firestore'
import { getStorage }  from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAnZJbk6hCAHzGbw3qDZOsG0SlHZB99igA",
    authDomain: "burjcode-profile-dev.firebaseapp.com",
    projectId: "burjcode-profile-dev",
    storageBucket: "burjcode-profile-dev.firebasestorage.app",
    messagingSenderId: "497988055501",
    appId: "1:497988055501:web:aad698c976ae37f920d484",
    measurementId: "G-52Q6NSQPGL"
};

const app = initializeApp(firebaseConfig)

export const auth    = getAuth(app)
export const db      = getFirestore(app)
export const storage = getStorage(app)
