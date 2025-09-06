import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useEntries } from '@/composables/useEntries';
import { useCategories } from '@/composables/useCategories';
import { useFirestore } from '@/composables/useFirestore';
const router = useRouter();
const { fetchLatestEntries, fetchEntries, entries } = useEntries();
const { categories, fetchCategories } = useCategories();
const latestEntries = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const totalEntries = ref(0);
const entriesPerPage = 4;
// Buscador
const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const showSearchResults = ref(false);
const loadEntries = async (page = 1) => {
    loading.value = true;
    try {
        // Calcular el offset para la paginación
        const offset = (page - 1) * entriesPerPage;
        // Obtener todas las entradas y luego paginar
        const allEntries = await fetchLatestEntries(100); // Obtener muchas entradas
        totalEntries.value = allEntries.length;
        // Paginar las entradas
        const startIndex = offset;
        const endIndex = startIndex + entriesPerPage;
        latestEntries.value = allEntries.slice(startIndex, endIndex);
        currentPage.value = page;
    }
    catch (error) {
        console.error('Error al cargar entradas:', error);
        latestEntries.value = [];
    }
    finally {
        loading.value = false;
    }
};
const totalPages = computed(() => {
    return Math.ceil(totalEntries.value / entriesPerPage);
});
const visiblePages = computed(() => {
    const pages = [];
    const start = Math.max(1, currentPage.value - 2);
    const end = Math.min(totalPages.value, currentPage.value + 2);
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        loadEntries(page);
    }
};
// Funciones de búsqueda
const performSearch = async () => {
    if (!searchQuery.value.trim()) {
        showSearchResults.value = false;
        return;
    }
    isSearching.value = true;
    try {
        // Obtener todas las entradas directamente de Firestore
        const { getCollection } = useFirestore();
        const allEntries = await getCollection('entries');
        const query = searchQuery.value.toLowerCase().trim();
        searchResults.value = allEntries.filter((entry) => entry.title?.toLowerCase().includes(query) ||
            entry.excerpt?.toLowerCase().includes(query) ||
            entry.content?.toLowerCase().includes(query)).map((entry) => ({
            id: entry.id,
            title: entry.title || '',
            content: entry.content || '',
            excerpt: entry.excerpt || '',
            mainImage: entry.mainImage,
            categoryId: entry.categoryId || '',
            categoryName: entry.categoryName,
            authorId: entry.authorId || '',
            authorEmail: entry.authorEmail,
            authorName: entry.authorName,
            published: entry.published || false,
            featured: entry.featured || false,
            tags: entry.tags || [],
            estimatedReadingTime: entry.estimatedReadingTime || '5 min',
            createdAt: entry.createdAt?.toDate() || new Date(),
            updatedAt: entry.updatedAt?.toDate() || new Date(),
            publishedAt: entry.publishedAt?.toDate() || undefined
        }));
        showSearchResults.value = true;
        console.log('Búsqueda realizada:', { query, results: searchResults.value.length });
    }
    catch (error) {
        console.error('Error en la búsqueda:', error);
        searchResults.value = [];
    }
    finally {
        isSearching.value = false;
    }
};
const clearSearch = () => {
    searchQuery.value = '';
    searchResults.value = [];
    showSearchResults.value = false;
};
const handleSearchKeyup = (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
};
const getCategoryName = (categoryId) => {
    const cat = categories.value.find(c => c.id === categoryId);
    return cat ? cat.name : 'Sin categoría';
};
onMounted(async () => {
    await fetchCategories();
    await loadEntries(1);
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
/** @type {__VLS_StyleScopedClasses['search-box']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['search-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['search-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['search-results-header']} */ ;
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
/** @type {__VLS_StyleScopedClasses['pagination-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-number']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-number']} */ ;
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
    ...{ class: "search-section" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "search-container" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "search-box" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    ...{ onKeyup: (__VLS_ctx.handleSearchKeyup) },
    value: (__VLS_ctx.searchQuery),
    type: "text",
    placeholder: "Buscar entradas...",
    ...{ class: "search-input" },
});
// @ts-ignore
[handleSearchKeyup, searchQuery,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.performSearch) },
    disabled: (__VLS_ctx.isSearching || !__VLS_ctx.searchQuery.trim()),
    ...{ class: "search-btn" },
});
// @ts-ignore
[searchQuery, performSearch, isSearching,];
if (__VLS_ctx.isSearching) {
    // @ts-ignore
    [isSearching,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "search-spinner" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
}
if (__VLS_ctx.searchQuery) {
    // @ts-ignore
    [searchQuery,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.clearSearch) },
        ...{ class: "clear-btn" },
    });
    // @ts-ignore
    [clearSearch,];
}
if (__VLS_ctx.showSearchResults) {
    // @ts-ignore
    [showSearchResults,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "search-results-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "search-results-header" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    if (__VLS_ctx.searchResults.length === 0) {
        // @ts-ignore
        [searchResults,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "no-results" },
        });
        (__VLS_ctx.searchQuery);
        // @ts-ignore
        [searchQuery,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "results-count" },
        });
        (__VLS_ctx.searchResults.length);
        (__VLS_ctx.searchResults.length !== 1 ? 's' : '');
        (__VLS_ctx.searchResults.length !== 1 ? 's' : '');
        // @ts-ignore
        [searchResults, searchResults, searchResults,];
    }
    if (__VLS_ctx.searchResults.length > 0) {
        // @ts-ignore
        [searchResults,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "entries-grid" },
        });
        for (const [entry] of __VLS_getVForSourceType((__VLS_ctx.searchResults))) {
            // @ts-ignore
            [searchResults,];
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
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "entry-actions" },
            });
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                ...{ class: "reading-time" },
            });
            (entry.estimatedReadingTime);
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                ...{ onClick: (() => __VLS_ctx.router.push(`/entry/${entry.id}`)) },
                ...{ class: "read-more-btn" },
            });
            // @ts-ignore
            [router,];
        }
    }
}
if (!__VLS_ctx.showSearchResults) {
    // @ts-ignore
    [showSearchResults,];
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
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "entry-actions" },
            });
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                ...{ class: "reading-time" },
            });
            (entry.estimatedReadingTime);
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                ...{ onClick: (() => __VLS_ctx.router.push(`/entry/${entry.id}`)) },
                ...{ class: "read-more-btn" },
            });
            // @ts-ignore
            [router,];
        }
    }
    if (__VLS_ctx.totalPages > 1) {
        // @ts-ignore
        [totalPages,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "pagination-section" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "pagination-info" },
        });
        (__VLS_ctx.currentPage);
        (__VLS_ctx.totalPages);
        (__VLS_ctx.totalEntries);
        // @ts-ignore
        [totalPages, currentPage, totalEntries,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "pagination-controls" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.showSearchResults))
                        return;
                    if (!(__VLS_ctx.totalPages > 1))
                        return;
                    __VLS_ctx.goToPage(__VLS_ctx.currentPage - 1);
                    // @ts-ignore
                    [currentPage, goToPage,];
                } },
            disabled: (__VLS_ctx.currentPage <= 1),
            ...{ class: "pagination-btn" },
        });
        // @ts-ignore
        [currentPage,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "pagination-numbers" },
        });
        for (const [page] of __VLS_getVForSourceType((__VLS_ctx.visiblePages))) {
            // @ts-ignore
            [visiblePages,];
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(!__VLS_ctx.showSearchResults))
                            return;
                        if (!(__VLS_ctx.totalPages > 1))
                            return;
                        __VLS_ctx.goToPage(page);
                        // @ts-ignore
                        [goToPage,];
                    } },
                key: (page),
                ...{ class: (['pagination-number', { active: page === __VLS_ctx.currentPage }]) },
            });
            // @ts-ignore
            [currentPage,];
            (page);
        }
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.showSearchResults))
                        return;
                    if (!(__VLS_ctx.totalPages > 1))
                        return;
                    __VLS_ctx.goToPage(__VLS_ctx.currentPage + 1);
                    // @ts-ignore
                    [currentPage, goToPage,];
                } },
            disabled: (__VLS_ctx.currentPage >= __VLS_ctx.totalPages),
            ...{ class: "pagination-btn" },
        });
        // @ts-ignore
        [totalPages, currentPage,];
    }
}
/** @type {__VLS_StyleScopedClasses['home-page']} */ ;
/** @type {__VLS_StyleScopedClasses['search-section']} */ ;
/** @type {__VLS_StyleScopedClasses['search-container']} */ ;
/** @type {__VLS_StyleScopedClasses['search-box']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['search-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['search-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['search-results-section']} */ ;
/** @type {__VLS_StyleScopedClasses['search-results-header']} */ ;
/** @type {__VLS_StyleScopedClasses['no-results']} */ ;
/** @type {__VLS_StyleScopedClasses['results-count']} */ ;
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
/** @type {__VLS_StyleScopedClasses['entry-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['reading-time']} */ ;
/** @type {__VLS_StyleScopedClasses['read-more-btn']} */ ;
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
/** @type {__VLS_StyleScopedClasses['entry-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['reading-time']} */ ;
/** @type {__VLS_StyleScopedClasses['read-more-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-section']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-info']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-numbers']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-number']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        router: router,
        latestEntries: latestEntries,
        loading: loading,
        currentPage: currentPage,
        totalEntries: totalEntries,
        searchQuery: searchQuery,
        searchResults: searchResults,
        isSearching: isSearching,
        showSearchResults: showSearchResults,
        totalPages: totalPages,
        visiblePages: visiblePages,
        goToPage: goToPage,
        performSearch: performSearch,
        clearSearch: clearSearch,
        handleSearchKeyup: handleSearchKeyup,
        getCategoryName: getCategoryName,
        formatDate: formatDate,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
