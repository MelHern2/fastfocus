# Sistema de Notificaciones

Este documento describe el sistema de notificaciones implementado en la aplicación, similar al de YouTube.

## Características

### 🔔 Campanita de Notificaciones
- **Ubicación**: En la barra de navegación, visible solo para usuarios autenticados
- **Indicador visual**: Badge rojo con el número de notificaciones no leídas
- **Animación**: La campanita se agita cuando hay notificaciones nuevas
- **Dropdown**: Al hacer clic se muestra un dropdown con las últimas 5 notificaciones

### 📱 Tipos de Notificaciones

#### 1. Respuestas a Comentarios
- **Cuándo se genera**: Cuando alguien responde a tu comentario
- **Contenido**: Muestra el nombre del usuario y un preview de la respuesta
- **Acción**: Al hacer clic te lleva directamente a la entrada donde está el comentario

#### 2. Likes a Comentarios
- **Cuándo se genera**: Cuando alguien le da like a tu comentario (solo el primer like)
- **Contenido**: Muestra el nombre del usuario que dio like
- **Acción**: Al hacer clic te lleva a la entrada correspondiente

### 🎯 Funcionalidades

#### Campanita de Notificaciones
- **Vista previa**: Muestra las últimas 5 notificaciones
- **Marcar como leída**: Botón para marcar todas como leídas
- **Ver todas**: Enlace para ir a la página completa de notificaciones
- **Tiempo real**: Se actualiza automáticamente cuando llegan nuevas notificaciones

#### Página de Notificaciones (`/notifications`)
- **Lista completa**: Muestra todas las notificaciones del usuario
- **Gestión**: Marcar como leídas, eliminar individuales o todas las leídas
- **Navegación**: Al hacer clic en una notificación te lleva a la entrada correspondiente
- **Filtrado**: Distingue visualmente entre notificaciones leídas y no leídas

### 🛠️ Implementación Técnica

#### Estructura de Datos
```typescript
interface Notification {
  id: string
  userId: string // Usuario que recibe la notificación
  type: 'reply' | 'like' | 'mention'
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
  data: {
    commentId?: string
    parentCommentId?: string
    entryId?: string
    entryTitle?: string
    fromUserId: string
    fromUserName: string
    fromUserEmail: string
  }
}
```

#### Componentes Principales

1. **NotificationBell.vue**: Campanita con dropdown
2. **NotificationsView.vue**: Página completa de notificaciones
3. **useNotifications.ts**: Composable para gestión de notificaciones

#### Integración con Comentarios

El sistema se integra automáticamente con el sistema de comentarios:

- **Al crear una respuesta**: Se genera una notificación para el autor del comentario padre
- **Al dar like**: Se genera una notificación para el autor del comentario (solo el primer like)
- **Prevención de auto-notificaciones**: No se generan notificaciones para acciones propias

### 🔒 Seguridad

#### Reglas de Firestore
```javascript
// Reglas para notificaciones
match /notifications/{notificationId} {
  // Permitir lectura solo al usuario propietario
  allow read: if request.auth != null && 
              request.auth.uid == resource.data.userId;
  
  // Permitir creación a usuarios autenticados
  allow create: if request.auth != null;
  
  // Permitir actualización/eliminación solo al propietario
  allow update, delete: if request.auth != null && 
                        request.auth.uid == resource.data.userId;
}
```

### 🎨 Diseño

#### Colores y Estados
- **No leída**: Fondo azul claro, borde azul, indicador azul
- **Leída**: Fondo blanco, borde gris
- **Hover**: Sombra sutil para indicar interactividad

#### Responsive
- **Desktop**: Dropdown a la derecha de la campanita
- **Mobile**: Dropdown adaptado al ancho de pantalla
- **Página completa**: Layout responsive con acciones apiladas en móvil

### 🚀 Uso

#### Para Usuarios
1. **Ver notificaciones**: Hacer clic en la campanita
2. **Marcar como leída**: Hacer clic en una notificación o usar "Marcar todas como leídas"
3. **Ir a la entrada**: Hacer clic en cualquier notificación
4. **Gestionar**: Ir a `/notifications` para gestión completa

#### Para Desarrolladores
```typescript
// Crear notificación de respuesta
await createReplyNotification(
  parentCommentAuthorId,
  parentCommentAuthorName,
  parentCommentAuthorEmail,
  commentId,
  parentCommentId,
  entryId,
  entryTitle,
  replyContent
)

// Crear notificación de like
await createLikeNotification(
  commentAuthorId,
  commentAuthorName,
  commentAuthorEmail,
  commentId,
  entryId,
  entryTitle
)
```

### 📊 Métricas y Monitoreo

El sistema incluye logging detallado para:
- Creación de notificaciones
- Errores en la generación
- Acciones de usuario (marcar como leída, eliminar)

### 🔄 Actualizaciones en Tiempo Real

- **Suscripción**: El sistema se suscribe a cambios en Firestore
- **Actualización automática**: Las notificaciones se actualizan sin recargar la página
- **Contador**: El badge se actualiza automáticamente

### 🎯 Próximas Mejoras

- [ ] Notificaciones push para navegadores
- [ ] Configuración de preferencias de notificación
- [ ] Notificaciones por email
- [ ] Agrupación de notificaciones similares
- [ ] Notificaciones de menciones en comentarios

