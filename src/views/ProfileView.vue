<template>
  <div class="profile-view">
    <div class="profile-container">
      <div class="profile-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal y verifica tu cuenta</p>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando perfil...</p>
      </div>

      <div v-else-if="userProfile" class="profile-content">
        <UserProfile />
      </div>

      <div v-else-if="loadError" class="error-state">
        <h2>Error al cargar el perfil</h2>
        <p>No se pudo cargar la información de tu perfil.</p>
        <button @click="loadProfile" class="retry-btn">Reintentar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useUserProfile } from '@/composables/useUserProfile'
import UserProfile from '@/components/UserProfile.vue'

const { user } = useAuth()
const { userProfile, loadUserProfile, loading } = useUserProfile()
const loadError = ref(false)

const loadProfile = async () => {
  if (user.value) {
    loadError.value = false
    try {
      await loadUserProfile(user.value)
    } catch (error) {
      console.error('Error al cargar perfil:', error)
      loadError.value = true
    }
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  background: 
    radial-gradient(circle at 20% 80%, rgba(21, 56, 96, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(100, 116, 139, 0.08) 0%, transparent 50%),
    linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
  padding: 2rem 0;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.profile-header {
  text-align: center;
  margin-bottom: 3rem;
}

.profile-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--gray-800) 0%, var(--primary-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
}

.profile-header p {
  color: var(--gray-600);
  font-size: 1.125rem;
  margin: 0;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(145deg, #ffffff 0%, var(--gray-50) 100%);
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--shadow-xl);
  border: 2px solid var(--gray-200);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state h2 {
  color: var(--error);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.error-state p {
  color: var(--gray-600);
  margin: 0 0 2rem 0;
}

.retry-btn {
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-xl);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.profile-content {
  background: linear-gradient(145deg, #ffffff 0%, var(--gray-50) 100%);
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--shadow-xl);
  border: 2px solid var(--gray-200);
  overflow: hidden;
}

@media (max-width: 768px) {
  .profile-view {
    padding: 1rem 0;
  }
  
  .profile-container {
    padding: 0 0.5rem;
  }
  
  .profile-header h1 {
    font-size: 2rem;
  }
  
  .profile-header p {
    font-size: 1rem;
  }
}
</style>




