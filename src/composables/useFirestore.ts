import { ref, computed } from 'vue'
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  onSnapshot,
  type DocumentData,
  type QuerySnapshot,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  type Query,
  type CollectionReference
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export function useFirestore() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Obtener todos los documentos de una colección con filtros y paginación
  const getCollection = async (
    collectionName: string, 
    constraints?: [string, any, any][], 
    orderByField?: string, 
    orderDirection: 'asc' | 'desc' = 'desc',
    limitCount?: number,
    lastDoc?: QueryDocumentSnapshot
  ) => {
    console.log('=== INICIO getCollection ===')
    console.log('collectionName:', collectionName)
    console.log('constraints:', constraints)
    console.log('orderByField:', orderByField)
    console.log('limitCount:', limitCount)
    console.log('db:', db)
    
    loading.value = true
    error.value = null
    
    try {
      console.log('Creando colección...')
      let q: Query<DocumentData> | CollectionReference<DocumentData> = collection(db, collectionName)
      console.log('Colección creada:', q)
      
      // Aplicar filtros
      if (constraints) {
        constraints.forEach(([field, operator, value]) => {
          console.log('Aplicando filtro:', field, operator, value)
          q = query(q, where(field, operator, value))
        })
      }
      
      // Aplicar ordenamiento
      if (orderByField) {
        console.log('Aplicando ordenamiento:', orderByField, orderDirection)
        q = query(q, orderBy(orderByField, orderDirection))
      }
      
      // Aplicar límite
      if (limitCount) {
        console.log('Aplicando límite:', limitCount)
        q = query(q, limit(limitCount))
      }
      
      // Aplicar paginación
      if (lastDoc) {
        console.log('Aplicando paginación')
        q = query(q, startAfter(lastDoc))
      }
      
      console.log('Ejecutando consulta...')
      const querySnapshot = await getDocs(q)
      console.log('querySnapshot.size:', querySnapshot.size)
      
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      console.log('Documentos procesados:', documents.length)
      console.log('Documentos:', documents)
      
      return documents
    } catch (err) {
      console.error('Error en getCollection:', err)
      console.error('Error details:', (err as any).message)
      console.error('Error stack:', (err as any).stack)
      error.value = `Error al obtener documentos: ${err}`
      return []
    } finally {
      loading.value = false
    }
  }

  // Obtener un documento específico
  const getDocument = async (collectionName: string, docId: string) => {
    console.log('=== INICIO getDocument ===')
    console.log('collectionName:', collectionName)
    console.log('docId:', docId)
    
    loading.value = true
    error.value = null
    
    try {
      const docRef = doc(db, collectionName, docId)
      console.log('docRef creado:', docRef)
      
      const docSnap = await getDoc(docRef)
      console.log('docSnap obtenido:', docSnap)
      console.log('docSnap.exists():', docSnap.exists())
      
      if (docSnap.exists()) {
        const result = {
          id: docSnap.id,
          ...docSnap.data()
        }
        console.log('Documento encontrado:', result)
        return result
      } else {
        console.log('Documento no encontrado')
        error.value = 'Documento no encontrado'
        return null
      }
    } catch (err) {
      console.error('Error en getDocument:', err)
      error.value = `Error al obtener documento: ${err}`
      return null
    } finally {
      loading.value = false
    }
  }

  // Agregar un nuevo documento
  const addDocument = async (collectionName: string, data: any) => {
    loading.value = true
    error.value = null
    
    try {
      const docRef = await addDoc(collection(db, collectionName), data)
      return docRef.id
    } catch (err) {
      error.value = `Error al agregar documento: ${err}`
      return null
    } finally {
      loading.value = false
    }
  }

  // Actualizar un documento
  const updateDocument = async (collectionName: string, docId: string, data: any) => {
    loading.value = true
    error.value = null
    
    try {
      const docRef = doc(db, collectionName, docId)
      await updateDoc(docRef, data)
      return true
    } catch (err) {
      error.value = `Error al actualizar documento: ${err}`
      return false
    } finally {
      loading.value = false
    }
  }

  // Eliminar un documento
  const deleteDocument = async (collectionName: string, docId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const docRef = doc(db, collectionName, docId)
      await deleteDoc(docRef)
      return true
    } catch (err) {
      error.value = `Error al eliminar documento: ${err}`
      return false
    } finally {
      loading.value = false
    }
  }

  // Escuchar cambios en tiempo real
  const subscribeToCollection = (
    collectionName: string, 
    callback: (documents: any[]) => void,
    conditions?: { field: string; operator: any; value: any }[],
    orderByField?: string,
    limitCount?: number
  ) => {
    let q: Query<DocumentData> | CollectionReference<DocumentData> = collection(db, collectionName)
    
    if (conditions) {
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value))
      })
    }
    
    if (orderByField) {
      q = query(q, orderBy(orderByField))
    }
    
    if (limitCount) {
      q = query(q, limit(limitCount))
    }

    return onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      callback(documents)
    })
  }

  return {
    loading,
    error,
    getCollection,
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    subscribeToCollection
  }
}
