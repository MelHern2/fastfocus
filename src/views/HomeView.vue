<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEntries } from '@/composables/useEntries'
import { useCategories } from '@/composables/useCategories'
import { useFirestore } from '@/composables/useFirestore'
import type { Entry } from '@/types/entry'

const router = useRouter()
const { fetchLatestEntries, fetchEntries, entries } = useEntries()
const { categories, fetchCategories } = useCategories()
const latestEntries = ref<Entry[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalEntries = ref(0)
const entriesPerPage = 4

// Buscador
const searchQuery = ref('')
const searchResults = ref<Entry[]>([])
const isSearching = ref(false)
const showSearchResults = ref(false)

const loadEntries = async (page = 1) => {
  loading.value = true
  
  try {
    // Calcular el offset para la paginación
    const offset = (page - 1) * entriesPerPage
    
    // Obtener todas las entradas y luego paginar
    const allEntries = await fetchLatestEntries(100) // Obtener muchas entradas
    totalEntries.value = allEntries.length
    
    // Paginar las entradas
    const startIndex = offset
    const endIndex = startIndex + entriesPerPage
    latestEntries.value = allEntries.slice(startIndex, endIndex) as any
    
    currentPage.value = page
  } catch (error) {
    console.error('Error al cargar entradas:', error)
    latestEntries.value = []
  } finally {
    loading.value = false
  }
}

const totalPages = computed(() => {
  return Math.ceil(totalEntries.value / entriesPerPage)
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

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    loadEntries(page)
  }
}

// Funciones de búsqueda
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    showSearchResults.value = false
    return
  }

  isSearching.value = true
  try {
    // Obtener todas las entradas directamente de Firestore
    const { getCollection } = useFirestore()
    const allEntries = await getCollection('entries')
    
    const query = searchQuery.value.toLowerCase().trim()
    searchResults.value = allEntries.filter((entry: any) => 
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
    console.log('Búsqueda realizada:', { query, results: searchResults.value.length })
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

const getCategoryName = (categoryId: string) => {
  const cat = categories.value.find(c => c.id === categoryId)
  return cat ? cat.name : 'Sin categoría'
}

onMounted(async () => {
  await fetchCategories()
  await loadEntries(1)
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const handleReadMore = (entryId: string) => {
  router.push(`/entry/${entryId}`)
}


</script>

<template>
  <div class="home-page">
    <!-- Buscador -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-box">
          <input
            v-model="searchQuery"
            @keyup="handleSearchKeyup"
            type="text"
            placeholder="Buscar entradas..."
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
        <h2>Resultados de búsqueda</h2>
        <p v-if="searchResults.length === 0" class="no-results">
          No se encontraron entradas que coincidan con "{{ searchQuery }}"
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
    </div>

    <!-- Sección de entradas -->
    <div v-if="!showSearchResults" class="latest-entries-section">

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando entradas...</p>
      </div>

      <div v-else-if="latestEntries.length === 0" class="empty-state">
        <p>No hay entradas disponibles</p>
      </div>

      <div v-else class="entries-grid">
        <article 
          v-for="entry in latestEntries" 
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
          Página {{ currentPage }} de {{ totalPages }} ({{ totalEntries }} entradas)
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
</template>

<style scoped>
.home-page {
  width: 100%;
  max-width: none;
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
  width: 100%;
  margin: 0;
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

/* Estilos para la sección de entradas */
.latest-entries-section {
  margin-bottom: 4rem;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
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
  backdrop-filter: blur(10px);
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
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
}

.entry-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(1.1) contrast(1.1);
}

.entry-card:hover .entry-main-image {
  transform: scale(1.1) rotate(2deg);
  filter: brightness(1.2) contrast(1.2) saturate(1.1);
}

.entry-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.entry-icon {
  font-size: 3rem;
  opacity: 0.8;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.entry-content {
  padding: 1rem;
}

.entry-header {
  margin-bottom: 1rem;
}

.entry-title {
  color: #1f2937;
  font-size: 1.375rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.entry-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.entry-date {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.featured-badge {
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
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
  box-shadow: 0 2px 8px rgba(21, 56, 96, 0.3);
}

.entry-excerpt {
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.95rem;
}

.entry-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
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
  display: block;
  white-space: nowrap;
}

.read-more-btn {
  background: linear-gradient(135deg, #667eea 0%, #5a67d8 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 15px rgba(102, 126, 234, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  display: inline-block;
  position: relative;
  overflow: hidden;
  text-transform: none;
  text-align: center;
  letter-spacing: 0.025em;
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
  transition: left 0.3s ease;
  pointer-events: none;
  z-index: -1;
}

.read-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(102, 126, 234, 0.4),
    0 4px 15px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #5a67d8 0%, #4c51bf 100%);
}

.read-more-btn:hover::before {
  left: 100%;
}

/* Estilos para el botón de cargar más */
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

/* Responsive Design */
@media (min-width: 1200px) {
  .entries-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }
  
  .entry-title {
    font-size: 1.5rem;
  }
  
  .entry-image {
    height: 250px;
  }
  
  .search-container {
    padding: 0 3rem;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
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
  .search-section {
    margin-bottom: 2rem;
    padding: 1.5rem 0;
  }
  
  .search-container {
    padding: 0;
    display: flex;
    justify-content: center;
  }
  
  .search-box {
    flex-direction: column;
    border-radius: var(--border-radius-md);
  }
  
  .search-input {
    padding: 0.875rem 1rem;
    font-size: 16px; /* Evita zoom en iOS */
    border-bottom: 1px solid var(--gray-200);
  }
  
  .search-btn,
  .clear-btn {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
  
  .entries-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin: 0;
    justify-items: center;
  }
  
  .entry-card {
    margin: 0;
    border-radius: 16px;
    max-width: 100%;
    width: 100%;
  }
  
  .entry-image {
    height: 180px;
    border-radius: 14px 14px 0 0;
  }
  
  .entry-icon {
    font-size: 2.5rem;
  }
  
  .entry-content {
    padding: 1rem;
  }
  
  .entry-title {
    font-size: 1.1rem;
  }
  
  .entry-excerpt {
    font-size: 0.9rem;
  }
  
  .entry-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .read-more-btn {
    width: 100%;
    text-align: center;
    padding: 0.75rem 1rem;
  }
  
  .pagination-section {
    margin: 2rem 0 0;
    padding: 1.5rem;
  }
  
  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pagination-btn {
    width: 100%;
    padding: 0.75rem 1rem;
  }
  
  .pagination-numbers {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .search-section {
    margin-bottom: 1.5rem;
    padding: 1rem 0;
  }
  
  .search-container {
    padding: 0;
  }
  
  .search-input {
    padding: 0.75rem 0.875rem;
    font-size: 16px;
  }
  
  .search-btn,
  .clear-btn {
    padding: 0.625rem 0.875rem;
    font-size: 0.9rem;
  }
  
  .entries-grid {
    gap: 1rem;
    margin: 0;
    justify-items: center;
  }
  
  .entry-card {
    border-radius: 12px;
    max-width: 100%;
    width: 100%;
  }
  
  .entry-image {
    height: 150px;
    border-radius: 10px 10px 0 0;
  }
  
  .entry-title {
    font-size: 1rem;
  }
  
  .entry-excerpt {
    font-size: 0.85rem;
  }
  
  .entry-icon {
    font-size: 2rem;
  }
  
  .entry-content {
    padding: 0.875rem;
  }
  
  .entry-title {
    font-size: 1.125rem;
  }
  
  .entry-excerpt {
    font-size: 0.9rem;
  }
  
  .read-more-btn {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
  }
  
  .pagination-section {
    margin: 1.5rem 0 0;
    padding: 1rem;
  }
  
  .pagination-info {
    font-size: 0.8rem;
  }
  
  .pagination-btn {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
  }
  
  .pagination-number {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
    min-width: 40px;
  }
}

@media (max-width: 360px) {
  .search-container {
    padding: 0 0.125rem;
  }
  
  .entries-grid {
    margin: 0;
    justify-items: center;
  }
  
  .entry-card {
    border-radius: 8px;
    max-width: 100%;
    width: 100%;
  }
  
  .entry-image {
    height: 120px;
    border-radius: 6px 6px 0 0;
  }
  
  .entry-content {
    padding: 0.75rem;
  }
  
  .entry-title {
    font-size: 1rem;
  }
  
  .entry-excerpt {
    font-size: 0.85rem;
  }
  
  .pagination-section {
    margin: 1rem 0;
    padding: 0.75rem;
  }
}
</style>