import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEntries } from '@/composables/useEntries';
import { useCategories } from '@/composables/useCategories';
import { useToast } from '@/composables/useToast';
// Editor WYSIWYG simple sin dependencias
const route = useRoute();
const router = useRouter();
const { error: showError } = useToast();
const { loading, error, fetchEntriesWithCategories, createEntry, updateEntry } = useEntries();
const { categories, fetchCategories, buildCategoryTree } = useCategories();
const editorInitialized = ref(false);
const formData = ref({
    title: '',
    content: '',
    excerpt: '',
    mainImage: '',
    categoryId: '',
    published: false,
    featured: false,
    tags: [],
    estimatedReadingTime: ''
});
const tagsInput = ref('');
const isEditing = computed(() => route.name === 'entry-edit');
const entryId = computed(() => route.params.id);
const isFormValid = computed(() => {
    return formData.value.title.trim() !== '' &&
        formData.value.excerpt.trim() !== '' &&
        formData.value.content.trim() !== '' &&
        formData.value.categoryId !== '';
});
// Inicializar Summernote
const initSummernote = () => {
    if (typeof window !== 'undefined' && window.$ && window.$.fn.summernote) {
        const $ = window.$;
        $('#summernote-editor').summernote({
            height: 400,
            placeholder: 'Escribe el contenido de tu entrada...',
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['insert', ['link']],
                ['misc', ['undo', 'redo']]
            ],
            callbacks: {
                onChange: (contents) => {
                    formData.value.content = contents;
                },
                onInit: () => {
                    console.log('Summernote inicializado correctamente');
                    editorInitialized.value = true;
                    // Cargar contenido si estamos editando
                    if (isEditing.value && formData.value.content) {
                        console.log('Intentando cargar contenido en onInit:', formData.value.content);
                        setTimeout(() => {
                            $('#summernote-editor').summernote('code', formData.value.content);
                            console.log('Contenido cargado en Summernote desde onInit');
                        }, 300);
                    }
                }
            }
        });
    }
};
// Crear jerarquía de categorías para el select
const categoriesWithHierarchy = computed(() => {
    console.log('Computing categoriesWithHierarchy, categories:', categories.value.length);
    const tree = buildCategoryTree();
    const result = [];
    const addCategories = (categories, level = 0) => {
        categories.forEach(category => {
            const prefix = '— '.repeat(level);
            result.push({
                id: category.id,
                displayName: `${prefix}${category.name}`,
                disabled: false
            });
            if (category.children && category.children.length > 0) {
                addCategories(category.children, level + 1);
            }
        });
    };
    addCategories(tree);
    console.log('CategoriesWithHierarchy result:', result.length);
    return result;
});
const resetForm = () => {
    formData.value = {
        title: '',
        content: '',
        excerpt: '',
        mainImage: '',
        categoryId: '',
        published: false,
        featured: false,
        tags: [],
        estimatedReadingTime: ''
    };
    tagsInput.value = '';
};
const updateTags = () => {
    const tags = tagsInput.value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    formData.value.tags = tags;
};
// Manejar subida de imagen
const handleImageUpload = (event) => {
    const target = event.target;
    const file = target.files?.[0];
    if (file) {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            showError('Por favor selecciona un archivo de imagen válido');
            return;
        }
        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showError('La imagen debe ser menor a 5MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            formData.value.mainImage = result;
        };
        reader.readAsDataURL(file);
    }
};
// Eliminar imagen
const removeImage = () => {
    formData.value.mainImage = '';
    // Limpiar el input file
    const fileInput = document.getElementById('mainImage');
    if (fileInput) {
        fileInput.value = '';
    }
};
// Sin watch complejo
// Cargar datos de la entrada si está editando
const loadEntry = async () => {
    if (isEditing.value && entryId.value) {
        try {
            await fetchEntriesWithCategories();
            const entries = await fetchEntriesWithCategories();
            const entry = entries.find(e => e.id === entryId.value);
            if (entry) {
                formData.value = {
                    title: entry.title,
                    content: entry.content,
                    excerpt: entry.excerpt,
                    mainImage: entry.mainImage || '',
                    categoryId: entry.categoryId,
                    published: entry.published,
                    featured: entry.featured,
                    tags: entry.tags || [],
                    estimatedReadingTime: entry.estimatedReadingTime || ''
                };
                tagsInput.value = entry.tags?.join(', ') || '';
                console.log('Contenido cargado:', entry.content);
                // El contenido se cargará en onInit cuando Summernote esté listo
                console.log('Contenido cargado en formData:', entry.content);
            }
            else {
                console.error('Entrada no encontrada');
                router.push('/admin');
            }
        }
        catch (err) {
            console.error('Error al cargar entrada:', err);
            router.push('/admin');
        }
    }
};
const handleSubmit = async () => {
    if (!isFormValid.value)
        return;
    try {
        const data = {
            title: formData.value.title.trim(),
            content: formData.value.content.trim(),
            excerpt: formData.value.excerpt.trim(),
            mainImage: formData.value.mainImage.trim(),
            categoryId: formData.value.categoryId,
            published: formData.value.published,
            featured: formData.value.featured,
            tags: formData.value.tags,
            estimatedReadingTime: formData.value.estimatedReadingTime.trim() || 'Tiempo de lectura no estimado'
        };
        if (isEditing.value) {
            await updateEntry(entryId.value, data);
        }
        else {
            await createEntry(data);
        }
        router.push('/admin');
    }
    catch (err) {
        console.error('Error al guardar entrada:', err);
    }
};
onMounted(async () => {
    console.log('EntryView onMounted iniciado');
    // Cargar categorías PRIMERO
    await fetchCategories();
    console.log('Categorías cargadas:', categories.value.length);
    // Cargar entrada si estamos editando
    if (isEditing.value) {
        await loadEntry();
    }
    // Cargar CDN de Summernote
    await loadSummernoteCDN();
    // Esperar a que se cargue y inicializar
    setTimeout(() => {
        initSummernote();
    }, 2000);
});
const loadSummernoteCDN = () => {
    return new Promise((resolve) => {
        // jQuery
        if (!document.querySelector('script[src*="jquery"]')) {
            const jqueryScript = document.createElement('script');
            jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
            jqueryScript.onload = () => {
                // Bootstrap CSS
                const bootstrapCSS = document.createElement('link');
                bootstrapCSS.rel = 'stylesheet';
                bootstrapCSS.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
                document.head.appendChild(bootstrapCSS);
                // Bootstrap JS
                const bootstrapJS = document.createElement('script');
                bootstrapJS.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js';
                bootstrapJS.onload = () => {
                    // Summernote CSS
                    const summernoteCSS = document.createElement('link');
                    summernoteCSS.rel = 'stylesheet';
                    summernoteCSS.href = 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css';
                    document.head.appendChild(summernoteCSS);
                    // Summernote JS
                    const summernoteJS = document.createElement('script');
                    summernoteJS.src = 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js';
                    summernoteJS.onload = () => resolve(true);
                    document.head.appendChild(summernoteJS);
                };
                document.head.appendChild(bootstrapJS);
            };
            document.head.appendChild(jqueryScript);
        }
        else {
            resolve(true);
        }
    });
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['breadcrumb-link']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-header']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-image-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-container']} */ ;
/** @type {__VLS_StyleScopedClasses['fallback-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "entry-view" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "entry-header" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "header-content" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "breadcrumb" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/admin",
    ...{ class: "breadcrumb-link" },
}));
const __VLS_2 = __VLS_1({
    to: "/admin",
    ...{ class: "breadcrumb-link" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "breadcrumb-separator" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "breadcrumb-current" },
});
(__VLS_ctx.isEditing ? 'Editar Entrada' : 'Nueva Entrada');
// @ts-ignore
[isEditing,];
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
(__VLS_ctx.isEditing ? 'Editar Entrada' : 'Nueva Entrada');
// @ts-ignore
[isEditing,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "entry-content" },
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
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "entry-form-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
        ...{ onSubmit: (__VLS_ctx.handleSubmit) },
        ...{ class: "entry-form" },
    });
    // @ts-ignore
    [handleSubmit,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-row" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "title",
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        id: "title",
        value: (__VLS_ctx.formData.title),
        type: "text",
        required: true,
        placeholder: "Ingresa el título de la entrada",
        ...{ class: "form-input" },
    });
    // @ts-ignore
    [formData,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "categoryId",
    });
    __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
        id: "categoryId",
        value: (__VLS_ctx.formData.categoryId),
        required: true,
        ...{ class: "form-select" },
        disabled: (__VLS_ctx.categories.length === 0),
    });
    // @ts-ignore
    [formData, categories,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "",
    });
    (__VLS_ctx.categories.length === 0 ? 'Cargando categorías...' : 'Selecciona una categoría');
    // @ts-ignore
    [categories,];
    for (const [category] of __VLS_getVForSourceType((__VLS_ctx.categoriesWithHierarchy))) {
        // @ts-ignore
        [categoriesWithHierarchy,];
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
            key: (category.id),
            value: (category.id),
            disabled: (category.disabled),
        });
        (category.displayName);
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "excerpt",
    });
    __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
        id: "excerpt",
        value: (__VLS_ctx.formData.excerpt),
        required: true,
        placeholder: "Escribe un breve resumen de la entrada",
        rows: "3",
        ...{ class: "form-textarea" },
    });
    // @ts-ignore
    [formData,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "estimatedReadingTime",
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        id: "estimatedReadingTime",
        value: (__VLS_ctx.formData.estimatedReadingTime),
        type: "text",
        placeholder: "Ej: 5 minutos, 10-15 min, etc. (opcional)",
        ...{ class: "form-input" },
        ...{ style: {} },
    });
    // @ts-ignore
    [formData,];
    __VLS_asFunctionalElement(__VLS_elements.small, __VLS_elements.small)({
        ...{ class: "form-help" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "mainImage",
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        ...{ onChange: (__VLS_ctx.handleImageUpload) },
        id: "mainImage",
        type: "file",
        accept: "image/*",
        ...{ class: "form-input" },
    });
    // @ts-ignore
    [handleImageUpload,];
    if (__VLS_ctx.formData.mainImage) {
        // @ts-ignore
        [formData,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "image-preview" },
        });
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: (__VLS_ctx.formData.mainImage),
            alt: "Vista previa",
            ...{ class: "preview-image" },
        });
        // @ts-ignore
        [formData,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.removeImage) },
            type: "button",
            ...{ class: "remove-image-btn" },
        });
        // @ts-ignore
        [removeImage,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "content",
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "editor-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        id: "summernote-editor",
        ...{ class: "summernote-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-row" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "tags",
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        ...{ onBlur: (__VLS_ctx.updateTags) },
        id: "tags",
        value: (__VLS_ctx.tagsInput),
        type: "text",
        placeholder: "Etiquetas separadas por comas",
        ...{ class: "form-input" },
    });
    // @ts-ignore
    [updateTags, tagsInput,];
    if (__VLS_ctx.formData.tags.length > 0) {
        // @ts-ignore
        [formData,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "tags-preview" },
        });
        for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.formData.tags))) {
            // @ts-ignore
            [formData,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                key: (tag),
                ...{ class: "tag" },
            });
            (tag);
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group checkbox-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        ...{ class: "checkbox-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "checkbox",
        ...{ class: "checkbox" },
    });
    (__VLS_ctx.formData.published);
    // @ts-ignore
    [formData,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "checkbox-text" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        ...{ class: "checkbox-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "checkbox",
        ...{ class: "checkbox" },
    });
    (__VLS_ctx.formData.featured);
    // @ts-ignore
    [formData,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "checkbox-text" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-actions" },
    });
    const __VLS_5 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        to: "/admin",
        ...{ class: "btn btn-secondary" },
    }));
    const __VLS_7 = __VLS_6({
        to: "/admin",
        ...{ class: "btn btn-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    const { default: __VLS_9 } = __VLS_8.slots;
    var __VLS_8;
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        type: "submit",
        disabled: (__VLS_ctx.loading || !__VLS_ctx.isFormValid),
        ...{ class: "btn btn-primary" },
    });
    // @ts-ignore
    [loading, isFormValid,];
    (__VLS_ctx.loading ? 'Guardando...' : (__VLS_ctx.isEditing ? 'Actualizar Entrada' : 'Crear Entrada'));
    // @ts-ignore
    [isEditing, loading,];
}
/** @type {__VLS_StyleScopedClasses['entry-view']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-link']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-separator']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-current']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-content']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-help']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['image-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-image']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-image-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-container']} */ ;
/** @type {__VLS_StyleScopedClasses['summernote-container']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['tags-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['tag']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-group']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-label']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-text']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-label']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-text']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        loading: loading,
        categories: categories,
        formData: formData,
        tagsInput: tagsInput,
        isEditing: isEditing,
        isFormValid: isFormValid,
        categoriesWithHierarchy: categoriesWithHierarchy,
        updateTags: updateTags,
        handleImageUpload: handleImageUpload,
        removeImage: removeImage,
        handleSubmit: handleSubmit,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
