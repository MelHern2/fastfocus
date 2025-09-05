import { ref, computed } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useUserManagement } from './useUserManagement'
import { useFirestore } from './useFirestore'
import type { User } from 'firebase/auth'
import type { UserProfile } from '@/types/user'

export function useUserProfile() {
  const { createOrUpdateUserProfile } = useUserManagement()
  const { getDocument } = useFirestore()
  const isInitialized = ref(false)
  const userProfile = ref<UserProfile | null>(null)
  const loading = ref(false)

  // Computed para verificar si el usuario está verificado
  const isEmailVerified = computed(() => {
    return userProfile.value?.emailVerified || false
  })

  // Computed para verificar si el perfil está completo
  const isProfileComplete = computed(() => {
    return userProfile.value?.displayName && userProfile.value?.emailVerified
  })

  // Función para cargar el perfil del usuario
  const loadUserProfile = async (user: User) => {
    if (!user) return null
    
    loading.value = true
    try {
      const profile = await getDocument('userProfiles', user.uid)
      if (profile) {
        userProfile.value = {
          id: profile.id,
          email: (profile as any).email || '',
          displayName: (profile as any).displayName,
          bio: (profile as any).bio,
          avatar: (profile as any).avatar,
          isAdmin: (profile as any).isAdmin || false,
          emailVerified: user.emailVerified,
          createdAt: (profile as any).createdAt?.toDate() || new Date(),
          updatedAt: (profile as any).updatedAt?.toDate() || new Date()
        }
      } else {
        // Si no hay perfil, crear uno básico
        userProfile.value = {
          id: user.uid,
          displayName: user.displayName || '',
          email: user.email || '',
          bio: '',
          avatar: user.photoURL || undefined,
          isAdmin: false,
          emailVerified: user.emailVerified,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
      return userProfile.value
    } catch (error) {
      console.error('Error al cargar perfil de usuario:', error)
      // Crear un perfil básico en caso de error
      userProfile.value = {
        id: user.uid,
        displayName: user.displayName || '',
        email: user.email || '',
        bio: '',
        avatar: user.photoURL || undefined,
        isAdmin: false,
        emailVerified: user.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      return userProfile.value
    } finally {
      loading.value = false
    }
  }

  // Función para actualizar el perfil
  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!auth.currentUser) throw new Error('Usuario no autenticado')
    
    loading.value = true
    try {
      const result = await createOrUpdateUserProfile(auth.currentUser, profileData)
      if (result) {
        userProfile.value = {
          id: auth.currentUser.uid,
          email: auth.currentUser.email || '',
          isAdmin: userProfile.value?.isAdmin || false,
          createdAt: userProfile.value?.createdAt || new Date(),
          updatedAt: new Date(),
          ...profileData,
          emailVerified: auth.currentUser.emailVerified
        }
      }
      return result
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Inicializar el listener de autenticación de manera segura
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    console.log('useUserProfile - onAuthStateChanged:', currentUser)
    if (currentUser && !isInitialized.value) {
      console.log('Creando perfil para usuario:', currentUser.email)
      try {
        // Pequeño delay para asegurar que Firestore esté listo
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Cargar perfil existente
        await loadUserProfile(currentUser)
        
        // Crear o actualizar perfil si es necesario
        const result = await createOrUpdateUserProfile(currentUser)
        console.log('Resultado de crear perfil:', result)
        
        // Recargar perfil después de crear/actualizar
        await loadUserProfile(currentUser)
        
        isInitialized.value = true
      } catch (err) {
        console.error('Error al crear/actualizar perfil de usuario:', err)
        // Crear un perfil básico en caso de error
        userProfile.value = {
          id: currentUser.uid,
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
          bio: '',
                        avatar: currentUser.photoURL || undefined,
          isAdmin: false,
          emailVerified: currentUser.emailVerified,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        isInitialized.value = true
      }
    } else if (!currentUser) {
      userProfile.value = null
      isInitialized.value = false
    }
  })

  return {
    userProfile,
    isInitialized,
    loading,
    isEmailVerified,
    isProfileComplete,
    loadUserProfile,
    updateUserProfile,
    unsubscribe
  }
}
