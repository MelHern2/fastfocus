<template>
  <div class="comment-item" :id="`comment-${comment.id}`" :class="{ 'is-reply': comment.parentId && !isNested, 'is-nested-reply': comment.parentId && isNested, 'is-being-replied-to': isReplyingToThis }" :data-comment-id="comment.id">
    <div class="comment-content">
      <div class="comment-header">
        <div class="comment-author">
          <span class="author-name">{{ comment.authorName }}</span>
          <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
          <span v-if="comment.isEdited" class="edited-badge">(editado)</span>
                     <span v-if="isReplyingToThis" class="replying-indicator">← Respondiendo a este comentario</span>
        </div>
      </div>

             <div class="comment-body">
         <div v-if="comment.parentId && comment.replyingTo" class="reply-to-indicator">
           <span class="reply-to-text">Respondiendo a {{ comment.replyingTo.authorName }}</span>
         </div>
         <p class="comment-text">{{ comment.content }}</p>
       </div>

      <div class="comment-actions">
        <div class="action-buttons">
          <button 
            v-if="user"
            @click="$emit('like', comment)"
            class="action-btn"
            :class="{ 'active': comment.userLiked }"
            title="Me gusta"
          >
            <span class="action-icon">👍</span>
            <span class="action-count">{{ comment.likeCount }}</span>
          </button>

          <button 
            v-if="user"
            @click="$emit('dislike', comment)"
            class="action-btn"
            :class="{ 'active': comment.userDisliked }"
            title="No me gusta"
          >
            <span class="action-icon">👎</span>
            <span class="action-count">{{ comment.dislikeCount }}</span>
          </button>

          <!-- Mostrar contadores para invitados -->
          <div v-if="!user" class="guest-action-display">
            <span class="action-count-display">
              <span class="action-icon">👍</span>
              {{ comment.likeCount }}
            </span>
            <span class="action-count-display">
              <span class="action-icon">👎</span>
              {{ comment.dislikeCount }}
            </span>
          </div>

                                <button 
             v-if="user"
             @click="handleReplyClick"
             class="action-btn"
             title="Responder"
           >
             <span class="action-icon">💬</span>
             <span class="action-text">Responder</span>
           </button>

          <!-- Mostrar contadores para usuarios no logueados -->
          <div v-if="!user" class="action-stats">
            <span class="action-stat">
              <span class="action-icon">👍</span>
              <span class="action-count">{{ comment.likeCount }}</span>
            </span>
            <span class="action-stat">
              <span class="action-icon">👎</span>
              <span class="action-count">{{ comment.dislikeCount }}</span>
            </span>
          </div>
        </div>

                 <div v-if="true" class="comment-actions-owner">
           <button 
             v-if="canEdit"
             @click="$emit('edit', comment)"
             class="action-btn action-btn-edit"
             :title="`Editar (${getEditTimeRemaining(comment)} min restantes)`"
           >
             <span class="action-icon">✏️</span>
             <span class="action-text">Editar</span>
             <span v-if="getEditTimeRemaining(comment) > 0" class="edit-time-remaining">
               ({{ getEditTimeRemaining(comment) }}m)
             </span>
           </button>

                     <button 
             v-if="true"
             @click="$emit('delete', comment)"
             class="action-btn action-btn-delete"
             :class="{ 'admin-delete': isAdmin && comment.authorId !== user?.uid }"
             :title="isAdmin && comment.authorId !== user?.uid ? 'Eliminar como administrador' : `Eliminar (${getDeleteTimeRemaining(comment)} min restantes)`"
           >
             <span class="action-icon">🗑️</span>
             <span class="action-text">
               {{ isAdmin && comment.authorId !== user?.uid ? 'Eliminar (Admin)' : 'Eliminar' }}
             </span>
             <span v-if="!isAdmin && getDeleteTimeRemaining(comment) > 0" class="delete-time-remaining">
               ({{ getDeleteTimeRemaining(comment) }}m)
             </span>
           </button>
        </div>
      </div>
    </div>

    <!-- Formulario de respuesta inline -->
    <div v-if="user && isReplyingToThis" class="inline-reply-form">
      <form @submit.prevent="handleSubmitReply" class="reply-form-inline">
        <div class="form-group">
          <textarea
            v-model="replyContent"
            placeholder="Escribe tu respuesta..."
            rows="2"
            class="reply-textarea"
            required
          ></textarea>
        </div>
        <div class="form-actions">
          <button 
            type="button" 
            @click="handleCancelReply"
            class="btn btn-secondary btn-sm"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            :disabled="!replyContent.trim()"
            class="btn btn-primary btn-sm"
          >
            Responder
          </button>
        </div>
      </form>
    </div>

         <!-- Respuestas - Solo mostrar contador -->
     <div v-if="comment.replyCount > 0" class="comment-replies">
      <div class="replies-indicator">
        <span class="replies-line"></span>
        <span class="replies-text">{{ comment.replyCount }} respuesta{{ comment.replyCount !== 1 ? 's' : '' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useComments } from '@/composables/useComments'
import { useAuth } from '@/composables/useAuth'
import { useAdmin } from '@/composables/useAdmin'
import { useToast } from '@/composables/useToast'
import type { CommentWithReplies } from '@/types/comment'

const props = defineProps<{
  comment: CommentWithReplies
  entryId: string
  isBeingRepliedTo?: boolean
  isNested?: boolean
}>()

const emit = defineEmits<{
  reply: [CommentWithReplies]
  edit: [CommentWithReplies]
  delete: [CommentWithReplies]
  like: [CommentWithReplies]
  dislike: [CommentWithReplies]
  'submit-reply': [string]
  'cancel-reply': []
}>()

const replyContent = ref('')
const isReplyingToThis = ref(false)

const { user } = useAuth()
const { isAdmin } = useAdmin()
const { error: showError } = useToast()
const { canEditComment, canDeleteComment, getEditTimeRemaining, getDeleteTimeRemaining, createComment } = useComments()

const canEdit = computed(() => canEditComment(props.comment))
const canDelete = computed(() => {
  return true
})

// Debug: verificar si este comentario está siendo respondido
console.log(`CommentItem ${props.comment.id}: isBeingRepliedTo = ${props.isBeingRepliedTo}, isReplyingToThis = ${isReplyingToThis.value}, isNested = ${props.isNested}`)

// Manejar respuestas anidadas
const handleNestedReply = (comment: CommentWithReplies) => {
  emit('reply', comment)
}

const handleReplyClick = () => {
  console.log('Botón Responder clickeado para comentario:', props.comment.id)
  isReplyingToThis.value = true
  replyContent.value = ''
}

const handleSubmitReply = async () => {
  if (!replyContent.value.trim()) return
  
  try {
    await createComment({
      entryId: props.entryId,
      content: replyContent.value,
      parentId: props.comment.id
    })
    replyContent.value = ''
    isReplyingToThis.value = false
  } catch (error: any) {
    console.error('Error al crear respuesta:', error)
    showError('Error al crear la respuesta: ' + error.message)
  }
}

const handleCancelReply = () => {
  isReplyingToThis.value = false
  replyContent.value = ''
}

const formatDate = (date: Date) => {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) {
    return 'Ahora mismo'
  } else if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`
  } else if (diffInHours < 24) {
    return `Hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`
  } else if (diffInDays < 7) {
    return `Hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`
  } else {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }
}
</script>

<style scoped>
.comment-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s;
}

.comment-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.comment-item.is-reply {
  margin-left: 1.5rem;
  border-left: 3px solid #667eea;
}

.comment-item.is-being-replied-to {
  border: 2px solid #0ea5e9;
  background: #f0f9ff;
  box-shadow: 0 0 0 1px #0ea5e9;
}

.comment-header {
  margin-bottom: 0.75rem;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.author-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.comment-date {
  color: #6b7280;
  font-size: 0.75rem;
}

.edited-badge {
  color: #6b7280;
  font-size: 0.75rem;
  font-style: italic;
}

.replying-indicator {
  color: #0ea5e9;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(14, 165, 233, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.comment-body {
  margin-bottom: 1rem;
}

.reply-to-indicator {
  margin-bottom: 0.5rem;
}

.reply-to-text {
  color: #667eea;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.comment-text {
  color: #374151;
  line-height: 1.6;
  margin: 0;
  font-size: 0.875rem;
  white-space: pre-wrap;
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 0.75rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.action-btn.active {
  color: #667eea;
  background: #e0e7ff;
}

.action-icon {
  font-size: 0.875rem;
}

.action-count {
  font-weight: 500;
}

.guest-action-display {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.action-count-display {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.action-text {
  font-weight: 500;
}

.action-stats {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.action-stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #6b7280;
  font-size: 0.75rem;
}

.action-btn-edit:hover {
  color: #059669;
  background: #d1fae5;
}

.action-btn-delete:hover {
  color: #dc2626;
  background: #fee2e2;
}

.action-btn-delete.admin-delete {
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.action-btn-delete.admin-delete:hover {
  color: #dc2626;
  background: #fee2e2;
  border-color: #fca5a5;
}

.comment-actions-owner {
  display: flex;
  gap: 0.5rem;
}

/* Respuestas */
.comment-replies {
  margin-top: 1rem;
}

.replies-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.replies-line {
  width: 2px;
  height: 20px;
  background: #e5e7eb;
  border-radius: 1px;
}

.replies-text {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
}

.replies-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left: 0;
  border-left: none;
  padding-left: 0;
}

/* Las respuestas de respuestas NO se indentan más */
.replies-list .replies-list {
  margin-left: 0;
  border-left: none;
  padding-left: 0;
}

/* Estilos para comentarios que son respuestas */
.comment-item.is-reply {
  background: #f8fafc;
}

/* Formulario de respuesta inline */
.inline-reply-form {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.reply-form-inline {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reply-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 60px;
}

.reply-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.75rem;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a67d8;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.edit-time-remaining {
  color: #f59e0b;
  font-size: 0.625rem;
  font-weight: 600;
  margin-left: 0.25rem;
}

.delete-time-remaining {
  color: #dc2626;
  font-size: 0.625rem;
  font-weight: 600;
  margin-left: 0.25rem;
}

@media (max-width: 768px) {
  .comment-item {
    padding: 0.75rem;
  }
  
  .comment-item.is-reply {
    margin-left: 0;
  }
  
  .replies-list {
    margin-left: 0;
    padding-left: 0;
  }
  
  .replies-list .replies-list {
    margin-left: 0;
    padding-left: 0;
  }
  
  .comment-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .action-btn {
    padding: 0.375rem 0.5rem;
  }
}
</style>
