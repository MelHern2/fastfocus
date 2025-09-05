import { computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useNotifications } from '@/composables/useNotifications';
const router = useRouter();
const { user } = useAuth();
const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllRead, subscribeToNotifications } = useNotifications();
let unsubscribe = null;
// Computed para verificar si hay notificaciones leídas
const hasReadNotifications = computed(() => {
    return notifications.value.some(n => n.isRead);
});
// Manejar click en notificación
const handleNotificationClick = async (notification) => {
    // Marcar como leída si no lo está
    if (!notification.isRead) {
        await markAsRead(notification.id);
    }
    // Navegar a la entrada correspondiente
    if (notification.data.entryId) {
        // Si es una notificación de respuesta, navegar al comentario específico
        if (notification.type === 'reply' && notification.data.commentId) {
            router.push(`/entry/${notification.data.entryId}#comment-${notification.data.commentId}`);
        }
        // Si es una notificación de like, navegar al comentario que recibió el like
        else if (notification.type === 'like' && notification.data.likedCommentId) {
            router.push(`/entry/${notification.data.entryId}#comment-${notification.data.likedCommentId}`);
        }
        // Si es una notificación de dislike, navegar al comentario que recibió el dislike
        else if (notification.type === 'dislike' && notification.data.dislikedCommentId) {
            router.push(`/entry/${notification.data.entryId}#comment-${notification.data.dislikedCommentId}`);
        }
        // Si no hay comentario específico, solo navegar a la entrada
        else {
            router.push(`/entry/${notification.data.entryId}`);
        }
    }
};
// Formatear tiempo
const formatTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) {
        return 'Hace un momento';
    }
    else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    }
    else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    }
    else if (diffInSeconds < 2592000) { // 30 días
        const days = Math.floor(diffInSeconds / 86400);
        return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
    else {
        // Para fechas más antiguas, mostrar la fecha completa
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};
// Función para inicializar notificaciones
const initializeNotifications = () => {
    if (user.value && !unsubscribe) {
        // Cargar notificaciones
        fetchNotifications();
        // Suscribirse a cambios en tiempo real
        unsubscribe = subscribeToNotifications();
    }
};
// Función para limpiar notificaciones
const cleanupNotifications = () => {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
};
// Observar cambios en el usuario
watch(user, (newUser, oldUser) => {
    if (newUser && !oldUser) {
        // Usuario se autenticó
        initializeNotifications();
    }
    else if (!newUser && oldUser) {
        // Usuario cerró sesión
        cleanupNotifications();
    }
}, { immediate: true });
onMounted(() => {
    // Inicializar si el usuario ya está autenticado
    initializeNotifications();
});
onUnmounted(() => {
    cleanupNotifications();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-card']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-card']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-card']} */ ;
/** @type {__VLS_StyleScopedClasses['unread']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-read-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-read-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['notifications-page']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-card']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-header']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-content']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-actions']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "notifications-page" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "page-header" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "header-actions" },
});
if (__VLS_ctx.unreadCount > 0) {
    // @ts-ignore
    [unreadCount,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.markAllAsRead) },
        ...{ class: "btn btn-secondary" },
        disabled: (__VLS_ctx.loading),
    });
    // @ts-ignore
    [markAllAsRead, loading,];
    (__VLS_ctx.loading ? 'Marcando...' : 'Marcar todas como leídas');
    // @ts-ignore
    [loading,];
}
if (__VLS_ctx.hasReadNotifications) {
    // @ts-ignore
    [hasReadNotifications,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.deleteAllRead) },
        ...{ class: "btn btn-outline" },
        disabled: (__VLS_ctx.loading),
    });
    // @ts-ignore
    [loading, deleteAllRead,];
    (__VLS_ctx.loading ? 'Eliminando...' : 'Eliminar leídas');
    // @ts-ignore
    [loading,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "notifications-content" },
});
if (__VLS_ctx.loading && __VLS_ctx.notifications.length === 0) {
    // @ts-ignore
    [loading, notifications,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-state" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-spinner" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
}
else if (__VLS_ctx.notifications.length === 0) {
    // @ts-ignore
    [notifications,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "empty-state" },
    });
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
        ...{ class: "empty-icon" },
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    });
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "notifications-list" },
    });
    for (const [notification] of __VLS_getVForSourceType((__VLS_ctx.notifications))) {
        // @ts-ignore
        [notifications,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading && __VLS_ctx.notifications.length === 0))
                        return;
                    if (!!(__VLS_ctx.notifications.length === 0))
                        return;
                    __VLS_ctx.handleNotificationClick(notification);
                    // @ts-ignore
                    [handleNotificationClick,];
                } },
            key: (notification.id),
            ...{ class: "notification-card" },
            ...{ class: ({ 'unread': !notification.isRead }) },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "notification-header" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "notification-icon" },
        });
        if (notification.type === 'reply') {
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
            });
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
            });
        }
        else if (notification.type === 'like') {
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
            });
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
            });
        }
        else if (notification.type === 'dislike') {
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
            });
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M19.682 17.682a4.5 4.5 0 000-6.364L12 3.636l-7.682 7.682a4.5 4.5 0 006.364 6.364L12 16.364l1.318 1.318a4.5 4.5 0 006.364 0z",
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
            });
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            });
        }
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "notification-info" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "notification-title" },
        });
        (notification.title);
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "notification-time" },
        });
        (__VLS_ctx.formatTime(notification.createdAt));
        // @ts-ignore
        [formatTime,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "notification-actions" },
        });
        if (!notification.isRead) {
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading && __VLS_ctx.notifications.length === 0))
                            return;
                        if (!!(__VLS_ctx.notifications.length === 0))
                            return;
                        if (!(!notification.isRead))
                            return;
                        __VLS_ctx.markAsRead(notification.id);
                        // @ts-ignore
                        [markAsRead,];
                    } },
                ...{ class: "mark-read-btn" },
                title: "Marcar como leída",
            });
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
            });
            __VLS_asFunctionalElement(__VLS_elements.path)({
                'stroke-linecap': "round",
                'stroke-linejoin': "round",
                'stroke-width': "2",
                d: "M5 13l4 4L19 7",
            });
        }
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading && __VLS_ctx.notifications.length === 0))
                        return;
                    if (!!(__VLS_ctx.notifications.length === 0))
                        return;
                    __VLS_ctx.deleteNotification(notification.id);
                    // @ts-ignore
                    [deleteNotification,];
                } },
            ...{ class: "delete-btn" },
            title: "Eliminar notificación",
        });
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
        });
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "notification-content" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "notification-message" },
        });
        (notification.message);
        if (notification.data.entryTitle) {
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "notification-context" },
            });
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                ...{ class: "context-label" },
            });
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                ...{ class: "context-value" },
            });
            (notification.data.entryTitle);
        }
        if (!notification.isRead) {
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "unread-indicator" },
            });
        }
    }
}
if (__VLS_ctx.loading && __VLS_ctx.notifications.length > 0) {
    // @ts-ignore
    [loading, notifications,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-spinner" },
    });
}
/** @type {__VLS_StyleScopedClasses['notifications-page']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['notifications-content']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['notifications-list']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-card']} */ ;
/** @type {__VLS_StyleScopedClasses['unread']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-header']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-info']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-title']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-time']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-read-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-content']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-message']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-context']} */ ;
/** @type {__VLS_StyleScopedClasses['context-label']} */ ;
/** @type {__VLS_StyleScopedClasses['context-value']} */ ;
/** @type {__VLS_StyleScopedClasses['unread-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        notifications: notifications,
        unreadCount: unreadCount,
        loading: loading,
        markAsRead: markAsRead,
        markAllAsRead: markAllAsRead,
        deleteNotification: deleteNotification,
        deleteAllRead: deleteAllRead,
        hasReadNotifications: hasReadNotifications,
        handleNotificationClick: handleNotificationClick,
        formatTime: formatTime,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
