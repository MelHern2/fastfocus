<template>
  <Transition name="notification" appear>
    <div 
      v-if="notification"
      :class="[
        'notification-toast',
        `notification-${notification.type}`,
        { 'notification-closing': isClosing }
      ]"
      @click="closeNotification"
    >
      <div class="notification-icon">
        <span v-if="notification.type === 'success'">✅</span>
        <span v-else-if="notification.type === 'error'">❌</span>
        <span v-else-if="notification.type === 'warning'">⚠️</span>
        <span v-else-if="notification.type === 'info'">ℹ️</span>
        <span v-else>📢</span>
      </div>
      
      <div class="notification-content">
        <h4 v-if="notification.title" class="notification-title">
          {{ notification.title }}
        </h4>
        <p class="notification-message">{{ notification.message }}</p>
      </div>
      
      <button 
        class="notification-close"
        @click.stop="closeNotification"
        aria-label="Cerrar notificación"
      >
        <span>✕</span>
      </button>
      
      <div class="notification-progress" :style="{ width: progressWidth + '%' }"></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
}

const props = defineProps<{
  notification: Notification | null
}>()

const emit = defineEmits<{
  close: [id: string]
}>()

const isClosing = ref(false)
const progressWidth = ref(100)
let progressInterval: NodeJS.Timeout | null = null
let closeTimeout: NodeJS.Timeout | null = null

const duration = computed(() => props.notification?.duration || 5000)

const closeNotification = () => {
  if (!props.notification) return
  
  isClosing.value = true
  
  // Limpiar timeouts
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  
  // Emitir evento después de la animación
  setTimeout(() => {
    emit('close', props.notification.id)
    isClosing.value = false
  }, 300)
}

const startProgress = () => {
  if (!props.notification) return
  
  const startTime = Date.now()
  const totalDuration = duration.value
  
  progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const remaining = Math.max(0, totalDuration - elapsed)
    progressWidth.value = (remaining / totalDuration) * 100
    
    if (remaining <= 0) {
      closeNotification()
    }
  }, 50)
}

onMounted(() => {
  if (props.notification) {
    progressWidth.value = 100
    startProgress()
  }
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
  if (closeTimeout) {
    clearTimeout(closeTimeout)
  }
})
</script>

<style scoped>
.notification-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  min-width: 320px;
  max-width: 400px;
  background: linear-gradient(145deg, #ffffff 0%, var(--gray-50) 100%);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-2xl);
  border: 2px solid var(--gray-200);
  padding: 1rem;
  cursor: pointer;
  transition: var(--transition-normal);
  overflow: hidden;
}

.notification-toast:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2xl);
}

.notification-success {
  border-left: 4px solid var(--success);
}

.notification-error {
  border-left: 4px solid var(--error);
}

.notification-warning {
  border-left: 4px solid var(--warning);
}

.notification-info {
  border-left: 4px solid var(--info);
}

.notification-toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.notification-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 0.25rem 0;
  line-height: 1.25;
}

.notification-message {
  font-size: 0.875rem;
  color: var(--gray-600);
  margin: 0;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--border-radius-sm);
  transition: var(--transition-fast);
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  background: var(--gray-100);
  color: var(--gray-600);
}

.notification-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--gradient-primary);
  transition: width 0.1s linear;
  border-radius: 0 0 var(--border-radius-xl) var(--border-radius-xl);
}

.notification-closing {
  transform: translateX(100%);
  opacity: 0;
}

/* Animaciones */
.notification-enter-active {
  transition: all 0.3s ease;
}

.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Responsive */
@media (max-width: 480px) {
  .notification-toast {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
}
</style>
