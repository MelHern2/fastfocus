import { ref } from 'vue'

export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
}

// Estado global para las notificaciones
const globalToastState = {
  notifications: ref<ToastNotification[]>([])
}

export function useToast() {
  const addNotification = (notification: Omit<ToastNotification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newNotification: ToastNotification = {
      id,
      duration: 5000, // 5 segundos por defecto
      ...notification
    }
    
    globalToastState.notifications.value.push(newNotification)
    
    // Auto-remove after duration
    setTimeout(() => {
      removeNotification(id)
    }, newNotification.duration)
    
    return id
  }
  
  const removeNotification = (id: string) => {
    const index = globalToastState.notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      globalToastState.notifications.value.splice(index, 1)
    }
  }
  
  const clearAll = () => {
    globalToastState.notifications.value = []
  }
  
  // Métodos de conveniencia
  const success = (message: string, title?: string, duration?: number) => {
    return addNotification({ type: 'success', message, title, duration })
  }
  
  const error = (message: string, title?: string, duration?: number) => {
    return addNotification({ type: 'error', message, title, duration })
  }
  
  const warning = (message: string, title?: string, duration?: number) => {
    return addNotification({ type: 'warning', message, title, duration })
  }
  
  const info = (message: string, title?: string, duration?: number) => {
    return addNotification({ type: 'info', message, title, duration })
  }
  
  return {
    notifications: globalToastState.notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }
}
