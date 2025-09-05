# Configuración de Firebase Firestore en Vue 3 + TypeScript

## Pasos para configurar Firebase

### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. En el panel lateral, ve a "Project Settings" (Configuración del proyecto)
4. En la pestaña "General", desplázate hacia abajo hasta "Your apps"
5. Haz clic en el ícono de web (</>) para agregar una aplicación web
6. Dale un nombre a tu aplicación y haz clic en "Register app"
7. Copia la configuración que aparece

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
VITE_FIREBASE_API_KEY=tu-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-messaging-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
```

**⚠️ IMPORTANTE:** 
- Reemplaza los valores con tu configuración real de Firebase
- Nunca subas el archivo `.env` a tu repositorio (ya está en `.gitignore`)
- Para producción, configura las variables de entorno en tu plataforma de hosting

### 3. Habilitar Firestore

1. En Firebase Console, ve a "Firestore Database"
2. Haz clic en "Create database"
3. Selecciona "Start in test mode" (puedes cambiar las reglas de seguridad después)
4. Elige la ubicación de tu base de datos
5. Haz clic en "Done"

### 4. Configurar reglas de seguridad (opcional)

En Firestore Database > Rules, puedes configurar las reglas de seguridad:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura a todos los usuarios
    // (solo para desarrollo - cambiar para producción)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Uso del composable useFirestore

El proyecto incluye un composable `useFirestore` que facilita las operaciones CRUD:

```typescript
import { useFirestore } from '@/composables/useFirestore'

const { 
  loading, 
  error, 
  getCollection, 
  getDocument, 
  addDocument, 
  updateDocument, 
  deleteDocument, 
  subscribeToCollection 
} = useFirestore()

// Obtener todos los documentos de una colección
const documents = await getCollection('users')

// Obtener un documento específico
const document = await getDocument('users', 'document-id')

// Agregar un nuevo documento
const newDocId = await addDocument('users', {
  name: 'Juan Pérez',
  email: 'juan@ejemplo.com'
})

// Actualizar un documento
await updateDocument('users', 'document-id', {
  name: 'Juan Carlos Pérez'
})

// Eliminar un documento
await deleteDocument('users', 'document-id')

// Suscripción en tiempo real
const unsubscribe = subscribeToCollection('users', (documents) => {
  console.log('Documentos actualizados:', documents)
})
```

## Componente de ejemplo

El proyecto incluye un componente `FirestoreExample.vue` que demuestra:
- Formulario para agregar documentos
- Lista de documentos con eliminación
- Suscripción en tiempo real
- Manejo de estados de carga y errores

## Estructura de archivos

```
src/
├── firebase/
│   └── config.ts          # Configuración de Firebase
├── composables/
│   └── useFirestore.ts    # Composable para operaciones CRUD
├── types/
│   └── env.d.ts           # Tipos para variables de entorno
└── components/
    └── FirestoreExample.vue  # Componente de ejemplo
```

## Próximos pasos

1. Configura las variables de entorno con tu proyecto de Firebase
2. Ejecuta `npm run dev` para probar la aplicación
3. Personaliza las reglas de seguridad según tus necesidades
4. Adapta el composable y componentes a tu caso de uso específico

## Recursos adicionales

- [Documentación oficial de Firebase](https://firebase.google.com/docs)
- [Guía de Firestore](https://firebase.google.com/docs/firestore)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
