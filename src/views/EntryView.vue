<template>
  <div class="entry-view">
    <div class="entry-header">
      <div class="header-content">
        <div class="breadcrumb">
          <router-link to="/admin" class="breadcrumb-link">Admin</router-link>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ isEditing ? 'Editar Entrada' : 'Nueva Entrada' }}</span>
        </div>
        <h1>{{ isEditing ? 'Editar Entrada' : 'Nueva Entrada' }}</h1>
      </div>
    </div>

    <div class="entry-content">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando...</p>
      </div>

      <div v-else class="entry-form-container">
        <form @submit.prevent="handleSubmit" class="entry-form">
          <div class="form-section">
            <h2>Información Básica</h2>
            
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
                    v-for="category in categoriesWithHierarchy" 
                    :key="category.id" 
                    :value="category.id"
                    :disabled="category.disabled"
                  >
                    {{ category.displayName }}
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
              <label for="mainImage">Imagen Principal</label>
              <input
                id="mainImage"
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="form-input"
              />
              <div v-if="formData.mainImage" class="image-preview">
                <img :src="formData.mainImage" alt="Vista previa" class="preview-image" />
                <button type="button" @click="removeImage" class="remove-image-btn">
                  ✕ Eliminar imagen
                </button>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h2>Contenido</h2>
            <div class="form-group">
              <label for="content">Contenido *</label>
              <div class="editor-container">
                <!-- Editor WYSIWYG con CDN -->
                <div id="summernote-editor" class="summernote-container"></div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h2>Configuración</h2>
            
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
          </div>

          <div class="form-actions">
            <router-link to="/admin" class="btn btn-secondary">
              Cancelar
            </router-link>
            <button 
              type="submit" 
              :disabled="loading || !isFormValid"
              class="btn btn-primary"
            >
              {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar Entrada' : 'Crear Entrada') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEntries } from '@/composables/useEntries'
import { useCategories } from '@/composables/useCategories'
import { useToast } from '@/composables/useToast'
import type { Entry, CreateEntryData, UpdateEntryData } from '@/types/entry'
// Editor WYSIWYG simple sin dependencias

const route = useRoute()
const router = useRouter()
const { error: showError } = useToast()
const { 
  loading, 
  error, 
  fetchEntriesWithCategories,
  createEntry, 
  updateEntry 
} = useEntries()
const { 
  categories, 
  fetchCategories, 
  buildCategoryTree 
} = useCategories()

const editorInitialized = ref(false)

const formData = ref({
  title: '',
  content: '',
  excerpt: '',
  mainImage: '',
  categoryId: '',
  published: false,
  featured: false,
  tags: [] as string[],
  estimatedReadingTime: ''
})

const tagsInput = ref('')

const isEditing = computed(() => route.name === 'entry-edit')
const entryId = computed(() => route.params.id as string)

const isFormValid = computed(() => {
  return formData.value.title.trim() !== '' && 
         formData.value.excerpt.trim() !== '' && 
         formData.value.content.trim() !== '' &&
         formData.value.categoryId !== ''
})

// Inicializar Summernote
const initSummernote = () => {
  if (typeof window !== 'undefined' && (window as any).$ && (window as any).$.fn.summernote) {
    const $ = (window as any).$
    $('#summernote-editor').summernote({
      height: 400,
      placeholder: 'Escribe el contenido de tu entrada...',
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'clear']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['insert', ['link']],
        ['misc', ['undo', 'redo']]
      ],
      callbacks: {
        onChange: (contents: string) => {
          formData.value.content = contents
        },
        onInit: () => {
          console.log('Summernote inicializado correctamente')
          editorInitialized.value = true
          
          // Cargar contenido si estamos editando
          if (isEditing.value && formData.value.content) {
            console.log('Intentando cargar contenido en onInit:', formData.value.content)
            setTimeout(() => {
              $('#summernote-editor').summernote('code', formData.value.content)
              console.log('Contenido cargado en Summernote desde onInit')
            }, 300)
          }
        }
      }
    })
  }
}

// Crear jerarquía de categorías para el select
const categoriesWithHierarchy = computed(() => {
  const tree = buildCategoryTree()
  const result: Array<{id: string, displayName: string, disabled: boolean}> = []
  
  const addCategories = (categories: any[], level = 0) => {
    categories.forEach(category => {
      const prefix = '— '.repeat(level)
      result.push({
        id: category.id,
        displayName: `${prefix}${category.name}`,
        disabled: false
      })
      
      if (category.children && category.children.length > 0) {
        addCategories(category.children, level + 1)
      }
    })
  }
  
  addCategories(tree)
  return result
})

const resetForm = () => {
  formData.value = {
    title: '',
    content: '',
    excerpt: '',
    mainImage: '',
    categoryId: '',
    published: false,
    featured: false,
    tags: [],
    estimatedReadingTime: ''
  }
  tagsInput.value = ''
}

const updateTags = () => {
  const tags = tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
  formData.value.tags = tags
}

// Manejar subida de imagen
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      showError('Por favor selecciona un archivo de imagen válido')
      return
    }
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('La imagen debe ser menor a 5MB')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      formData.value.mainImage = result
    }
    reader.readAsDataURL(file)
  }
}

// Eliminar imagen
const removeImage = () => {
  formData.value.mainImage = ''
  // Limpiar el input file
  const fileInput = document.getElementById('mainImage') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

// Sin watch complejo

// Cargar datos de la entrada si está editando
const loadEntry = async () => {
  if (isEditing.value && entryId.value) {
    try {
      await fetchEntriesWithCategories()
      const entries = await fetchEntriesWithCategories()
      const entry = entries.find(e => e.id === entryId.value)
      
      if (entry) {
        formData.value = {
          title: entry.title,
          content: entry.content,
          excerpt: entry.excerpt,
          mainImage: entry.mainImage || '',
          categoryId: entry.categoryId,
          published: entry.published,
          featured: entry.featured,
          tags: entry.tags || [],
          estimatedReadingTime: entry.estimatedReadingTime || ''
        }
        tagsInput.value = entry.tags?.join(', ') || ''
        
        console.log('Contenido cargado:', entry.content)
        
        // El contenido se cargará en onInit cuando Summernote esté listo
        
        console.log('Contenido cargado en formData:', entry.content)
      } else {
        console.error('Entrada no encontrada')
        router.push('/admin')
      }
    } catch (err) {
      console.error('Error al cargar entrada:', err)
      router.push('/admin')
    }
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  try {
            const data = {
          title: formData.value.title.trim(),
          content: formData.value.content.trim(),
          excerpt: formData.value.excerpt.trim(),
          mainImage: formData.value.mainImage.trim(),
          categoryId: formData.value.categoryId,
          published: formData.value.published,
          featured: formData.value.featured,
          tags: formData.value.tags,
          estimatedReadingTime: formData.value.estimatedReadingTime.trim() || 'Tiempo de lectura no estimado'
        }

    if (isEditing.value) {
      await updateEntry(entryId.value, data as UpdateEntryData)
    } else {
      await createEntry(data as CreateEntryData)
    }
    
    router.push('/admin')
  } catch (err) {
    console.error('Error al guardar entrada:', err)
  }
}

onMounted(async () => {
  console.log('EntryView onMounted iniciado')
  await fetchCategories()
  
  // Cargar entrada PRIMERO si estamos editando
  if (isEditing.value) {
    await loadEntry()
  }
  
  // Cargar CDN de Summernote
  await loadSummernoteCDN()
  
  // Esperar a que se cargue y inicializar
  setTimeout(() => {
    initSummernote()
  }, 2000)
})

const loadSummernoteCDN = () => {
  return new Promise((resolve) => {
    // jQuery
    if (!document.querySelector('script[src*="jquery"]')) {
      const jqueryScript = document.createElement('script')
      jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js'
      jqueryScript.onload = () => {
        // Bootstrap CSS
        const bootstrapCSS = document.createElement('link')
        bootstrapCSS.rel = 'stylesheet'
        bootstrapCSS.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
        document.head.appendChild(bootstrapCSS)
        
        // Bootstrap JS
        const bootstrapJS = document.createElement('script')
        bootstrapJS.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js'
        bootstrapJS.onload = () => {
          // Summernote CSS
          const summernoteCSS = document.createElement('link')
          summernoteCSS.rel = 'stylesheet'
          summernoteCSS.href = 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css'
          document.head.appendChild(summernoteCSS)
          
          // Summernote JS
          const summernoteJS = document.createElement('script')
          summernoteJS.src = 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js'
          summernoteJS.onload = () => resolve(true)
          document.head.appendChild(summernoteJS)
        }
        document.head.appendChild(bootstrapJS)
      }
      document.head.appendChild(jqueryScript)
    } else {
      resolve(true)
    }
  })
}
</script>

<style scoped>
.entry-view {
  min-height: 100vh;
  background: #f8fafc;
}

.entry-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.breadcrumb-link {
  color: #667eea;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #5a67d8;
}

.breadcrumb-separator {
  color: #9ca3af;
}

.breadcrumb-current {
  color: #374151;
  font-weight: 500;
}

.entry-header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 2rem;
  font-weight: 700;
}

.entry-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.entry-form-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.entry-form {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2.5rem;
}

.form-section:last-of-type {
  margin-bottom: 0;
}

.form-section h2 {
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input[type="file"] {
  padding: 0.5rem;
  cursor: pointer;
}

.form-input[type="file"]::-webkit-file-upload-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
}

.form-input[type="file"]::-webkit-file-upload-button:hover {
  background: #5a67d8;
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
  min-height: 100px;
}

.image-preview {
  margin-top: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  max-width: 300px;
  position: relative;
}

.preview-image {
  width: 100%;
  height: auto;
  display: block;
}

.remove-image-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-image-btn:hover {
  background: rgba(239, 68, 68, 1);
}

.editor-container {
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

/* Editor Summernote */
.editor-container {
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.summernote-container {
  min-height: 400px;
}

:deep(.note-editor) {
  border: none !important;
  border-radius: 6px !important;
}

:deep(.note-toolbar) {
  background: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb !important;
  border-radius: 6px 6px 0 0 !important;
}

:deep(.note-editing-area) {
  border: none !important;
  border-radius: 0 0 6px 6px !important;
}

:deep(.note-editable) {
  min-height: 400px !important;
  padding: 1rem !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  font-size: 14px !important;
  line-height: 1.6 !important;
}

.editor-fallback {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  color: #6b7280;
  font-size: 14px;
}

.debug-info {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #10b981;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 10;
}

.fallback-textarea {
  width: 100%;
  min-height: 400px;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
}

.fallback-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  accent-color: #667eea;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #374151;
}

.tags-preview {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a67d8;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }
  
  .entry-content {
    padding: 1rem;
  }
  
  .entry-form {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

/* Estilos globales para Quill - sin scoped */
</style>
