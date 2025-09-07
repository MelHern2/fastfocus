# Solución para problemas de Firebase con uBlock Origin

## Problemas identificados:
1. **Bloqueo de conexiones a Firestore**: uBlock Origin está bloqueando las conexiones WebSocket a Firebase
2. **Error 400 en registro**: Problema con la API de Identity Toolkit

## Soluciones implementadas:

### 1. Arreglo del error 400 en registro
- ✅ Corregida la función `resendEmailVerification` en `useAuth.ts`
- ✅ Mejorada la función `resendVerification` en `LoginView.vue`
- ✅ Eliminada la creación de usuarios temporales

### 2. Configuración de uBlock Origin

#### Opción A: Agregar reglas de excepción (Recomendado)

1. **Abre uBlock Origin** en tu navegador
2. **Haz clic en el ícono de uBlock Origin** (generalmente en la barra de herramientas)
3. **Haz clic en el ícono de engranaje** ⚙️ para abrir la configuración
4. **Ve a la pestaña "Filtros"**
5. **En la sección "Mis filtros", agrega estas reglas:**

```
# Reglas de excepción para Firebase
@@||firebase.googleapis.com^
@@||identitytoolkit.googleapis.com^
@@||fastfocus-bfdef.firebaseapp.com^
@@||fastfocus-bfdef.firebasestorage.app^
@@||fastfocus-bfdef-default-rtdb.europe-west1.firebasedatabase.app^
@@||googleapis.com^$domain=localhost
@@||googleapis.com^$domain=127.0.0.1
@@||firestore.googleapis.com/google.firestore.v1.Firestore/Listen/channel^
@@||firestore.googleapis.com^$websocket
```

6. **Haz clic en "Aplicar cambios"**
7. **Recarga la página** de tu aplicación

#### Opción B: Deshabilitar uBlock Origin temporalmente

1. **Haz clic en el ícono de uBlock Origin**
2. **Haz clic en el interruptor grande** para deshabilitarlo temporalmente
3. **Recarga la página**
4. **Vuelve a habilitar uBlock Origin** cuando hayas terminado de probar

#### Opción C: Modo de desarrollador

1. **Abre las herramientas de desarrollador** (F12)
2. **Ve a la pestaña "Network"**
3. **Busca las conexiones bloqueadas** a `firebase.googleapis.com`
4. **Haz clic derecho en la conexión bloqueada**
5. **Selecciona "Allow"** para permitir esa conexión específica

## Verificación de la solución:

### Para verificar que Firebase funciona:
1. **Abre la consola del navegador** (F12)
2. **Ve a la pestaña "Console"**
3. **Busca mensajes como:**
   - ✅ "Firebase inicializado correctamente"
   - ✅ "Conexión a Firestore establecida"
   - ❌ "Error de conexión a Firebase"

### Para verificar la autenticación:
1. **Intenta registrarte** con un email nuevo
2. **Verifica que recibes el email de confirmación**
3. **Intenta iniciar sesión** con credenciales válidas

## Archivos modificados:
- `src/composables/useAuth.ts` - Corregida la función de reenvío de verificación
- `src/views/LoginView.vue` - Mejorada la lógica de reenvío de verificación
- `public/firebase-exceptions.txt` - Reglas de excepción para uBlock Origin

## Notas importantes:
- Las reglas de excepción solo afectan a los dominios de Firebase
- No comprometen la seguridad general de tu navegador
- Puedes eliminar las reglas cuando no uses la aplicación
- Si sigues teniendo problemas, considera usar un navegador diferente para desarrollo





