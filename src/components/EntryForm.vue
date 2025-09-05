<template>
  <div class="entry-form-overlay">
    <div class="entry-form">
      <div class="form-header">
        <h3>{{ isEditing ? 'Editar Entrada' : 'Nueva Entrada' }}</h3>
        <button @click="$emit('cancel')" class="close-btn">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="form-content">
        <div class="form-row">
          <div class="form-group">
            <label for="title">Título *</label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              required
              placeholder="Ingresa el título de la entrada"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="categoryId">Categoría *</label>
            <select
              id="categoryId"
              v-model="formData.categoryId"
              required
              class="form-select"
            >
              <option value="">Selecciona una categoría</option>
              <option 
                v-for="category in categories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="excerpt">Resumen *</label>
          <textarea
            id="excerpt"
            v-model="formData.excerpt"
            required
            placeholder="Escribe un breve resumen de la entrada"
            rows="3"
            class="form-textarea"
          ></textarea>
        </div>

        <!-- CAMPO DE PRUEBA -->
        <div class="form-group" style="background-color: #ff0000; color: white; padding: 20px; border: 5px solid #000; margin: 20px 0;">
          <h2 style="color: white; margin: 0 0 10px 0;">CAMPO DE PRUEBA - TIEMPO DE LECTURA</h2>
          <input
            type="text"
            placeholder="ESTO DEBERÍA SER VISIBLE"
            style="width: 100%; padding: 15px; font-size: 18px; border: 3px solid #000;"
          />
        </div>

        <div class="form-group" style="background-color: #fef3c7; padding: 15px; border: 2px solid #f59e0b; border-radius: 8px; margin: 20px 0;">
          <label for="estimatedReadingTime" style="color: #92400e; font-weight: bold; font-size: 16px;">Tiempo estimado de lectura</label>
          <input
            id="estimatedReadingTime"
            v-model="formData.estimatedReadingTime"
            type="text"
            placeholder="Ej: 5 minutos, 10-15 min, etc. (opcional)"
            class="form-input"
            style="border: 3px solid #f59e0b; background-color: #fffbeb; font-size: 16px; padding: 15px; margin-top: 10px;"
          />
          <small class="form-help" style="color: #92400e; font-weight: 500; margin-top: 10px; display: block;">Si se deja vacío, se auto-rellenará con "Tiempo de lectura no estimado"</small>
        </div>

        <div class="form-group">
          <label for="content">Contenido *</label>
          <div class="editor-container">
            <div ref="editorElement" class="quill-editor"></div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="tags">Etiquetas</label>
            <input
              id="tags"
              v-model="tagsInput"
              type="text"
              placeholder="Etiquetas separadas por comas"
              class="form-input"
              @blur="updateTags"
            />
            <div class="tags-preview" v-if="formData.tags.length > 0">
              <span 
                v-for="tag in formData.tags" 
                :key="tag" 
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input
                v-model="formData.published"
                type="checkbox"
                class="checkbox"
              />
              <span class="checkbox-text">Publicar entrada</span>
            </label>

            <label class="checkbox-label">
              <input
                v-model="formData.featured"
                type="checkbox"
                class="checkbox"
              />
              <span class="checkbox-text">Entrada destacada</span>
            </label>
          </div>
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
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useEntries } from '@/composables/useEntries'
import type { Entry, CreateEntryData, UpdateEntryData } from '@/types/entry'
import type { Category } from '@/types/category'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

interface Props {
  entry?: Entry | null
  categories?: Category[]
}

interface Emits {
  (e: 'save', data: CreateEntryData | UpdateEntryData): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { loading } = useEntries()

const editorElement = ref<HTMLElement>()
let quill: Quill | null = null

const formData = ref({
  title: '',
  content: '',
  excerpt: '',
  categoryId: '',
  published: false,
  featured: false,
  tags: [] as string[],
  estimatedReadingTime: ''
})

// Debug: verificar que el campo se está cargando
console.log('EntryForm - formData inicial:', formData.value)

const tagsInput = ref('')

const isEditing = computed(() => !!props.entry)

const isFormValid = computed(() => {
  return formData.value.title.trim() !== '' && 
         formData.value.excerpt.trim() !== '' && 
         formData.value.content.trim() !== '' &&
         formData.value.categoryId !== ''
})

const resetForm = () => {
  formData.value = {
    title: '',
    content: '',
    excerpt: '',
    categoryId: '',
    published: false,
    featured: false,
    tags: [],
    estimatedReadingTime: ''
  }
  tagsInput.value = ''
  if (quill) {
    quill.setContents([])
  }
}

const updateTags = () => {
  const tags = tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
  formData.value.tags = tags
}

// Cargar datos de la entrada si está editando
watch(() => props.entry, (newEntry) => {
  if (newEntry) {
    formData.value = {
      title: newEntry.title,
      content: newEntry.content,
      excerpt: newEntry.excerpt,
      categoryId: newEntry.categoryId,
      published: newEntry.published,
      featured: newEntry.featured,
      tags: newEntry.tags || [],
      estimatedReadingTime: newEntry.estimatedReadingTime || ''
    }
    tagsInput.value = newEntry.tags?.join(', ') || ''
    
    // Actualizar el editor Quill
    nextTick(() => {
      if (quill) {
        quill.setContents(quill.clipboard.convert(newEntry.content))
      }
    })
  } else {
    resetForm()
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!isFormValid.value) return

  const data = {
    title: formData.value.title.trim(),
    content: formData.value.content.trim(),
    excerpt: formData.value.excerpt.trim(),
    categoryId: formData.value.categoryId,
    published: formData.value.published,
    featured: formData.value.featured,
    tags: formData.value.tags,
    estimatedReadingTime: formData.value.estimatedReadingTime.trim()
  }

  console.log('EntryForm - Datos a enviar:', data)
  emit('save', data)
}

onMounted(async () => {
  console.log('EntryForm - Componente montado')
  console.log('EntryForm - formData en onMounted:', formData.value)
  await nextTick()
  
  if (editorElement.value) {
    quill = new Quill(editorElement.value, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          ['clean']
        ]
      }
    })

    // Actualizar el contenido del formulario cuando cambie el editor
    quill.on('text-change', () => {
      formData.value.content = quill?.root.innerHTML || ''
    })

    // Cargar contenido inicial si está editando
    if (props.entry) {
      quill.setContents(quill.clipboard.convert(props.entry.content))
    }
  }
})

onUnmounted(() => {
  if (quill) {
    quill = null
  }
})
</script>

<style scoped>
.entry-form-overlay {
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

.entry-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 900px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
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

.editor-container {
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.quill-editor {
  min-height: 300px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  accent-color: #667eea;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #4a5568;
}

.form-help {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 4px;
  display: block;
}

.tags-preview {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: #e2e8f0;
  color: #4a5568;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
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
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .entry-form {
    margin: 10px;
    max-width: none;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>


