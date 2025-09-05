<template>
  <Transition name="loader-fade" mode="out-in">
    <div v-if="isNavigating" class="global-loader">
      <div class="loader-container">
        <div class="loader-content">
          <!-- Logo animado -->
          <div class="logo-container">
            <img 
              src="/src/assets/logo-fast-focus-removebg-preview.png" 
              alt="FastFocus" 
              class="loader-logo"
            />
            <div class="logo-glow"></div>
          </div>
          
          <!-- Texto de carga -->
          <h2 class="loader-title">FastFocus</h2>
          <p class="loader-subtitle">{{ loadingMessage }}</p>
          
          <!-- Spinner animado -->
          <div class="spinner-container">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
          
          <!-- Puntos de carga -->
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const { isNavigating, loadingMessage } = useGlobalLoader()
</script>

<style scoped>
.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
}

.loader-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 400px;
  padding: 2rem;
}

/* Logo animado */
.logo-container {
  position: relative;
  margin-bottom: 1.5rem;
  animation: logoFloat 3s ease-in-out infinite;
}

.loader-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 8px 25px rgba(255, 255, 255, 0.3));
  animation: logoPulse 2s ease-in-out infinite;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: glowPulse 2s ease-in-out infinite;
}

/* Título y subtítulo */
.loader-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  animation: titleFade 1.5s ease-in-out infinite;
}

.loader-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 2rem 0;
  font-weight: 400;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Spinner de anillos */
.spinner-container {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 1.5rem;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  border-top-color: rgba(255, 255, 255, 0.6);
  animation: spin 1.5s linear infinite reverse;
  animation-delay: 0.5s;
}

.spinner-ring:nth-child(3) {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  border-top-color: rgba(255, 255, 255, 0.4);
  animation: spin 1.5s linear infinite;
  animation-delay: 1s;
}

/* Puntos de carga */
.loading-dots {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: dotsBounce 1.4s ease-in-out infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

/* Animaciones */
@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes logoPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes titleFade {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dotsBounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* Transiciones */
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: all 0.3s ease;
}

.loader-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.loader-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

/* Responsive para móviles */
@media (max-width: 768px) {
  .loader-content {
    max-width: 300px;
    padding: 1.5rem;
  }
  
  .loader-logo {
    width: 60px;
    height: 60px;
  }
  
  .logo-glow {
    width: 90px;
    height: 90px;
  }
  
  .loader-title {
    font-size: 2rem;
  }
  
  .loader-subtitle {
    font-size: 1rem;
  }
  
  .spinner-container {
    width: 50px;
    height: 50px;
  }
  
  .loading-dots span {
    width: 6px;
    height: 6px;
  }
}

/* Responsive para tablets */
@media (min-width: 769px) and (max-width: 1024px) {
  .loader-content {
    max-width: 350px;
  }
  
  .loader-logo {
    width: 70px;
    height: 70px;
  }
  
  .logo-glow {
    width: 105px;
    height: 105px;
  }
}

/* Responsive para pantallas grandes */
@media (min-width: 1025px) {
  .loader-content {
    max-width: 450px;
  }
  
  .loader-logo {
    width: 90px;
    height: 90px;
  }
  
  .logo-glow {
    width: 135px;
    height: 135px;
  }
  
  .loader-title {
    font-size: 3rem;
  }
  
  .loader-subtitle {
    font-size: 1.25rem;
  }
}

/* Soporte para modo oscuro */
@media (prefers-color-scheme: dark) {
  .global-loader {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .logo-container,
  .loader-logo,
  .logo-glow,
  .loader-title,
  .spinner-ring,
  .loading-dots span {
    animation: none;
  }
  
  .logo-container {
    transform: translateY(0);
  }
  
  .loader-logo {
    transform: scale(1);
  }
  
  .logo-glow {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
