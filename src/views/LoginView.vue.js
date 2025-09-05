import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
const router = useRouter();
const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, logout, resendEmailVerification, checkEmailExists, loading } = useAuth();
const email = ref('');
const password = ref('');
const displayName = ref('');
const error = ref('');
const successMessage = ref('');
const isRegistering = ref(false);
const sendingVerification = ref(false);
const handleEmailLogin = async () => {
    try {
        error.value = '';
        successMessage.value = '';
        if (isRegistering.value) {
            if (!displayName.value.trim()) {
                error.value = 'El nombre es obligatorio';
                return;
            }
            await signUpWithEmail(email.value, password.value, displayName.value);
            successMessage.value = 'Cuenta creada exitosamente. Revisa tu correo para verificar tu cuenta.';
        }
        else {
            const user = await signInWithEmail(email.value, password.value);
            // Verificar si el correo está verificado
            if (user && !user.emailVerified) {
                // No cerrar sesión, solo mostrar mensaje y permitir reenviar verificación
                error.value = 'Debes verificar tu correo electrónico antes de continuar. Revisa tu bandeja de entrada.';
                return;
            }
            successMessage.value = 'Sesión iniciada exitosamente';
        }
        // Redirigir al inicio después de un breve delay
        setTimeout(() => {
            router.push('/');
        }, 1500);
    }
    catch (err) {
        error.value = err.message || 'Error al autenticar';
    }
};
const handleGoogleLogin = async () => {
    try {
        error.value = '';
        successMessage.value = '';
        await signInWithGoogle();
        successMessage.value = 'Sesión iniciada con Google exitosamente';
        // Redirigir al inicio después de un breve delay
        setTimeout(() => {
            router.push('/');
        }, 1500);
    }
    catch (err) {
        error.value = err.message || 'Error al autenticar con Google';
    }
};
const handleRegister = () => {
    isRegistering.value = !isRegistering.value;
    error.value = '';
    successMessage.value = '';
    displayName.value = ''; // Limpiar el campo de nombre al cambiar de modo
};
const resendVerification = async () => {
    if (!user.value) {
        error.value = 'Debes estar autenticado para reenviar la verificación';
        return;
    }
    if (user.value.emailVerified) {
        error.value = 'Tu email ya está verificado';
        return;
    }
    sendingVerification.value = true;
    try {
        // Usar el SDK de Firebase para reenviar email de verificación
        await resendEmailVerification();
        successMessage.value = 'Email de verificación enviado. Revisa tu bandeja de entrada y la carpeta de spam.';
        error.value = '';
    }
    catch (err) {
        error.value = 'Error al enviar verificación: ' + err.message;
    }
    finally {
        sendingVerification.value = false;
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['login-header']} */ ;
/** @type {__VLS_StyleScopedClasses['login-header']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['verification-help']} */ ;
/** @type {__VLS_StyleScopedClasses['resend-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['resend-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['separator']} */ ;
/** @type {__VLS_StyleScopedClasses['separator']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-google']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-google']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['login-header']} */ ;
/** @type {__VLS_StyleScopedClasses['login-header']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-google']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['login-header']} */ ;
/** @type {__VLS_StyleScopedClasses['login-header']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-google']} */ ;
/** @type {__VLS_StyleScopedClasses['google-icon']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "login-container" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "login-card" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "login-header" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
(__VLS_ctx.isRegistering ? '📝 Registrarse' : '🔐 Iniciar Sesión');
// @ts-ignore
[isRegistering,];
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
(__VLS_ctx.isRegistering ? 'Crea tu cuenta en FastFocus' : 'Accede a tu cuenta de FastFocus');
// @ts-ignore
[isRegistering,];
__VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
    ...{ onSubmit: (__VLS_ctx.handleEmailLogin) },
    ...{ class: "login-form" },
});
// @ts-ignore
[handleEmailLogin,];
if (__VLS_ctx.isRegistering) {
    // @ts-ignore
    [isRegistering,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "displayName",
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        id: "displayName",
        value: (__VLS_ctx.displayName),
        type: "text",
        placeholder: "Tu nombre completo",
        required: true,
        disabled: (__VLS_ctx.loading),
        ...{ class: "form-input" },
    });
    // @ts-ignore
    [displayName, loading,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "email",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    id: "email",
    type: "email",
    placeholder: "tu@email.com",
    required: true,
    disabled: (__VLS_ctx.loading),
    ...{ class: "form-input" },
});
(__VLS_ctx.email);
// @ts-ignore
[loading, email,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "password",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    id: "password",
    type: "password",
    placeholder: "Tu contraseña",
    required: true,
    disabled: (__VLS_ctx.loading),
    ...{ class: "form-input" },
});
(__VLS_ctx.password);
// @ts-ignore
[loading, password,];
if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
}
if (__VLS_ctx.user && !__VLS_ctx.user.emailVerified) {
    // @ts-ignore
    [user, user,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "verification-help" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.resendVerification) },
        disabled: (__VLS_ctx.sendingVerification),
        ...{ class: "resend-btn" },
    });
    // @ts-ignore
    [resendVerification, sendingVerification,];
    if (__VLS_ctx.sendingVerification) {
        // @ts-ignore
        [sendingVerification,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
}
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    type: "submit",
    ...{ class: "btn-primary" },
    disabled: (__VLS_ctx.loading),
});
// @ts-ignore
[loading,];
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "loading-spinner" },
    });
}
(__VLS_ctx.isRegistering ? 'Registrarse' : 'Iniciar Sesión');
// @ts-ignore
[isRegistering,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "separator" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.handleGoogleLogin) },
    ...{ class: "btn-google" },
    disabled: (__VLS_ctx.loading),
});
// @ts-ignore
[loading, handleGoogleLogin,];
__VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
    ...{ class: "google-icon" },
    viewBox: "0 0 24 24",
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    fill: "#4285F4",
    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    fill: "#34A853",
    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    fill: "#FBBC05",
    d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    fill: "#EA4335",
    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "toggle-mode" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
(__VLS_ctx.isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?');
// @ts-ignore
[isRegistering,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.handleRegister) },
    ...{ class: "toggle-btn" },
    disabled: (__VLS_ctx.loading),
});
// @ts-ignore
[loading, handleRegister,];
(__VLS_ctx.isRegistering ? 'Iniciar Sesión' : 'Registrarse');
// @ts-ignore
[isRegistering,];
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['login-header']} */ ;
/** @type {__VLS_StyleScopedClasses['login-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['verification-help']} */ ;
/** @type {__VLS_StyleScopedClasses['resend-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['separator']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-google']} */ ;
/** @type {__VLS_StyleScopedClasses['google-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        user: user,
        loading: loading,
        email: email,
        password: password,
        displayName: displayName,
        error: error,
        isRegistering: isRegistering,
        sendingVerification: sendingVerification,
        handleEmailLogin: handleEmailLogin,
        handleGoogleLogin: handleGoogleLogin,
        handleRegister: handleRegister,
        resendVerification: resendVerification,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
