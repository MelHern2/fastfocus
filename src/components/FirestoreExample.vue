<template>
  <div class="firestore-example">
    <h2>Ejemplo de Firestore</h2>
    
    <!-- Formulario para agregar documentos -->
    <div class="form-section">
      <h3>Agregar nuevo documento</h3>
      <form @submit.prevent="addNewDocument">
        <input 
          v-model="newDocument.name" 
          placeholder="Nombre" 
          required
        />
        <input 
          v-model="newDocument.email" 
          type="email" 
          placeholder="Email" 
          required
        />
        <button type="submit" :disabled="loading">
          {{ loading ? 'Agregando...' : 'Agregar' }}
        </button>
      </form>
    </div>

    <!-- Lista de documentos -->
    <div class="documents-section">
      <h3>Documentos en la colección</h3>
      <div v-if="loading" class="loading">Cargando...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="documents.length === 0" class="no-data">
        No hay documentos en la colección
      </div>
      <div v-else class="documents-list">
        <div 
          v-for="doc in documents" 
          :key="doc.id" 
          class="document-item"
        >
          <div class="document-info">
            <strong>{{ doc.name }}</strong>
            <span>{{ doc.email }}</span>
          </div>
          <div class="document-actions">
            <button @click="deleteDocument(doc.id)" class="delete-btn">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useFirestore } from '@/composables/useFirestore'

// Tipos para los documentos
interface Document {
  id: string
  name: string
  email: string
  createdAt?: any
}

// Composable de Firestore
const { 
  loading, 
  error, 
  getCollection, 
  addDocument, 
  deleteDocument, 
  subscribeToCollection 
} = useFirestore()

// Estado reactivo
const documents = ref<Document[]>([])
const newDocument = ref({
  name: '',
  email: ''
})

// Suscripción en tiempo real
let unsubscribe: (() => void) | null = null

// Cargar documentos al montar el componente
onMounted(async () => {
  // Cargar documentos iniciales
  const initialDocs = await getCollection('users')
  documents.value = initialDocs as Document[]
  
  // Suscribirse a cambios en tiempo real
  unsubscribe = subscribeToCollection('users', (docs) => {
    documents.value = docs as Document[]
  })
})

// Limpiar suscripción al desmontar
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

// Agregar nuevo documento
const addNewDocument = async () => {
  const docData = {
    ...newDocument.value,
    createdAt: new Date()
  }
  
  const docId = await addDocument('users', docData)
  
  if (docId) {
    // Limpiar formulario
    newDocument.value = {
      name: '',
      email: ''
    }
  }
}

// Eliminar documento
const deleteDocumentHandler = async (docId: string) => {
  const success = await deleteDocument('users', docId)
  if (success) {
    console.log('Documento eliminado correctamente')
  }
}
</script>

<style scoped>
.firestore-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.form-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  min-width: 200px;
}

button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.documents-section {
  margin-top: 20px;
}

.loading, .error, .no-data {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #dc3545;
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.document-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.document-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.document-info strong {
  color: #333;
}

.document-info span {
  color: #666;
  font-size: 0.9em;
}

.delete-btn {
  background-color: #dc3545;
  padding: 6px 12px;
  font-size: 0.9em;
}

.delete-btn:hover {
  background-color: #c82333;
}
</style>
