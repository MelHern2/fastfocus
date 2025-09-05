<template>
  <div class="toast-container">
    <NotificationToast
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
      @close="removeNotification"
    />
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import NotificationToast from './NotificationToast.vue'

const { notifications, removeNotification } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
}

.toast-container > * {
  pointer-events: auto;
}
</style>
