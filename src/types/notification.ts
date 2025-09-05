export interface Notification {
  id: string
  userId: string // Usuario que recibe la notificación
  type: 'reply' | 'like' | 'dislike' | 'mention' // Tipo de notificación
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
  
  // Datos específicos según el tipo
  data: {
    // Para respuestas
    commentId?: string
    parentCommentId?: string
    entryId?: string
    entryTitle?: string
    
    // Para likes
    likedCommentId?: string
    
    // Para dislikes
    dislikedCommentId?: string
    
    // Para menciones
    mentionedInCommentId?: string
    
    // Información del usuario que generó la notificación
    fromUserId: string
    fromUserName: string
    fromUserEmail: string
  }
}

export interface CreateNotificationData {
  userId: string
  type: 'reply' | 'like' | 'dislike' | 'mention'
  title: string
  message: string
  data: {
    commentId?: string
    parentCommentId?: string
    entryId?: string
    entryTitle?: string
    likedCommentId?: string
    dislikedCommentId?: string
    mentionedInCommentId?: string
    fromUserId: string
    fromUserName: string
    fromUserEmail: string
  }
}

export interface UpdateNotificationData {
  isRead?: boolean
}
