<template>
  <div class="notifications-page">
    <div class="page-header">
      <h1>Notificaciones</h1>
      <div class="header-actions">
        <button 
          v-if="unreadCount > 0"
          @click="markAllAsRead" 
          class="btn btn-secondary"
          :disabled="loading"
        >
          {{ loading ? 'Marcando...' : 'Marcar todas como leídas' }}
        </button>
        <button 
          v-if="hasReadNotifications"
          @click="deleteAllRead" 
          class="btn btn-outline"
          :disabled="loading"
        >
          {{ loading ? 'Eliminando...' : 'Eliminar leídas' }}
        </button>
      </div>
    </div>

    <div class="notifications-content">
      <div v-if="loading && notifications.length === 0" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando notificaciones...</p>
      </div>

      <div v-else-if="notifications.length === 0" class="empty-state">
        <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <h2>No tienes notificaciones</h2>
        <p>Cuando alguien responda a tus comentarios o les dé like, aparecerán aquí.</p>
      </div>

      <div v-else class="notifications-list">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification-card"
          :class="{ 'unread': !notification.isRead }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-header">
            <div class="notification-icon">
              <svg v-if="notification.type === 'reply'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <svg v-else-if="notification.type === 'like'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <svg v-else-if="notification.type === 'dislike'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.682 17.682a4.5 4.5 0 000-6.364L12 3.636l-7.682 7.682a4.5 4.5 0 006.364 6.364L12 16.364l1.318 1.318a4.5 4.5 0 006.364 0z" />
              </svg>
              <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div class="notification-info">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
            </div>

            <div class="notification-actions">
              <button 
                v-if="!notification.isRead"
                @click.stop="markAsRead(notification.id)"
                class="mark-read-btn"
                title="Marcar como leída"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              
              <button 
                @click.stop="deleteNotification(notification.id)"
                class="delete-btn"
                title="Eliminar notificación"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div class="notification-content">
            <div class="notification-message">{{ notification.message }}</div>
            
            <div v-if="notification.data.entryTitle" class="notification-context">
              <span class="context-label">En:</span>
              <span class="context-value">{{ notification.data.entryTitle }}</span>
            </div>
          </div>

          <div v-if="!notification.isRead" class="unread-indicator"></div>
        </div>
      </div>
    </div>

    <!-- Loading overlay para acciones -->
    <div v-if="loading && notifications.length > 0" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'
import type { Notification } from '@/types/notification'

const router = useRouter()
const { user } = useAuth()
const { 
  notifications, 
  unreadCount, 
  loading, 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  subscribeToNotifications 
} = useNotifications()

let unsubscribe: (() => void) | null = null

// Computed para verificar si hay notificaciones leídas
const hasReadNotifications = computed(() => {
  return notifications.value.some(n => n.isRead)
})

// Manejar click en notificación
const handleNotificationClick = async (notification: Notification) => {
  // Marcar como leída si no lo está
  if (!notification.isRead) {
    await markAsRead(notification.id)
  }

  // Navegar a la entrada correspondiente
  if (notification.data.entryId) {
    // Si es una notificación de respuesta, navegar al comentario específico
    if (notification.type === 'reply' && notification.data.commentId) {
      router.push(`/entry/${notification.data.entryId}#comment-${notification.data.commentId}`)
    } 
    // Si es una notificación de like, navegar al comentario que recibió el like
    else if (notification.type === 'like' && notification.data.likedCommentId) {
      router.push(`/entry/${notification.data.entryId}#comment-${notification.data.likedCommentId}`)
    }
    // Si es una notificación de dislike, navegar al comentario que recibió el dislike
    else if (notification.type === 'dislike' && notification.data.dislikedCommentId) {
      router.push(`/entry/${notification.data.entryId}#comment-${notification.data.dislikedCommentId}`)
    }
    // Si no hay comentario específico, solo navegar a la entrada
    else {
      router.push(`/entry/${notification.data.entryId}`)
    }
  }
}

// Formatear tiempo
const formatTime = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Hace un momento'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
  } else if (diffInSeconds < 2592000) { // 30 días
    const days = Math.floor(diffInSeconds / 86400)
    return `Hace ${days} día${days > 1 ? 's' : ''}`
  } else {
    // Para fechas más antiguas, mostrar la fecha completa
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// Función para inicializar notificaciones
const initializeNotifications = () => {
  if (user.value && !unsubscribe) {
    // Cargar notificaciones
    fetchNotifications()
    
    // Suscribirse a cambios en tiempo real
    unsubscribe = subscribeToNotifications()
  }
}

// Función para limpiar notificaciones
const cleanupNotifications = () => {
  if (unsubscribe) {
    unsubscribe()
    unsubscribe = null
  }
}

// Observar cambios en el usuario
watch(user, (newUser, oldUser) => {
  if (newUser && !oldUser) {
    // Usuario se autenticó
    initializeNotifications()
  } else if (!newUser && oldUser) {
    // Usuario cerró sesión
    cleanupNotifications()
  }
}, { immediate: true })

onMounted(() => {
  // Inicializar si el usuario ya está autenticado
  initializeNotifications()
})

onUnmounted(() => {
  cleanupNotifications()
})
</script>

<style scoped>
.notifications-page {
  max-width: 4xl;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-outline {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-outline:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #6b7280;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
  max-width: 24rem;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.notification-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.notification-card.unread {
  border-color: #667eea;
  background: #f8faff;
}

.notification-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.notification-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.notification-card.unread .notification-icon {
  background: #dbeafe;
  color: #667eea;
}

.notification-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.notification-info {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.notification-time {
  color: #9ca3af;
  font-size: 0.875rem;
}

.notification-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.mark-read-btn,
.delete-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.mark-read-btn:hover {
  background: #f0f9ff;
  color: #667eea;
}

.delete-btn:hover {
  background: #fef2f2;
  color: #ef4444;
}

.mark-read-btn svg,
.delete-btn svg {
  width: 1rem;
  height: 1rem;
}

.notification-content {
  margin-left: 3.5rem;
}

.notification-message {
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  word-wrap: break-word;
}

.notification-context {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
}

.context-label {
  color: #6b7280;
  font-weight: 500;
}

.context-value {
  color: #667eea;
  font-weight: 500;
}

.unread-indicator {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 0.75rem;
  height: 0.75rem;
  background: #667eea;
  border-radius: 50%;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

@media (max-width: 768px) {
  .notifications-page {
    padding: 1rem 0.5rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .header-actions {
    justify-content: stretch;
  }
  
  .btn {
    flex: 1;
    justify-content: center;
  }
  
  .notification-card {
    padding: 1rem;
  }
  
  .notification-header {
    gap: 0.75rem;
  }
  
  .notification-content {
    margin-left: 3rem;
  }
  
  .notification-actions {
    flex-direction: column;
  }
}
</style>
