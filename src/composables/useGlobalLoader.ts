import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const isLoading = ref(false)
const loadingMessage = ref('Cargando...')

export function useGlobalLoader() {
  const router = useRouter()

  // Función para mostrar el loader
  const showLoader = (message?: string) => {
    isLoading.value = true
    if (message) {
      loadingMessage.value = message
    }
  }

  // Función para ocultar el loader
  const hideLoader = () => {
    isLoading.value = false
    loadingMessage.value = 'Cargando...'
  }

  // Función para mostrar el loader durante una operación
  const withLoader = async <T>(operation: () => Promise<T>, message?: string): Promise<T> => {
    try {
      showLoader(message)
      const result = await operation()
      return result
    } finally {
      hideLoader()
    }
  }

  // Computed para detectar navegación
  const isNavigating = computed(() => {
    return router.currentRoute.value.meta.loading || isLoading.value
  })

  return {
    isLoading: computed(() => isLoading.value),
    loadingMessage: computed(() => loadingMessage.value),
    isNavigating,
    showLoader,
    hideLoader,
    withLoader
  }
}





