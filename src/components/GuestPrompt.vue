<template>
  <div class="guest-prompt">
    <div class="guest-prompt-content">
      <div class="guest-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      
      <div class="guest-message">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        
        <div class="guest-actions">
          <router-link to="/login" class="btn btn-primary">
            Iniciar Sesión
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Acción restringida',
  message: 'Para realizar esta acción necesitas iniciar sesión o continuar como invitado para ver el contenido.'
})

const emit = defineEmits<{
  continueAsGuest: []
}>()
</script>

<style scoped>
.guest-prompt {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1rem 0;
  text-align: center;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.1);
  position: relative;
}

.guest-prompt::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 16px 16px 0 0;
}

.guest-prompt-content {
  max-width: 400px;
  margin: 0 auto;
}

.guest-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.guest-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.guest-message h3 {
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.guest-message p {
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
}

.guest-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  min-width: 120px;
}

.btn-primary {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
}



@media (min-width: 640px) {
  .guest-actions {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
