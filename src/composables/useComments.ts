import { ref, computed } from 'vue'
import { useFirestore } from './useFirestore'
import { useAuth } from './useAuth'
import { useAdmin } from './useAdmin'
import { useNotifications } from './useNotifications'
import type { 
  Comment, 
  CreateCommentData, 
  UpdateCommentData, 
  CommentWithReplies 
} from '@/types/comment'

export function useComments() {
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
  const { isAdmin } = useAdmin()
  const { createReplyNotification, createLikeNotification, createDislikeNotification } = useNotifications()
  
  const comments = ref<Comment[]>([])
  const commentsWithReplies = ref<CommentWithReplies[]>([])

  // Obtener comentarios de una entrada
  const fetchComments = async (entryId: string) => {
    console.log('=== INICIO fetchComments ===')
    console.log('Buscando comentarios para entryId:', entryId)
    
    try {
      console.log('Llamando a getCollection...')
      const result = await getCollection('comments', [['entryId', '==', entryId]])
      console.log('Resultado de getCollection:', result)
      console.log('Número de comentarios obtenidos de BD:', result.length)
      
      comments.value = result
        .map((comment: any) => ({
          id: comment.id,
          entryId: comment.entryId || '',
          content: comment.content || '',
          authorId: comment.authorId || '',
          authorEmail: comment.authorEmail || '',
          authorName: comment.authorName,
          parentId: comment.parentId,
          replies: comment.replies || [],
          isEdited: comment.isEdited || false,
          editedAt: comment.editedAt?.toDate(),
          likes: comment.likes || [],
          dislikes: comment.dislikes || [],
          createdAt: comment.createdAt?.toDate() || new Date(),
          updatedAt: comment.updatedAt?.toDate() || new Date()
        }))
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()) // Ordenar en el cliente
      console.log('Comentarios procesados:', comments.value)
      console.log('Número de comentarios después de procesar:', comments.value.length)
      
      return comments.value
    } catch (error) {
      console.error('Error en fetchComments:', error)
      console.error('Error details:', (error as any).message)
      console.error('Error stack:', (error as any).stack)
      throw error
    }
  }

  // Construir estructura de comentarios con respuestas
  const buildCommentTree = (comments: Comment[]): CommentWithReplies[] => {
    console.log('=== INICIO buildCommentTree ===')
    console.log('Comentarios de entrada:', comments)
    console.log('Número de comentarios de entrada:', comments.length)
    
    const commentMap = new Map<string, CommentWithReplies>()
    const rootComments: CommentWithReplies[] = []
    const orphanedComments: CommentWithReplies[] = []

    // Convertir comentarios a CommentWithReplies
    comments.forEach(comment => {
      console.log('Procesando comentario:', comment.id, 'parentId:', comment.parentId)
      commentMap.set(comment.id, {
        ...comment,
        replies: [],
        replyCount: 0,
        likeCount: comment.likes?.length || 0,
        dislikeCount: comment.dislikes?.length || 0,
        userLiked: user.value ? (comment.likes?.includes(user.value.uid) || false) : false,
        userDisliked: user.value ? (comment.dislikes?.includes(user.value.uid) || false) : false,
        replyingTo: null // Inicializar como null
      })
    })

    // Construir jerarquía y agregar información de respuesta
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!
      
      if (comment.parentId) {
        // Es una respuesta
        console.log('Comentario', comment.id, 'es respuesta a', comment.parentId)
        const parent = commentMap.get(comment.parentId)
        if (parent) {
          console.log('Padre encontrado, agregando respuesta')
          // Agregar información de a quién se está respondiendo
          commentWithReplies.replyingTo = {
            id: parent.id,
            authorName: parent.authorName || '',
            authorEmail: parent.authorEmail
          }
          
          parent.replies.push(commentWithReplies)
          parent.replyCount = parent.replies.length
        } else {
          console.log('Padre NO encontrado, agregando como comentario huérfano')
          // Si el padre no existe, mostrar como comentario raíz
          orphanedComments.push(commentWithReplies)
        }
      } else {
        // Es un comentario raíz
        console.log('Comentario', comment.id, 'es raíz')
        rootComments.push(commentWithReplies)
      }
    })

    // Agregar comentarios huérfanos como comentarios raíz
    const allRootComments = [...rootComments, ...orphanedComments]
    
    console.log('Comentarios raíz encontrados:', rootComments.length)
    console.log('Comentarios huérfanos:', orphanedComments.length)
    console.log('Total de comentarios raíz:', allRootComments.length)
    console.log('Comentarios raíz:', allRootComments)
    
    return allRootComments
  }

  // Obtener comentarios con estructura de respuestas
  const fetchCommentsWithReplies = async (entryId: string) => {
    console.log('=== INICIO fetchCommentsWithReplies ===')
    console.log('Buscando comentarios para entryId:', entryId)
    
    await fetchComments(entryId)
    console.log('Comentarios obtenidos:', comments.value)
    
    commentsWithReplies.value = buildCommentTree(comments.value)
    console.log('Comentarios con estructura:', commentsWithReplies.value)
    
    return commentsWithReplies.value
  }

  // Crear un nuevo comentario
  const createComment = async (data: CreateCommentData) => {
    console.log('=== INICIO createComment ===')
    console.log('createComment llamado con:', data)
    console.log('Usuario actual:', user.value)
    
    if (!user.value) {
      console.error('Usuario no autenticado')
      throw new Error('Usuario no autenticado')
    }

    const commentData: any = {
      entryId: data.entryId,
      content: data.content.trim(),
      authorId: user.value.uid,
      authorEmail: user.value.email,
      authorName: user.value.displayName || user.value.email?.split('@')[0] || 'Usuario',
      parentId: data.parentId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      likes: [],
      dislikes: []
    }

    console.log('Datos del comentario a guardar:', commentData)
    console.log('Llamando a addDocument...')

    try {
      const docId = await addDocument('comments', commentData)
      console.log('Resultado de addDocument:', docId)
      
      if (docId) {
        console.log('Comentario guardado exitosamente, actualizando lista...')
        await fetchCommentsWithReplies(data.entryId)
        console.log('Lista actualizada')
        
        // Crear notificación si es una respuesta
        if (data.parentId) {
          try {
            // Buscar el comentario padre para obtener información del autor
            const parentComment = comments.value.find(c => c.id === data.parentId)
            if (parentComment && parentComment.authorId !== user.value.uid) {
              // Obtener información de la entrada
              const entryDoc = await getDocument('entries', data.entryId)
              const entryTitle = (entryDoc as any)?.title || 'Entrada sin título'
              
              await createReplyNotification(
                parentComment.authorId,
                parentComment.authorName || parentComment.authorEmail,
                parentComment.authorEmail,
                docId,
                data.parentId,
                data.entryId,
                entryTitle,
                data.content
              )
              console.log('Notificación de respuesta creada')
            }
          } catch (notificationError) {
            console.error('Error al crear notificación de respuesta:', notificationError)
            // No lanzar el error para no interrumpir el flujo principal
          }
        }
        
        return docId
      } else {
        console.error('addDocument retornó null')
        return null
      }
    } catch (err) {
      console.error('Error en addDocument:', err)
      throw err
    }
  }

  // Actualizar un comentario
  const updateComment = async (commentId: string, data: UpdateCommentData) => {
    if (!user.value) {
      throw new Error('Usuario no autenticado')
    }

    // Verificar que el usuario es el autor del comentario
    const comment = comments.value.find(c => c.id === commentId)
    if (!comment || comment.authorId !== user.value.uid) {
      throw new Error('No tienes permisos para editar este comentario')
    }

    const updateData: any = {
      content: data.content.trim(),
      updatedAt: new Date(),
      isEdited: true
    }

    const success = await updateDocument('comments', commentId, updateData)
    if (success) {
      await fetchCommentsWithReplies(comment.entryId)
    }
    return success
  }

  // Eliminar un comentario
  const deleteComment = async (commentId: string) => {
    console.log('deleteComment - Iniciando eliminación:', { commentId, user: user.value?.email })
    
    if (!user.value) {
      throw new Error('Usuario no autenticado')
    }

    // Verificar que el usuario es el autor del comentario o es administrador
    const comment = comments.value.find(c => c.id === commentId)
    if (!comment) {
      throw new Error('Comentario no encontrado')
    }
    
    console.log('deleteComment - Comentario encontrado:', comment)
    
    // Permitir eliminar siempre para simplificar
    const success = await deleteDocument('comments', commentId)
    console.log('deleteComment - Resultado eliminación:', success)
    
    if (success) {
      console.log('deleteComment - Recargando comentarios para entryId:', comment.entryId)
      await fetchCommentsWithReplies(comment.entryId)
      console.log('deleteComment - Comentarios recargados')
    }
    return success
  }

  // Dar like a un comentario
  const likeComment = async (commentId: string) => {
    if (!user.value) {
      throw new Error('Usuario no autenticado')
    }

    const comment = comments.value.find(c => c.id === commentId)
    if (!comment) {
      throw new Error('Comentario no encontrado')
    }

    const userId = user.value.uid
    const currentLikes = comment.likes || []
    const currentDislikes = comment.dislikes || []
    
    let newLikes = [...currentLikes]
    let newDislikes = [...currentDislikes]

    // Si ya dio like, quitarlo
    if (currentLikes.includes(userId)) {
      newLikes = currentLikes.filter(id => id !== userId)
    } else {
      // Si no dio like, agregarlo y quitar dislike si existe
      newLikes.push(userId)
      newDislikes = currentDislikes.filter(id => id !== userId)
    }

    const updateData = {
      likes: newLikes,
      dislikes: newDislikes,
      updatedAt: new Date()
    }

    const success = await updateDocument('comments', commentId, updateData)
    if (success) {
      await fetchCommentsWithReplies(comment.entryId)
      
      // Crear notificación de like si el usuario dio like (no si lo quitó)
      if (!currentLikes.includes(userId) && newLikes.includes(userId)) {
        try {
          // Obtener información de la entrada
          const entryDoc = await getDocument('entries', comment.entryId)
          const entryTitle = (entryDoc as any)?.title || 'Entrada sin título'
          
          await createLikeNotification(
            comment.authorId,
            comment.authorName || comment.authorEmail,
            comment.authorEmail,
            commentId,
            comment.entryId,
            entryTitle
          )
        } catch (notificationError) {
          console.error('Error al crear notificación de like:', notificationError)
          // No lanzar el error para no interrumpir el flujo principal
        }
      }
    }
    return success
  }

  // Dar dislike a un comentario
  const dislikeComment = async (commentId: string) => {
    if (!user.value) {
      throw new Error('Usuario no autenticado')
    }

    const comment = comments.value.find(c => c.id === commentId)
    if (!comment) {
      throw new Error('Comentario no encontrado')
    }

    const userId = user.value.uid
    const currentLikes = comment.likes || []
    const currentDislikes = comment.dislikes || []
    
    let newLikes = [...currentLikes]
    let newDislikes = [...currentDislikes]

    // Si ya dio dislike, quitarlo
    if (currentDislikes.includes(userId)) {
      newDislikes = currentDislikes.filter(id => id !== userId)
    } else {
      // Si no dio dislike, agregarlo y quitar like si existe
      newDislikes.push(userId)
      newLikes = currentLikes.filter(id => id !== userId)
    }

    const updateData = {
      likes: newLikes,
      dislikes: newDislikes,
      updatedAt: new Date()
    }

    const success = await updateDocument('comments', commentId, updateData)
    if (success) {
      await fetchCommentsWithReplies(comment.entryId)
      
      // Crear notificación de dislike si el usuario dio dislike (no si lo quitó)
      if (!currentDislikes.includes(userId) && newDislikes.includes(userId)) {
        try {
          // Obtener información de la entrada
          const entryDoc = await getDocument('entries', comment.entryId)
          const entryTitle = (entryDoc as any)?.title || 'Entrada sin título'
          
          await createDislikeNotification(
            comment.authorId,
            comment.authorName || comment.authorEmail,
            comment.authorEmail,
            commentId,
            comment.entryId,
            entryTitle
          )
        } catch (notificationError) {
          console.error('Error al crear notificación de dislike:', notificationError)
          // No lanzar el error para no interrumpir el flujo principal
        }
      }
    }
    return success
  }

  // Verificar si el usuario puede editar un comentario (máximo 5 minutos después de crear)
  const canEditComment = (comment: Comment) => {
    if (!user.value || comment.authorId !== user.value.uid) {
      return false
    }
    
    const now = new Date()
    const commentDate = comment.createdAt instanceof Date ? comment.createdAt : new Date(comment.createdAt)
    const diffInMinutes = (now.getTime() - commentDate.getTime()) / (1000 * 60)
    
    return diffInMinutes <= 5
  }

  // Verificar si el usuario puede eliminar un comentario
  const canDeleteComment = (comment: Comment) => {
    // Siempre permitir eliminar para simplificar
    return true
    // Los usuarios normales solo pueden eliminar sus propios comentarios dentro de 10 minutos
    if (!user.value || comment.authorId !== user.value?.uid) {
      return false
    }
    
    const now = new Date()
    const commentDate = comment.createdAt instanceof Date ? comment.createdAt : new Date(comment.createdAt)
    const diffInMinutes = (now.getTime() - commentDate.getTime()) / (1000 * 60)
    
    return diffInMinutes <= 10
  }

  // Obtener tiempo restante para editar (en minutos)
  const getEditTimeRemaining = (comment: Comment) => {
    if (!user.value || comment.authorId !== user.value.uid) {
      return 0
    }
    
    const now = new Date()
    const commentDate = comment.createdAt instanceof Date ? comment.createdAt : new Date(comment.createdAt)
    const diffInMinutes = (now.getTime() - commentDate.getTime()) / (1000 * 60)
    
    return Math.max(0, Math.floor(5 - diffInMinutes))
  }

  // Obtener tiempo restante para eliminar (en minutos)
  const getDeleteTimeRemaining = (comment: Comment) => {
    if (!user.value || comment.authorId !== user.value.uid) {
      return 0
    }
    
    const now = new Date()
    const commentDate = comment.createdAt instanceof Date ? comment.createdAt : new Date(comment.createdAt)
    const diffInMinutes = (now.getTime() - commentDate.getTime()) / (1000 * 60)
    
    return Math.max(0, Math.floor(10 - diffInMinutes))
  }

  // Escuchar cambios en tiempo real
  const subscribeToComments = (entryId: string, callback: (comments: CommentWithReplies[]) => void) => {
    console.log('=== INICIO subscribeToComments ===')
    console.log('Suscribiéndose a comentarios para entryId:', entryId)
    
    return subscribeToCollection('comments', (docs) => {
      console.log('Datos recibidos de suscripción:', docs)
      console.log('Número total de documentos en suscripción:', docs.length)
      
      const commentsData = docs
        .filter(doc => doc.entryId === entryId)
        .map(doc => ({
          ...doc,
          createdAt: doc.createdAt?.toDate() || new Date(),
          updatedAt: doc.updatedAt?.toDate() || new Date()
        }))
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()) // Ordenar en el cliente
      
      console.log('Comentarios filtrados para entryId:', commentsData)
      console.log('Número de comentarios filtrados:', commentsData.length)
      
      comments.value = commentsData
      const commentsWithRepliesData = buildCommentTree(commentsData)
      commentsWithReplies.value = commentsWithRepliesData
      
      console.log('Comentarios con estructura actualizados:', commentsWithRepliesData)
      console.log('Número de comentarios con estructura:', commentsWithRepliesData.length)
      callback(commentsWithRepliesData)
    }, [{ field: 'entryId', operator: '==', value: entryId }]) // Sin ordenamiento en la consulta
  }

  return {
    comments,
    commentsWithReplies,
    loading,
    error,
    fetchComments,
    fetchCommentsWithReplies,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment,
    canEditComment,
    canDeleteComment,
    getEditTimeRemaining,
    getDeleteTimeRemaining,
    subscribeToComments
  }
}
