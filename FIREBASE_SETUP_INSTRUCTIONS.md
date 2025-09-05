# Configuración de Firebase para el Sistema de Administración

## 🔥 Configuración de Firebase Auth

### 1. Habilitar Métodos de Autenticación

En la consola de Firebase:

1. Ve a **Authentication** > **Sign-in method**
2. Habilita los siguientes proveedores:
   - ✅ **Email/Password**
   - ✅ **Google**

### 2. Configurar Google Sign-In

1. En **Google** provider:
   - Habilita el proveedor
   - Agrega tu dominio autorizado (ej: `localhost` para desarrollo)
   - Configura el email de soporte

## 🗄️ Configuración de Firestore

### 1. Crear Base de Datos

1. Ve a **Firestore Database**
2. Crea una nueva base de datos
3. Selecciona **modo de producción** (más seguro)

### 2. Configurar Reglas de Seguridad

1. Ve a **Firestore Database** > **Rules**
2. Reemplaza las reglas existentes con el contenido de `firestore.rules`

### 3. Estructura de Datos

El sistema creará automáticamente estas colecciones:

```
users/
  {userId}/
    - email: string
    - displayName: string
    - photoURL: string
    - isAdmin: boolean
    - createdAt: timestamp
    - updatedAt: timestamp

categories/
  {categoryId}/
    - name: string
    - description: string
    - parentId: string (opcional)
    - createdAt: timestamp
    - updatedAt: timestamp
```

## 👤 Usuario Administrador

### Crear Usuario Administrador

1. Ve a **Authentication** > **Users**
2. Haz clic en **Add user**
3. Crea el usuario con:
   - **Email**: `melanasdoblaktocas3@gmail.com`
   - **Password**: (elige una contraseña segura)

### Verificar Permisos

El sistema automáticamente:
- ✅ Detecta si el email es `melanasdoblaktocas3@gmail.com`
- ✅ Marca al usuario como administrador
- ✅ Permite acceso al panel de administración

## 🚀 Probar el Sistema

### 1. Registro/Login Normal

1. Ve a `/login`
2. Registra un usuario normal (cualquier email)
3. Verifica que NO vea el botón "Admin"

### 2. Login como Administrador

1. Ve a `/login`
2. Inicia sesión con `melanasdoblaktocas3@gmail.com`
3. Verifica que SÍ vea el botón "Admin"
4. Haz clic en "Admin" para acceder al panel

### 3. Gestión de Categorías

1. En el panel de administración
2. Crea, edita y elimina categorías
3. Verifica que los datos se guarden en Firestore

## 🔧 Solución de Problemas

### Error: "Permission denied"

- Verifica que las reglas de Firestore estén configuradas correctamente
- Asegúrate de que el usuario esté autenticado

### Error: "User not found"

- Verifica que el usuario esté creado en Firebase Auth
- Revisa que el email sea exactamente `melanasdoblaktocas3@gmail.com`

### Botón Admin no aparece

- Verifica en la consola del navegador los logs de depuración
- Asegúrate de que el usuario esté autenticado correctamente

## 📝 Notas Importantes

- El sistema crea automáticamente perfiles de usuario en Firestore
- Solo el email `melanasdoblaktocas3@gmail.com` tiene permisos de administrador
- Las reglas de Firestore protegen los datos y solo permiten acceso autorizado
- El sistema funciona tanto con login por email como con Google Sign-In

