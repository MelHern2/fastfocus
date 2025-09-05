<template>
  <div class="entry-list">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Cargando entradas...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
    </div>

    <div v-else-if="entries.length === 0" class="empty-state">
      <p>No hay entradas disponibles</p>
    </div>

    <div v-else class="entries-grid">
      <div 
        v-for="entry in entries" 
        :key="entry.id" 
        class="entry-card"
      >
        <div class="entry-header">
          <h3 class="entry-title">{{ entry.title }}</h3>
          <div class="entry-meta">
            <span class="entry-category">{{ entry.categoryName || 'Sin categoría' }}</span>
            <span class="entry-date">{{ formatDate(entry.createdAt) }}</span>
            <span class="entry-reading-time">📖 {{ entry.estimatedReadingTime }}</span>
          </div>
        </div>

        <div class="entry-content">
          <p class="entry-excerpt">{{ entry.excerpt }}</p>
        </div>

        <div class="entry-footer">
          <div class="entry-tags" v-if="entry.tags && entry.tags.length > 0">
            <span 
              v-for="tag in entry.tags" 
              :key="tag" 
              class="tag"
            >
              {{ tag }}
            </span>
          </div>

          <div class="entry-status">
            <span 
              :class="['status-badge', entry.published ? 'published' : 'draft']"
            >
              {{ entry.published ? 'Publicado' : 'Borrador' }}
            </span>
            <span 
              v-if="entry.featured" 
              class="featured-badge"
            >
              ⭐ Destacado
            </span>
          </div>
        </div>

        <div class="entry-actions">
          <router-link 
            :to="`/admin/entries/${entry.id}/edit`"
            class="btn btn-edit"
          >
            Editar
          </router-link>
          <button 
            @click="handleDelete(entry)" 
            class="btn btn-delete"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import type { Entry } from '@/types/entry'

interface Props {
  entries: Entry[]
  loading?: boolean
  error?: string | null
}

interface Emits {
  (e: 'delete', entry: Entry): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { success, error: showError } = useToast()
const { confirm } = useConfirm()

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const handleDelete = async (entry: Entry) => {
  const confirmed = await confirm({
    title: 'Eliminar entrada',
    message: `¿Estás seguro de que quieres eliminar la entrada "${entry.title}"?`,
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    type: 'danger'
  })
  
  if (confirmed) {
    emit('delete', entry)
  }
}
</script>

<style scoped>
.entry-list {
  width: 100%;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #dc2626;
  font-weight: 500;
}

.entries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.entry-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.entry-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.entry-header {
  margin-bottom: 16px;
}

.entry-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.entry-meta {
  display: flex;
  gap: 12px;
  font-size: 0.875rem;
  color: #6b7280;
  flex-wrap: wrap;
}

.entry-category {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.entry-date {
  color: #9ca3af;
}

.entry-reading-time {
  background: #f0f9ff;
  color: #0369a1;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.75rem;
}

.entry-content {
  margin-bottom: 16px;
}

.entry-excerpt {
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.entry-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: #e0e7ff;
  color: #3730a3;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 500;
}

.entry-status {
  display: flex;
  gap: 8px;
  align-items: center;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.published {
  background: #dcfce7;
  color: #166534;
}

.status-badge.draft {
  background: #fef3c7;
  color: #92400e;
}

.featured-badge {
  background: #fef3c7;
  color: #92400e;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.entry-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .entries-grid {
    grid-template-columns: 1fr;
  }
  
  .entry-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .entry-actions {
    width: 100%;
    justify-content: stretch;
  }
  
  .btn {
    flex: 1;
  }
}
</style>
