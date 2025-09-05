import { useToast } from '@/composables/useToast';
import NotificationToast from './NotificationToast.vue';
const { notifications, removeNotification } = useToast();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['toast-container']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "toast-container" },
});
for (const [notification] of __VLS_getVForSourceType((__VLS_ctx.notifications))) {
    // @ts-ignore
    [notifications,];
    /** @type {[typeof NotificationToast, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(NotificationToast, new NotificationToast({
        ...{ 'onClose': {} },
        key: (notification.id),
        notification: (notification),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onClose': {} },
        key: (notification.id),
        notification: (notification),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    const __VLS_5 = ({ close: {} },
        { onClose: (__VLS_ctx.removeNotification) });
    // @ts-ignore
    [removeNotification,];
    var __VLS_2;
}
/** @type {__VLS_StyleScopedClasses['toast-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        NotificationToast: NotificationToast,
        notifications: notifications,
        removeNotification: removeNotification,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
