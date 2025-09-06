# Desplegar Reglas de Firestore

## Problema Actual
Las reglas de Firestore no permiten crear categorías porque la verificación de administrador no está funcionando correctamente.

## Solución

### Opción 1: Desplegar reglas manualmente (Recomendado)

1. **Ve a la consola de Firebase**: https://console.firebase.google.com/
2. **Selecciona tu proyecto**: `fastfocus-bfdef`
3. **Ve a Firestore Database** → **Reglas**
4. **Reemplaza las reglas actuales** con estas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Función para verificar si el usuario es administrador
    function isAdmin() {
      return request.auth != null && 
             (request.auth.token.email == 'melanasdoblaktocas3@gmail.com' ||
              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
    
    // Reglas para usuarios - permitir que cualquier usuario autenticado cree su propio perfil
    match /users/{userId} {
      // Permitir lectura y escritura solo al usuario autenticado que coincida con el ID del documento
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Permitir lectura a administradores
      allow read: if isAdmin();
    }
    
    // Reglas para categorías
    match /categories/{categoryId} {
      // Permitir lectura a todos los usuarios autenticados
      allow read: if request.auth != null;
      
      // Permitir escritura solo a administradores
      allow write: if isAdmin();
    }
    
    // Reglas por defecto - denegar todo lo demás
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. **Haz clic en "Publicar"**

### Opción 2: Reglas temporales más permisivas

Si las reglas anteriores no funcionan, usa estas reglas temporales (menos seguras):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para usuarios
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reglas para categorías - temporalmente más permisivas
    match /categories/{categoryId} {
      allow read, write: if request.auth != null;
    }
    
    // Reglas por defecto
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Después de desplegar las reglas

1. **Recarga la página** de tu aplicación
2. **Intenta crear una categoría** nuevamente
3. **Debería funcionar** sin errores de permisos

## Nota
Las reglas actualizadas verifican tanto el email del token como el campo `isAdmin` en el perfil del usuario, lo que debería resolver el problema de permisos.






