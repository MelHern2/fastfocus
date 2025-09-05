import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useEntries } from '@/composables/useEntries';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
const props = defineProps();
const emit = defineEmits();
const { loading } = useEntries();
const editorElement = ref();
let quill = null;
const formData = ref({
    title: '',
    content: '',
    excerpt: '',
    categoryId: '',
    published: false,
    featured: false,
    tags: [],
    estimatedReadingTime: ''
});
// Debug: verificar que el campo se está cargando
console.log('EntryForm - formData inicial:', formData.value);
const tagsInput = ref('');
const isEditing = computed(() => !!props.entry);
const isFormValid = computed(() => {
    return formData.value.title.trim() !== '' &&
        formData.value.excerpt.trim() !== '' &&
        formData.value.content.trim() !== '' &&
        formData.value.categoryId !== '';
});
const resetForm = () => {
    formData.value = {
        title: '',
        content: '',
        excerpt: '',
        categoryId: '',
        published: false,
        featured: false,
        tags: [],
        estimatedReadingTime: ''
    };
    tagsInput.value = '';
    if (quill) {
        quill.setContents([]);
    }
};
const updateTags = () => {
    const tags = tagsInput.value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    formData.value.tags = tags;
};
// Cargar datos de la entrada si está editando
watch(() => props.entry, (newEntry) => {
    if (newEntry) {
        formData.value = {
            title: newEntry.title,
            content: newEntry.content,
            excerpt: newEntry.excerpt,
            categoryId: newEntry.categoryId,
            published: newEntry.published,
            featured: newEntry.featured,
            tags: newEntry.tags || [],
            estimatedReadingTime: newEntry.estimatedReadingTime || ''
        };
        tagsInput.value = newEntry.tags?.join(', ') || '';
        // Actualizar el editor Quill
        nextTick(() => {
            if (quill) {
                quill.setContents(quill.clipboard.convert(newEntry.content));
            }
        });
    }
    else {
        resetForm();
    }
}, { immediate: true });
const handleSubmit = () => {
    if (!isFormValid.value)
        return;
    const data = {
        title: formData.value.title.trim(),
        content: formData.value.content.trim(),
        excerpt: formData.value.excerpt.trim(),
        categoryId: formData.value.categoryId,
        published: formData.value.published,
        featured: formData.value.featured,
        tags: formData.value.tags,
        estimatedReadingTime: formData.value.estimatedReadingTime.trim()
    };
    console.log('EntryForm - Datos a enviar:', data);
    emit('save', data);
};
onMounted(async () => {
    console.log('EntryForm - Componente montado');
    console.log('EntryForm - formData en onMounted:', formData.value);
    await nextTick();
    if (editorElement.value) {
        quill = new Quill(editorElement.value, {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    ['blockquote', 'code-block'],
                    ['link', 'image'],
                    ['clean']
                ]
            }
        });
        // Actualizar el contenido del formulario cuando cambie el editor
        quill.on('text-change', () => {
            formData.value.content = quill?.root.innerHTML || '';
        });
        // Cargar contenido inicial si está editando
        if (props.entry) {
            quill.setContents(quill.clipboard.convert(props.entry.content));
        }
    }
});
onUnmounted(() => {
    if (quill) {
        quill = null;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['form-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "entry-form-overlay" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "entry-form" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-header" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
(__VLS_ctx.isEditing ? 'Editar Entrada' : 'Nueva Entrada');
// @ts-ignore
[isEditing,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('cancel');
            // @ts-ignore
            [$emit,];
        } },
    ...{ class: "close-btn" },
});
__VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
    ...{ onSubmit: (__VLS_ctx.handleSubmit) },
    ...{ class: "form-content" },
});
// @ts-ignore
[handleSubmit,];
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
});
// @ts-ignore
[formData,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "",
});
for (const [category] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    // @ts-ignore
    [categories,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        key: (category.id),
        value: (category.id),
    });
    (category.name);
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
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "text",
    placeholder: "ESTO DEBERÍA SER VISIBLE",
    ...{ style: {} },
});
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
    for: "content",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "editor-container" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ref: "editorElement",
    ...{ class: "quill-editor" },
});
/** @type {typeof __VLS_ctx.editorElement} */ ;
// @ts-ignore
[editorElement,];
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
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('cancel');
            // @ts-ignore
            [$emit,];
        } },
    type: "button",
    ...{ class: "btn btn-secondary" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    type: "submit",
    disabled: (__VLS_ctx.loading || !__VLS_ctx.isFormValid),
    ...{ class: "btn btn-primary" },
});
// @ts-ignore
[loading, isFormValid,];
(__VLS_ctx.loading ? 'Guardando...' : (__VLS_ctx.isEditing ? 'Actualizar' : 'Crear'));
// @ts-ignore
[isEditing, loading,];
/** @type {__VLS_StyleScopedClasses['entry-form-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['entry-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-content']} */ ;
/** @type {__VLS_StyleScopedClasses['form-row']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-help']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-container']} */ ;
/** @type {__VLS_StyleScopedClasses['quill-editor']} */ ;
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
        editorElement: editorElement,
        formData: formData,
        tagsInput: tagsInput,
        isEditing: isEditing,
        isFormValid: isFormValid,
        updateTags: updateTags,
        handleSubmit: handleSubmit,
    }),
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
