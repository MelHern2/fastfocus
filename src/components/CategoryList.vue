<template>
  <div class="category-list">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando categorías...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
    </div>

    <div v-else-if="categories.length === 0" class="empty-state">
      <p>No hay categorías creadas aún.</p>
    </div>

    <div v-else class="categories-container">
      <div class="categories-header">
        <h4>Lista de Categorías ({{ categories.length }})</h4>
      </div>

      <div class="categories-grid">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-card"
        >
          <div class="category-content">
            <div class="category-info">
              <h5 class="category-name">{{ category.name }}</h5>
              <p class="category-description">{{ category.description }}</p>
              
              <div class="category-meta">
                <span v-if="category.parentId" class="parent-info">
                  <strong>Padre:</strong> {{ getParentName(category.parentId) }}
                </span>
                <span v-else class="root-category">Categoría raíz</span>
              </div>

              <div class="category-dates">
                <small class="date-info">
                  Creada: {{ formatDate(category.createdAt) }}
                </small>
                <small class="date-info">
                  Actualizada: {{ formatDate(category.updatedAt) }}
                </small>
              </div>
            </div>

            <div class="category-actions">
              <button 
                @click="$emit('edit', category)"
                class="action-btn edit-btn"
                title="Editar categoría"
              >
                ✏️
              </button>
              <button 
                @click="$emit('delete', category)"
                class="action-btn delete-btn"
                title="Eliminar categoría"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '@/types/category'

interface Props {
  categories: Category[]
  loading: boolean
  error: string | null
}

interface Emits {
  (e: 'edit', category: Category): void
  (e: 'delete', category: Category): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const getParentName = (parentId: string): string => {
  const parent = props.categories.find(cat => cat.id === parentId)
  return parent ? parent.name : 'Categoría no encontrada'
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<style scoped>
.category-list {
  width: 100%;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #4a5568;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #e53e3e;
  font-weight: 500;
}

.categories-container {
  width: 100%;
}

.categories-header {
  margin-bottom: 20px;
}

.categories-header h4 {
  margin: 0;
  color: #2d3748;
  font-size: 1.125rem;
  font-weight: 600;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.category-card {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s;
}

.category-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e0;
}

.category-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
}

.category-info {
  flex: 1;
}

.category-name {
  margin: 0 0 8px 0;
  color: #2d3748;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
}

.category-description {
  margin: 0 0 12px 0;
  color: #4a5568;
  font-size: 0.875rem;
  line-height: 1.5;
}

.category-meta {
  margin-bottom: 12px;
}

.parent-info {
  color: #667eea;
  font-size: 0.8rem;
  background: #edf2f7;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.root-category {
  color: #48bb78;
  font-size: 0.8rem;
  background: #f0fff4;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  font-weight: 500;
}

.category-dates {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-info {
  color: #718096;
  font-size: 0.75rem;
}

.category-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.delete-btn:hover {
  background: #fed7d7;
  border-color: #feb2b2;
  color: #e53e3e;
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .category-content {
    flex-direction: column;
    gap: 12px;
  }
  
  .category-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .category-card {
    padding: 15px;
  }
  
  .category-name {
    font-size: 1rem;
  }
  
  .category-description {
    font-size: 0.8rem;
  }
}
</style>

