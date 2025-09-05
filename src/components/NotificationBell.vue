<template>
  <div class="notification-bell-container" v-if="user">
    <button 
      @click="toggleDropdown" 
      class="notification-bell"
      :class="{ 'has-notifications': unreadCount > 0 }"
      :title="unreadCount > 0 ? `${unreadCount} notificaciones no leídas` : 'Notificaciones'"
    >
      <svg 
        class="bell-icon" 
        :class="{ 'animate': unreadCount > 0 }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      
      <!-- Badge de notificaciones no leídas -->
      <span 
        v-if="unreadCount > 0" 
        class="notification-badge"
        :class="{ 'pulse': unreadCount > 0 }"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown de notificaciones -->
    <div 
      v-if="showDropdown" 
      class="notification-dropdown"
      @click.stop
    >
      <div class="dropdown-header">
        <h3>Notificaciones</h3>
        <div class="header-actions">
          <button 
            v-if="unreadCount > 0"
            @click="markAllAsRead" 
            class="mark-all-read-btn"
            :disabled="loading"
          >
            {{ loading ? 'Marcando...' : 'Marcar todas como leídas' }}
          </button>
          <button 
            @click="closeDropdown" 
            class="close-btn"
            title="Cerrar"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="notifications-content">
        <div v-if="loading" class="loading-notifications">
          <div class="loading-spinner"></div>
          <p>Cargando notificaciones...</p>
        </div>

        <div v-else-if="notifications.length === 0" class="no-notifications">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p>No tienes notificaciones</p>
        </div>

        <div v-else class="notifications-list">
          <div 
            v-for="notification in notifications.slice(0, 5)" 
            :key="notification.id"
            class="notification-item"
            :class="{ 'unread': !notification.isRead }"
            @click="handleNotificationClick(notification)"
          >
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
            
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
            </div>

            <div v-if="!notification.isRead" class="unread-indicator"></div>
          </div>
        </div>

        <div v-if="notifications.length > 5" class="view-all-notifications">
          <button @click="viewAllNotifications" class="view-all-btn">
            Ver todas las notificaciones ({{ notifications.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay para cerrar el dropdown -->
    <div 
      v-if="showDropdown" 
      class="dropdown-overlay" 
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
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
  subscribeToNotifications 
} = useNotifications()

const showDropdown = ref(false)
let unsubscribe: (() => void) | null = null

// Toggle del dropdown
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// Cerrar dropdown
const closeDropdown = () => {
  showDropdown.value = false
}

// Manejar click en notificación
const handleNotificationClick = async (notification: Notification) => {
  // Marcar como leída si no lo está
  if (!notification.isRead) {
    await markAsRead(notification.id)
  }

  // Navegar a la entrada correspondiente
  if (notification.data.entryId) {
    closeDropdown()
    
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

// Ver todas las notificaciones
const viewAllNotifications = () => {
  closeDropdown()
  router.push('/notifications')
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
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `Hace ${days} día${days > 1 ? 's' : ''}`
  }
}

// Cerrar dropdown al hacer click fuera
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.notification-bell-container')) {
    closeDropdown()
  }
}

// Función para inicializar notificaciones
const initializeNotifications = () => {
  if (user.value && user.value.emailVerified && !unsubscribe) {
    // Cargar notificaciones iniciales
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
  
  // Agregar listener para clicks fuera
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  cleanupNotifications()
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.notification-bell-container {
  position: relative;
  display: inline-block;
}

.notification-bell {
  position: relative;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.notification-bell:hover {
  background: #f3f4f6;
  color: #374151;
}

.notification-bell.has-notifications {
  color: #667eea;
}

.bell-icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 0.2s ease;
}

.bell-icon.animate {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.notification-badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  min-width: 1.25rem;
  text-align: center;
  line-height: 1;
}

.notification-badge.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 20rem;
  max-width: 90vw;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  margin-top: 0.5rem;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dropdown-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.mark-all-read-btn {
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.mark-all-read-btn:hover:not(:disabled) {
  background: #f0f9ff;
}

.mark-all-read-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.close-btn svg {
  width: 1rem;
  height: 1rem;
}

.notifications-content {
  max-height: 24rem;
  overflow-y: auto;
}

.loading-notifications {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: #6b7280;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-notifications {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: #6b7280;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.notifications-list {
  padding: 0.5rem 0;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.unread {
  background: #f0f9ff;
  border-left: 3px solid #667eea;
}

.notification-icon {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  color: #6b7280;
}

.notification-item.unread .notification-icon {
  background: #dbeafe;
  color: #667eea;
}

.notification-icon svg {
  width: 1rem;
  height: 1rem;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.notification-message {
  color: #6b7280;
  font-size: 0.8125rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
  word-wrap: break-word;
}

.notification-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

.unread-indicator {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  width: 0.5rem;
  height: 0.5rem;
  background: #667eea;
  border-radius: 50%;
}

.view-all-notifications {
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.view-all-btn {
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.view-all-btn:hover {
  background: #f0f9ff;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

@media (max-width: 640px) {
  .notification-dropdown {
    width: 18rem;
    right: -1rem;
  }
  
  .notification-item {
    padding: 0.5rem 0.75rem;
  }
  
  .notification-message {
    font-size: 0.75rem;
  }
}
</style>
