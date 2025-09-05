import { ref, computed } from 'vue'
import { useFirestore } from './useFirestore'
import { useAuth } from './useAuth'
import type { 
  Notification, 
  CreateNotificationData, 
  UpdateNotificationData 
} from '@/types/notification'

export function useNotifications() {
  const { 
    loading, 
    error, 
    getCollection, 
    getDocument, 
    addDocument, 
    updateDocument, 
    deleteDocument,
    subscribeToCollection 
  } = useFirestore()
  
  const { user } = useAuth()
  
  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)

  // Obtener notificaciones del usuario actual
  const fetchNotifications = async (userId?: string) => {
    const targetUserId = userId || user.value?.uid
    if (!targetUserId) {
      console.error('No hay usuario autenticado')
      return []
    }

    console.log('=== INICIO fetchNotifications ===')
    console.log('Buscando notificaciones para userId:', targetUserId)
    
    const result = await getCollection('notifications', [
      ['userId', '==', targetUserId]
    ])
    
    notifications.value = result
      .map(notification => ({
        ...notification,
        createdAt: notification.createdAt?.toDate() || new Date(),
        updatedAt: notification.updatedAt?.toDate() || new Date()
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Más recientes primero
    
    // Actualizar contador de no leídas
    unreadCount.value = notifications.value.filter(n => !n.isRead).length
    
    console.log('Notificaciones obtenidas:', notifications.value)
    console.log('Notificaciones no leídas:', unreadCount.value)
    
    return notifications.value
  }

  // Crear una nueva notificación
  const createNotification = async (data: CreateNotificationData) => {
    console.log('=== INICIO createNotification ===')
    console.log('createNotification llamado con:', data)
    
    // No crear notificación si el usuario se está notificando a sí mismo
    if (data.userId === data.data.fromUserId) {
      console.log('No se crea notificación para el mismo usuario')
      return null
    }

    const notificationData: any = {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      data: data.data
    }

    console.log('Datos de la notificación a guardar:', notificationData)

    try {
      const docId = await addDocument('notifications', notificationData)
      console.log('Notificación guardada exitosamente:', docId)
      
      if (docId && user.value?.uid === data.userId) {
        // Actualizar la lista si es para el usuario actual
        await fetchNotifications()
      }
      
      return docId
    } catch (err) {
      console.error('Error en createNotification:', err)
      throw err
    }
  }

  // Marcar notificación como leída
  const markAsRead = async (notificationId: string) => {
    if (!user.value) {
      throw new Error('Usuario no autenticado')
    }

    const updateData: UpdateNotificationData = {
      isRead: true
    }

    const success = await updateDocument('notifications', notificationId, updateData)
    if (success) {
      await fetchNotifications()
    }
    return success
  }

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = async () => {
    if (!user.value) {
      throw new Error('Usuario no autenticado')
    }

    const unreadNotifications = notifications.value.filter(n => !n.isRead)
    
    // Actualizar todas las notificaciones no leídas
    const updatePromises = unreadNotifications.map(notification => 
      updateDocument('notifications', notification.id, { isRead: true })
    )
    
    try {
      await Promise.all(updatePromises)
      await fetchNotifications()
      return true
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error)
      return false
    }
  }

  // Eliminar notificación
  const deleteNotification = async (notificationId: string) => {
    if (!user.value) {
      throw new Error('Usuario no autenticado')
    }

    const success = await deleteDocument('notifications', notificationId)
    if (success) {
      await fetchNotifications()
    }
    return success
  }

  // Eliminar todas las notificaciones leídas
  const deleteAllRead = async () => {
    if (!user.value) {
      throw new Error('Usuario no autenticado')
    }

    const readNotifications = notifications.value.filter(n => n.isRead)
    
    const deletePromises = readNotifications.map(notification => 
      deleteDocument('notifications', notification.id)
    )
    
    try {
      await Promise.all(deletePromises)
      await fetchNotifications()
      return true
    } catch (error) {
      console.error('Error al eliminar notificaciones leídas:', error)
      return false
    }
  }

  // Crear notificación de respuesta
  const createReplyNotification = async (
    parentCommentAuthorId: string,
    parentCommentAuthorName: string,
    parentCommentAuthorEmail: string,
    commentId: string,
    parentCommentId: string,
    entryId: string,
    entryTitle: string,
    replyContent: string
  ) => {
    if (!user.value) {
      throw new Error('Usuario no autenticado')
    }

    const notificationData: CreateNotificationData = {
      userId: parentCommentAuthorId,
      type: 'reply',
      title: 'Nueva respuesta a tu comentario',
      message: `${user.value.displayName || user.value.email?.split('@')[0]} respondió a tu comentario: "${replyContent.substring(0, 100)}${replyContent.length > 100 ? '...' : ''}"`,
      data: {
        commentId,
        parentCommentId,
        entryId,
        entryTitle,
        fromUserId: user.value.uid,
        fromUserName: user.value.displayName || user.value.email?.split('@')[0] || 'Usuario',
        fromUserEmail: user.value.email || ''
      }
    }

    return await createNotification(notificationData)
  }

  // Crear notificación de like
  const createLikeNotification = async (
    commentAuthorId: string,
    commentAuthorName: string,
    commentAuthorEmail: string,
    commentId: string,
    entryId: string,
    entryTitle: string
  ) => {
    if (!user.value) {
      throw new Error('Usuario no autenticado')
    }

    const notificationData: CreateNotificationData = {
      userId: commentAuthorId,
      type: 'like',
      title: 'A alguien le gustó tu comentario',
      message: `${user.value.displayName || user.value.email?.split('@')[0]} le dio like a tu comentario`,
      data: {
        likedCommentId: commentId,
        entryId,
        entryTitle,
        fromUserId: user.value.uid,
        fromUserName: user.value.displayName || user.value.email?.split('@')[0] || 'Usuario',
        fromUserEmail: user.value.email || ''
      }
    }

    return await createNotification(notificationData)
  }

  // Crear notificación de dislike
  const createDislikeNotification = async (
    commentAuthorId: string,
    commentAuthorName: string,
    commentAuthorEmail: string,
    commentId: string,
    entryId: string,
    entryTitle: string
  ) => {
    if (!user.value) {
      throw new Error('Usuario no autenticado')
    }

    const notificationData: CreateNotificationData = {
      userId: commentAuthorId,
      type: 'dislike',
      title: 'A alguien no le gustó tu comentario',
      message: `${user.value.displayName || user.value.email?.split('@')[0]} le dio dislike a tu comentario`,
      data: {
        dislikedCommentId: commentId,
        entryId,
        entryTitle,
        fromUserId: user.value.uid,
        fromUserName: user.value.displayName || user.value.email?.split('@')[0] || 'Usuario',
        fromUserEmail: user.value.email || ''
      }
    }

    return await createNotification(notificationData)
  }

  // Escuchar cambios en tiempo real
  const subscribeToNotifications = (userId?: string, callback?: (notifications: Notification[]) => void) => {
    const targetUserId = userId || user.value?.uid
    if (!targetUserId) {
      console.error('No hay usuario autenticado para suscribirse')
      return null
    }

    console.log('=== INICIO subscribeToNotifications ===')
    console.log('Suscribiéndose a notificaciones para userId:', targetUserId)
    
    return subscribeToCollection('notifications', (docs) => {
      console.log('Datos recibidos de suscripción de notificaciones:', docs)
      
      const notificationsData = docs
        .filter(doc => doc.userId === targetUserId)
        .map(doc => ({
          ...doc,
          createdAt: doc.createdAt?.toDate() || new Date(),
          updatedAt: doc.updatedAt?.toDate() || new Date()
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      
      notifications.value = notificationsData
      unreadCount.value = notificationsData.filter(n => !n.isRead).length
      
      console.log('Notificaciones actualizadas:', notificationsData)
      console.log('Notificaciones no leídas:', unreadCount.value)
      
      if (callback) {
        callback(notificationsData)
      }
    }, [{ field: 'userId', operator: '==', value: targetUserId }])
  }

  return {
    notifications: computed(() => notifications.value),
    unreadCount: computed(() => unreadCount.value),
    loading,
    error,
    fetchNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    createReplyNotification,
    createLikeNotification,
    createDislikeNotification,
    subscribeToNotifications
  }
}
