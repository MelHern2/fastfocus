<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import GlobalLoader from '@/components/GlobalLoader.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
</script>

<template>
  <div id="app">
    <!-- Loader global -->
    <GlobalLoader />
    
    <!-- Navegación principal -->
    <NavBar />

    <!-- Contenido principal -->
    <main class="main-content">
      <RouterView />
    </main>
    
    <!-- Sistema de notificaciones -->
    <ToastContainer />
    
    <!-- Diálogo de confirmación -->
    <ConfirmDialog />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: 
    radial-gradient(circle at 20% 80%, rgba(21, 56, 96, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(100, 116, 139, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(21, 56, 96, 0.04) 0%, transparent 50%),
    linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
  line-height: 1.6;
  color: var(--gray-800);
  min-height: 100vh;
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 10% 20%, rgba(21, 56, 96, 0.02) 0%, transparent 30%),
    radial-gradient(circle at 90% 80%, rgba(100, 116, 139, 0.02) 0%, transparent 30%);
  pointer-events: none;
  z-index: -1;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
  padding: 0.5rem 1rem;
}

/* Responsive Design */
@media (min-width: 1600px) {
  .main-content {
    padding: 1rem 2rem;
  }
}

@media (min-width: 1400px) and (max-width: 1599px) {
  .main-content {
    padding: 0.75rem 1.5rem;
  }
}

@media (max-width: 1200px) {
  .main-content {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 0;
    margin: 0;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 0;
  }
}
</style>
