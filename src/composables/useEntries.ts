import { ref, computed } from 'vue'
import { useFirestore } from './useFirestore'
import { useAuth } from './useAuth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import type { 
  Entry, 
  CreateEntryData, 
  UpdateEntryData, 
  EntryWithCategory
} from '@/types/entry'

export function useEntries() {
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
  
  const { user } = useAuth()
  
  const entries = ref<Entry[]>([])
  const entriesWithCategories = ref<EntryWithCategory[]>([])
  
  // Obtener todas las entradas
  const fetchEntries = async () => {
    const result = await getCollection('entries')
    entries.value = result.map((entry: any) => ({
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
    return entries.value
  }
  
  // Obtener entradas con información de categoría
  const fetchEntriesWithCategories = async () => {
    await fetchEntries()
    
    const entriesWithCategoryInfo = await Promise.all(
      entries.value.map(async (entry) => {
        let categoryName = 'Sin categoría'
        
        if (entry.categoryId) {
          const categoryData = await getDocument('categories', entry.categoryId)
          if (categoryData) {
            categoryName = (categoryData as any).name
          }
        }
        
        return {
          ...entry,
          category: {
            id: entry.categoryId,
            name: categoryName
          }
        }
      })
    )
    
    entriesWithCategories.value = entriesWithCategoryInfo
    return entriesWithCategories.value
  }
  
  // Obtener las últimas entradas publicadas con paginación
  const fetchLatestEntries = async (limit: number = 4, lastDocId?: string) => {
    try {
      // Para la primera página, no necesitamos lastDoc
      let lastDoc: any = undefined
      
      // Para páginas siguientes, necesitamos obtener el documento de referencia
      if (lastDocId) {
        try {
          const docRef = doc(db, 'entries', lastDocId)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            lastDoc = docSnap
          }
        } catch (error) {
          console.error('Error al obtener documento de referencia:', error)
        }
      }
      
      // Obtener todas las entradas ordenadas por fecha de creación
      const result = await getCollection('entries', undefined, 'createdAt', 'desc', limit, lastDoc)
      
      const latestEntries = result.map((entry: any) => ({
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
        createdAt: entry.createdAt?.toDate() || new Date(),
        updatedAt: entry.updatedAt?.toDate() || new Date(),
        publishedAt: entry.publishedAt?.toDate() || undefined
      }))
      
      return latestEntries
    } catch (error) {
      console.error('Error en fetchLatestEntries:', error)
      return []
    }
  }
  
  // Crear una nueva entrada
  const createEntry = async (data: CreateEntryData) => {
    if (!user.value) {
      throw new Error('Usuario no autenticado')
    }
    
    const entryData: any = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      mainImage: data.mainImage || '',
      categoryId: data.categoryId,
      authorId: user.value.uid,
      authorEmail: user.value.email,
      published: data.published,
      featured: data.featured,
      tags: data.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Si se publica, agregar fecha de publicación
    if (data.published) {
      entryData.publishedAt = new Date()
    }
    
    const docId = await addDocument('entries', entryData)
    if (docId) {
      await fetchEntries() // Actualizar la lista
      return docId
    }
    return null
  }
  
  // Actualizar una entrada
  const updateEntry = async (id: string, data: UpdateEntryData) => {
    const updateData: any = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      mainImage: data.mainImage || '',
      categoryId: data.categoryId,
      published: data.published,
      featured: data.featured,
      tags: data.tags || [],
      updatedAt: new Date()
    }
    
    // Si se publica por primera vez, agregar fecha de publicación
    const currentEntry = entries.value.find(entry => entry.id === id)
    if (data.published && currentEntry && !currentEntry.publishedAt) {
      updateData.publishedAt = new Date()
    }
    
    const success = await updateDocument('entries', id, updateData)
    if (success) {
      await fetchEntries() // Actualizar la lista
    }
    return success
  }
  
  // Eliminar una entrada
  const deleteEntry = async (id: string) => {
    const success = await deleteDocument('entries', id)
    if (success) {
      await fetchEntries() // Actualizar la lista
    }
    return success
  }
  
  // Obtener entradas por categoría
  const getEntriesByCategory = (categoryId: string) => {
    return entries.value.filter(entry => entry.categoryId === categoryId)
  }
  
  // Obtener entradas publicadas
  const publishedEntries = computed(() => {
    return entries.value.filter(entry => entry.published)
  })
  
  // Obtener entradas destacadas
  const featuredEntries = computed(() => {
    return entries.value.filter(entry => entry.featured && entry.published)
  })
  
  // Obtener entradas por autor
  const getEntriesByAuthor = (authorId: string) => {
    return entries.value.filter(entry => entry.authorId === authorId)
  }
  
  // Obtener entradas por categoría
  const fetchEntriesByCategory = async (categoryId: string) => {
    const result = await getCollection('entries', [
      ['categoryId', '==', categoryId],
      ['published', '==', true]
    ])
    return result.map((entry: any) => ({
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
  }

  // Escuchar cambios en tiempo real
  const subscribeToEntries = (callback: (entries: Entry[]) => void) => {
    return subscribeToCollection('entries', (docs) => {
      const entriesData = docs.map(doc => ({
        ...doc,
        createdAt: doc.createdAt?.toDate() || new Date(),
        updatedAt: doc.updatedAt?.toDate() || new Date(),
        publishedAt: doc.publishedAt?.toDate() || undefined
      }))
      entries.value = entriesData
      callback(entriesData)
    }, undefined, 'createdAt')
  }
  
  return {
    entries: computed(() => entries.value),
    entriesWithCategories: computed(() => entriesWithCategories.value),
    publishedEntries,
    featuredEntries,
    loading,
    error,
    fetchEntries,
    fetchEntriesWithCategories,
    fetchLatestEntries,
    fetchEntriesByCategory,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntriesByCategory,
    getEntriesByAuthor,
    subscribeToEntries,
    getDocument
  }
}
