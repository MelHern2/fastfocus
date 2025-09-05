import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useAdmin } from '@/composables/useAdmin';
import { useCategories } from '@/composables/useCategories';
import { useEntries } from '@/composables/useEntries';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';
import CategoryForm from '@/components/CategoryForm.vue';
import CategoryList from '@/components/CategoryList.vue';
import EntryList from '@/components/EntryList.vue';
const router = useRouter();
const { user, logout } = useAuth();
const { canAccessAdmin, loading: adminLoading } = useAdmin();
const { success, error: showError } = useToast();
const { confirm } = useConfirm();
// Verificación simplificada de administrador
const isAdmin = computed(() => {
    return user.value && user.value.email === 'melenasdoblaktocas3@gmail.com';
});
const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories();
const { entriesWithCategories, loading: entriesLoading, error: entriesError, fetchEntriesWithCategories, createEntry, updateEntry, deleteEntry } = useEntries();
const activeTab = ref('categories');
const showCategoryForm = ref(false);
const editingCategory = ref(null);
// Verificar acceso de administrador
watch([canAccessAdmin, adminLoading, user], ([hasAccess, isLoading, currentUser]) => {
    console.log('AdminView: canAccessAdmin cambió a:', hasAccess, 'adminLoading:', isLoading, 'user:', currentUser?.email);
    // Si no está cargando, hay un usuario autenticado pero no tiene acceso de admin
    if (!isLoading && currentUser && hasAccess === false) {
        console.log('AdminView: Usuario no tiene acceso de admin');
        // Comentado temporalmente para debugging
        // setTimeout(() => {
        //   router.push('/')
        // }, 2000)
    }
}, { immediate: true });
onMounted(async () => {
    await fetchCategories();
    await fetchEntriesWithCategories();
});
const handleCategorySave = async (data) => {
    try {
        if (editingCategory.value) {
            // Actualizar categoría existente
            await updateCategory(editingCategory.value.id, data);
        }
        else {
            // Crear nueva categoría
            await createCategory(data);
        }
        showCategoryForm.value = false;
        editingCategory.value = null;
    }
    catch (err) {
        console.error('Error al guardar categoría:', err);
    }
};
const handleCategoryCancel = () => {
    showCategoryForm.value = false;
    editingCategory.value = null;
};
const handleEditCategory = (category) => {
    editingCategory.value = category;
    showCategoryForm.value = true;
};
const handleDeleteCategory = async (category) => {
    const confirmed = await confirm({
        title: 'Eliminar categoría',
        message: `¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
    });
    if (confirmed) {
        try {
            await deleteCategory(category.id);
        }
        catch (err) {
            console.error('Error al eliminar categoría:', err);
        }
    }
};
// Función para eliminar entradas
const handleDeleteEntry = async (entry) => {
    const confirmed = await confirm({
        title: 'Eliminar entrada',
        message: `¿Estás seguro de que quieres eliminar la entrada "${entry.title}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
    });
    if (confirmed) {
        try {
            await deleteEntry(entry.id);
        }
        catch (err) {
            console.error('Error al eliminar entrada:', err);
        }
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['admin-header']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-info']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['add-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-header']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-info']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['access-denied-content']} */ ;
/** @type {__VLS_StyleScopedClasses['access-denied-content']} */ ;
/** @type {__VLS_StyleScopedClasses['access-denied-content']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "admin-view" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "admin-header" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "admin-info" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
(__VLS_ctx.user?.email);
// @ts-ignore
[user,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.logout) },
    ...{ class: "logout-btn" },
});
// @ts-ignore
[logout,];
if (__VLS_ctx.user && !__VLS_ctx.isAdmin) {
    // @ts-ignore
    [user, isAdmin,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "access-denied" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "access-denied-content" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
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
if (!__VLS_ctx.user || __VLS_ctx.isAdmin) {
    // @ts-ignore
    [user, isAdmin,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "admin-content" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "admin-tabs" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(!__VLS_ctx.user || __VLS_ctx.isAdmin))
                    return;
                __VLS_ctx.activeTab = 'categories';
                // @ts-ignore
                [activeTab,];
            } },
        ...{ class: ({ active: __VLS_ctx.activeTab === 'categories' }) },
        ...{ class: "tab-btn" },
    });
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(!__VLS_ctx.user || __VLS_ctx.isAdmin))
                    return;
                __VLS_ctx.activeTab = 'entries';
                // @ts-ignore
                [activeTab,];
            } },
        ...{ class: ({ active: __VLS_ctx.activeTab === 'entries' }) },
        ...{ class: "tab-btn" },
    });
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "tab-content" },
    });
    if (__VLS_ctx.activeTab === 'categories') {
        // @ts-ignore
        [activeTab,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "categories-section" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "section-header" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.user || __VLS_ctx.isAdmin))
                        return;
                    if (!(__VLS_ctx.activeTab === 'categories'))
                        return;
                    __VLS_ctx.showCategoryForm = true;
                    // @ts-ignore
                    [showCategoryForm,];
                } },
            ...{ class: "add-btn" },
        });
        if (__VLS_ctx.showCategoryForm) {
            // @ts-ignore
            [showCategoryForm,];
            /** @type {[typeof CategoryForm, ]} */ ;
            // @ts-ignore
            const __VLS_5 = __VLS_asFunctionalComponent(CategoryForm, new CategoryForm({
                ...{ 'onSave': {} },
                ...{ 'onCancel': {} },
                category: (__VLS_ctx.editingCategory),
                categories: (__VLS_ctx.categories),
            }));
            const __VLS_6 = __VLS_5({
                ...{ 'onSave': {} },
                ...{ 'onCancel': {} },
                category: (__VLS_ctx.editingCategory),
                categories: (__VLS_ctx.categories),
            }, ...__VLS_functionalComponentArgsRest(__VLS_5));
            let __VLS_8;
            let __VLS_9;
            const __VLS_10 = ({ save: {} },
                { onSave: (__VLS_ctx.handleCategorySave) });
            const __VLS_11 = ({ cancel: {} },
                { onCancel: (__VLS_ctx.handleCategoryCancel) });
            // @ts-ignore
            [editingCategory, categories, handleCategorySave, handleCategoryCancel,];
            var __VLS_7;
        }
        /** @type {[typeof CategoryList, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(CategoryList, new CategoryList({
            ...{ 'onEdit': {} },
            ...{ 'onDelete': {} },
            categories: (__VLS_ctx.categories),
            loading: (__VLS_ctx.loading),
            error: (__VLS_ctx.error),
        }));
        const __VLS_14 = __VLS_13({
            ...{ 'onEdit': {} },
            ...{ 'onDelete': {} },
            categories: (__VLS_ctx.categories),
            loading: (__VLS_ctx.loading),
            error: (__VLS_ctx.error),
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        let __VLS_16;
        let __VLS_17;
        const __VLS_18 = ({ edit: {} },
            { onEdit: (__VLS_ctx.handleEditCategory) });
        const __VLS_19 = ({ delete: {} },
            { onDelete: (__VLS_ctx.handleDeleteCategory) });
        // @ts-ignore
        [categories, loading, error, handleEditCategory, handleDeleteCategory,];
        var __VLS_15;
    }
    if (__VLS_ctx.activeTab === 'entries') {
        // @ts-ignore
        [activeTab,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "entries-section" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "section-header" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
        const __VLS_21 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        RouterLink;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
            to: "/admin/entries/new",
            ...{ class: "add-btn" },
        }));
        const __VLS_23 = __VLS_22({
            to: "/admin/entries/new",
            ...{ class: "add-btn" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        const { default: __VLS_25 } = __VLS_24.slots;
        var __VLS_24;
        /** @type {[typeof EntryList, ]} */ ;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent(EntryList, new EntryList({
            ...{ 'onDelete': {} },
            entries: (__VLS_ctx.entriesWithCategories),
            loading: (__VLS_ctx.entriesLoading),
            error: (__VLS_ctx.entriesError),
        }));
        const __VLS_27 = __VLS_26({
            ...{ 'onDelete': {} },
            entries: (__VLS_ctx.entriesWithCategories),
            loading: (__VLS_ctx.entriesLoading),
            error: (__VLS_ctx.entriesError),
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        let __VLS_29;
        let __VLS_30;
        const __VLS_31 = ({ delete: {} },
            { onDelete: (__VLS_ctx.handleDeleteEntry) });
        // @ts-ignore
        [entriesWithCategories, entriesLoading, entriesError, handleDeleteEntry,];
        var __VLS_28;
    }
}
/** @type {__VLS_StyleScopedClasses['admin-view']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-header']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-info']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['access-denied']} */ ;
/** @type {__VLS_StyleScopedClasses['access-denied-content']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-content']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-content']} */ ;
/** @type {__VLS_StyleScopedClasses['categories-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['add-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['entries-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['add-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        CategoryForm: CategoryForm,
        CategoryList: CategoryList,
        EntryList: EntryList,
        user: user,
        logout: logout,
        isAdmin: isAdmin,
        categories: categories,
        loading: loading,
        error: error,
        entriesWithCategories: entriesWithCategories,
        entriesLoading: entriesLoading,
        entriesError: entriesError,
        activeTab: activeTab,
        showCategoryForm: showCategoryForm,
        editingCategory: editingCategory,
        handleCategorySave: handleCategorySave,
        handleCategoryCancel: handleCategoryCancel,
        handleEditCategory: handleEditCategory,
        handleDeleteCategory: handleDeleteCategory,
        handleDeleteEntry: handleDeleteEntry,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
