const { initializeApp } = require('firebase/app');
const { getFirestore, connectFirestoreEmulator } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAiQDaWxZZPTci18vBW-ihaMVhEeV9RuXs",
  authDomain: "fastfocus-bfdef.firebaseapp.com",
  databaseURL: "https://fastfocus-bfdef-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fastfocus-bfdef",
  storageBucket: "fastfocus-bfdef.firebasestorage.app",
  messagingSenderId: "441287270247",
  appId: "1:441287270247:web:5f751286441899c63499c2",
  measurementId: "G-F4YER23C94"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('Firebase inicializado correctamente');
console.log('Proyecto:', firebaseConfig.projectId);





