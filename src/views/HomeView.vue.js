import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEntries } from '@/composables/useEntries';
import { useCategories } from '@/composables/useCategories';
const router = useRouter();
const { fetchLatestEntries } = useEntries();
const { categories, fetchCategories } = useCategories();
const latestEntries = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const hasMore = ref(true);
const lastDoc = ref(null);
const loadEntries = async (isLoadMore = false) => {
    if (isLoadMore) {
        loadingMore.value = true;
    }
    else {
        loading.value = true;
    }
    try {
        const entries = await fetchLatestEntries(4, isLoadMore ? lastDoc.value : undefined);
        if (isLoadMore) {
            latestEntries.value.push(...entries);
        }
        else {
            latestEntries.value = entries;
        }
        // Verificar si hay más entradas
        hasMore.value = entries.length === 4;
        // Guardar el último documento para la siguiente página
        if (entries.length > 0) {
            lastDoc.value = entries[entries.length - 1].id;
        }
    }
    catch (error) {
        console.error('Error al cargar entradas:', error);
        // Mostrar mensaje de error al usuario
        latestEntries.value = [];
    }
    finally {
        loading.value = false;
        loadingMore.value = false;
    }
};
const loadMore = () => {
    if (!loadingMore.value && hasMore.value) {
        loadEntries(true);
    }
};
const getCategoryName = (categoryId) => {
    const cat = categories.value.find(c => c.id === categoryId);
    return cat ? cat.name : 'Sin categoría';
};
onMounted(async () => {
    await fetchCategories();
    await loadEntries();
});
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['entry-card']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-card']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-card']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-card']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-card']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-card']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-main-image']} */ ;
/** @type {__VLS_StyleScopedClasses['read-more-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['read-more-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['read-more-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-button']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-button']} */ ;
/** @type {__VLS_StyleScopedClasses['entries-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-title']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-image']} */ ;
/** @type {__VLS_StyleScopedClasses['entries-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-card']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-image']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-title']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['read-more-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "home-page" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "latest-entries-section" },
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
else if (__VLS_ctx.latestEntries.length === 0) {
    // @ts-ignore
    [latestEntries,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "empty-state" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "entries-grid" },
    });
    for (const [entry] of __VLS_getVForSourceType((__VLS_ctx.latestEntries))) {
        // @ts-ignore
        [latestEntries,];
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
                    if (!!(__VLS_ctx.latestEntries.length === 0))
                        return;
                    __VLS_ctx.handleReadMore(entry.id);
                    // @ts-ignore
                    [handleReadMore,];
                } },
            ...{ class: "read-more-btn" },
        });
    }
}
if (__VLS_ctx.hasMore && !__VLS_ctx.loading) {
    // @ts-ignore
    [loading, hasMore,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "load-more-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.loadMore) },
        disabled: (__VLS_ctx.loadingMore),
        ...{ class: "load-more-button" },
    });
    // @ts-ignore
    [loadMore, loadingMore,];
    if (__VLS_ctx.loadingMore) {
        // @ts-ignore
        [loadingMore,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "loading-spinner-small" },
        });
    }
    (__VLS_ctx.loadingMore ? 'Cargando...' : 'Cargar más entradas');
    // @ts-ignore
    [loadingMore,];
}
/** @type {__VLS_StyleScopedClasses['home-page']} */ ;
/** @type {__VLS_StyleScopedClasses['latest-entries-section']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
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
/** @type {__VLS_StyleScopedClasses['load-more-section']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more-button']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner-small']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        latestEntries: latestEntries,
        loading: loading,
        loadingMore: loadingMore,
        hasMore: hasMore,
        loadMore: loadMore,
        getCategoryName: getCategoryName,
        formatDate: formatDate,
        handleReadMore: handleReadMore,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
