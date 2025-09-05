import { ref, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useUserProfile } from '@/composables/useUserProfile';
import UserProfile from '@/components/UserProfile.vue';
const { user } = useAuth();
const { userProfile, loadUserProfile, loading } = useUserProfile();
const loadError = ref(false);
const loadProfile = async () => {
    if (user.value) {
        loadError.value = false;
        try {
            await loadUserProfile(user.value);
        }
        catch (error) {
            console.error('Error al cargar perfil:', error);
            loadError.value = true;
        }
    }
};
onMounted(() => {
    loadProfile();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['profile-header']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-header']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-view']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-container']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-header']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-header']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "profile-view" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "profile-container" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "profile-header" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
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
else if (__VLS_ctx.userProfile) {
    // @ts-ignore
    [userProfile,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "profile-content" },
    });
    /** @type {[typeof UserProfile, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(UserProfile, new UserProfile({}));
    const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
else if (__VLS_ctx.loadError) {
    // @ts-ignore
    [loadError,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "error-state" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.loadProfile) },
        ...{ class: "retry-btn" },
    });
    // @ts-ignore
    [loadProfile,];
}
/** @type {__VLS_StyleScopedClasses['profile-view']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-container']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-header']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-content']} */ ;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['retry-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        UserProfile: UserProfile,
        userProfile: userProfile,
        loading: loading,
        loadError: loadError,
        loadProfile: loadProfile,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
