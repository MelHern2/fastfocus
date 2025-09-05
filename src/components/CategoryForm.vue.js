import { ref, computed, watch, onMounted } from 'vue';
import { useCategories } from '@/composables/useCategories';
const props = defineProps();
const emit = defineEmits();
const { loading, getAllCategoriesFlat, fetchCategories, categories } = useCategories();
const formData = ref({
    name: '',
    description: '',
    parentId: ''
});
const isEditing = computed(() => !!props.category);
// Categorías disponibles como padre (excluyendo la categoría actual si está editando)
const availableParents = computed(() => {
    const categoriesList = getAllCategoriesFlat();
    console.log('Available categories for parent selection:', categoriesList);
    if (isEditing.value && props.category) {
        // Filtrar la categoría actual y sus descendientes para evitar referencias circulares
        const filtered = categoriesList.filter(cat => {
            return cat.id !== props.category.id &&
                !isDescendantOf(cat.id, props.category.id, categoriesList);
        });
        return filtered.map(cat => ({
            ...cat,
            disabled: false
        }));
    }
    return categoriesList.map(cat => ({
        ...cat,
        disabled: false
    }));
});
// Función para verificar si una categoría es descendiente de otra
const isDescendantOf = (categoryId, ancestorId, categories) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category || !category.parentId)
        return false;
    if (category.parentId === ancestorId)
        return true;
    return isDescendantOf(category.parentId, ancestorId, categories);
};
const isFormValid = computed(() => {
    return formData.value.name.trim() !== '' && formData.value.description.trim() !== '';
});
const resetForm = () => {
    formData.value = {
        name: '',
        description: '',
        parentId: ''
    };
};
// Cargar datos de la categoría si está editando
watch(() => props.category, (newCategory) => {
    if (newCategory) {
        formData.value = {
            name: newCategory.name,
            description: newCategory.description,
            parentId: newCategory.parentId || ''
        };
    }
    else {
        resetForm();
    }
}, { immediate: true });
const handleSubmit = () => {
    if (!isFormValid.value)
        return;
    const data = {
        name: formData.value.name.trim(),
        description: formData.value.description.trim(),
        parentId: formData.value.parentId || undefined
    };
    emit('save', data);
};
onMounted(async () => {
    // Cargar categorías para el selector de padre
    try {
        await fetchCategories();
    }
    catch (error) {
        console.error('Error al cargar categorías:', error);
    }
    if (props.category) {
        formData.value = {
            name: props.category.name,
            description: props.category.description,
            parentId: props.category.parentId || ''
        };
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
/** @type {__VLS_StyleScopedClasses['category-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "category-form-overlay" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "category-form" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-header" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
(__VLS_ctx.isEditing ? 'Editar Categoría' : 'Nueva Categoría');
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
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "name",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    id: "name",
    value: (__VLS_ctx.formData.name),
    type: "text",
    required: true,
    placeholder: "Ingresa el nombre de la categoría",
    ...{ class: "form-input" },
});
// @ts-ignore
[formData,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "description",
});
__VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
    id: "description",
    value: (__VLS_ctx.formData.description),
    required: true,
    placeholder: "Ingresa la descripción de la categoría",
    rows: "3",
    ...{ class: "form-textarea" },
});
// @ts-ignore
[formData,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "parentId",
});
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    id: "parentId",
    value: (__VLS_ctx.formData.parentId),
    ...{ class: "form-select" },
});
// @ts-ignore
[formData,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "",
});
for (const [cat] of __VLS_getVForSourceType((__VLS_ctx.availableParents))) {
    // @ts-ignore
    [availableParents,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        key: (cat.id),
        value: (cat.id),
        disabled: (cat.disabled),
    });
    (cat.displayName);
}
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
/** @type {__VLS_StyleScopedClasses['category-form-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['category-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-content']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        loading: loading,
        formData: formData,
        isEditing: isEditing,
        availableParents: availableParents,
        isFormValid: isFormValid,
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
