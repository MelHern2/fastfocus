import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEntries } from '@/composables/useEntries';
import CommentsSection from '@/components/CommentsSection.vue';
const route = useRoute();
const router = useRouter();
const { getDocument, loading } = useEntries();
const entry = ref(null);
const entryId = computed(() => route.params.id);
const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};
const loadEntry = async () => {
    console.log('=== INICIO loadEntry ===');
    console.log('entryId.value:', entryId.value);
    if (!entryId.value) {
        console.log('No hay entryId, redirigiendo a home');
        router.push('/');
        return;
    }
    try {
        console.log('Buscando entrada con ID:', entryId.value);
        const entryData = await getDocument('entries', entryId.value);
        console.log('Datos de entrada obtenidos:', entryData);
        if (entryData) {
            entry.value = {
                ...entryData,
                createdAt: entryData.createdAt?.toDate() || new Date(),
                updatedAt: entryData.updatedAt?.toDate() || new Date(),
                publishedAt: entryData.publishedAt?.toDate() || undefined
            };
            console.log('Entrada cargada exitosamente:', entry.value);
        }
        else {
            console.log('No se encontró la entrada');
        }
    }
    catch (error) {
        console.error('Error al cargar la entrada:', error);
    }
};
// Función para hacer scroll a un elemento específico
const scrollToElement = (elementId) => {
    nextTick(() => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            // Resaltar el elemento brevemente
            element.style.backgroundColor = '#fef3c7';
            setTimeout(() => {
                element.style.backgroundColor = '';
            }, 2000);
        }
    });
};
// Función para manejar el hash de la URL
const handleHashNavigation = () => {
    const hash = route.hash;
    if (hash && hash.startsWith('#comment-')) {
        const commentId = hash.replace('#comment-', '');
        // Esperar un poco para que los comentarios se carguen
        setTimeout(() => {
            scrollToElement(`comment-${commentId}`);
        }, 1000);
    }
};
onMounted(async () => {
    console.log('=== EntryDetailView onMounted ===');
    console.log('route.params:', route.params);
    console.log('entryId computed:', entryId.value);
    await loadEntry();
    handleHashNavigation();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['not-found']} */ ;
/** @type {__VLS_StyleScopedClasses['not-found']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-link']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-excerpt']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-title']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-main-image-container']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-title']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-title']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-title']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-meta']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "entry-detail-view" },
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
else if (!__VLS_ctx.entry) {
    // @ts-ignore
    [entry,];
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
        ...{ class: "entry-content" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "entry-header" },
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
    (__VLS_ctx.entry.title);
    // @ts-ignore
    [entry,];
    __VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
        ...{ class: "entry-title" },
    });
    (__VLS_ctx.entry.title);
    // @ts-ignore
    [entry,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "entry-meta" },
    });
    __VLS_asFunctionalElement(__VLS_elements.time, __VLS_elements.time)({
        ...{ class: "entry-date" },
    });
    (__VLS_ctx.formatDate(__VLS_ctx.entry.createdAt));
    // @ts-ignore
    [entry, formatDate,];
    if (__VLS_ctx.entry.featured) {
        // @ts-ignore
        [entry,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "featured-badge" },
        });
    }
    if (__VLS_ctx.entry.mainImage) {
        // @ts-ignore
        [entry,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "entry-main-image-container" },
        });
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: (__VLS_ctx.entry.mainImage),
            alt: (__VLS_ctx.entry.title),
            ...{ class: "entry-main-image" },
        });
        // @ts-ignore
        [entry, entry,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "entry-excerpt" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (__VLS_ctx.entry.excerpt);
    // @ts-ignore
    [entry,];
    if (__VLS_ctx.entry.tags && __VLS_ctx.entry.tags.length > 0) {
        // @ts-ignore
        [entry, entry,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "entry-tags" },
        });
        for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.entry.tags))) {
            // @ts-ignore
            [entry,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                key: (tag),
                ...{ class: "tag" },
            });
            (tag);
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "entry-body" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "entry-content-html" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.entry.content) }, null, null);
    // @ts-ignore
    [entry, vHtml,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "entry-footer" },
    });
    const __VLS_10 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        to: "/",
        ...{ class: "btn btn-secondary" },
    }));
    const __VLS_12 = __VLS_11({
        to: "/",
        ...{ class: "btn btn-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    const { default: __VLS_14 } = __VLS_13.slots;
    var __VLS_13;
}
/** @type {[typeof CommentsSection, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(CommentsSection, new CommentsSection({
    entryId: (__VLS_ctx.entryId),
}));
const __VLS_16 = __VLS_15({
    entryId: (__VLS_ctx.entryId),
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
// @ts-ignore
[entryId,];
/** @type {__VLS_StyleScopedClasses['entry-detail-view']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['not-found']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-header']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-link']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-separator']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-current']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-title']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-date']} */ ;
/** @type {__VLS_StyleScopedClasses['featured-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-main-image-container']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-main-image']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-excerpt']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['tag']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-body']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content-html']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        CommentsSection: CommentsSection,
        loading: loading,
        entry: entry,
        entryId: entryId,
        formatDate: formatDate,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
