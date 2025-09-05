<template>
  <div class="comments-section">
    <h3 class="comments-title">Comentarios ({{ totalCommentsCount }})</h3>
    
    <!-- Formulario para nuevo comentario -->
    <div v-if="user && user.emailVerified" class="comment-form-container">
      <form @submit.prevent="handleSubmitComment" class="comment-form">
        <div class="form-group">
          <textarea
            v-model="newCommentContent"
            placeholder="Escribe tu comentario..."
            rows="3"
            class="comment-textarea"
            :disabled="submitting"
            required
          ></textarea>
        </div>
        <div class="form-actions">
          <button 
            type="submit" 
            :disabled="submitting || !newCommentContent.trim()"
            class="btn btn-primary"
          >
            {{ submitting ? 'Enviando...' : 'Comentar' }}
          </button>
        </div>
      </form>
    </div>



    <!-- Mensaje para usuarios no logueados -->
    <GuestPrompt 
      v-if="!user"
      title="Comentarios deshabilitados"
      message="Para comentar y interactuar con otros usuarios, necesitas iniciar sesión. Como invitado puedes ver todos los comentarios pero no participar en la conversación."
      @continue-as-guest="() => {}"
    />

    <!-- Mensaje para usuarios no verificados -->
    <div v-if="user && !user.emailVerified" class="verification-required">
      <div class="verification-message">
        <h4>📧 Verificación de Email Requerida</h4>
        <p>Para poder comentar, necesitas verificar tu dirección de correo electrónico.</p>
        <p>Revisa tu bandeja de entrada (y la carpeta de spam) para encontrar el email de verificación.</p>
        <button @click="resendVerification" class="btn btn-secondary" :disabled="sendingVerification">
          {{ sendingVerification ? 'Enviando...' : 'Reenviar Email de Verificación' }}
        </button>
      </div>
    </div>

    <!-- Lista de comentarios -->
    <div v-if="loading" class="loading-comments">
      <div class="loading-spinner"></div>
      <p>Cargando comentarios...</p>
    </div>

    <div v-else-if="commentsWithReplies.length === 0" class="no-comments">
      <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
    </div>

         <div v-else class="comments-list">
        
        
        <CommentItem
          v-for="comment in commentsWithReplies"
          :key="comment.id"
          :comment="comment"
          :entry-id="entryId"
          :is-being-replied-to="replyingTo?.id === comment.id"
          @reply="handleReply"
          @edit="handleEdit"
          @delete="handleDelete"
          @like="handleLike"
          @dislike="handleDislike"
          @submit-reply="handleSubmitInlineReply"
          @cancel-reply="cancelReply"
        />
     </div>

    <!-- Modal para editar comentario -->
    <div v-if="editingComment" class="modal-overlay" @click="cancelEdit">
      <div class="modal-content" @click.stop>
        <h4>Editar comentario</h4>
        <form @submit.prevent="handleEditSubmit" class="edit-form">
          <textarea
            v-model="editContent"
            rows="4"
            class="edit-textarea"
            required
          ></textarea>
          <div class="modal-actions">
            <button type="button" @click="cancelEdit" class="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" :disabled="submitting" class="btn btn-primary">
              {{ submitting ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useComments } from '@/composables/useComments'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import CommentItem from './CommentItem.vue'
import GuestPrompt from './GuestPrompt.vue'
import type { CommentWithReplies } from '@/types/comment'

const props = defineProps<{
  entryId: string
}>()

const { user, resendEmailVerification } = useAuth()
const { success, error: showError } = useToast()
const { confirm } = useConfirm()
const {
  comments,
  commentsWithReplies,
  loading,
  error,
  fetchCommentsWithReplies,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  subscribeToComments
} = useComments()

const newCommentContent = ref('')
const submitting = ref(false)
const editingComment = ref<CommentWithReplies | null>(null)
const editContent = ref('')
const replyingTo = ref<CommentWithReplies | null>(null)
const replyContent = ref('')
const replyPlaceholder = ref('Escribe tu respuesta...')
const sendingVerification = ref(false)

let unsubscribe: (() => void) | null = null

// Computed property para contar todos los comentarios incluyendo respuestas
const totalCommentsCount = computed(() => {
  // Filtrar comentarios de esta entrada específica y contar todos
  const entryComments = comments.value.filter(comment => comment.entryId === props.entryId)
  
  // Logs de depuración detallados
  console.log('=== DEBUG totalCommentsCount ===')
  console.log('props.entryId:', props.entryId)
  console.log('comments.value.length:', comments.value.length)
  console.log('comments.value:', comments.value)
  console.log('entryComments.length:', entryComments.length)
  console.log('entryComments:', entryComments)
  console.log('commentsWithReplies.value.length:', commentsWithReplies.value.length)
  console.log('commentsWithReplies.value:', commentsWithReplies.value)
  
  return entryComments.length
})

// Crear nuevo comentario
const handleSubmitComment = async () => {
  if (!newCommentContent.value.trim()) return

  console.log('Intentando crear comentario:', {
    entryId: props.entryId,
    content: newCommentContent.value,
    user: user.value
  })

  submitting.value = true
  try {
    const result = await createComment({
      entryId: props.entryId,
      content: newCommentContent.value
    })
    console.log('Comentario creado exitosamente:', result)
    newCommentContent.value = ''
  } catch (error) {
    console.error('Error al crear comentario:', error)
    showError('Error al crear el comentario: ' + (error as any).message)
  } finally {
    submitting.value = false
  }
}

// Responder a un comentario
const handleReply = (comment: CommentWithReplies) => {
  console.log('handleReply llamado con:', comment)
  console.log('Estado anterior replyingTo:', replyingTo.value)
  replyingTo.value = comment
  console.log('Nuevo estado replyingTo:', replyingTo.value)
  replyContent.value = ''
  replyPlaceholder.value = 'Escribe tu respuesta...'
  // Hacer scroll al comentario que se está respondiendo
  setTimeout(() => {
    const commentElement = document.querySelector(`[data-comment-id="${comment.id}"]`)
    if (commentElement) {
      commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 100)
}

// Cancelar respuesta
const cancelReply = () => {
  replyingTo.value = null
  replyContent.value = ''
  replyPlaceholder.value = 'Escribe tu respuesta...'
}

// Reenviar email de verificación
const resendVerification = async () => {
  console.log('resendVerification llamado')
  console.log('user.value:', user.value)
  console.log('user.value?.email:', user.value?.email)
  console.log('user.value?.emailVerified:', user.value?.emailVerified)
  
  if (!user.value) {
    showError('No hay usuario autenticado. Por favor, inicia sesión primero.')
    return
  }
  
  if (user.value.emailVerified) {
    showError('Tu email ya está verificado. No necesitas reenviar la verificación.')
    return
  }
  
  sendingVerification.value = true
  try {
    console.log('Reenviando verificación para usuario:', user.value.email)
    console.log('Estado de verificación:', user.value.emailVerified)
    
    // Verificar que el usuario esté realmente autenticado
    const { auth } = await import('@/firebase/config')
    if (!auth.currentUser) {
      throw new Error('Usuario no autenticado correctamente. Por favor, cierra sesión y vuelve a iniciar sesión.')
    }
    
    console.log('Usuario autenticado correctamente:', auth.currentUser.email)
    console.log('Estado de verificación del usuario autenticado:', auth.currentUser.emailVerified)
    
    await resendEmailVerification()
    success('Email de verificación reenviado. Revisa tu bandeja de entrada y la carpeta de spam.')
  } catch (error: any) {
    console.error('Error al reenviar verificación:', error)
    console.error('Código de error:', error.code)
    console.error('Mensaje de error:', error.message)
    showError('Error al reenviar el email de verificación: ' + (error.message || error))
  } finally {
    sendingVerification.value = false
  }
}

// Enviar respuesta inline
const handleSubmitInlineReply = async (content: string) => {
  console.log('handleSubmitInlineReply llamado con:', { content, replyingTo: replyingTo.value })
  if (!replyingTo.value || !content.trim()) return

  submitting.value = true
  try {
    await createComment({
      entryId: props.entryId,
      content: content,
      parentId: replyingTo.value.id
    })
    cancelReply()
    // Mostrar mensaje de éxito temporal
    const successMessage = document.createElement('div')
    successMessage.className = 'success-message'
    successMessage.textContent = 'Respuesta enviada exitosamente'
    successMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      z-index: 1001;
      font-size: 0.875rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `
    document.body.appendChild(successMessage)
    
    // Remover el mensaje después de 3 segundos
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.parentNode.removeChild(successMessage)
      }
    }, 3000)
  } catch (error: any) {
    console.error('Error al crear respuesta:', error)
    showError('Error al crear la respuesta: ' + error.message)
  } finally {
    submitting.value = false
  }
}

// Enviar respuesta (mantener para compatibilidad)
const handleSubmitReply = async () => {
  if (!replyingTo.value || !replyContent.value.trim()) return

  submitting.value = true
  try {
    await createComment({
      entryId: props.entryId,
      content: replyContent.value,
      parentId: replyingTo.value.id
    })
    // Solo limpiar el contenido, mantener el formulario visible
    replyContent.value = ''
    replyPlaceholder.value = 'Respuesta enviada. Puedes escribir otra respuesta...'
    // Mostrar mensaje de éxito temporal
    const successMessage = document.createElement('div')
    successMessage.className = 'success-message'
    successMessage.textContent = 'Respuesta enviada exitosamente'
    successMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      z-index: 1001;
      font-size: 0.875rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `
    document.body.appendChild(successMessage)
    
    // Remover el mensaje después de 3 segundos
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.parentNode.removeChild(successMessage)
      }
    }, 3000)
  } catch (error: any) {
    console.error('Error al crear respuesta:', error)
    showError('Error al crear la respuesta: ' + error.message)
  } finally {
    submitting.value = false
  }
}

// Editar comentario
const handleEdit = (comment: CommentWithReplies) => {
  editingComment.value = comment
  editContent.value = comment.content
}

// Cancelar edición
const cancelEdit = () => {
  editingComment.value = null
  editContent.value = ''
}

// Guardar edición
const handleEditSubmit = async () => {
  if (!editingComment.value || !editContent.value.trim()) return

  submitting.value = true
  try {
    await updateComment(editingComment.value.id, {
      content: editContent.value
    })
    cancelEdit()
  } catch (error) {
    console.error('Error al actualizar comentario:', error)
    showError('Error al actualizar el comentario')
  } finally {
    submitting.value = false
  }
}

// Eliminar comentario
const handleDelete = async (comment: CommentWithReplies) => {
  const confirmed = await confirm({
    title: 'Eliminar comentario',
    message: '¿Estás seguro de que quieres eliminar este comentario?',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    type: 'danger'
  })
  
  if (!confirmed) return

  try {
    await deleteComment(comment.id)
    success('Comentario eliminado correctamente')
  } catch (error) {
    console.error('Error al eliminar comentario:', error)
    showError('Error al eliminar el comentario')
  }
}

// Dar like
const handleLike = async (comment: CommentWithReplies) => {
  try {
    await likeComment(comment.id)
  } catch (error) {
    console.error('Error al dar like:', error)
  }
}

// Dar dislike
const handleDislike = async (comment: CommentWithReplies) => {
  try {
    await dislikeComment(comment.id)
  } catch (error) {
    console.error('Error al dar dislike:', error)
  }
}

onMounted(async () => {
  console.log('=== INICIO onMounted CommentsSection ===')
  console.log('props.entryId:', props.entryId)
  
  try {
    console.log('Llamando a fetchCommentsWithReplies...')
    await fetchCommentsWithReplies(props.entryId)
    console.log('fetchCommentsWithReplies completado')
    console.log('comments.value después de fetchCommentsWithReplies:', comments.value)
    console.log('commentsWithReplies.value después de fetchCommentsWithReplies:', commentsWithReplies.value)
  } catch (error) {
    console.error('Error en fetchCommentsWithReplies:', error)
  }
  
  // Suscribirse a cambios en tiempo real
  try {
    console.log('Suscribiéndose a cambios en tiempo real...')
    unsubscribe = subscribeToComments(props.entryId, (comments) => {
      console.log('Callback de suscripción ejecutado con:', comments)
      // Los comentarios se actualizan automáticamente
    })
    console.log('Suscripción configurada')
  } catch (error) {
    console.error('Error al configurar suscripción:', error)
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<style scoped>
.comments-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.comments-title {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  margin-left: 1rem;
}

.comment-form-container {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  position: relative;
}

.comment-form-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px 16px 0 0;
}

.reply-form-container {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.1);
  position: relative;
}

.reply-form-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  border-radius: 16px 16px 0 0;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.reply-to-text {
  color: #0c4a6e;
  font-weight: 500;
  font-size: 0.875rem;
}

.cancel-reply-btn {
  background: none;
  border: none;
  color: #0c4a6e;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.cancel-reply-btn:hover {
  background: rgba(14, 165, 233, 0.1);
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.comment-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;
}

.comment-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.comment-textarea:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.login-prompt {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: center;
}

.login-prompt p {
  color: #92400e;
  margin: 0;
}

.login-link {
  color: #667eea;
  text-decoration: underline;
  font-weight: 500;
}

.login-link:hover {
  color: #5a67d8;
}

.loading-comments {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--gray-200);
  border-top: 3px solid var(--primary-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-comments {
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
  background: var(--gray-50);
  border-radius: var(--border-radius-lg);
  border: 2px solid var(--gray-200);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Modal de edición */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(145deg, #ffffff 0%, var(--gray-50) 100%);
  border-radius: var(--border-radius-2xl);
  padding: 2rem;
  max-width: 800px;
  width: 90%;
  box-shadow: var(--shadow-2xl);
  border: 2px solid var(--gray-200);
  position: relative;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius-2xl) var(--border-radius-2xl) 0 0;
}

.modal-content h4 {
  color: var(--gray-800);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--gray-300);
  border-radius: var(--border-radius-lg);
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  background: #ffffff;
  transition: var(--transition-fast);
}

.edit-textarea:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px var(--primary-blue-50);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
  font-size: 0.875rem;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 2px solid var(--gray-300);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--gray-200);
  border-color: var(--gray-400);
}

@media (min-width: 1400px) {
  .modal-content {
    max-width: 1000px;
    padding: 3rem;
  }
  
  .edit-textarea {
    min-height: 150px;
  }
}

@media (min-width: 1200px) and (max-width: 1399px) {
  .modal-content {
    max-width: 900px;
    padding: 2.5rem;
  }
  
  .edit-textarea {
    min-height: 120px;
  }
}

@media (max-width: 768px) {
  .comments-section {
    margin-top: 2rem;
    padding-top: 1.5rem;
  }
  
  .comment-form-container,
  .reply-form-container {
    padding: 1rem;
  }
  
  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
    max-width: 95%;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

/* Estilos para mensaje de verificación */
.verification-required {
  margin: 1rem 0;
  padding: 1rem;
  background: var(--warning-bg);
  border: 2px solid var(--warning);
  border-radius: var(--border-radius-lg);
}

.verification-message {
  text-align: center;
}

.verification-message h4 {
  margin: 0 0 0.5rem 0;
  color: var(--warning-dark);
  font-size: 1.1rem;
  font-weight: 600;
}

.verification-message p {
  margin: 0.5rem 0;
  color: var(--warning-dark);
  font-size: 0.9rem;
}

.verification-message .btn {
  margin-top: 0.5rem;
}
</style>
