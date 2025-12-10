import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBLASoEG5NwdnsVov-lvT_KJX1rg-m6QLc",
  authDomain: "study-hub-1297a.firebaseapp.com",
  projectId: "study-hub-1297a",
  storageBucket: "study-hub-1297a.firebasestorage.app",
  messagingSenderId: "278786999386",
  appId: "1:278786999386:web:7f7d9a148714565cd28463",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app

