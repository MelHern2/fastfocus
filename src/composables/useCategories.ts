import { ref, computed } from 'vue'
import { useFirestore } from './useFirestore'
import type { 
  Category, 
  CreateCategoryData, 
  UpdateCategoryData, 
  CategoryWithParent,
  CategoryTree 
} from '@/types/category'

export function useCategories() {
  const { 
    loading, 
    error, 
    getCollection, 
    getDocument, 
    addDocument, 
    updateDocument, 
    deleteDocument,
    subscribeToCollection 
  } = useFirestore()
  
  const categories = ref<Category[]>([])
  const categoriesWithParents = ref<CategoryWithParent[]>([])
  
  // Obtener todas las categorías
  const fetchCategories = async () => {
    const result = await getCollection('categories')
    categories.value = result.map(cat => ({
      ...cat,
      createdAt: cat.createdAt?.toDate() || new Date(),
      updatedAt: cat.updatedAt?.toDate() || new Date()
    }))
    return categories.value
  }
  
  // Obtener categorías con información del padre
  const fetchCategoriesWithParents = async () => {
    await fetchCategories()
    
    const categoriesWithParentInfo = await Promise.all(
      categories.value.map(async (category) => {
        let parent: Category | undefined
        
        if (category.parentId) {
          const parentData = await getDocument('categories', category.parentId)
          if (parentData) {
            parent = {
              ...parentData,
              createdAt: parentData.createdAt?.toDate() || new Date(),
              updatedAt: parentData.updatedAt?.toDate() || new Date()
            }
          }
        }
        
        return {
          ...category,
          parent
        }
      })
    )
    
    categoriesWithParents.value = categoriesWithParentInfo
    return categoriesWithParents.value
  }
  
  // Crear una nueva categoría
  const createCategory = async (data: CreateCategoryData) => {
    // Filtrar campos undefined para evitar errores de Firestore
    const categoryData: any = {
      name: data.name,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Solo agregar parentId si no es undefined
    if (data.parentId !== undefined && data.parentId !== '') {
      categoryData.parentId = data.parentId
    }
    
    const docId = await addDocument('categories', categoryData)
    if (docId) {
      await fetchCategories() // Actualizar la lista
      return docId
    }
    return null
  }
  
  // Actualizar una categoría
  const updateCategory = async (id: string, data: UpdateCategoryData) => {
    // Filtrar campos undefined para evitar errores de Firestore
    const updateData: any = {
      name: data.name,
      description: data.description,
      updatedAt: new Date()
    }
    
    // Solo agregar parentId si no es undefined
    if (data.parentId !== undefined && data.parentId !== '') {
      updateData.parentId = data.parentId
    } else if (data.parentId === '') {
      // Si es string vacío, eliminar el campo parentId
      updateData.parentId = null
    }
    
    const success = await updateDocument('categories', id, updateData)
    if (success) {
      await fetchCategories() // Actualizar la lista
    }
    return success
  }
  
  // Eliminar una categoría
  const deleteCategory = async (id: string) => {
    // Verificar si la categoría tiene hijos
    const hasChildren = categories.value.some(cat => cat.parentId === id)
    if (hasChildren) {
      error.value = 'No se puede eliminar una categoría que tiene subcategorías'
      return false
    }
    
    const success = await deleteDocument('categories', id)
    if (success) {
      await fetchCategories() // Actualizar la lista
    }
    return success
  }
  
  // Obtener categorías raíz (sin padre)
  const rootCategories = computed(() => {
    return categories.value.filter(cat => !cat.parentId)
  })
  
  // Obtener subcategorías de una categoría específica
  const getSubcategories = (parentId: string) => {
    return categories.value.filter(cat => cat.parentId === parentId)
  }
  
  // Construir árbol de categorías
  const buildCategoryTree = (): CategoryTree[] => {
    const categoryMap = new Map<string, CategoryTree>()
    
    // Crear mapa de categorías
    categories.value.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] })
    })
    
    // Construir árbol
    const tree: CategoryTree[] = []
    categoryMap.forEach(category => {
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId)!
        parent.children.push(category)
      } else {
        tree.push(category)
      }
    })
    
    // Ordenar por nombre
    const sortCategories = (cats: CategoryTree[]): CategoryTree[] => {
      return cats.sort((a, b) => a.name.localeCompare(b.name))
        .map(cat => ({
          ...cat,
          children: sortCategories(cat.children)
        }))
    }
    
    return sortCategories(tree)
  }
  
  // Obtener todas las categorías en formato plano con jerarquía
  const getAllCategoriesFlat = () => {
    const tree = buildCategoryTree()
    const result: Array<Category & { level: number, displayName: string }> = []
    
    const addCategories = (categories: CategoryTree[], level = 0) => {
      categories.forEach(category => {
        const prefix = '— '.repeat(level)
        result.push({
          ...category,
          level,
          displayName: `${prefix}${category.name}`
        })
        
        if (category.children && category.children.length > 0) {
          addCategories(category.children, level + 1)
        }
      })
    }
    
    addCategories(tree)
    return result
  }
  
  // Escuchar cambios en tiempo real
  const subscribeToCategories = (callback: (categories: Category[]) => void) => {
    return subscribeToCollection('categories', (docs) => {
      const categoriesData = docs.map(doc => ({
        ...doc,
        createdAt: doc.createdAt?.toDate() || new Date(),
        updatedAt: doc.updatedAt?.toDate() || new Date()
      }))
      categories.value = categoriesData
      callback(categoriesData)
    }, undefined, 'name')
  }
  
  return {
    categories: computed(() => categories.value),
    categoriesWithParents: computed(() => categoriesWithParents.value),
    rootCategories,
    loading,
    error,
    fetchCategories,
    fetchCategoriesWithParents,
    createCategory,
    updateCategory,
    deleteCategory,
    getSubcategories,
    buildCategoryTree,
    getAllCategoriesFlat,
    subscribeToCategories
  }
}
