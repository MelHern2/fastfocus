import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useAdmin } from '@/composables/useAdmin';
import { useCategories } from '@/composables/useCategories';
import NotificationBell from './NotificationBell.vue';
import CategoryMenuItem from './CategoryMenuItem.vue';
const route = useRoute();
const { user, logout } = useAuth();
const { isAdmin } = useAdmin();
const { categories, loading, fetchCategories, buildCategoryTree } = useCategories();
const showDropdown = ref(false);
const categoriesTree = ref([]);
const hoveredCategory = ref(null);
let hoverTimeout = null;
// Detectar si estamos en la página de admin
const isAdminPage = computed(() => {
    return route.path.startsWith('/admin');
});
// Debug para hover
watch(hoveredCategory, (newVal) => {
    console.log('Hovered category changed:', newVal);
});
// Cargar categorías y construir árbol
const loadCategoriesTree = async () => {
    try {
        await fetchCategories();
        categoriesTree.value = buildCategoryTree();
        console.log('Categorías cargadas:', categoriesTree.value);
        console.log('Categorías con hijos:', categoriesTree.value.filter(cat => cat.children && cat.children.length > 0));
    }
    catch (error) {
        console.error('Error al cargar categorías:', error);
        categoriesTree.value = [];
    }
};
// Cargar categorías al montar el componente
onMounted(async () => {
    await loadCategoriesTree();
});
// Limpiar timeout al desmontar
onUnmounted(() => {
    if (hoverTimeout) {
        clearTimeout(hoverTimeout);
    }
});
// Debug: verificar estado de admin
console.log('NavBar - Usuario:', user.value?.email);
console.log('NavBar - DisplayName:', user.value?.displayName);
console.log('NavBar - Es admin:', isAdmin.value);
console.log('NavBar - Email coincide:', user.value?.email === 'melanasdoblaktocas3@gmail.com');
console.log('NavBar - Condición botón admin:', user.value && user.value.email === 'melanasdoblaktocas3@gmail.com');
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['brand-link']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-link']} */ ;
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['router-link-active']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-container']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-container']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-container']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-container']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['user-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['user-name']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.nav, __VLS_elements.nav)({
    ...{ class: "navbar" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "nav-container" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "nav-brand" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/",
    ...{ class: "brand-link" },
}));
const __VLS_2 = __VLS_1({
    to: "/",
    ...{ class: "brand-link" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/src/assets/logo-fast-focus-removebg-preview.png",
    alt: "FastFocus",
    ...{ class: "nav-logo" },
});
var __VLS_3;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "nav-menu" },
});
const __VLS_5 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    to: "/",
    ...{ class: "nav-link" },
}));
const __VLS_7 = __VLS_6({
    to: "/",
    ...{ class: "nav-link" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_9 } = __VLS_8.slots;
var __VLS_8;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onMouseenter: (...[$event]) => {
            __VLS_ctx.showDropdown = true;
            // @ts-ignore
            [showDropdown,];
        } },
    ...{ onMouseleave: (...[$event]) => {
            __VLS_ctx.showDropdown = false;
            // @ts-ignore
            [showDropdown,];
        } },
    ...{ class: "dropdown-container" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "nav-link dropdown-trigger" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "dropdown-arrow" },
});
if (__VLS_ctx.showDropdown) {
    // @ts-ignore
    [showDropdown,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "dropdown-menu" },
    });
    if (__VLS_ctx.loading) {
        // @ts-ignore
        [loading,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "dropdown-loading" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "loading-spinner" },
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    else if (__VLS_ctx.categoriesTree.length === 0) {
        // @ts-ignore
        [categoriesTree,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "dropdown-empty" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "dropdown-content" },
        });
        for (const [category] of __VLS_getVForSourceType((__VLS_ctx.categoriesTree))) {
            // @ts-ignore
            [categoriesTree,];
            /** @type {[typeof CategoryMenuItem, ]} */ ;
            // @ts-ignore
            const __VLS_10 = __VLS_asFunctionalComponent(CategoryMenuItem, new CategoryMenuItem({
                ...{ 'onCloseDropdown': {} },
                key: (category.id),
                category: (category),
                level: (0),
            }));
            const __VLS_11 = __VLS_10({
                ...{ 'onCloseDropdown': {} },
                key: (category.id),
                category: (category),
                level: (0),
            }, ...__VLS_functionalComponentArgsRest(__VLS_10));
            let __VLS_13;
            let __VLS_14;
            const __VLS_15 = ({ closeDropdown: {} },
                { onCloseDropdown: (...[$event]) => {
                        if (!(__VLS_ctx.showDropdown))
                            return;
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(__VLS_ctx.categoriesTree.length === 0))
                            return;
                        __VLS_ctx.showDropdown = false;
                        // @ts-ignore
                        [showDropdown,];
                    } });
            var __VLS_12;
        }
    }
}
const __VLS_17 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    to: "/about",
    ...{ class: "nav-link" },
}));
const __VLS_19 = __VLS_18({
    to: "/about",
    ...{ class: "nav-link" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_21 } = __VLS_20.slots;
var __VLS_20;
if (__VLS_ctx.user) {
    // @ts-ignore
    [user,];
    /** @type {[typeof NotificationBell, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(NotificationBell, new NotificationBell({}));
    const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
}
if (!__VLS_ctx.user) {
    // @ts-ignore
    [user,];
    const __VLS_26 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
        to: "/login",
        ...{ class: "nav-link" },
    }));
    const __VLS_28 = __VLS_27({
        to: "/login",
        ...{ class: "nav-link" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    const { default: __VLS_30 } = __VLS_29.slots;
    var __VLS_29;
}
else {
    if (__VLS_ctx.isAdminPage) {
        // @ts-ignore
        [isAdminPage,];
        const __VLS_31 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        RouterLink;
        // @ts-ignore
        const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
            to: "/",
            ...{ class: "nav-link back-link" },
        }));
        const __VLS_33 = __VLS_32({
            to: "/",
            ...{ class: "nav-link back-link" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_32));
        const { default: __VLS_35 } = __VLS_34.slots;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "back-icon" },
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "back-text" },
        });
        var __VLS_34;
    }
    else if (__VLS_ctx.user && __VLS_ctx.user.email === 'melanasdoblaktocas3@gmail.com') {
        // @ts-ignore
        [user, user,];
        const __VLS_36 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        RouterLink;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
            to: "/admin",
            ...{ class: "nav-link admin-link" },
        }));
        const __VLS_38 = __VLS_37({
            to: "/admin",
            ...{ class: "nav-link admin-link" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        const { default: __VLS_40 } = __VLS_39.slots;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "admin-icon" },
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "admin-text" },
        });
        var __VLS_39;
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "user-menu" },
    });
    const __VLS_41 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        to: "/profile",
        ...{ class: "profile-link" },
    }));
    const __VLS_43 = __VLS_42({
        to: "/profile",
        ...{ class: "profile-link" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    const { default: __VLS_45 } = __VLS_44.slots;
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "user-name" },
    });
    (__VLS_ctx.user.displayName || 'Sin nombre');
    // @ts-ignore
    [user,];
    var __VLS_44;
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.logout) },
        ...{ class: "logout-btn" },
    });
    // @ts-ignore
    [logout,];
}
/** @type {__VLS_StyleScopedClasses['navbar']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-container']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-brand']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-container']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-content']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
/** @type {__VLS_StyleScopedClasses['back-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['back-text']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-link']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-text']} */ ;
/** @type {__VLS_StyleScopedClasses['user-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['user-name']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        NotificationBell: NotificationBell,
        CategoryMenuItem: CategoryMenuItem,
        user: user,
        logout: logout,
        loading: loading,
        showDropdown: showDropdown,
        categoriesTree: categoriesTree,
        isAdminPage: isAdminPage,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
