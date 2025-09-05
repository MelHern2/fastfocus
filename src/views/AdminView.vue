<template>
  <div class="admin-view">
    <div class="admin-header">
      <h1>Panel de Administración</h1>
      <div class="admin-info">
        <p>Bienvenido, {{ user?.email }}</p>
        <button @click="logout" class="logout-btn">Cerrar Sesión</button>
      </div>
    </div>

    <!-- Mensaje de acceso denegado -->
    <div v-if="user && !isAdmin" class="access-denied">
      <div class="access-denied-content">
        <h2>🚫 Acceso Denegado</h2>
        <p>No tienes permisos de administrador para acceder a esta sección.</p>
        <p>Serás redirigido automáticamente al inicio en unos segundos...</p>
        <router-link to="/" class="btn btn-primary">Ir al Inicio Ahora</router-link>
      </div>
    </div>

    <div v-if="!user || isAdmin" class="admin-content">
      <div class="admin-tabs">
        <button 
          @click="activeTab = 'categories'"
          :class="{ active: activeTab === 'categories' }"
          class="tab-btn"
        >
          Gestión de Categorías
        </button>
        <button 
          @click="activeTab = 'entries'"
          :class="{ active: activeTab === 'entries' }"
          class="tab-btn"
        >
          Gestión de Entradas
        </button>
      </div>

      <div class="tab-content">
        <div v-if="activeTab === 'categories'" class="categories-section">
          <div class="section-header">
            <h2>Gestión de Categorías</h2>
            <button @click="showCategoryForm = true" class="add-btn">
              + Nueva Categoría
            </button>
          </div>

          <CategoryForm 
            v-if="showCategoryForm"
            :category="editingCategory"
            :categories="categories"
            @save="handleCategorySave"
            @cancel="handleCategoryCancel"
          />

          <CategoryList 
            :categories="categories"
            :loading="loading"
            :error="error"
            @edit="handleEditCategory"
            @delete="handleDeleteCategory"
          />
        </div>

        <div v-if="activeTab === 'entries'" class="entries-section">
          <div class="section-header">
            <h2>Gestión de Entradas</h2>
            <router-link to="/admin/entries/new" class="add-btn">
              + Nueva Entrada
            </router-link>
          </div>

          <EntryList 
            :entries="entriesWithCategories"
            :loading="entriesLoading"
            :error="entriesError"
            @delete="handleDeleteEntry"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAdmin } from '@/composables/useAdmin'
import { useCategories } from '@/composables/useCategories'
import { useEntries } from '@/composables/useEntries'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import CategoryForm from '@/components/CategoryForm.vue'
import CategoryList from '@/components/CategoryList.vue'
import EntryList from '@/components/EntryList.vue'
import type { Category, CreateCategoryData, UpdateCategoryData } from '@/types/category'
import type { Entry, CreateEntryData, UpdateEntryData } from '@/types/entry'

const router = useRouter()
const { user, logout } = useAuth()
const { canAccessAdmin, loading: adminLoading } = useAdmin()
const { success, error: showError } = useToast()
const { confirm } = useConfirm()

// Verificación simplificada de administrador
const isAdmin = computed(() => {
  return user.value && user.value.email === 'melenasdoblaktocas3@gmail.com'
})
const { 
  categories, 
  loading, 
  error, 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = useCategories()

const { 
  entriesWithCategories,
  loading: entriesLoading,
  error: entriesError,
  fetchEntriesWithCategories,
  createEntry,
  updateEntry,
  deleteEntry
} = useEntries()

const activeTab = ref('categories')
const showCategoryForm = ref(false)
const editingCategory = ref<Category | null>(null)

// Verificar acceso de administrador
watch([canAccessAdmin, adminLoading, user], ([hasAccess, isLoading, currentUser]) => {
  console.log('AdminView: canAccessAdmin cambió a:', hasAccess, 'adminLoading:', isLoading, 'user:', currentUser?.email)
  
  // Si no está cargando, hay un usuario autenticado pero no tiene acceso de admin
  if (!isLoading && currentUser && hasAccess === false) {
    console.log('AdminView: Usuario no tiene acceso de admin')
    // Comentado temporalmente para debugging
    // setTimeout(() => {
    //   router.push('/')
    // }, 2000)
  }
}, { immediate: true })

onMounted(async () => {
  await fetchCategories()
  await fetchEntriesWithCategories()
})

const handleCategorySave = async (data: CreateCategoryData | UpdateCategoryData) => {
  try {
    if (editingCategory.value) {
      // Actualizar categoría existente
      await updateCategory(editingCategory.value.id, data as UpdateCategoryData)
    } else {
      // Crear nueva categoría
      await createCategory(data as CreateCategoryData)
    }
    
    showCategoryForm.value = false
    editingCategory.value = null
  } catch (err) {
    console.error('Error al guardar categoría:', err)
  }
}

const handleCategoryCancel = () => {
  showCategoryForm.value = false
  editingCategory.value = null
}

const handleEditCategory = (category: Category) => {
  editingCategory.value = category
  showCategoryForm.value = true
}

const handleDeleteCategory = async (category: Category) => {
  const confirmed = await confirm({
    title: 'Eliminar categoría',
    message: `¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`,
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    type: 'danger'
  })
  
  if (confirmed) {
    try {
      await deleteCategory(category.id)
    } catch (err) {
      console.error('Error al eliminar categoría:', err)
    }
  }
}

// Función para eliminar entradas
const handleDeleteEntry = async (entry: Entry) => {
  const confirmed = await confirm({
    title: 'Eliminar entrada',
    message: `¿Estás seguro de que quieres eliminar la entrada "${entry.title}"?`,
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    type: 'danger'
  })
  
  if (confirmed) {
    try {
      await deleteEntry(entry.id)
    } catch (err) {
      console.error('Error al eliminar entrada:', err)
    }
  }
}
</script>

<style scoped>
.admin-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.admin-header h1 {
  color: #2d3748;
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.admin-info p {
  margin: 0;
  color: #4a5568;
  font-weight: 500;
}

.logout-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background: #c53030;
}

.admin-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.admin-tabs {
  display: flex;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.tab-btn {
  background: none;
  border: none;
  padding: 15px 25px;
  cursor: pointer;
  font-weight: 500;
  color: #4a5568;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  background: #edf2f7;
  color: #2d3748;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
  background: white;
}

.tab-content {
  padding: 30px;
}

.categories-section h2 {
  color: #2d3748;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.add-btn {
  background: #48bb78;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background: #38a169;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .admin-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
}

/* Estilos para mensaje de acceso denegado */
.access-denied {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
}

.access-denied-content {
  text-align: center;
  background: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  max-width: 500px;
}

.access-denied-content h2 {
  color: #dc2626;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.access-denied-content p {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.access-denied-content .btn {
  margin-top: 1.5rem;
}
</style>
