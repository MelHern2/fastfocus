<template>
  <div class="category-form-overlay">
    <div class="category-form">
      <div class="form-header">
        <h3>{{ isEditing ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
        <button @click="$emit('cancel')" class="close-btn">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="form-content">
        <div class="form-group">
          <label for="name">Nombre *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            placeholder="Ingresa el nombre de la categoría"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="description">Descripción *</label>
          <textarea
            id="description"
            v-model="formData.description"
            required
            placeholder="Ingresa la descripción de la categoría"
            rows="3"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="parentId">Categoría Padre (Opcional)</label>
          <select
            id="parentId"
            v-model="formData.parentId"
            class="form-select"
          >
            <option value="">Sin categoría padre</option>
            <option 
              v-for="cat in availableParents" 
              :key="cat.id" 
              :value="cat.id"
              :disabled="cat.disabled"
            >
              {{ cat.displayName }}
            </option>
          </select>
        </div>

        <div class="form-actions">
          <button 
            type="button" 
            @click="$emit('cancel')" 
            class="btn btn-secondary"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            :disabled="loading || !isFormValid"
            class="btn btn-primary"
          >
            {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useCategories } from '@/composables/useCategories'
import type { Category, CreateCategoryData, UpdateCategoryData } from '@/types/category'

interface Props {
  category?: Category | null
  categories?: Category[]
}

interface Emits {
  (e: 'save', data: CreateCategoryData | UpdateCategoryData): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { loading, getAllCategoriesFlat, fetchCategories, categories } = useCategories()

const formData = ref({
  name: '',
  description: '',
  parentId: ''
})

const isEditing = computed(() => !!props.category)

// Categorías disponibles como padre (excluyendo la categoría actual si está editando)
const availableParents = computed(() => {
  const categoriesList = getAllCategoriesFlat()
  console.log('Available categories for parent selection:', categoriesList)
  
  if (isEditing.value && props.category) {
    // Filtrar la categoría actual y sus descendientes para evitar referencias circulares
    const filtered = categoriesList.filter(cat => {
      return cat.id !== props.category!.id && 
             !isDescendantOf(cat.id, props.category!.id, categoriesList)
    })
    return filtered.map(cat => ({
      ...cat,
      disabled: false
    }))
  }
  return categoriesList.map(cat => ({
    ...cat,
    disabled: false
  }))
})

// Función para verificar si una categoría es descendiente de otra
const isDescendantOf = (categoryId: string, ancestorId: string, categories: any[]): boolean => {
  const category = categories.find(cat => cat.id === categoryId)
  if (!category || !category.parentId) return false
  if (category.parentId === ancestorId) return true
  return isDescendantOf(category.parentId, ancestorId, categories)
}

const isFormValid = computed(() => {
  return formData.value.name.trim() !== '' && formData.value.description.trim() !== ''
})

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    parentId: ''
  }
}

// Cargar datos de la categoría si está editando
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    formData.value = {
      name: newCategory.name,
      description: newCategory.description,
      parentId: newCategory.parentId || ''
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!isFormValid.value) return

  const data = {
    name: formData.value.name.trim(),
    description: formData.value.description.trim(),
    parentId: formData.value.parentId || undefined
  }

  emit('save', data)
}

onMounted(async () => {
  // Cargar categorías para el selector de padre
  try {
    await fetchCategories()
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
  
  if (props.category) {
    formData.value = {
      name: props.category.name,
      description: props.category.description,
      parentId: props.category.parentId || ''
    }
  }
})
</script>

<style scoped>
.category-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.category-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e2e8f0;
}

.form-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #a0aec0;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f7fafc;
  color: #4a5568;
}

.form-content {
  padding: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #4a5568;
  font-weight: 500;
  font-size: 0.875rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover:not(:disabled) {
  background: #cbd5e0;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a67d8;
}

@media (max-width: 768px) {
  .category-form-overlay {
    padding: 10px;
    align-items: flex-start;
    padding-top: 20px;
  }
  
  .category-form {
    margin: 0;
    max-width: none;
    width: 100%;
    max-height: 95vh;
    border-radius: 8px;
  }
  
  .form-header {
    padding: 15px 20px;
  }
  
  .form-header h3 {
    font-size: 1.125rem;
  }
  
  .form-content {
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-input,
  .form-textarea,
  .form-select {
    padding: 12px;
    font-size: 16px; /* Evita zoom en iOS */
  }
  
  .form-textarea {
    min-height: 70px;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
    padding-top: 15px;
  }
  
  .btn {
    width: 100%;
    padding: 12px 20px;
    font-size: 16px; /* Evita zoom en iOS */
  }
}

@media (max-width: 480px) {
  .category-form-overlay {
    padding: 5px;
    padding-top: 10px;
  }
  
  .category-form {
    border-radius: 6px;
  }
  
  .form-header {
    padding: 12px 15px;
  }
  
  .form-header h3 {
    font-size: 1rem;
  }
  
  .form-content {
    padding: 15px;
  }
  
  .form-group {
    margin-bottom: 12px;
  }
  
  .form-input,
  .form-textarea,
  .form-select {
    padding: 10px;
    font-size: 16px;
  }
  
  .form-textarea {
    min-height: 60px;
  }
  
  .form-actions {
    margin-top: 15px;
    padding-top: 12px;
  }
  
  .btn {
    padding: 10px 15px;
    font-size: 16px;
  }
}

@media (max-width: 360px) {
  .category-form-overlay {
    padding: 2px;
    padding-top: 5px;
  }
  
  .form-header {
    padding: 10px 12px;
  }
  
  .form-content {
    padding: 12px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  .form-input,
  .form-textarea,
  .form-select {
    padding: 8px;
  }
  
  .form-textarea {
    min-height: 50px;
  }
  
  .btn {
    padding: 8px 12px;
  }
}
</style>
