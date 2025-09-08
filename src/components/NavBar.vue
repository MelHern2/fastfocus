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
        <div class="dropdown-container" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
          <div class="nav-link dropdown-trigger">
            Categorías
            <span class="dropdown-arrow" :class="{ 'rotated': showDropdown }">▼</span>
          </div>
          <div v-show="showDropdown" class="dropdown-menu" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
            <div class="dropdown-content">
              <!-- Estado de carga -->
              <div v-if="loading" class="dropdown-loading">
                <div class="loading-spinner"></div>
                <span>Cargando categorías...</span>
              </div>
              
              <!-- Estado vacío -->
              <div v-else-if="categoriesTree.length === 0" class="dropdown-empty">
                No hay categorías disponibles
              </div>
              
              <!-- Lista de categorías -->
              <template v-else>
                <CategoryMenuItem 
                  v-for="category in categoriesTree" 
                  :key="category.id"
                  :category="category"
                  :level="0"
                  @close-dropdown="closeDropdown"
                />
              </template>
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
          <!-- Botón de administración para usuarios admin -->
          <router-link v-if="user && user.email && user.email.toLowerCase().trim() === 'melenasdoblaktocas3@gmail.com'" to="/admin" class="nav-link admin-link">
            <span class="admin-icon">⚙️</span>
            <span class="admin-text">Admin</span>
          </router-link>
          
          <!-- Botón para volver al index cuando estás en admin -->
          <router-link v-if="isAdminPage" to="/" class="nav-link back-link">
            <span class="back-icon">🏠</span>
            <span class="back-text">Volver al Inicio</span>
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
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAdmin } from '@/composables/useAdmin'
import { useCategories } from '@/composables/useCategories'
import NotificationBell from './NotificationBell.vue'
import CategoryMenuItem from './CategoryMenuItem.vue'
import type { CategoryTree } from '@/types/category'

const route = useRoute()
const { user, logout } = useAuth()
const { isAdmin } = useAdmin()
const { categories, loading, fetchCategories, buildCategoryTree } = useCategories()

const showDropdown = ref(false)
const showSubmenu = ref(false)
const categoriesTree = ref<CategoryTree[]>([])
const hoveredCategory = ref(null)
let hoverTimeout: number | null = null
let leaveTimeout: number | null = null

// Debug inicial
console.log('NavBar mounted, showDropdown initial:', showDropdown.value)

// Detectar si estamos en la página de admin
const isAdminPage = computed(() => {
  return route.path.startsWith('/admin')
})

// Manejar entrada del mouse
const handleMouseEnter = () => {
  if (leaveTimeout) {
    clearTimeout(leaveTimeout)
    leaveTimeout = null
  }
  showDropdown.value = true
}

// Manejar salida del mouse
const handleMouseLeave = () => {
  leaveTimeout = setTimeout(() => {
    showDropdown.value = false
  }, 500) // 500ms de delay
}

// Cerrar dropdown
const closeDropdown = () => {
  showDropdown.value = false
}


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

// Limpiar timeouts al desmontar
onUnmounted(() => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
  }
  if (leaveTimeout) {
    clearTimeout(leaveTimeout)
  }
})

// Debug: verificar estado de admin
watch(user, (newUser) => {
  console.log('NavBar - Usuario actualizado:', newUser)
  console.log('NavBar - Email:', newUser?.email)
  console.log('NavBar - Email tipo:', typeof newUser?.email)
  console.log('NavBar - Email longitud:', newUser?.email?.length)
  console.log('NavBar - Email charCodeAt:', newUser?.email?.split('').map(c => c.charCodeAt(0)))
  console.log('NavBar - DisplayName:', newUser?.displayName)
  console.log('NavBar - Es admin:', isAdmin.value)
  console.log('NavBar - Email coincide exacto:', newUser?.email === 'melanasdoblaktocas3@gmail.com')
  console.log('NavBar - Email coincide normalizado:', newUser?.email?.toLowerCase().trim() === 'melanasdoblaktocas3@gmail.com')
  console.log('NavBar - Condición botón admin:', newUser && newUser.email && newUser.email.toLowerCase().trim() === 'melanasdoblaktocas3@gmail.com')
  console.log('NavBar - Está en admin page:', isAdminPage.value)
}, { immediate: true })
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  transition: all 0.3s ease;
}

.nav-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0.75rem 1rem;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
  }
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: 700;
}

.brand-link {
  color: var(--primary-blue);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 16px;
  position: relative;
  background: transparent;
}

.brand-link:hover {
  color: var(--primary-blue-light);
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
}

.nav-logo {
  height: 48px;
  width: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.brand-link:hover .nav-logo {
  filter: drop-shadow(0 8px 16px rgba(59, 130, 246, 0.2));
  transform: scale(1.08) rotate(2deg);
}




.nav-menu {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.nav-link {
  color: var(--gray-600);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  position: relative;
  white-space: nowrap;
  background: transparent;
}

.nav-link:hover {
  color: var(--primary-blue);
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
}

.nav-link.router-link-active {
  color: var(--primary-blue);
  background: rgba(59, 130, 246, 0.15);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-link {
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: transparent;
}

.profile-link:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.user-name {
  color: inherit;
  font-weight: inherit;
  font-size: inherit;
}

.logout-btn {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #dc2626;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
  color: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.2);
}

/* Estilos para el botón de administración */
.admin-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #5a67d8 100%);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  position: relative;
}

.admin-link:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #4c51bf 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
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
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  position: relative;
}

.back-link:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
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
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  background: transparent;
  width: 100%;
  min-width: 120px;
}

.dropdown-trigger:hover {
  color: var(--primary-blue);
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
}

.dropdown-trigger.router-link-active {
  color: var(--primary-blue);
  background: rgba(59, 130, 246, 0.15);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.dropdown-arrow {
  font-size: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.dropdown-container:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: #ff0000 !important; /* ← ROJO PARA IDENTIFICAR CAMBIOS - VERCEL TEST */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  overflow: visible;
  animation: dropdownFadeIn 0.2s ease-out;
  margin-top: 0.25rem;
}

.dropdown-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
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
  padding: 0.75rem 1rem;
  color: var(--gray-500);
  font-size: 0.875rem;
  text-align: center;
  font-style: italic;
}

.dropdown-content {
  padding: 0.25rem 0;
  overflow: visible;
}

.dropdown-category {
  position: relative;
}

.dropdown-item-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.dropdown-item {
  color: var(--gray-700) !important;
  text-decoration: none !important;
  font-size: 0.875rem;
  padding: 0.75rem 1rem !important;
  display: block;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  background: var(--gray-50) !important;
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
}

.dropdown-item:hover {
  color: var(--primary-blue) !important;
  background: rgba(59, 130, 246, 0.1) !important;
  border-left-color: var(--primary-blue);
}

.dropdown-category:hover .dropdown-item {
  color: var(--primary-blue) !important;
  background: rgba(59, 130, 246, 0.1) !important;
  border-left-color: var(--primary-blue);
}

/* Forzar estilos específicos para el dropdown - Mayor especificidad */
.navbar .dropdown-menu .dropdown-item {
  color: var(--gray-700) !important;
  background: #ff0000 !important; /* ← ROJO PARA IDENTIFICAR CAMBIOS */
  padding: 0.75rem 1rem !important;
}

.navbar .dropdown-menu .dropdown-item:hover {
  color: var(--primary-blue) !important;
  background: rgba(59, 130, 246, 0.1) !important;
}

/* Forzar estilos para router-link dentro del dropdown */
.navbar .dropdown-menu .dropdown-item.router-link {
  color: var(--gray-700) !important;
  background: #ff0000 !important; /* ← ROJO PARA IDENTIFICAR CAMBIOS */
  padding: 0.75rem 1rem !important;
}

.navbar .dropdown-menu .dropdown-item.router-link:hover {
  color: var(--primary-blue) !important;
  background: rgba(59, 130, 246, 0.1) !important;
}

.dropdown-arrow-right {
  font-size: 0.75rem;
  color: var(--gray-400);
  margin-left: 0.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.dropdown-arrow-right:hover {
  background: var(--gray-100);
  color: var(--primary-blue);
}

.dropdown-arrow-right.expanded {
  transform: rotate(90deg);
}

.dropdown-submenu {
  background: rgba(255, 255, 255, 0.95);
  border-left: 3px solid var(--primary-blue);
  margin-left: 1rem;
}

.dropdown-submenu .dropdown-item {
  background: transparent !important;
  font-weight: 500;
  padding-left: 1.5rem;
  font-size: 0.875rem;
  color: var(--gray-700) !important;
  border-left: none;
  width: 100%;
  display: block;
}

.dropdown-submenu .dropdown-item a {
  color: var(--gray-700) !important;
  text-decoration: none !important;
  background-color: transparent !important;
  padding: 0.75rem 1rem !important;
  display: block;
  width: 100%;
}

.dropdown-submenu .dropdown-item:hover {
  color: var(--primary-blue) !important;
  background: rgba(59, 130, 246, 0.1) !important;
  width: 100%;
}

.dropdown-submenu .dropdown-item:hover a {
  color: var(--primary-blue) !important;
  background-color: transparent !important;
}

/* Sobrescribir CSS global que aplica color verde a los enlaces */
.dropdown-submenu a {
  color: var(--gray-700) !important;
  background-color: transparent !important;
  padding: 0.75rem 1rem !important;
  display: block;
  width: 100%;
}

.dropdown-submenu a:hover {
  color: var(--primary-blue) !important;
  background-color: rgba(59, 130, 246, 0.1) !important;
  width: 100%;
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
    padding: 1.25rem 3rem;
  }
  
  .nav-logo {
    height: 56px;
  }
}

@media (min-width: 1400px) and (max-width: 1599px) {
  .nav-container {
    padding: 1rem 2.5rem;
  }
  
  .nav-logo {
    height: 52px;
  }
}

@media (min-width: 1200px) and (max-width: 1399px) {
  .nav-logo {
    height: 50px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .nav-logo {
    height: 48px;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0.75rem 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
  }
  
  .nav-brand {
    order: 1;
    align-self: center;
  }
  
  .nav-logo {
    height: 44px;
  }
  
  .brand-link {
    padding: 0.5rem;
  }
  
  .nav-menu {
    order: 2;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    align-items: center;
  }
  
  .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    min-width: 180px;
    max-width: 280px;
    z-index: 1001;
    margin-top: 0.25rem;
    width: auto;
    border-radius: 8px;
  }
  
  .dropdown-submenu {
    position: static !important;
    top: auto !important;
    left: auto !important;
    transform: none !important;
    min-width: auto !important;
    max-width: none !important;
    width: auto !important;
    z-index: auto !important;
    background: transparent !important;
    border-left: none !important;
    margin-left: 0 !important;
    padding: 0 !important;
  }
  
  .dropdown-submenu .dropdown-item {
    padding-left: 1rem !important;
    font-size: 0.8rem !important;
    background: rgba(59, 130, 246, 0.05) !important;
    margin: 0.25rem 0 !important;
    border-radius: 4px !important;
  }
  
  .user-menu {
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 0.375rem;
  }
  
  .profile-link {
    font-size: 0.8rem;
    padding: 0.375rem 0.75rem;
  }
  
  .logout-btn {
    font-size: 0.8rem;
    padding: 0.375rem 0.75rem;
  }
  
  .admin-link,
  .back-link {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }
  
  .admin-text,
  .back-text {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0.5rem 0.75rem;
  }
  
  .nav-logo {
    height: 40px;
  }
  
  .nav-menu {
    gap: 0.25rem;
  }
  
  .nav-link {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .user-menu {
    gap: 0.25rem;
    padding: 0.25rem;
  }
  
  .profile-link,
  .logout-btn,
  .admin-link,
  .back-link {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }
  
  .dropdown-menu {
    min-width: 160px;
    max-width: 85vw;
    border-radius: 6px;
  }
}
</style>
