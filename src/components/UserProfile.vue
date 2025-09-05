<template>
  <div class="user-profile">
    <div class="profile-header">
      <div class="profile-avatar">
        <div class="avatar-circle">
          {{ userInitials }}
        </div>
        <div v-if="!userProfile?.emailVerified" class="verification-badge unverified">
          ⚠️
        </div>
        <div v-else class="verification-badge verified">
          ✅
        </div>
      </div>
      <div class="profile-info">
        <h3 class="profile-name">{{ userProfile?.displayName || 'Usuario' }}</h3>
        <p class="profile-email">{{ user?.email }}</p>
        <div class="verification-status">
          <span v-if="userProfile?.emailVerified" class="status verified">
            Correo verificado
          </span>
          <span v-else class="status unverified">
            Correo no verificado
          </span>
        </div>
      </div>
    </div>

    <div v-if="!userProfile?.emailVerified" class="verification-section">
      <div class="verification-warning">
        <h4>⚠️ Verificación de correo requerida</h4>
        <p>Para completar tu registro, necesitas verificar tu correo electrónico.</p>
        <button 
          @click="sendVerificationEmail" 
          :disabled="sendingVerification"
          class="verify-btn"
        >
          <span v-if="sendingVerification">Enviando...</span>
          <span v-else>Enviar correo de verificación</span>
        </button>
      </div>
    </div>

    <div class="profile-form">
      <h4>Información del perfil</h4>
      
      <div v-if="!isEditing" class="profile-display">
        <div class="info-item">
          <label>Nombre completo:</label>
          <span class="info-value">{{ userProfile?.displayName || 'No especificado' }}</span>
          <button @click="startEditing" class="edit-btn">Editar</button>
        </div>
      </div>

      <form v-else @submit.prevent="updateProfile" class="edit-form">
        <div class="form-group">
          <label for="displayName">Nombre completo</label>
          <input
            id="displayName"
            v-model="formData.displayName"
            type="text"
            placeholder="Ingresa tu nombre completo"
            required
          />
        </div>

        <div class="form-actions">
          <button 
            type="button"
            @click="cancelEditing"
            class="cancel-btn"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            :disabled="saving"
            class="save-btn"
          >
            <span v-if="saving">Guardando...</span>
            <span v-else>Guardar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useUserProfile } from '@/composables/useUserProfile'
import { useToast } from '@/composables/useToast'
import { updateProfile as updateFirebaseProfile } from 'firebase/auth'

const { user, resendEmailVerification } = useAuth()
const { userProfile, updateUserProfile } = useUserProfile()
const { success, error: showError } = useToast()

const formData = ref({
  displayName: ''
})

const saving = ref(false)
const sendingVerification = ref(false)
const isEditing = ref(false)

const userInitials = computed(() => {
  if (userProfile.value?.displayName) {
    return userProfile.value.displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return user.value?.email?.[0]?.toUpperCase() || 'U'
})

const sendVerificationEmail = async () => {
  if (!user.value) return
  
  sendingVerification.value = true
  try {
    await resendEmailVerification()
    success('Correo de verificación enviado. Revisa tu bandeja de entrada.')
  } catch (error) {
    console.error('Error al enviar verificación:', error)
    showError('Error al enviar el correo de verificación.')
  } finally {
    sendingVerification.value = false
  }
}

const startEditing = () => {
  isEditing.value = true
  formData.value.displayName = userProfile.value?.displayName || ''
}

const cancelEditing = () => {
  isEditing.value = false
  formData.value.displayName = userProfile.value?.displayName || ''
}

const updateProfile = async () => {
  if (!user.value) return
  
  saving.value = true
  try {
    // Actualizar Firebase Auth
    await updateFirebaseProfile(user.value, {
      displayName: formData.value.displayName
    })
    
    // Actualizar perfil en Firestore
    await updateUserProfile({
      displayName: formData.value.displayName
    })
    
    success('Perfil actualizado correctamente')
    isEditing.value = false
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    showError('Error al actualizar el perfil.')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (userProfile.value) {
    formData.value.displayName = userProfile.value.displayName || ''
  }
})
</script>

<style scoped>
.user-profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 20px rgba(102, 126, 234, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.profile-avatar {
  position: relative;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.verification-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.verification-badge.verified {
  background: #10b981;
}

.verification-badge.unverified {
  background: #f59e0b;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.profile-email {
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.verification-status {
  margin-top: 0.5rem;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status.verified {
  background: #d1fae5;
  color: #065f46;
}

.status.unverified {
  background: #fef3c7;
  color: #92400e;
}

.verification-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 16px;
  border: 2px solid rgba(245, 158, 11, 0.3);
}

.verification-warning h4 {
  color: #92400e;
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
}

.verification-warning p {
  color: #92400e;
  margin: 0 0 1rem 0;
}

.verify-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.verify-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.verify-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.profile-form h4 {
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
}

.profile-display {
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
}

.info-item label {
  font-weight: 600;
  color: #374151;
  min-width: 120px;
}

.info-value {
  flex: 1;
  color: #1f2937;
  font-size: 1rem;
}

.edit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.edit-form {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}
</style>


