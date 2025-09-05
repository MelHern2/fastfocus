import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategories } from '@/composables/useCategories';
import { useEntries } from '@/composables/useEntries';
const route = useRoute();
const router = useRouter();
const { categories, fetchCategories } = useCategories();
const { fetchEntriesByCategory } = useEntries();
const loading = ref(true);
const entriesLoading = ref(true);
const entries = ref([]);
const categoryId = computed(() => route.params.id);
const category = computed(() => {
    return categories.value.find(cat => cat.id === categoryId.value);
});
const loadCategoryData = async () => {
    try {
        loading.value = true;
        await fetchCategories();
    }
    catch (error) {
        console.error('Error al cargar categorías:', error);
    }
    finally {
        loading.value = false;
    }
};
const loadEntries = async () => {
    if (!categoryId.value)
        return;
    try {
        entriesLoading.value = true;
        console.log('Cargando entradas para categoría:', categoryId.value);
        const categoryEntries = await fetchEntriesByCategory(categoryId.value);
        console.log('Entradas encontradas:', categoryEntries.length);
        entries.value = categoryEntries;
    }
    catch (error) {
        console.error('Error al cargar entradas:', error);
        entries.value = [];
    }
    finally {
        entriesLoading.value = false;
    }
};
const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
};
const handleReadMore = (entryId) => {
    router.push(`/entry/${entryId}`);
};
const getCategoryName = (categoryId) => {
    const cat = categories.value.find(c => c.id === categoryId);
    return cat ? cat.name : 'Sin categoría';
};
onMounted(async () => {
    await loadCategoryData();
    await loadEntries();
});
// Escuchar cambios en la ruta
watch(() => route.params.id, async (newId) => {
    if (newId) {
        await loadEntries();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['not-found']} */ ;
/** @type {__VLS_StyleScopedClasses['not-found']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-link']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-card']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-card']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-main-image']} */ ;
/** @type {__VLS_StyleScopedClasses['read-more-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['category-view']} */ ;
/** @type {__VLS_StyleScopedClasses['category-header']} */ ;
/** @type {__VLS_StyleScopedClasses['category-title']} */ ;
/** @type {__VLS_StyleScopedClasses['entries-section']} */ ;
/** @type {__VLS_StyleScopedClasses['entries-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['read-more-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "category-view" },
});
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-state" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-spinner" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
}
else if (!__VLS_ctx.category) {
    // @ts-ignore
    [category,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "not-found" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        to: "/",
        ...{ class: "btn btn-primary" },
    }));
    const __VLS_2 = __VLS_1({
        to: "/",
        ...{ class: "btn btn-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_4 } = __VLS_3.slots;
    var __VLS_3;
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "category-content" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "category-header" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "breadcrumb" },
    });
    const __VLS_5 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        to: "/",
        ...{ class: "breadcrumb-link" },
    }));
    const __VLS_7 = __VLS_6({
        to: "/",
        ...{ class: "breadcrumb-link" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    const { default: __VLS_9 } = __VLS_8.slots;
    var __VLS_8;
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "breadcrumb-separator" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "breadcrumb-current" },
    });
    (__VLS_ctx.category.name);
    // @ts-ignore
    [category,];
    __VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
        ...{ class: "category-title" },
    });
    (__VLS_ctx.category.name);
    // @ts-ignore
    [category,];
    if (__VLS_ctx.category.description) {
        // @ts-ignore
        [category,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "category-description" },
        });
        (__VLS_ctx.category.description);
        // @ts-ignore
        [category,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "entries-section" },
    });
    if (__VLS_ctx.entriesLoading) {
        // @ts-ignore
        [entriesLoading,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "loading-state" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "loading-spinner" },
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    }
    else if (__VLS_ctx.entries.length === 0) {
        // @ts-ignore
        [entries,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "empty-state" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "empty-icon" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "entries-grid" },
        });
        for (const [entry] of __VLS_getVForSourceType((__VLS_ctx.entries))) {
            // @ts-ignore
            [entries,];
            __VLS_asFunctionalElement(__VLS_elements.article, __VLS_elements.article)({
                key: (entry.id),
                ...{ class: "entry-card" },
            });
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "entry-image" },
            });
            if (entry.mainImage) {
                __VLS_asFunctionalElement(__VLS_elements.img)({
                    src: (entry.mainImage),
                    alt: (entry.title),
                    ...{ class: "entry-main-image" },
                });
            }
            else {
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    ...{ class: "entry-image-placeholder" },
                });
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                    ...{ class: "entry-icon" },
                });
            }
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "entry-content" },
            });
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "entry-header" },
            });
            __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
                ...{ class: "entry-title" },
            });
            (entry.title);
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "entry-meta" },
            });
            __VLS_asFunctionalElement(__VLS_elements.time, __VLS_elements.time)({
                ...{ class: "entry-date" },
            });
            (__VLS_ctx.formatDate(entry.createdAt));
            // @ts-ignore
            [formatDate,];
            if (entry.featured) {
                __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                    ...{ class: "featured-badge" },
                });
            }
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "entry-category" },
            });
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                ...{ class: "category-badge" },
            });
            (__VLS_ctx.getCategoryName(entry.categoryId));
            // @ts-ignore
            [getCategoryName,];
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
                ...{ class: "entry-excerpt" },
            });
            (entry.excerpt);
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "entry-footer" },
            });
            if (entry.tags && entry.tags.length > 0) {
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    ...{ class: "entry-tags" },
                });
                for (const [tag] of __VLS_getVForSourceType((entry.tags.slice(0, 2)))) {
                    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                        key: (tag),
                        ...{ class: "tag" },
                    });
                    (tag);
                }
            }
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(!__VLS_ctx.category))
                            return;
                        if (!!(__VLS_ctx.entriesLoading))
                            return;
                        if (!!(__VLS_ctx.entries.length === 0))
                            return;
                        __VLS_ctx.handleReadMore(entry.id);
                        // @ts-ignore
                        [handleReadMore,];
                    } },
                ...{ class: "read-more-btn" },
            });
        }
    }
}
/** @type {__VLS_StyleScopedClasses['category-view']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['not-found']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['category-content']} */ ;
/** @type {__VLS_StyleScopedClasses['category-header']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-link']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-separator']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-current']} */ ;
/** @type {__VLS_StyleScopedClasses['category-title']} */ ;
/** @type {__VLS_StyleScopedClasses['category-description']} */ ;
/** @type {__VLS_StyleScopedClasses['entries-section']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['entries-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-card']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-image']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-main-image']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-image-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-header']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-title']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-date']} */ ;
/** @type {__VLS_StyleScopedClasses['featured-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-category']} */ ;
/** @type {__VLS_StyleScopedClasses['category-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-excerpt']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['tag']} */ ;
/** @type {__VLS_StyleScopedClasses['read-more-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        loading: loading,
        entriesLoading: entriesLoading,
        entries: entries,
        category: category,
        formatDate: formatDate,
        handleReadMore: handleReadMore,
        getCategoryName: getCategoryName,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
