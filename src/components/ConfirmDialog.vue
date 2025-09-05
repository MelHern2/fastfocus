<template>
  <Transition name="modal" appear>
    <div v-if="isVisible" class="modal-overlay" @click="handleCancel">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <div class="modal-icon">
            <span v-if="options.type === 'warning'">⚠️</span>
            <span v-else-if="options.type === 'danger'">🗑️</span>
            <span v-else-if="options.type === 'info'">ℹ️</span>
            <span v-else">❓</span>
          </div>
          <h3 v-if="options.title" class="modal-title">{{ options.title }}</h3>
        </div>
        
        <div class="modal-body">
          <p class="modal-message">{{ options.message }}</p>
        </div>
        
        <div class="modal-footer">
          <button 
            class="modal-btn modal-btn-cancel"
            @click="handleCancel"
          >
            {{ options.cancelText }}
          </button>
          <button 
            class="modal-btn modal-btn-confirm"
            :class="`modal-btn-${options.type}`"
            @click="handleConfirm"
          >
            {{ options.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useConfirm } from '@/composables/useConfirm'

const { isVisible, options, handleConfirm, handleCancel } = useConfirm()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-container {
  background: linear-gradient(145deg, #ffffff 0%, var(--gray-50) 100%);
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--shadow-2xl);
  border: 2px solid var(--gray-200);
  max-width: 400px;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.modal-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius-2xl) var(--border-radius-2xl) 0 0;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 2px solid var(--gray-200);
}

.modal-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
}

.modal-body {
  padding: 1.5rem;
}

.modal-message {
  font-size: 1rem;
  color: var(--gray-600);
  line-height: 1.5;
  margin: 0;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  justify-content: flex-end;
}

.modal-btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-xl);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
  border: none;
  font-size: 0.875rem;
  min-width: 100px;
}

.modal-btn-cancel {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 2px solid var(--gray-300);
}

.modal-btn-cancel:hover {
  background: var(--gray-200);
  border-color: var(--gray-400);
}

.modal-btn-confirm {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-md);
}

.modal-btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.modal-btn-warning {
  background: var(--gradient-warning);
}

.modal-btn-warning:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.modal-btn-danger {
  background: var(--gradient-error);
}

.modal-btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.modal-btn-info {
  background: var(--gradient-info);
}

.modal-btn-info:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Animaciones */
.modal-enter-active {
  transition: all 0.3s ease;
}

.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container {
  transform: scale(0.9) translateY(-20px);
}

.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-20px);
}

/* Responsive */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-container {
    border-radius: 16px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-btn {
    width: 100%;
  }
}
</style>
