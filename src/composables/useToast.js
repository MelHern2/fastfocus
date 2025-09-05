import { ref } from 'vue';
// Estado global para las notificaciones
const globalToastState = {
    notifications: ref([])
};
export function useToast() {
    const addNotification = (notification) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newNotification = {
            id,
            duration: 5000, // 5 segundos por defecto
            ...notification
        };
        globalToastState.notifications.value.push(newNotification);
        // Auto-remove after duration
        setTimeout(() => {
            removeNotification(id);
        }, newNotification.duration);
        return id;
    };
    const removeNotification = (id) => {
        const index = globalToastState.notifications.value.findIndex(n => n.id === id);
        if (index > -1) {
            globalToastState.notifications.value.splice(index, 1);
        }
    };
    const clearAll = () => {
        globalToastState.notifications.value = [];
    };
    // Métodos de conveniencia
    const success = (message, title, duration) => {
        return addNotification({ type: 'success', message, title, duration });
    };
    const error = (message, title, duration) => {
        return addNotification({ type: 'error', message, title, duration });
    };
    const warning = (message, title, duration) => {
        return addNotification({ type: 'warning', message, title, duration });
    };
    const info = (message, title, duration) => {
        return addNotification({ type: 'info', message, title, duration });
    };
    return {
        notifications: globalToastState.notifications,
        addNotification,
        removeNotification,
        clearAll,
        success,
        error,
        warning,
        info
    };
}
