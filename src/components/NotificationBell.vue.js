import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useNotifications } from '@/composables/useNotifications';
const router = useRouter();
const { user } = useAuth();
const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead, subscribeToNotifications } = useNotifications();
const showDropdown = ref(false);
let unsubscribe = null;
// Toggle del dropdown
const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
};
// Cerrar dropdown
const closeDropdown = () => {
    showDropdown.value = false;
};
// Manejar click en notificación
const handleNotificationClick = async (notification) => {
    // Marcar como leída si no lo está
    if (!notification.isRead) {
        await markAsRead(notification.id);
    }
    // Navegar a la entrada correspondiente
    if (notification.data.entryId) {
        closeDropdown();
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
// Ver todas las notificaciones
const viewAllNotifications = () => {
    closeDropdown();
    router.push('/notifications');
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
    else {
        const days = Math.floor(diffInSeconds / 86400);
        return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
};
// Cerrar dropdown al hacer click fuera
const handleClickOutside = (event) => {
    const target = event.target;
    if (!target.closest('.notification-bell-container')) {
        closeDropdown();
    }
};
// Función para inicializar notificaciones
const initializeNotifications = () => {
    if (user.value && user.value.emailVerified && !unsubscribe) {
        // Cargar notificaciones iniciales
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
    // Agregar listener para clicks fuera
    document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
    cleanupNotifications();
    document.removeEventListener('click', handleClickOutside);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['notification-bell']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-bell']} */ ;
/** @type {__VLS_StyleScopedClasses['bell-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-header']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-all-read-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-all-read-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['unread']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['view-all-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-dropdown']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-message']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.user) {
    // @ts-ignore
    [user,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "notification-bell-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.toggleDropdown) },
        ...{ class: "notification-bell" },
        ...{ class: ({ 'has-notifications': __VLS_ctx.unreadCount > 0 }) },
        title: (__VLS_ctx.unreadCount > 0 ? `${__VLS_ctx.unreadCount} notificaciones no leídas` : 'Notificaciones'),
    });
    // @ts-ignore
    [toggleDropdown, unreadCount, unreadCount, unreadCount,];
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
        ...{ class: "bell-icon" },
        ...{ class: ({ 'animate': __VLS_ctx.unreadCount > 0 }) },
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
    });
    // @ts-ignore
    [unreadCount,];
    __VLS_asFunctionalElement(__VLS_elements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        'stroke-width': "2",
        d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    });
    if (__VLS_ctx.unreadCount > 0) {
        // @ts-ignore
        [unreadCount,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "notification-badge" },
            ...{ class: ({ 'pulse': __VLS_ctx.unreadCount > 0 }) },
        });
        // @ts-ignore
        [unreadCount,];
        (__VLS_ctx.unreadCount > 99 ? '99+' : __VLS_ctx.unreadCount);
        // @ts-ignore
        [unreadCount, unreadCount,];
    }
    if (__VLS_ctx.showDropdown) {
        // @ts-ignore
        [showDropdown,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ onClick: () => { } },
            ...{ class: "notification-dropdown" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "dropdown-header" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "header-actions" },
        });
        if (__VLS_ctx.unreadCount > 0) {
            // @ts-ignore
            [unreadCount,];
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                ...{ onClick: (__VLS_ctx.markAllAsRead) },
                ...{ class: "mark-all-read-btn" },
                disabled: (__VLS_ctx.loading),
            });
            // @ts-ignore
            [markAllAsRead, loading,];
            (__VLS_ctx.loading ? 'Marcando...' : 'Marcar todas como leídas');
            // @ts-ignore
            [loading,];
        }
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.closeDropdown) },
            ...{ class: "close-btn" },
            title: "Cerrar",
        });
        // @ts-ignore
        [closeDropdown,];
        __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
        });
        __VLS_asFunctionalElement(__VLS_elements.path)({
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M6 18L18 6M6 6l12 12",
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "notifications-content" },
        });
        if (__VLS_ctx.loading) {
            // @ts-ignore
            [loading,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "loading-notifications" },
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
                ...{ class: "no-notifications" },
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
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        }
        else {
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "notifications-list" },
            });
            for (const [notification] of __VLS_getVForSourceType((__VLS_ctx.notifications.slice(0, 5)))) {
                // @ts-ignore
                [notifications,];
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    ...{ onClick: (...[$event]) => {
                            if (!(__VLS_ctx.user))
                                return;
                            if (!(__VLS_ctx.showDropdown))
                                return;
                            if (!!(__VLS_ctx.loading))
                                return;
                            if (!!(__VLS_ctx.notifications.length === 0))
                                return;
                            __VLS_ctx.handleNotificationClick(notification);
                            // @ts-ignore
                            [handleNotificationClick,];
                        } },
                    key: (notification.id),
                    ...{ class: "notification-item" },
                    ...{ class: ({ 'unread': !notification.isRead }) },
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
                    ...{ class: "notification-content" },
                });
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    ...{ class: "notification-title" },
                });
                (notification.title);
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    ...{ class: "notification-message" },
                });
                (notification.message);
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    ...{ class: "notification-time" },
                });
                (__VLS_ctx.formatTime(notification.createdAt));
                // @ts-ignore
                [formatTime,];
                if (!notification.isRead) {
                    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                        ...{ class: "unread-indicator" },
                    });
                }
            }
        }
        if (__VLS_ctx.notifications.length > 5) {
            // @ts-ignore
            [notifications,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "view-all-notifications" },
            });
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                ...{ onClick: (__VLS_ctx.viewAllNotifications) },
                ...{ class: "view-all-btn" },
            });
            // @ts-ignore
            [viewAllNotifications,];
            (__VLS_ctx.notifications.length);
            // @ts-ignore
            [notifications,];
        }
    }
    if (__VLS_ctx.showDropdown) {
        // @ts-ignore
        [showDropdown,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ onClick: (__VLS_ctx.closeDropdown) },
            ...{ class: "dropdown-overlay" },
        });
        // @ts-ignore
        [closeDropdown,];
    }
}
/** @type {__VLS_StyleScopedClasses['notification-bell-container']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-bell']} */ ;
/** @type {__VLS_StyleScopedClasses['has-notifications']} */ ;
/** @type {__VLS_StyleScopedClasses['bell-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['animate']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['pulse']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-dropdown']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-all-read-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['notifications-content']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-notifications']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['no-notifications']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['notifications-list']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
/** @type {__VLS_StyleScopedClasses['unread']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-content']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-title']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-message']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-time']} */ ;
/** @type {__VLS_StyleScopedClasses['unread-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['view-all-notifications']} */ ;
/** @type {__VLS_StyleScopedClasses['view-all-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-overlay']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        user: user,
        notifications: notifications,
        unreadCount: unreadCount,
        loading: loading,
        markAllAsRead: markAllAsRead,
        showDropdown: showDropdown,
        toggleDropdown: toggleDropdown,
        closeDropdown: closeDropdown,
        handleNotificationClick: handleNotificationClick,
        viewAllNotifications: viewAllNotifications,
        formatTime: formatTime,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
