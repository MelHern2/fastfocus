# Personalización del Correo de Verificación de Firebase

## 🇪🇸 Cambiar el idioma del correo a español

### 1. Acceder a la Consola de Firebase

1. Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Navega a **Authentication** > **Templates** (Plantillas)

### 2. Personalizar la Plantilla de Verificación

1. En la sección **Email templates**, busca **Email address verification**
2. Haz clic en **Customize** (Personalizar)
3. Cambia el idioma a **Español** en el selector de idioma
4. Personaliza el contenido del correo:

**Asunto sugerido:**
```
Verifica tu dirección de correo electrónico
```

**Contenido sugerido:**
```
¡Hola!

Gracias por registrarte en nuestra plataforma. Para completar tu registro, necesitamos verificar tu dirección de correo electrónico.

Haz clic en el siguiente enlace para verificar tu cuenta:

[Enlace de verificación]

Si no creaste una cuenta con nosotros, puedes ignorar este correo.

¡Gracias por unirte a nosotros!

El equipo de [Nombre de tu aplicación]
```

5. Haz clic en **Save** (Guardar)

## 🔗 Personalizar la URL de verificación

### 1. Configurar Dominio Personalizado

1. En la consola de Firebase, ve a **Authentication** > **Settings** (Configuración)
2. Busca la sección **Authorized domains** (Dominios autorizados)
3. Agrega tu dominio personalizado (ej: `tudominio.com`)

### 2. Configurar Redirect URL

1. En **Authentication** > **Settings** > **Authorized domains**
2. Agrega la URL donde quieres que redirija después de la verificación:
   ```
   https://tudominio.com/verificacion-exitosa
   ```

### 3. Configurar en el Código (Opcional)

Si quieres manejar la verificación en tu aplicación, puedes agregar esto a tu código:

```javascript
// En useAuth.ts
import { getAuth, sendEmailVerification } from 'firebase/auth'

const resendEmailVerification = async () => {
  const auth = getAuth()
  const user = auth.currentUser
  
  if (user) {
    await sendEmailVerification(user, {
      url: 'https://tudominio.com/verificacion-exitosa'
    })
  }
}
```

## 📧 Plantilla de Correo Completa en Español

```
Asunto: Verifica tu dirección de correo electrónico

¡Hola!

Gracias por registrarte en nuestra plataforma. Para completar tu registro y acceder a todas las funciones, necesitamos verificar tu dirección de correo electrónico.

Haz clic en el siguiente enlace para verificar tu cuenta:

[Enlace de verificación]

Este enlace expirará en 3 días por motivos de seguridad.

Si no creaste una cuenta con nosotros, puedes ignorar este correo de forma segura.

Si tienes problemas para hacer clic en el enlace, copia y pega la siguiente URL en tu navegador:
[URL completa]

¡Gracias por unirte a nosotros!

El equipo de [Nombre de tu aplicación]

---
Este es un correo automático, por favor no respondas a este mensaje.
```

## 🔧 Configuración Adicional

### Personalizar el Remitente

1. En **Authentication** > **Settings** > **Email templates**
2. Configura el **Sender name** (Nombre del remitente)
3. Configura el **Sender email** (si tienes un dominio personalizado)

### Configurar Página de Verificación Exitosa

Crea una página en tu aplicación para mostrar cuando el usuario verifica su correo:

```vue
<!-- VerificacionExitosa.vue -->
<template>
  <div class="verification-success">
    <h1>¡Email Verificado!</h1>
    <p>Tu dirección de correo ha sido verificada exitosamente.</p>
    <router-link to="/login" class="btn btn-primary">
      Continuar al Login
    </router-link>
  </div>
</template>
```

## ✅ Verificar los Cambios

1. Registra un nuevo usuario de prueba
2. Revisa el correo recibido
3. Verifica que:
   - El correo esté en español
   - La URL no contenga referencias obvias a Firebase
   - El enlace funcione correctamente
   - La redirección funcione como esperado

## 🚨 Notas Importantes

- Los cambios en las plantillas pueden tardar unos minutos en aplicarse
- Siempre prueba con un correo real antes de usar en producción
- Mantén una copia de seguridad de las plantillas originales
- Considera agregar tu logo o branding al correo si es posible
