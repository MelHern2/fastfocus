import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

// Configuración de Firebase del proyecto fastfocus-bfdef
const firebaseConfig = {
  apiKey: "AIzaSyAiQDaWxZZPTci18vBW-ihaMVhEeV9RuXs",
  authDomain: "fastfocus-bfdef.firebaseapp.com",
  databaseURL: "https://fastfocus-bfdef-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fastfocus-bfdef",
  storageBucket: "fastfocus-bfdef.firebasestorage.app",
  messagingSenderId: "441287270247",
  appId: "1:441287270247:web:5f751286441899c63499c2",
  measurementId: "G-F4YER23C94"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar Firestore
export const db = getFirestore(app)

// Inicializar Auth
export const auth = getAuth(app)

// Inicializar Analytics (opcional, solo en el navegador)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

export default app
