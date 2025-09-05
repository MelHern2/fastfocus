<template>
  <div class="entry-detail-view">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Cargando entrada...</p>
    </div>

    <div v-else-if="!entry" class="not-found">
      <h1>Entrada no encontrada</h1>
      <p>La entrada que buscas no existe o ha sido eliminada.</p>
      <router-link to="/" class="btn btn-primary">Volver al inicio</router-link>
    </div>

    <div v-else class="entry-content">
      <!-- Header de la entrada -->
      <div class="entry-header">
        <div class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">Inicio</router-link>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ entry.title }}</span>
        </div>
        
        <h1 class="entry-title">{{ entry.title }}</h1>
        
        <div class="entry-meta">
          <time class="entry-date">{{ formatDate(entry.createdAt) }}</time>
          <span v-if="entry.featured" class="featured-badge">⭐ Destacada</span>
        </div>
      </div>

      <!-- Imagen principal -->
      <div v-if="entry.mainImage" class="entry-main-image-container">
        <img :src="entry.mainImage" :alt="entry.title" class="entry-main-image" />
      </div>

      <!-- Resumen -->
      <div class="entry-excerpt">
        <p>{{ entry.excerpt }}</p>
      </div>

      <!-- Etiquetas -->
      <div v-if="entry.tags && entry.tags.length > 0" class="entry-tags">
        <span 
          v-for="tag in entry.tags" 
          :key="tag" 
          class="tag"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Contenido -->
      <div class="entry-body">
        <div v-html="entry.content" class="entry-content-html"></div>
      </div>

             <!-- Footer -->
       <div class="entry-footer">
         <router-link to="/" class="btn btn-secondary">
           ← Volver al inicio
         </router-link>
       </div>
     </div>

     <!-- Sección de comentarios -->
     <CommentsSection :entry-id="entryId" />
   </div>
 </template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEntries } from '@/composables/useEntries'
import CommentsSection from '@/components/CommentsSection.vue'
import type { Entry } from '@/types/entry'

const route = useRoute()
const router = useRouter()
const { getDocument, loading } = useEntries()

const entry = ref<Entry | null>(null)

const entryId = computed(() => route.params.id as string)

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const loadEntry = async () => {
  console.log('=== INICIO loadEntry ===')
  console.log('entryId.value:', entryId.value)
  
  if (!entryId.value) {
    console.log('No hay entryId, redirigiendo a home')
    router.push('/')
    return
  }

  try {
    console.log('Buscando entrada con ID:', entryId.value)
    const entryData = await getDocument('entries', entryId.value)
    console.log('Datos de entrada obtenidos:', entryData)
    
    if (entryData) {
      entry.value = {
        ...entryData,
        createdAt: entryData.createdAt?.toDate() || new Date(),
        updatedAt: entryData.updatedAt?.toDate() || new Date(),
        publishedAt: entryData.publishedAt?.toDate() || undefined
      }
      console.log('Entrada cargada exitosamente:', entry.value)
    } else {
      console.log('No se encontró la entrada')
    }
  } catch (error) {
    console.error('Error al cargar la entrada:', error)
  }
}

// Función para hacer scroll a un elemento específico
const scrollToElement = (elementId: string) => {
  nextTick(() => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
      // Resaltar el elemento brevemente
      element.style.backgroundColor = '#fef3c7'
      setTimeout(() => {
        element.style.backgroundColor = ''
      }, 2000)
    }
  })
}

// Función para manejar el hash de la URL
const handleHashNavigation = () => {
  const hash = route.hash
  if (hash && hash.startsWith('#comment-')) {
    const commentId = hash.replace('#comment-', '')
    // Esperar un poco para que los comentarios se carguen
    setTimeout(() => {
      scrollToElement(`comment-${commentId}`)
    }, 1000)
  }
}

onMounted(async () => {
  console.log('=== EntryDetailView onMounted ===')
  console.log('route.params:', route.params)
  console.log('entryId computed:', entryId.value)
  
  await loadEntry()
  handleHashNavigation()
})
</script>

<style scoped>
.entry-detail-view {
  min-height: 100vh;
  background: #f8fafc;
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

.not-found {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.not-found h1 {
  color: #1f2937;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.not-found p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.entry-content {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(102, 126, 234, 0.1);
  position: relative;
}

.entry-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px 20px 0 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
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

.entry-header {
  margin-bottom: 2rem;
}

.entry-title {
  background: linear-gradient(135deg, #1f2937 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.entry-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.entry-date {
  font-style: italic;
}

.featured-badge {
  background: #fbbf24;
  color: #92400e;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.entry-main-image-container {
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.entry-main-image {
  width: 100%;
  height: auto;
  display: block;
}

.entry-excerpt {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
  border-left: 4px solid #667eea;
}

.entry-excerpt p {
  color: #374151;
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 0;
  font-style: italic;
}

.entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 2rem 0;
}

.tag {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.entry-body {
  margin: 2rem 0;
}

.entry-content-html {
  color: #374151;
  line-height: 1.7;
  font-size: 1.125rem;
}

.entry-content-html h1,
.entry-content-html h2,
.entry-content-html h3,
.entry-content-html h4,
.entry-content-html h5,
.entry-content-html h6 {
  color: #1f2937;
  margin: 2rem 0 1rem 0;
  font-weight: 600;
}

.entry-content-html h1 { font-size: 2rem; }
.entry-content-html h2 { font-size: 1.75rem; }
.entry-content-html h3 { font-size: 1.5rem; }
.entry-content-html h4 { font-size: 1.25rem; }
.entry-content-html h5 { font-size: 1.125rem; }
.entry-content-html h6 { font-size: 1rem; }

.entry-content-html p {
  margin: 1rem 0;
}

.entry-content-html ul,
.entry-content-html ol {
  margin: 1rem 0;
  padding-left: 2rem;
}

.entry-content-html li {
  margin: 0.5rem 0;
}

.entry-content-html blockquote {
  border-left: 4px solid #667eea;
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #6b7280;
}

.entry-content-html a {
  color: #667eea;
  text-decoration: underline;
}

.entry-content-html a:hover {
  color: #5a67d8;
}

.entry-content-html img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}

.entry-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
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

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
}

.btn-secondary {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #374151;
  border: 1px solid #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

/* Responsive Design */
@media (min-width: 1400px) {
  .entry-content {
    padding: 1.5rem 2rem;
    margin-top: 0.75rem;
  }
  
  .entry-title {
    font-size: 3.5rem;
  }
  
  .entry-main-image-container {
    margin: 3rem 0;
  }
}

@media (min-width: 1200px) and (max-width: 1399px) {
  .entry-content {
    padding: 1.25rem 1.5rem;
    margin-top: 0.75rem;
  }
  
  .entry-title {
    font-size: 3rem;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .entry-content {
    padding: 1rem 1.25rem;
    margin-top: 0.75rem;
  }
  
  .entry-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .entry-content {
    padding: 1rem;
    margin: 0.5rem 1rem;
    max-width: 100%;
  }
  
  .entry-title {
    font-size: 2rem;
  }
  
  .entry-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  
  .entry-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
