import { ref, computed, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useUserProfile } from '@/composables/useUserProfile';
import { useToast } from '@/composables/useToast';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';
const { user, resendEmailVerification } = useAuth();
const { userProfile, updateUserProfile } = useUserProfile();
const { success, error: showError } = useToast();
const formData = ref({
    displayName: ''
});
const saving = ref(false);
const sendingVerification = ref(false);
const isEditing = ref(false);
const userInitials = computed(() => {
    if (userProfile.value?.displayName) {
        return userProfile.value.displayName
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }
    return user.value?.email?.[0]?.toUpperCase() || 'U';
});
const sendVerificationEmail = async () => {
    if (!user.value)
        return;
    sendingVerification.value = true;
    try {
        await resendEmailVerification();
        success('Correo de verificación enviado. Revisa tu bandeja de entrada.');
    }
    catch (error) {
        console.error('Error al enviar verificación:', error);
        showError('Error al enviar el correo de verificación.');
    }
    finally {
        sendingVerification.value = false;
    }
};
const startEditing = () => {
    isEditing.value = true;
    formData.value.displayName = userProfile.value?.displayName || '';
};
const cancelEditing = () => {
    isEditing.value = false;
    formData.value.displayName = userProfile.value?.displayName || '';
};
const updateProfile = async () => {
    if (!user.value)
        return;
    saving.value = true;
    try {
        // Actualizar Firebase Auth
        await updateFirebaseProfile(user.value, {
            displayName: formData.value.displayName
        });
        // Actualizar perfil en Firestore
        await updateUserProfile({
            displayName: formData.value.displayName
        });
        success('Perfil actualizado correctamente');
        isEditing.value = false;
    }
    catch (error) {
        console.error('Error al actualizar perfil:', error);
        showError('Error al actualizar el perfil.');
    }
    finally {
        saving.value = false;
    }
};
onMounted(() => {
    if (userProfile.value) {
        formData.value.displayName = userProfile.value.displayName || '';
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['verification-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['verification-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['verified']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['unverified']} */ ;
/** @type {__VLS_StyleScopedClasses['verification-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "user-profile" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "profile-header" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "profile-avatar" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "avatar-circle" },
});
(__VLS_ctx.userInitials);
// @ts-ignore
[userInitials,];
if (!__VLS_ctx.userProfile?.emailVerified) {
    // @ts-ignore
    [userProfile,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "verification-badge unverified" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "verification-badge verified" },
    });
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "profile-info" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "profile-name" },
});
(__VLS_ctx.userProfile?.displayName || 'Usuario');
// @ts-ignore
[userProfile,];
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "profile-email" },
});
(__VLS_ctx.user?.email);
// @ts-ignore
[user,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "verification-status" },
});
if (__VLS_ctx.userProfile?.emailVerified) {
    // @ts-ignore
    [userProfile,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "status verified" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "status unverified" },
    });
}
if (!__VLS_ctx.userProfile?.emailVerified) {
    // @ts-ignore
    [userProfile,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "verification-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "verification-warning" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.sendVerificationEmail) },
        disabled: (__VLS_ctx.sendingVerification),
        ...{ class: "verify-btn" },
    });
    // @ts-ignore
    [sendVerificationEmail, sendingVerification,];
    if (__VLS_ctx.sendingVerification) {
        // @ts-ignore
        [sendingVerification,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "profile-form" },
});
__VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({});
if (!__VLS_ctx.isEditing) {
    // @ts-ignore
    [isEditing,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "profile-display" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-value" },
    });
    (__VLS_ctx.userProfile?.displayName || 'No especificado');
    // @ts-ignore
    [userProfile,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.startEditing) },
        ...{ class: "edit-btn" },
    });
    // @ts-ignore
    [startEditing,];
}
else {
    __VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
        ...{ onSubmit: (__VLS_ctx.updateProfile) },
        ...{ class: "edit-form" },
    });
    // @ts-ignore
    [updateProfile,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "displayName",
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        id: "displayName",
        value: (__VLS_ctx.formData.displayName),
        type: "text",
        placeholder: "Ingresa tu nombre completo",
        required: true,
    });
    // @ts-ignore
    [formData,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-actions" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.cancelEditing) },
        type: "button",
        ...{ class: "cancel-btn" },
    });
    // @ts-ignore
    [cancelEditing,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        type: "submit",
        disabled: (__VLS_ctx.saving),
        ...{ class: "save-btn" },
    });
    // @ts-ignore
    [saving,];
    if (__VLS_ctx.saving) {
        // @ts-ignore
        [saving,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
}
/** @type {__VLS_StyleScopedClasses['user-profile']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-header']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['verification-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['unverified']} */ ;
/** @type {__VLS_StyleScopedClasses['verification-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['verified']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-info']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-name']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-email']} */ ;
/** @type {__VLS_StyleScopedClasses['verification-status']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['verified']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['unverified']} */ ;
/** @type {__VLS_StyleScopedClasses['verification-section']} */ ;
/** @type {__VLS_StyleScopedClasses['verification-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-form']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-display']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-value']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        user: user,
        userProfile: userProfile,
        formData: formData,
        saving: saving,
        sendingVerification: sendingVerification,
        isEditing: isEditing,
        userInitials: userInitials,
        sendVerificationEmail: sendVerificationEmail,
        startEditing: startEditing,
        cancelEditing: cancelEditing,
        updateProfile: updateProfile,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
