import { ref, computed, onMounted } from 'vue'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
  type User
} from 'firebase/auth'
import { auth } from '@/firebase/config'

// Importar la configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAiQDaWxZZPTci18vBW-ihaMVhEeV9RuXs",
  authDomain: "fastfocus-bfdef.firebaseapp.com",
  databaseURL: "https://fastfocus-bfdef-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fastfocus-bfdef",
  storageBucket: "fastfocus-bfdef.firebasestorage.app",
  messagingSenderId: "441287270247",
  appId: "1:441287270247:web:5f751286441899c63499c2",
  measurementId: "G-F4YER23C94"
}

export function useAuth() {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)
  
  // Computed para verificar si el usuario es invitado
  const isGuest = computed(() => !user.value)
  
  // Computed para verificar si el usuario está autenticado
  const isAuthenticated = computed(() => !!user.value)

  // Escuchar cambios en el estado de autenticación
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      // Recargar el usuario para obtener el displayName actualizado
      currentUser.reload().then(() => {
        user.value = currentUser
        console.log('Auth listener - Usuario actualizado:', currentUser.displayName)
      }).catch(err => {
        console.error('Error al recargar usuario:', err)
        user.value = currentUser
      })
    } else {
      user.value = currentUser
    }
    loading.value = false
  })

  // Limpiar el listener cuando el componente se desmonte
  onMounted(() => {
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  })

  // Iniciar sesión con email y contraseña
  const signInWithEmail = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      // Asegurar que el displayName esté disponible
      if (result.user && result.user.displayName) {
        user.value = result.user
      }
      return result.user
    } catch (err: any) {
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Registrar usuario con email y contraseña
  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Actualizar el perfil con el nombre si se proporciona
      if (displayName && result.user) {
        await updateProfile(result.user, {
          displayName: displayName
        })
        // Forzar actualización del objeto user con el displayName actualizado
        user.value = { ...result.user, displayName: displayName }
      }
      
      // Enviar email de verificación
      if (result.user) {
        await sendEmailVerification(result.user)
      }
      
      return result.user
    } catch (err: any) {
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Iniciar sesión con Google
  const signInWithGoogle = async () => {
    loading.value = true
    error.value = null
    
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (err: any) {
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Cerrar sesión
  const logout = async () => {
    loading.value = true
    error.value = null
    
    try {
      await signOut(auth)
    } catch (err: any) {
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Reenviar email de verificación usando el SDK de Firebase
  const resendEmailVerification = async () => {
    console.log('=== INICIO resendEmailVerification ===')
    
    // Verificar que hay un usuario autenticado
    if (!auth.currentUser) {
      throw new Error('No hay usuario autenticado. Por favor, inicia sesión primero.')
    }
    
    const currentUser = auth.currentUser
    
    // Verificar que el email no esté ya verificado
    if (currentUser.emailVerified) {
      throw new Error('Tu email ya está verificado. No necesitas reenviar la verificación.')
    }
    
    loading.value = true
    error.value = null
    
    try {
      console.log('=== USANDO SDK DE FIREBASE ===')
      
      // Usar el SDK de Firebase directamente
      await sendEmailVerification(currentUser)
      
      console.log('✅ Email de verificación enviado exitosamente')
      return true
      
    } catch (err: any) {
      console.error('Error:', err)
      error.value = 'Error al enviar verificación: ' + (err.message || err)
      throw err
    } finally {
      loading.value = false
      console.log('=== FIN resendEmailVerification ===')
    }
  }

  // Función para verificar si un email está registrado
  const checkEmailExists = async (email: string) => {
    try {
      // Intentar iniciar sesión con una contraseña incorrecta
      await signInWithEmailAndPassword(auth, email, 'temp-password-check')
      // Si llegamos aquí, el usuario existe pero la contraseña es incorrecta
      await signOut(auth)
      return true
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        return false
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        // El usuario existe pero la contraseña es incorrecta
        await signOut(auth)
        return true
      }
      throw err
    }
  }

  // Convertir códigos de error de Firebase a mensajes legibles
  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No existe una cuenta con este email'
      case 'auth/wrong-password':
        return 'Contraseña incorrecta'
      case 'auth/invalid-credential':
        return 'Email o contraseña incorrectos'
      case 'auth/email-already-in-use':
        return 'Este email ya está en uso'
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres'
      case 'auth/invalid-email':
        return 'Email inválido'
      case 'auth/popup-closed-by-user':
        return 'Se cerró la ventana de autenticación'
      case 'auth/popup-blocked':
        return 'El popup fue bloqueado por el navegador'
      case 'auth/cancelled-popup-request':
        return 'Solicitud de popup cancelada'
      default:
        return 'Error de autenticación'
    }
  }

  return {
    user,
    loading,
    error,
    isGuest,
    isAuthenticated,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    logout,
    resendEmailVerification,
    checkEmailExists
  }
}
