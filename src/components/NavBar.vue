<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <img src="/src/assets/logo-fast-focus-removebg-preview.png" alt="FastFocus" class="nav-logo" />
        </router-link>
      </div>

      <div class="nav-menu">
        <router-link to="/" class="nav-link">Inicio</router-link>
        
        <!-- Menú desplegable de categorías -->
        <div class="dropdown-container" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <div class="nav-link dropdown-trigger">
            Categorías
            <span class="dropdown-arrow">▼</span>
          </div>
          <div v-if="showDropdown" class="dropdown-menu">
            <div v-if="loading" class="dropdown-loading">
              <div class="loading-spinner"></div>
              <span>Cargando categorías...</span>
            </div>
            <div v-else-if="categoriesTree.length === 0" class="dropdown-empty">
              No hay categorías disponibles
            </div>
            <div v-else class="dropdown-content">
              <CategoryMenuItem 
                v-for="category in categoriesTree" 
                :key="category.id"
                :category="category"
                :level="0"
                @close-dropdown="showDropdown = false"
              />
            </div>
          </div>
        </div>
        
        <router-link to="/about" class="nav-link">Acerca de</router-link>
        
        <!-- Notificaciones para usuarios autenticados -->
        <NotificationBell v-if="user" />
        
        <!-- Enlaces de autenticación -->
        <template v-if="!user">
          <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
        </template>
        
        <template v-else>
          <!-- Botón para volver al index cuando estás en admin -->
          <router-link v-if="isAdminPage" to="/" class="nav-link back-link">
            <span class="back-icon">🏠</span>
            <span class="back-text">Volver al Inicio</span>
          </router-link>
          
          <!-- Botón de administración para usuarios admin -->
          <router-link v-else-if="user && user.email === 'melenasdoblaktocas3@gmail.com'" to="/admin" class="nav-link admin-link">
            <span class="admin-icon">⚙️</span>
            <span class="admin-text">Admin</span>
          </router-link>
          
          <div class="user-menu">
            <router-link to="/profile" class="profile-link">
              <span class="user-name">{{ user.displayName || 'Sin nombre' }}</span>
            </router-link>
            <button @click="logout" class="logout-btn">Cerrar Sesión</button>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAdmin } from '@/composables/useAdmin'
import { useCategories } from '@/composables/useCategories'
import NotificationBell from './NotificationBell.vue'
import CategoryMenuItem from './CategoryMenuItem.vue'

const route = useRoute()
const { user, logout } = useAuth()
const { isAdmin } = useAdmin()
const { categories, loading, fetchCategories, buildCategoryTree } = useCategories()

const showDropdown = ref(false)
const categoriesTree = ref([])
const hoveredCategory = ref(null)

// Detectar si estamos en la página de admin
const isAdminPage = computed(() => {
  return route.path.startsWith('/admin')
})


// Debug para hover
watch(hoveredCategory, (newVal) => {
  console.log('Hovered category changed:', newVal)
})

// Cargar categorías y construir árbol
const loadCategoriesTree = async () => {
  try {
    await fetchCategories()
    categoriesTree.value = buildCategoryTree()
    console.log('Categorías cargadas:', categoriesTree.value)
    console.log('Categorías con hijos:', categoriesTree.value.filter(cat => cat.children && cat.children.length > 0))
  } catch (error) {
    console.error('Error al cargar categorías:', error)
    categoriesTree.value = []
  }
}

// Cargar categorías al montar el componente
onMounted(async () => {
  await loadCategoriesTree()
})

// Debug: verificar estado de admin
console.log('NavBar - Usuario:', user.value?.email)
console.log('NavBar - DisplayName:', user.value?.displayName)
console.log('NavBar - Es admin:', isAdmin.value)
console.log('NavBar - Email coincide:', user.value?.email === 'melenasdoblaktocas3@gmail.com')
console.log('NavBar - Condición botón admin:', user.value && user.value.email === 'melenasdoblaktocas3@gmail.com')
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #ffffff 0%, var(--gray-50) 100%);
  box-shadow: var(--shadow-lg);
  padding: 0.5rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--gray-200);
}

.nav-container {
  width: 100%;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: 700;
}

.brand-link {
  color: var(--primary-blue);
  text-decoration: none;
  transition: var(--transition-normal);
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: var(--border-radius-xl);
}

.brand-link:hover {
  color: var(--primary-blue-light);
  transform: translateY(-2px);
  background: var(--primary-blue-50);
  box-shadow: var(--shadow-md);
}

.nav-logo {
  height: 50px;
  width: auto;
  transition: var(--transition-normal);
  filter: drop-shadow(var(--shadow-sm));
}

.brand-link:hover .nav-logo {
  filter: drop-shadow(var(--shadow-md));
  transform: scale(1.05);
}



.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--gray-600);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition-fast);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-lg);
  position: relative;
}

.nav-link:hover {
  color: var(--primary-blue);
  background: var(--primary-blue-50);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  color: var(--primary-blue);
  background: var(--primary-blue-100);
  font-weight: 600;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-link {
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.profile-link:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.user-name {
  color: inherit;
  font-weight: inherit;
  font-size: inherit;
}

.logout-btn {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border: 1px solid #d1d5db;
  color: #6b7280;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.logout-btn:hover {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: #fca5a5;
  color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(220, 38, 38, 0.15);
}

/* Estilos para el botón de administración */
.admin-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #5a67d8 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
}

.admin-link:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #4c51bf 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.admin-icon {
  font-size: 1rem;
}

.admin-text {
  font-size: 0.875rem;
}

/* Estilos para el botón de volver al inicio */
.back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--success) 0%, var(--success-dark) 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-lg);
  font-weight: 500;
  transition: var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.back-link:hover {
  background: linear-gradient(135deg, var(--success-dark) 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.back-icon {
  font-size: 1rem;
}

.back-text {
  font-size: 0.875rem;
}

/* Estilos para el menú desplegable de categorías */
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-lg);
  transition: var(--transition-fast);
  position: relative;
}

.dropdown-trigger:hover {
  color: var(--primary-blue);
  background: var(--primary-blue-50);
  transform: translateY(-1px);
}

.dropdown-trigger.router-link-active {
  color: var(--primary-blue);
  background: var(--primary-blue-100);
  font-weight: 600;
}

.dropdown-arrow {
  font-size: 0.75rem;
  transition: var(--transition-fast);
}

.dropdown-container:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: linear-gradient(145deg, #ffffff 0%, var(--gray-50) 100%);
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  min-width: 200px;
  z-index: 1000;
  overflow: visible;
  animation: dropdownFadeIn 0.2s ease-out;
}

.dropdown-loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: var(--gray-600);
  font-size: 0.875rem;
}

.dropdown-loading .loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--gray-200);
  border-top: 2px solid var(--primary-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.dropdown-empty {
  padding: 1rem;
  color: var(--gray-500);
  font-size: 0.875rem;
  text-align: center;
  font-style: italic;
}

.dropdown-content {
  padding: 0.5rem 0;
  overflow: visible;
}


@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (min-width: 1600px) {
  .nav-container {
    padding: 0 2rem;
  }
  
  .nav-logo {
    height: 60px;
  }
}

@media (min-width: 1400px) and (max-width: 1599px) {
  .nav-container {
    padding: 0 1.5rem;
  }
  
  .nav-logo {
    height: 55px;
  }
}

@media (min-width: 1200px) and (max-width: 1399px) {
  .nav-logo {
    height: 52px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .nav-logo {
    height: 75px;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .nav-logo {
    height: 60px;
  }
  
  .brand-link {
    padding: 0.25rem;
  }
  
  .nav-menu {
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .dropdown-menu {
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 250px;
    max-width: 90vw;
  }
  
  .dropdown-submenu {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 200px;
    max-width: 80vw;
  }
  
  .user-menu {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .user-name {
    text-align: center;
  }
  
  .logout-btn {
    width: 100%;
  }
}
</style>
