import { ref, computed, watch } from 'vue'
import { useAuth } from './useAuth'
import { useUserManagement } from './useUserManagement'

export function useAdmin() {
  const { user } = useAuth()
  const { getUserProfile } = useUserManagement()
  
  const userProfile = ref(null)
  const loading = ref(false)
  
  // Email del administrador
  const ADMIN_EMAIL = 'melanasdoblaktocas3@gmail.com'
  
  // Función para verificar si un email es de administrador (más flexible)
  const isAdminEmail = (email: string | null | undefined): boolean => {
    if (!email) return false
    const cleanEmail = email.trim().toLowerCase()
    const cleanAdminEmail = ADMIN_EMAIL.trim().toLowerCase()
    console.log('isAdminEmail check:', {
      originalEmail: email,
      cleanEmail,
      adminEmail: ADMIN_EMAIL,
      cleanAdminEmail,
      matches: cleanEmail === cleanAdminEmail
    })
    return cleanEmail === cleanAdminEmail
  }
  
  // Cargar perfil del usuario cuando cambie
  watch(user, async (newUser) => {
    console.log('useAdmin - Usuario cambió:', newUser?.email)
    if (newUser) {
      loading.value = true
      try {
        const profile = await getUserProfile(newUser.uid)
        userProfile.value = profile as any
        console.log('useAdmin - Perfil cargado:', profile)
        console.log('useAdmin - Email del usuario:', newUser.email)
        console.log('useAdmin - Email admin esperado:', ADMIN_EMAIL)
        console.log('useAdmin - Coincide email:', newUser.email === ADMIN_EMAIL)
      } catch (err) {
        console.error('Error al cargar perfil:', err)
        console.log('useAdmin - Usando verificación por email como fallback')
      } finally {
        loading.value = false
      }
    } else {
      userProfile.value = null
    }
  }, { immediate: true })
  
  // Verificar si el usuario actual es administrador
  const isAdmin = computed(() => {
    console.log('useAdmin - Computed isAdmin ejecutándose:', {
      user: user.value,
      userEmail: user.value?.email,
      loading: loading.value
    })
    
    if (!user.value?.email) {
      console.log('useAdmin - No hay email de usuario')
      return false
    }
    
    // Verificar por email primero (más confiable)
    const emailCheck = isAdminEmail(user.value.email)
    console.log('useAdmin - Verificación por email:', {
      userEmail: user.value.email,
      emailCheck
    })
    
    if (emailCheck) {
      console.log('useAdmin - Usuario es admin por email')
      return true
    }
    
    // Si el perfil está cargando, no verificar por perfil aún
    if (loading.value) {
      console.log('useAdmin - Perfil cargando, solo verificando por email')
      return false
    }
    
    // Verificar por perfil de Firestore como fallback
    const profileCheck = (userProfile.value as any)?.isAdmin === true
    console.log('useAdmin - Verificación por perfil:', {
      userProfile: userProfile.value,
      profileCheck
    })
    
    const result = emailCheck || profileCheck
    console.log('useAdmin - Resultado final:', result)
    return result
  })
  
  // Verificar si el usuario está autenticado
  const isAuthenticated = computed(() => {
    const result = !!user.value
    console.log('useAdmin - isAuthenticated check:', {
      user: user.value,
      result
    })
    return result
  })
  
  // Verificar si el usuario puede acceder al panel de administración
  const canAccessAdmin = computed(() => {
    console.log('useAdmin - canAccessAdmin check:', {
      isAuthenticated: isAuthenticated.value,
      isAdmin: isAdmin.value,
      loading: loading.value,
      userEmail: user.value?.email
    })
    
    // Si no está autenticado, no puede acceder
    if (!isAuthenticated.value) {
      console.log('useAdmin - No autenticado')
      return false
    }
    
    // Si es admin por email, permitir acceso inmediatamente
    if (isAdminEmail(user.value?.email)) {
      console.log('useAdmin - Admin por email, acceso permitido')
      return true
    }
    
    // Si está cargando el perfil, no permitir acceso aún
    if (loading.value) {
      console.log('useAdmin - Cargando perfil, acceso denegado temporalmente')
      return false
    }
    
    // Verificar si es admin por perfil
    const result = isAdmin.value
    console.log('useAdmin - Resultado final canAccessAdmin:', result)
    return result
  })
  
  return {
    isAdmin,
    isAuthenticated,
    canAccessAdmin,
    userProfile,
    loading,
    ADMIN_EMAIL
  }
}
