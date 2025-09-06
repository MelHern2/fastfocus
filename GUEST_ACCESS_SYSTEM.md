# Sistema de Acceso de Invitados

Este documento describe el sistema de acceso de invitados implementado en la aplicación, que permite a usuarios no registrados ver todo el contenido pero con limitaciones en las acciones de interacción.

## Características del Sistema de Invitados

### 🔓 Acceso Completo de Lectura
- **Entradas**: Los invitados pueden ver todas las entradas publicadas
- **Comentarios**: Pueden leer todos los comentarios y respuestas
- **Categorías**: Acceso completo a la información de categorías
- **Navegación**: Acceso a todas las páginas públicas

### 🚫 Limitaciones para Invitados
- **Comentarios**: No pueden crear, editar o eliminar comentarios
- **Likes/Dislikes**: No pueden dar like o dislike a comentarios
- **Notificaciones**: No tienen acceso al sistema de notificaciones
- **Perfil**: No pueden acceder a funciones de perfil de usuario

### 🎯 Experiencia de Usuario

#### Para Invitados
1. **Navegación libre**: Pueden explorar todo el contenido sin restricciones
2. **Visualización de interacciones**: Ven los contadores de likes/dislikes pero no pueden interactuar
3. **Prompts informativos**: Reciben mensajes claros sobre las limitaciones
4. **Opciones de registro**: Fácil acceso para registrarse cuando deseen participar

#### Para Usuarios Autenticados
- **Funcionalidad completa**: Acceso a todas las características
- **Interacción completa**: Pueden comentar, dar likes, recibir notificaciones
- **Gestión de perfil**: Control total sobre su cuenta

## Implementación Técnica

### 🔒 Reglas de Firestore

```javascript
// Reglas para categorías - Acceso público de lectura
match /categories/{categoryId} {
  allow read: if true;  // Todos pueden leer
  allow write: if isAdmin();  // Solo admins pueden escribir
}

// Reglas para entradas - Acceso público de lectura
match /entries/{entryId} {
  allow read: if true;  // Todos pueden leer
  allow write: if isAdmin();  // Solo admins pueden escribir
}

// Reglas para comentarios - Lectura pública, escritura autenticada
match /comments/{commentId} {
  allow read: if true;  // Todos pueden leer
  allow create: if request.auth != null;  // Solo usuarios autenticados
  allow update, delete: if request.auth != null && 
                       request.auth.uid == resource.data.authorId;
}
```

### 🛠️ Componentes Principales

#### 1. GuestPrompt.vue
Componente reutilizable para mostrar mensajes a invitados:
- **Props**: `title`, `message` personalizables
- **Acciones**: Botones para iniciar sesión o continuar como invitado
- **Diseño**: Interfaz atractiva y clara

#### 2. useAuth.ts (Actualizado)
Composable mejorado con información de invitados:
```typescript
const { user, isGuest, isAuthenticated } = useAuth()

// isGuest: true si el usuario no está autenticado
// isAuthenticated: true si el usuario está autenticado
```

#### 3. CommentsSection.vue (Actualizado)
- **Para invitados**: Muestra `GuestPrompt` en lugar del formulario de comentarios
- **Para autenticados**: Funcionalidad completa de comentarios

#### 4. CommentItem.vue (Actualizado)
- **Para invitados**: Muestra contadores de likes/dislikes sin botones interactivos
- **Para autenticados**: Botones completos de interacción

### 🎨 Diseño y UX

#### Estados Visuales
- **Invitados**: Contadores de interacción en estilo "solo lectura"
- **Autenticados**: Botones interactivos con estados activos
- **Prompts**: Diseño atractivo que invita al registro

#### Mensajes Informativos
- **Claros y concisos**: Explican qué pueden y no pueden hacer
- **Call-to-action**: Botones prominentes para iniciar sesión
- **No intrusivos**: No bloquean la experiencia de lectura

### 📱 Responsive Design
- **Mobile**: Prompts y botones adaptados para pantallas pequeñas
- **Desktop**: Layout optimizado para interacciones de escritorio
- **Tablet**: Experiencia intermedia adaptada

## Flujo de Usuario

### 1. Usuario Invitado Navega
```
Usuario no autenticado → Ve contenido completo → Intenta interactuar → Ve prompt de invitado
```

### 2. Opciones del Invitado
```
Prompt de invitado → [Iniciar Sesión] o [Continuar como Invitado]
```

### 3. Transición a Usuario Autenticado
```
Iniciar Sesión → Autenticación exitosa → Acceso completo a funcionalidades
```

## Beneficios del Sistema

### 🎯 Para el Negocio
- **Mayor alcance**: Contenido accesible sin barreras de registro
- **Conversión**: Invitados pueden convertirse en usuarios registrados
- **SEO**: Contenido indexable por motores de búsqueda
- **Engagement**: Usuarios pueden explorar antes de comprometerse

### 👥 Para los Usuarios
- **Acceso inmediato**: No necesitan registrarse para leer
- **Exploración libre**: Pueden evaluar el contenido antes de registrarse
- **Transición suave**: Proceso de registro opcional y no forzado
- **Experiencia completa**: Acceso a todo el contenido público

### 🔧 Para los Desarrolladores
- **Código limpio**: Separación clara entre funcionalidades de invitado y autenticado
- **Reutilizable**: Componentes como `GuestPrompt` son reutilizables
- **Mantenible**: Lógica clara y bien documentada
- **Escalable**: Fácil agregar nuevas funcionalidades para invitados

## Casos de Uso

### 📖 Lectura de Contenido
- **Entradas**: Acceso completo a artículos y posts
- **Comentarios**: Pueden leer todas las conversaciones
- **Navegación**: Acceso a todas las páginas públicas

### 💬 Interacción Limitada
- **Visualización**: Ven likes, dislikes, respuestas
- **Sin participación**: No pueden comentar o reaccionar
- **Información**: Reciben prompts informativos sobre limitaciones

### 🔄 Transición a Usuario
- **Momento de conversión**: Cuando intentan interactuar
- **Proceso suave**: Registro opcional y no forzado
- **Retención**: Pueden continuar como invitados si prefieren

## Próximas Mejoras

### 🚀 Funcionalidades Adicionales
- [ ] Compartir contenido (para invitados)
- [ ] Suscripción a newsletter (sin registro)
- [ ] Acceso a contenido premium con registro
- [ ] Modo de lectura offline

### 📊 Analytics y Métricas
- [ ] Tracking de comportamiento de invitados
- [ ] Métricas de conversión invitado → usuario
- [ ] Análisis de contenido más visto por invitados

### 🎨 Mejoras de UX
- [ ] Onboarding para nuevos usuarios
- [ ] Tutorial interactivo para invitados
- [ ] Personalización de prompts según el contexto





