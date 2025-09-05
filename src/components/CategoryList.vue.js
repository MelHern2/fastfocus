const props = defineProps();
const emit = defineEmits();
const getParentName = (parentId) => {
    const parent = props.categories.find(cat => cat.id === parentId);
    return parent ? parent.name : 'Categoría no encontrada';
};
const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['categories-header']} */ ;
/** @type {__VLS_StyleScopedClasses['category-card']} */ ;
/** @type {__VLS_StyleScopedClasses['categories-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['category-content']} */ ;
/** @type {__VLS_StyleScopedClasses['category-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['category-card']} */ ;
/** @type {__VLS_StyleScopedClasses['category-name']} */ ;
/** @type {__VLS_StyleScopedClasses['category-description']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "category-list" },
});
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-state" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "spinner" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
}
else if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "error-state" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
}
else if (__VLS_ctx.categories.length === 0) {
    // @ts-ignore
    [categories,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "empty-state" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "categories-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "categories-header" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({});
    (__VLS_ctx.categories.length);
    // @ts-ignore
    [categories,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "categories-grid" },
    });
    for (const [category] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
        // @ts-ignore
        [categories,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            key: (category.id),
            ...{ class: "category-card" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "category-content" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "category-info" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)({
            ...{ class: "category-name" },
        });
        (category.name);
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "category-description" },
        });
        (category.description);
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "category-meta" },
        });
        if (category.parentId) {
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                ...{ class: "parent-info" },
            });
            __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
            (__VLS_ctx.getParentName(category.parentId));
            // @ts-ignore
            [getParentName,];
        }
        else {
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                ...{ class: "root-category" },
            });
        }
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "category-dates" },
        });
        __VLS_asFunctionalElement(__VLS_elements.small, __VLS_elements.small)({
            ...{ class: "date-info" },
        });
        (__VLS_ctx.formatDate(category.createdAt));
        // @ts-ignore
        [formatDate,];
        __VLS_asFunctionalElement(__VLS_elements.small, __VLS_elements.small)({
            ...{ class: "date-info" },
        });
        (__VLS_ctx.formatDate(category.updatedAt));
        // @ts-ignore
        [formatDate,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "category-actions" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!!(__VLS_ctx.categories.length === 0))
                        return;
                    __VLS_ctx.$emit('edit', category);
                    // @ts-ignore
                    [$emit,];
                } },
            ...{ class: "action-btn edit-btn" },
            title: "Editar categoría",
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!!(__VLS_ctx.categories.length === 0))
                        return;
                    __VLS_ctx.$emit('delete', category);
                    // @ts-ignore
                    [$emit,];
                } },
            ...{ class: "action-btn delete-btn" },
            title: "Eliminar categoría",
        });
    }
}
/** @type {__VLS_StyleScopedClasses['category-list']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['categories-container']} */ ;
/** @type {__VLS_StyleScopedClasses['categories-header']} */ ;
/** @type {__VLS_StyleScopedClasses['categories-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['category-card']} */ ;
/** @type {__VLS_StyleScopedClasses['category-content']} */ ;
/** @type {__VLS_StyleScopedClasses['category-info']} */ ;
/** @type {__VLS_StyleScopedClasses['category-name']} */ ;
/** @type {__VLS_StyleScopedClasses['category-description']} */ ;
/** @type {__VLS_StyleScopedClasses['category-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['parent-info']} */ ;
/** @type {__VLS_StyleScopedClasses['root-category']} */ ;
/** @type {__VLS_StyleScopedClasses['category-dates']} */ ;
/** @type {__VLS_StyleScopedClasses['date-info']} */ ;
/** @type {__VLS_StyleScopedClasses['date-info']} */ ;
/** @type {__VLS_StyleScopedClasses['category-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        getParentName: getParentName,
        formatDate: formatDate,
    }),
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
