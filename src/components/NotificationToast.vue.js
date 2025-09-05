import { ref, onMounted, onUnmounted, computed } from 'vue';
const props = defineProps();
const emit = defineEmits();
const isClosing = ref(false);
const progressWidth = ref(100);
let progressInterval = null;
let closeTimeout = null;
const duration = computed(() => props.notification?.duration || 5000);
const closeNotification = () => {
    if (!props.notification)
        return;
    isClosing.value = true;
    // Limpiar timeouts
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
    if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
    }
    // Emitir evento después de la animación
    setTimeout(() => {
        emit('close', props.notification.id);
        isClosing.value = false;
    }, 300);
};
const startProgress = () => {
    if (!props.notification)
        return;
    const startTime = Date.now();
    const totalDuration = duration.value;
    progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, totalDuration - elapsed);
        progressWidth.value = (remaining / totalDuration) * 100;
        if (remaining <= 0) {
            closeNotification();
        }
    }, 50);
};
onMounted(() => {
    if (props.notification) {
        progressWidth.value = 100;
        startProgress();
    }
});
onUnmounted(() => {
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    if (closeTimeout) {
        clearTimeout(closeTimeout);
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['notification-toast']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-toast']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-close']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-toast']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "notification",
    appear: true,
}));
const __VLS_2 = __VLS_1({
    name: "notification",
    appear: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
if (__VLS_ctx.notification) {
    // @ts-ignore
    [notification,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.closeNotification) },
        ...{ class: ([
                'notification-toast',
                `notification-${__VLS_ctx.notification.type}`,
                { 'notification-closing': __VLS_ctx.isClosing }
            ]) },
    });
    // @ts-ignore
    [notification, closeNotification, isClosing,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "notification-icon" },
    });
    if (__VLS_ctx.notification.type === 'success') {
        // @ts-ignore
        [notification,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    else if (__VLS_ctx.notification.type === 'error') {
        // @ts-ignore
        [notification,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    else if (__VLS_ctx.notification.type === 'warning') {
        // @ts-ignore
        [notification,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    else if (__VLS_ctx.notification.type === 'info') {
        // @ts-ignore
        [notification,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "notification-content" },
    });
    if (__VLS_ctx.notification.title) {
        // @ts-ignore
        [notification,];
        __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({
            ...{ class: "notification-title" },
        });
        (__VLS_ctx.notification.title);
        // @ts-ignore
        [notification,];
    }
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "notification-message" },
    });
    (__VLS_ctx.notification.message);
    // @ts-ignore
    [notification,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.closeNotification) },
        ...{ class: "notification-close" },
        'aria-label': "Cerrar notificación",
    });
    // @ts-ignore
    [closeNotification,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "notification-progress" },
        ...{ style: ({ width: __VLS_ctx.progressWidth + '%' }) },
    });
    // @ts-ignore
    [progressWidth,];
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['notification-toast']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-closing']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-content']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-title']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-message']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-close']} */ ;
/** @type {__VLS_StyleScopedClasses['notification-progress']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        isClosing: isClosing,
        progressWidth: progressWidth,
        closeNotification: closeNotification,
    }),
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
