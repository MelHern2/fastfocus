import { useConfirm } from '@/composables/useConfirm';
const { isVisible, options, handleConfirm, handleCancel } = useConfirm();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['modal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-btn-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-btn-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-btn-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-btn-info']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-enter-from']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-leave-to']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-body']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "modal",
    appear: true,
}));
const __VLS_2 = __VLS_1({
    name: "modal",
    appear: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
if (__VLS_ctx.isVisible) {
    // @ts-ignore
    [isVisible,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.handleCancel) },
        ...{ class: "modal-overlay" },
    });
    // @ts-ignore
    [handleCancel,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: () => { } },
        ...{ class: "modal-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-header" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-icon" },
    });
    if (__VLS_ctx.options.type === 'warning') {
        // @ts-ignore
        [options,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    else if (__VLS_ctx.options.type === 'danger') {
        // @ts-ignore
        [options,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    else if (__VLS_ctx.options.type === 'info') {
        // @ts-ignore
        [options,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    __VLS_asFunctionalDirective(__VLS_directives.vElse, ")(null!, { ...__VLS_directiveBindingRestFields,  }, null!, null!);
    // @ts-ignore
    [vElse], ",];);
    if (__VLS_ctx.options.title) {
        // @ts-ignore
        [options,];
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
            ...{ class: "modal-title" },
        });
        (__VLS_ctx.options.title);
        // @ts-ignore
        [options,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-body" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "modal-message" },
    });
    (__VLS_ctx.options.message);
    // @ts-ignore
    [options,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-footer" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.handleCancel) },
        ...{ class: "modal-btn modal-btn-cancel" },
    });
    // @ts-ignore
    [handleCancel,];
    (__VLS_ctx.options.cancelText);
    // @ts-ignore
    [options,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.handleConfirm) },
        ...{ class: "modal-btn modal-btn-confirm" },
        ...{ class: (`modal-btn-${__VLS_ctx.options.type}`) },
    });
    // @ts-ignore
    [options, handleConfirm,];
    (__VLS_ctx.options.confirmText);
    // @ts-ignore
    [options,];
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-title']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-body']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-message']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-btn-confirm']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        isVisible: isVisible,
        options: options,
        handleConfirm: handleConfirm,
        handleCancel: handleCancel,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
