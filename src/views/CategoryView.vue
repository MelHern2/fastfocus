<template>
  <div class="category-view">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Cargando categoría...</p>
    </div>

    <div v-else-if="!category" class="not-found">
      <h1>Categoría no encontrada</h1>
      <p>La categoría que buscas no existe o ha sido eliminada.</p>
      <router-link to="/" class="btn btn-primary">Volver al inicio</router-link>
    </div>

    <div v-else class="category-content">
      <!-- Header de la categoría -->
      <div class="category-header">
        <div class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">Inicio</router-link>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ category.name }}</span>
        </div>
        
        <h1 class="category-title">{{ category.name }}</h1>
        
        <p v-if="category.description" class="category-description">
          {{ category.description }}
        </p>
      </div>

      <!-- Buscador -->
      <div class="search-section">
        <div class="search-container">
          <div class="search-box">
            <input
              v-model="searchQuery"
              @keyup="handleSearchKeyup"
              type="text"
              :placeholder="`Buscar en ${category.name}...`"
              class="search-input"
            />
            <button 
              @click="performSearch"
              :disabled="isSearching || !searchQuery.trim()"
              class="search-btn"
            >
              <span v-if="isSearching" class="search-spinner">⟳</span>
              <span v-else>🔍</span>
            </button>
            <button 
              v-if="searchQuery"
              @click="clearSearch"
              class="clear-btn"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- Resultados de búsqueda -->
      <div v-if="showSearchResults" class="search-results-section">
        <div class="search-results-header">
          <h2>Resultados de búsqueda en {{ category.name }}</h2>
          <p v-if="searchResults.length === 0" class="no-results">
            No se encontraron entradas que coincidan con "{{ searchQuery }}" en esta categoría
          </p>
          <p v-else class="results-count">
            {{ searchResults.length }} resultado{{ searchResults.length !== 1 ? 's' : '' }} encontrado{{ searchResults.length !== 1 ? 's' : '' }}
          </p>
        </div>
        
        <div v-if="searchResults.length > 0" class="entries-grid">
          <article 
            v-for="entry in searchResults" 
            :key="entry.id" 
            class="entry-card"
          >
            <div class="entry-image">
              <img 
                v-if="entry.mainImage" 
                :src="entry.mainImage" 
                :alt="entry.title"
                class="entry-main-image"
              />
              <div v-else class="entry-image-placeholder">
                <span class="entry-icon">📝</span>
              </div>
            </div>
            
            <div class="entry-content">
              <div class="entry-header">
                <h3 class="entry-title">{{ entry.title }}</h3>
                <div class="entry-meta">
                  <time class="entry-date">{{ formatDate(entry.createdAt) }}</time>
                  <span v-if="entry.featured" class="featured-badge">⭐</span>
                </div>
                <div class="entry-category">
                  <span class="category-badge">{{ category.name }}</span>
                </div>
              </div>

              <p class="entry-excerpt">{{ entry.excerpt }}</p>

              <div class="entry-footer">
                <div class="entry-tags" v-if="entry.tags && entry.tags.length > 0">
                  <span 
                    v-for="tag in entry.tags.slice(0, 2)" 
                    :key="tag" 
                    class="tag"
                  >
                    #{{ tag }}
                  </span>
                </div>
                
                <div class="entry-actions">
                  <span class="reading-time">{{ entry.estimatedReadingTime }}</span>
                  <button @click="() => router.push(`/entry/${entry.id}`)" class="read-more-btn">Leer más</button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Entradas de la categoría -->
      <div v-if="!showSearchResults" class="entries-section">
        <div v-if="entriesLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Cargando entradas...</p>
        </div>

        <div v-else-if="entries.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>No hay entradas en esta categoría</h3>
          <p>Esta categoría aún no tiene entradas publicadas.</p>
        </div>

        <div v-else class="entries-grid">
          <article 
            v-for="entry in paginatedEntries" 
            :key="entry.id" 
            class="entry-card"
          >
            <div class="entry-image">
              <img 
                v-if="entry.mainImage" 
                :src="entry.mainImage" 
                :alt="entry.title"
                class="entry-main-image"
              />
              <div v-else class="entry-image-placeholder">
                <span class="entry-icon">📝</span>
              </div>
            </div>
            
            <div class="entry-content">
              <div class="entry-header">
                <h3 class="entry-title">{{ entry.title }}</h3>
                <div class="entry-meta">
                  <time class="entry-date">{{ formatDate(entry.createdAt) }}</time>
                  <span v-if="entry.featured" class="featured-badge">⭐</span>
                </div>
                <div class="entry-category">
                  <span class="category-badge">{{ getCategoryName(entry.categoryId) }}</span>
                </div>
              </div>

              <p class="entry-excerpt">{{ entry.excerpt }}</p>

              <div class="entry-footer">
                <div class="entry-tags" v-if="entry.tags && entry.tags.length > 0">
                  <span 
                    v-for="tag in entry.tags.slice(0, 2)" 
                    :key="tag" 
                    class="tag"
                  >
                    #{{ tag }}
                  </span>
                </div>
                
                <div class="entry-actions">
                  <span class="reading-time">{{ entry.estimatedReadingTime }}</span>
                  <button @click="() => router.push(`/entry/${entry.id}`)" class="read-more-btn">Leer más</button>
                </div>
              </div>
            </div>
          </article>
        </div>
        
        <!-- Paginación -->
        <div v-if="totalPages > 1" class="pagination-section">
          <div class="pagination-info">
            Página {{ currentPage }} de {{ totalPages }} ({{ entries.length }} entradas)
          </div>
          <div class="pagination-controls">
            <button 
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="pagination-btn"
            >
              ← Anterior
            </button>
            
            <div class="pagination-numbers">
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="goToPage(page)"
                :class="['pagination-number', { active: page === currentPage }]"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="pagination-btn"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategories } from '@/composables/useCategories'
import { useEntries } from '@/composables/useEntries'
import { useFirestore } from '@/composables/useFirestore'
import type { Category } from '@/types/category'
import type { Entry } from '@/types/entry'

const route = useRoute()
const router = useRouter()
const { categories, fetchCategories } = useCategories()
const { fetchEntriesByCategory, entries: allEntries } = useEntries()

const loading = ref(true)
const entriesLoading = ref(true)
const entries = ref<Entry[]>([])
const currentPage = ref(1)
const entriesPerPage = 4

// Buscador
const searchQuery = ref('')
const searchResults = ref<Entry[]>([])
const isSearching = ref(false)
const showSearchResults = ref(false)

const categoryId = computed(() => route.params.id as string)

const category = computed(() => {
  return categories.value.find(cat => cat.id === categoryId.value)
})

const loadCategoryData = async () => {
  try {
    loading.value = true
    await fetchCategories()
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  } finally {
    loading.value = false
  }
}

const loadEntries = async () => {
  if (!categoryId.value) return
  
  try {
    entriesLoading.value = true
    console.log('Cargando entradas para categoría:', categoryId.value)
    const categoryEntries = await fetchEntriesByCategory(categoryId.value)
    console.log('Entradas encontradas:', categoryEntries.length)
    entries.value = categoryEntries as any
  } catch (error) {
    console.error('Error al cargar entradas:', error)
    entries.value = []
  } finally {
    entriesLoading.value = false
  }
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const handleReadMore = (entryId: string) => {
  console.log('handleReadMore llamado con ID:', entryId)
  console.log('Navegando a:', `/entry/${entryId}`)
  router.push(`/entry/${entryId}`)
}

const getCategoryName = (categoryId: string) => {
  const cat = categories.value.find(c => c.id === categoryId)
  return cat ? cat.name : 'Sin categoría'
}

const totalPages = computed(() => {
  return Math.ceil(entries.value.length / entriesPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const paginatedEntries = computed(() => {
  const startIndex = (currentPage.value - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  return entries.value.slice(startIndex, endIndex)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Funciones de búsqueda específicas para categorías
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    showSearchResults.value = false
    return
  }

  isSearching.value = true
  try {
    // Obtener entradas de la categoría específica directamente de Firestore
    const { getCollection } = useFirestore()
    const categoryEntries = await getCollection('entries', [
      ['categoryId', '==', categoryId.value],
      ['published', '==', true]
    ])
    
    const query = searchQuery.value.toLowerCase().trim()
    searchResults.value = categoryEntries.filter((entry: any) => 
      entry.title?.toLowerCase().includes(query) ||
      entry.excerpt?.toLowerCase().includes(query) ||
      entry.content?.toLowerCase().includes(query)
    ).map((entry: any) => ({
      id: entry.id,
      title: entry.title || '',
      content: entry.content || '',
      excerpt: entry.excerpt || '',
      mainImage: entry.mainImage,
      categoryId: entry.categoryId || '',
      categoryName: entry.categoryName,
      authorId: entry.authorId || '',
      authorEmail: entry.authorEmail,
      authorName: entry.authorName,
      published: entry.published || false,
      featured: entry.featured || false,
      tags: entry.tags || [],
      estimatedReadingTime: entry.estimatedReadingTime || '5 min',
      createdAt: entry.createdAt?.toDate() || new Date(),
      updatedAt: entry.updatedAt?.toDate() || new Date(),
      publishedAt: entry.publishedAt?.toDate() || undefined
    }))
    
    showSearchResults.value = true
    console.log('Búsqueda en categoría realizada:', { query, categoryId: categoryId.value, results: searchResults.value.length })
  } catch (error) {
    console.error('Error en la búsqueda:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  showSearchResults.value = false
}

const handleSearchKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    performSearch()
  }
}

onMounted(async () => {
  await loadCategoryData()
  await loadEntries()
})

// Escuchar cambios en la ruta
watch(() => route.params.id, async (newId) => {
  if (newId) {
    currentPage.value = 1 // Resetear a la primera página
    await loadEntries()
  }
})
</script>

<style scoped>
.category-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--gray-600);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--gray-200);
  border-top: 3px solid var(--primary-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.not-found h1 {
  color: var(--gray-800);
  font-size: 2rem;
  margin-bottom: 1rem;
}

.not-found p {
  color: var(--gray-600);
  margin-bottom: 2rem;
}

.category-content {
  background: linear-gradient(145deg, #ffffff 0%, var(--gray-50) 100%);
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--shadow-xl);
  border: 2px solid var(--gray-200);
  overflow: hidden;
}

.category-header {
  background: var(--gradient-primary);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

.breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.breadcrumb-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: var(--transition-fast);
}

.breadcrumb-link:hover {
  color: white;
}

.breadcrumb-separator {
  color: rgba(255, 255, 255, 0.6);
}

.breadcrumb-current {
  color: white;
  font-weight: 600;
}

.category-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-description {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
}

/* Estilos del buscador */
.search-section {
  margin-bottom: 3rem;
  padding: 2rem 0;
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
  border-radius: var(--border-radius-xl);
  border: 2px solid var(--gray-200);
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  border: 2px solid var(--gray-200);
  overflow: hidden;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  outline: none;
  font-size: 1.1rem;
  background: transparent;
  color: var(--gray-800);
}

.search-input::placeholder {
  color: var(--gray-500);
}

.search-btn {
  padding: 1rem 1.5rem;
  background: var(--gradient-primary);
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.search-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-btn {
  padding: 1rem;
  background: var(--gray-200);
  border: none;
  color: var(--gray-600);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.clear-btn:hover {
  background: var(--gray-300);
  color: var(--gray-800);
}

.search-spinner {
  animation: spin 1s linear infinite;
}

/* Estilos de resultados de búsqueda */
.search-results-section {
  margin-bottom: 3rem;
}

.search-results-header {
  text-align: center;
  margin-bottom: 2rem;
}

.search-results-header h2 {
  color: var(--gray-800);
  font-size: 2rem;
  margin-bottom: 1rem;
}

.results-count {
  color: var(--gray-600);
  font-size: 1.1rem;
}

.no-results {
  color: var(--gray-500);
  font-style: italic;
}

.entries-section {
  padding: 2rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--gray-600);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--gray-800);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.entries-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.entry-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.1),
    0 4px 15px rgba(102, 126, 234, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(102, 126, 234, 0.15);
  position: relative;
}

.entry-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  opacity: 0;
  transition: all 0.4s ease;
  border-radius: 24px 24px 0 0;
}

.entry-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 24px;
}

.entry-card:hover {
  transform: translateY(-15px) scale(1.03) rotateX(5deg);
  box-shadow: 
    0 30px 60px rgba(102, 126, 234, 0.2),
    0 15px 35px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border-color: rgba(102, 126, 234, 0.4);
}

.entry-card:hover::before {
  opacity: 1;
  height: 8px;
}

.entry-card:hover::after {
  opacity: 1;
}

.entry-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.entry-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(1) contrast(1) saturate(1);
}

.entry-card:hover .entry-main-image {
  transform: scale(1.1) rotate(2deg);
  filter: brightness(1.2) contrast(1.2) saturate(1.1);
}

.entry-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.entry-icon {
  font-size: 3rem;
  color: var(--gray-400);
}

.entry-content {
  padding: 1.5rem;
}

.entry-header {
  margin-bottom: 1rem;
}

.entry-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.entry-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--gray-500);
}

.entry-date {
  font-weight: 500;
}

.featured-badge {
  background: var(--gradient-warning);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
}

.entry-category {
  margin-top: 0.5rem;
}

.category-badge {
  background: var(--gradient-primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-lg);
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.entry-excerpt {
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.entry-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.entry-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: var(--primary-blue-100);
  color: var(--primary-blue);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.entry-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.reading-time {
  color: var(--gray-600);
  font-size: 0.875rem;
  font-weight: 500;
}

.read-more-btn {
  background: linear-gradient(135deg, #667eea 0%, #5a67d8 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  z-index: 10;
  pointer-events: auto;
}

.read-more-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.read-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5a67d8 0%, #4c51bf 100%);
}

.read-more-btn:hover::before {
  left: 100%;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-lg);
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition-fast);
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Responsive Design */
@media (min-width: 992px) {
  .entries-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  .entry-title {
    font-size: 1.4rem;
  }
  
  .entry-image {
    height: 220px;
  }
}

@media (max-width: 768px) {
  .category-view {
    padding: 1rem;
  }
  
  .category-header {
    padding: 2rem 1rem;
  }
  
  .category-title {
    font-size: 2rem;
  }
  
  .entries-section {
    padding: 1rem;
  }
  
  .entries-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .entry-content {
    padding: 1rem;
  }
  
  .entry-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .read-more-btn {
    width: 100%;
  }
}

/* Estilos de paginación */
.pagination-section {
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(145deg, #ffffff 0%, var(--gray-50) 100%);
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--shadow-lg);
  border: 2px solid var(--gray-200);
}

.pagination-info {
  text-align: center;
  color: var(--gray-600);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.pagination-btn {
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.pagination-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.pagination-numbers {
  display: flex;
  gap: 0.5rem;
}

.pagination-number {
  background: white;
  color: var(--gray-700);
  border: 2px solid var(--gray-200);
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
  min-width: 44px;
}

.pagination-number:hover {
  background: var(--primary-blue-50);
  border-color: var(--primary-blue-200);
  color: var(--primary-blue);
}

.pagination-number.active {
  background: var(--gradient-primary);
  color: white;
  border-color: var(--primary-blue);
  box-shadow: var(--shadow-sm);
}
</style>
