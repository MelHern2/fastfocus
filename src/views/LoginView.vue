<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>{{ isRegistering ? '📝 Registrarse' : '🔐 Iniciar Sesión' }}</h1>
        <p>{{ isRegistering ? 'Crea tu cuenta en FastFocus' : 'Accede a tu cuenta de FastFocus' }}</p>
      </div>

      <!-- Formulario de login -->
      <form @submit.prevent="handleEmailLogin" class="login-form">
        <div v-if="isRegistering" class="form-group">
          <label for="displayName">Nombre completo *</label>
          <input
            id="displayName"
            v-model="displayName"
            type="text"
            placeholder="Tu nombre completo"
            required
            :disabled="loading"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="tu@email.com"
            required
            :disabled="loading"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Tu contraseña"
            required
            :disabled="loading"
            class="form-input"
          />
        </div>

        <!-- Error message -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Reenviar verificación solo si el usuario está autenticado pero no verificado -->
        <div v-if="user && !user.emailVerified" class="verification-help">
          <p>¿No recibiste el email de verificación?</p>
          <button 
            @click="resendVerification" 
            :disabled="sendingVerification"
            class="resend-btn"
          >
            <span v-if="sendingVerification">Enviando...</span>
            <span v-else>Reenviar verificación</span>
          </button>
        </div>

        <!-- Submit button -->
        <button 
          type="submit" 
          class="btn-primary"
          :disabled="loading"
        >
          <span v-if="loading" class="loading-spinner"></span>
          {{ isRegistering ? 'Registrarse' : 'Iniciar Sesión' }}
        </button>
      </form>

      <!-- Separator -->
      <div class="separator">
        <span>o</span>
      </div>

      <!-- Google Sign In -->
      <button 
        @click="handleGoogleLogin" 
        class="btn-google"
        :disabled="loading"
      >
        <svg class="google-icon" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuar con Google
      </button>

      <!-- Toggle sign up/sign in -->
      <div class="toggle-mode">
        <p>
          {{ isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?' }}
          <button 
            @click="handleRegister" 
            class="toggle-btn"
            :disabled="loading"
          >
            {{ isRegistering ? 'Iniciar Sesión' : 'Registrarse' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, logout, resendEmailVerification, checkEmailExists, loading } = useAuth()

const email = ref('')
const password = ref('')
const displayName = ref('')
const error = ref('')
const successMessage = ref('')
const isRegistering = ref(false)
const sendingVerification = ref(false)

const handleEmailLogin = async () => {
  try {
    error.value = ''
    successMessage.value = ''
    
    if (isRegistering.value) {
      if (!displayName.value.trim()) {
        error.value = 'El nombre es obligatorio'
        return
      }
      await signUpWithEmail(email.value, password.value, displayName.value)
      successMessage.value = 'Cuenta creada exitosamente. Revisa tu correo para verificar tu cuenta.'
    } else {
      const user = await signInWithEmail(email.value, password.value)
      
      // Verificar si el correo está verificado
      if (user && !user.emailVerified) {
        // No cerrar sesión, solo mostrar mensaje y permitir reenviar verificación
        error.value = 'Debes verificar tu correo electrónico antes de continuar. Revisa tu bandeja de entrada.'
        return
      }
      
      successMessage.value = 'Sesión iniciada exitosamente'
    }
    
    // Redirigir al inicio después de un breve delay
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (err: any) {
    error.value = err.message || 'Error al autenticar'
  }
}

const handleGoogleLogin = async () => {
  try {
    error.value = ''
    successMessage.value = ''
    
    await signInWithGoogle()
    successMessage.value = 'Sesión iniciada con Google exitosamente'
    
    // Redirigir al inicio después de un breve delay
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (err: any) {
    error.value = err.message || 'Error al autenticar con Google'
  }
}

const handleRegister = () => {
  isRegistering.value = !isRegistering.value
  error.value = ''
  successMessage.value = ''
  displayName.value = '' // Limpiar el campo de nombre al cambiar de modo
}

const resendVerification = async () => {
  if (!user.value) {
    error.value = 'Debes estar autenticado para reenviar la verificación'
    return
  }
  
  if (user.value.emailVerified) {
    error.value = 'Tu email ya está verificado'
    return
  }
  
  sendingVerification.value = true
  try {
    // Usar el SDK de Firebase para reenviar email de verificación
    await resendEmailVerification()
    successMessage.value = 'Email de verificación enviado. Revisa tu bandeja de entrada y la carpeta de spam.'
    error.value = ''
  } catch (err: any) {
    error.value = 'Error al enviar verificación: ' + err.message
  } finally {
    sendingVerification.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-header h1 {
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
}

.login-header p {
  color: #64748b;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 400;
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: #f9fafb;
  color: #1f2937;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  border: 1px solid #fecaca;
  font-weight: 500;
}

.verification-help {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #fecaca;
}

.verification-help p {
  margin: 0 0 0.75rem 0;
  color: #92400e;
  font-weight: 500;
}

.resend-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.resend-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.resend-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary {
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled)::before {
  left: 100%;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.separator {
  text-align: center;
  margin: 2rem 0;
  position: relative;
}

.separator::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.separator span {
  background: white;
  padding: 0 1.5rem;
  color: #6b7280;
  font-size: 0.95rem;
  font-weight: 500;
}

.btn-google {
  width: 100%;
  padding: 1rem 1.5rem;
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.btn-google:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-google:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.google-icon {
  width: 24px;
  height: 24px;
}

.toggle-mode {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.toggle-mode p {
  color: #6b7280;
  margin: 0;
  font-size: 0.95rem;
  font-weight: 400;
}

.toggle-btn {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.95rem;
  margin-left: 0.5rem;
  transition: color 0.2s ease;
}

.toggle-btn:hover:not(:disabled) {
  color: #5a67d8;
}

.toggle-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
    min-height: 100vh;
    align-items: flex-start;
    padding-top: 2rem;
  }
  
  .login-card {
    padding: 2rem;
    border-radius: 16px;
    margin: 0 auto;
    width: 100%;
    max-width: 90vw;
  }
  
  .login-header h1 {
    font-size: 2rem;
  }
  
  .login-header p {
    font-size: 1rem;
  }
  
  .form-input {
    padding: 0.875rem 1rem;
    font-size: 16px; /* Evita zoom en iOS */
  }
  
  .btn-primary,
  .btn-google {
    padding: 0.875rem 1.25rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 0.5rem;
    padding-top: 1rem;
  }
  
  .login-card {
    padding: 1.5rem;
    border-radius: 12px;
    max-width: 95vw;
  }
  
  .login-header h1 {
    font-size: 1.75rem;
  }
  
  .login-header p {
    font-size: 0.9rem;
  }
  
  .form-input {
    padding: 0.75rem 0.875rem;
    font-size: 16px; /* Evita zoom en iOS */
  }
  
  .btn-primary,
  .btn-google {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }
  
  .google-icon {
    width: 20px;
    height: 20px;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .error-message {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .login-card {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  .login-header h1 {
    font-size: 1.5rem;
  }
  
  .login-header p {
    font-size: 0.85rem;
  }
  
  .form-input {
    padding: 0.625rem 0.75rem;
  }
  
  .btn-primary,
  .btn-google {
    padding: 0.625rem 0.875rem;
    font-size: 0.9rem;
  }
}
</style>
