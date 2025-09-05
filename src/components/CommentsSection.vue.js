import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useComments } from '@/composables/useComments';
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';
import CommentItem from './CommentItem.vue';
import GuestPrompt from './GuestPrompt.vue';
const props = defineProps();
const { user, resendEmailVerification } = useAuth();
const { success, error: showError } = useToast();
const { confirm } = useConfirm();
const { comments, commentsWithReplies, loading, error, fetchCommentsWithReplies, createComment, updateComment, deleteComment, likeComment, dislikeComment, subscribeToComments } = useComments();
const newCommentContent = ref('');
const submitting = ref(false);
const editingComment = ref(null);
const editContent = ref('');
const replyingTo = ref(null);
const replyContent = ref('');
const replyPlaceholder = ref('Escribe tu respuesta...');
const sendingVerification = ref(false);
let unsubscribe = null;
// Computed property para contar todos los comentarios incluyendo respuestas
const totalCommentsCount = computed(() => {
    // Filtrar comentarios de esta entrada específica y contar todos
    const entryComments = comments.value.filter(comment => comment.entryId === props.entryId);
    // Logs de depuración detallados
    console.log('=== DEBUG totalCommentsCount ===');
    console.log('props.entryId:', props.entryId);
    console.log('comments.value.length:', comments.value.length);
    console.log('comments.value:', comments.value);
    console.log('entryComments.length:', entryComments.length);
    console.log('entryComments:', entryComments);
    console.log('commentsWithReplies.value.length:', commentsWithReplies.value.length);
    console.log('commentsWithReplies.value:', commentsWithReplies.value);
    return entryComments.length;
});
// Crear nuevo comentario
const handleSubmitComment = async () => {
    if (!newCommentContent.value.trim())
        return;
    console.log('Intentando crear comentario:', {
        entryId: props.entryId,
        content: newCommentContent.value,
        user: user.value
    });
    submitting.value = true;
    try {
        const result = await createComment({
            entryId: props.entryId,
            content: newCommentContent.value
        });
        console.log('Comentario creado exitosamente:', result);
        newCommentContent.value = '';
    }
    catch (error) {
        console.error('Error al crear comentario:', error);
        showError('Error al crear el comentario: ' + error.message);
    }
    finally {
        submitting.value = false;
    }
};
// Responder a un comentario
const handleReply = (comment) => {
    console.log('handleReply llamado con:', comment);
    console.log('Estado anterior replyingTo:', replyingTo.value);
    replyingTo.value = comment;
    console.log('Nuevo estado replyingTo:', replyingTo.value);
    replyContent.value = '';
    replyPlaceholder.value = 'Escribe tu respuesta...';
    // Hacer scroll al comentario que se está respondiendo
    setTimeout(() => {
        const commentElement = document.querySelector(`[data-comment-id="${comment.id}"]`);
        if (commentElement) {
            commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
};
// Cancelar respuesta
const cancelReply = () => {
    replyingTo.value = null;
    replyContent.value = '';
    replyPlaceholder.value = 'Escribe tu respuesta...';
};
// Reenviar email de verificación
const resendVerification = async () => {
    console.log('resendVerification llamado');
    console.log('user.value:', user.value);
    console.log('user.value?.email:', user.value?.email);
    console.log('user.value?.emailVerified:', user.value?.emailVerified);
    if (!user.value) {
        showError('No hay usuario autenticado. Por favor, inicia sesión primero.');
        return;
    }
    if (user.value.emailVerified) {
        showError('Tu email ya está verificado. No necesitas reenviar la verificación.');
        return;
    }
    sendingVerification.value = true;
    try {
        console.log('Reenviando verificación para usuario:', user.value.email);
        console.log('Estado de verificación:', user.value.emailVerified);
        // Verificar que el usuario esté realmente autenticado
        const { auth } = await import('@/firebase/config');
        if (!auth.currentUser) {
            throw new Error('Usuario no autenticado correctamente. Por favor, cierra sesión y vuelve a iniciar sesión.');
        }
        console.log('Usuario autenticado correctamente:', auth.currentUser.email);
        console.log('Estado de verificación del usuario autenticado:', auth.currentUser.emailVerified);
        await resendEmailVerification();
        success('Email de verificación reenviado. Revisa tu bandeja de entrada y la carpeta de spam.');
    }
    catch (error) {
        console.error('Error al reenviar verificación:', error);
        console.error('Código de error:', error.code);
        console.error('Mensaje de error:', error.message);
        showError('Error al reenviar el email de verificación: ' + (error.message || error));
    }
    finally {
        sendingVerification.value = false;
    }
};
// Enviar respuesta inline
const handleSubmitInlineReply = async (content) => {
    console.log('handleSubmitInlineReply llamado con:', { content, replyingTo: replyingTo.value });
    if (!replyingTo.value || !content.trim())
        return;
    submitting.value = true;
    try {
        await createComment({
            entryId: props.entryId,
            content: content,
            parentId: replyingTo.value.id
        });
        cancelReply();
        // Mostrar mensaje de éxito temporal
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Respuesta enviada exitosamente';
        successMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      z-index: 1001;
      font-size: 0.875rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
        document.body.appendChild(successMessage);
        // Remover el mensaje después de 3 segundos
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 3000);
    }
    catch (error) {
        console.error('Error al crear respuesta:', error);
        showError('Error al crear la respuesta: ' + error.message);
    }
    finally {
        submitting.value = false;
    }
};
// Enviar respuesta (mantener para compatibilidad)
const handleSubmitReply = async () => {
    if (!replyingTo.value || !replyContent.value.trim())
        return;
    submitting.value = true;
    try {
        await createComment({
            entryId: props.entryId,
            content: replyContent.value,
            parentId: replyingTo.value.id
        });
        // Solo limpiar el contenido, mantener el formulario visible
        replyContent.value = '';
        replyPlaceholder.value = 'Respuesta enviada. Puedes escribir otra respuesta...';
        // Mostrar mensaje de éxito temporal
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Respuesta enviada exitosamente';
        successMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      z-index: 1001;
      font-size: 0.875rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
        document.body.appendChild(successMessage);
        // Remover el mensaje después de 3 segundos
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 3000);
    }
    catch (error) {
        console.error('Error al crear respuesta:', error);
        showError('Error al crear la respuesta: ' + error.message);
    }
    finally {
        submitting.value = false;
    }
};
// Editar comentario
const handleEdit = (comment) => {
    editingComment.value = comment;
    editContent.value = comment.content;
};
// Cancelar edición
const cancelEdit = () => {
    editingComment.value = null;
    editContent.value = '';
};
// Guardar edición
const handleEditSubmit = async () => {
    if (!editingComment.value || !editContent.value.trim())
        return;
    submitting.value = true;
    try {
        await updateComment(editingComment.value.id, {
            content: editContent.value
        });
        cancelEdit();
    }
    catch (error) {
        console.error('Error al actualizar comentario:', error);
        showError('Error al actualizar el comentario');
    }
    finally {
        submitting.value = false;
    }
};
// Eliminar comentario
const handleDelete = async (comment) => {
    const confirmed = await confirm({
        title: 'Eliminar comentario',
        message: '¿Estás seguro de que quieres eliminar este comentario?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
    });
    if (!confirmed)
        return;
    try {
        await deleteComment(comment.id);
        success('Comentario eliminado correctamente');
    }
    catch (error) {
        console.error('Error al eliminar comentario:', error);
        showError('Error al eliminar el comentario');
    }
};
// Dar like
const handleLike = async (comment) => {
    try {
        await likeComment(comment.id);
    }
    catch (error) {
        console.error('Error al dar like:', error);
    }
};
// Dar dislike
const handleDislike = async (comment) => {
    try {
        await dislikeComment(comment.id);
    }
    catch (error) {
        console.error('Error al dar dislike:', error);
    }
};
onMounted(async () => {
    console.log('=== INICIO onMounted CommentsSection ===');
    console.log('props.entryId:', props.entryId);
    try {
        console.log('Llamando a fetchCommentsWithReplies...');
        await fetchCommentsWithReplies(props.entryId);
        console.log('fetchCommentsWithReplies completado');
        console.log('comments.value después de fetchCommentsWithReplies:', comments.value);
        console.log('commentsWithReplies.value después de fetchCommentsWithReplies:', commentsWithReplies.value);
    }
    catch (error) {
        console.error('Error en fetchCommentsWithReplies:', error);
    }
    // Suscribirse a cambios en tiempo real
    try {
        console.log('Suscribiéndose a cambios en tiempo real...');
        unsubscribe = subscribeToComments(props.entryId, (comments) => {
            console.log('Callback de suscripción ejecutado con:', comments);
            // Los comentarios se actualizan automáticamente
        });
        console.log('Suscripción configurada');
    }
    catch (error) {
        console.error('Error al configurar suscripción:', error);
    }
});
onUnmounted(() => {
    if (unsubscribe) {
        unsubscribe();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['comment-form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-reply-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['login-prompt']} */ ;
/** @type {__VLS_StyleScopedClasses['login-link']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['comments-section']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['verification-message']} */ ;
/** @type {__VLS_StyleScopedClasses['verification-message']} */ ;
/** @type {__VLS_StyleScopedClasses['verification-message']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "comments-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "comments-title" },
});
(__VLS_ctx.totalCommentsCount);
// @ts-ignore
[totalCommentsCount,];
if (__VLS_ctx.user && __VLS_ctx.user.emailVerified) {
    // @ts-ignore
    [user, user,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "comment-form-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
        ...{ onSubmit: (__VLS_ctx.handleSubmitComment) },
        ...{ class: "comment-form" },
    });
    // @ts-ignore
    [handleSubmitComment,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
        value: (__VLS_ctx.newCommentContent),
        placeholder: "Escribe tu comentario...",
        rows: "3",
        ...{ class: "comment-textarea" },
        disabled: (__VLS_ctx.submitting),
        required: true,
    });
    // @ts-ignore
    [newCommentContent, submitting,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-actions" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        type: "submit",
        disabled: (__VLS_ctx.submitting || !__VLS_ctx.newCommentContent.trim()),
        ...{ class: "btn btn-primary" },
    });
    // @ts-ignore
    [newCommentContent, submitting,];
    (__VLS_ctx.submitting ? 'Enviando...' : 'Comentar');
    // @ts-ignore
    [submitting,];
}
if (!__VLS_ctx.user) {
    // @ts-ignore
    [user,];
    /** @type {[typeof GuestPrompt, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(GuestPrompt, new GuestPrompt({
        ...{ 'onContinueAsGuest': {} },
        title: "Comentarios deshabilitados",
        message: "Para comentar y interactuar con otros usuarios, necesitas iniciar sesión. Como invitado puedes ver todos los comentarios pero no participar en la conversación.",
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onContinueAsGuest': {} },
        title: "Comentarios deshabilitados",
        message: "Para comentar y interactuar con otros usuarios, necesitas iniciar sesión. Como invitado puedes ver todos los comentarios pero no participar en la conversación.",
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    const __VLS_5 = ({ continueAsGuest: {} },
        { onContinueAsGuest: (() => { }) });
    var __VLS_2;
}
if (__VLS_ctx.user && !__VLS_ctx.user.emailVerified) {
    // @ts-ignore
    [user, user,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "verification-required" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "verification-message" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.resendVerification) },
        ...{ class: "btn btn-secondary" },
        disabled: (__VLS_ctx.sendingVerification),
    });
    // @ts-ignore
    [resendVerification, sendingVerification,];
    (__VLS_ctx.sendingVerification ? 'Enviando...' : 'Reenviar Email de Verificación');
    // @ts-ignore
    [sendingVerification,];
}
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-comments" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-spinner" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
}
else if (__VLS_ctx.commentsWithReplies.length === 0) {
    // @ts-ignore
    [commentsWithReplies,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "no-comments" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "comments-list" },
    });
    for (const [comment] of __VLS_getVForSourceType((__VLS_ctx.commentsWithReplies))) {
        // @ts-ignore
        [commentsWithReplies,];
        /** @type {[typeof CommentItem, ]} */ ;
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent(CommentItem, new CommentItem({
            ...{ 'onReply': {} },
            ...{ 'onEdit': {} },
            ...{ 'onDelete': {} },
            ...{ 'onLike': {} },
            ...{ 'onDislike': {} },
            ...{ 'onSubmitReply': {} },
            ...{ 'onCancelReply': {} },
            key: (comment.id),
            comment: (comment),
            entryId: (__VLS_ctx.entryId),
            isBeingRepliedTo: (__VLS_ctx.replyingTo?.id === comment.id),
        }));
        const __VLS_8 = __VLS_7({
            ...{ 'onReply': {} },
            ...{ 'onEdit': {} },
            ...{ 'onDelete': {} },
            ...{ 'onLike': {} },
            ...{ 'onDislike': {} },
            ...{ 'onSubmitReply': {} },
            ...{ 'onCancelReply': {} },
            key: (comment.id),
            comment: (comment),
            entryId: (__VLS_ctx.entryId),
            isBeingRepliedTo: (__VLS_ctx.replyingTo?.id === comment.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_7));
        let __VLS_10;
        let __VLS_11;
        const __VLS_12 = ({ reply: {} },
            { onReply: (__VLS_ctx.handleReply) });
        const __VLS_13 = ({ edit: {} },
            { onEdit: (__VLS_ctx.handleEdit) });
        const __VLS_14 = ({ delete: {} },
            { onDelete: (__VLS_ctx.handleDelete) });
        const __VLS_15 = ({ like: {} },
            { onLike: (__VLS_ctx.handleLike) });
        const __VLS_16 = ({ dislike: {} },
            { onDislike: (__VLS_ctx.handleDislike) });
        const __VLS_17 = ({ submitReply: {} },
            { onSubmitReply: (__VLS_ctx.handleSubmitInlineReply) });
        const __VLS_18 = ({ cancelReply: {} },
            { onCancelReply: (__VLS_ctx.cancelReply) });
        // @ts-ignore
        [entryId, replyingTo, handleReply, handleEdit, handleDelete, handleLike, handleDislike, handleSubmitInlineReply, cancelReply,];
        var __VLS_9;
    }
}
if (__VLS_ctx.editingComment) {
    // @ts-ignore
    [editingComment,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.cancelEdit) },
        ...{ class: "modal-overlay" },
    });
    // @ts-ignore
    [cancelEdit,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: () => { } },
        ...{ class: "modal-content" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({});
    __VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
        ...{ onSubmit: (__VLS_ctx.handleEditSubmit) },
        ...{ class: "edit-form" },
    });
    // @ts-ignore
    [handleEditSubmit,];
    __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
        value: (__VLS_ctx.editContent),
        rows: "4",
        ...{ class: "edit-textarea" },
        required: true,
    });
    // @ts-ignore
    [editContent,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-actions" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.cancelEdit) },
        type: "button",
        ...{ class: "btn btn-secondary" },
    });
    // @ts-ignore
    [cancelEdit,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        type: "submit",
        disabled: (__VLS_ctx.submitting),
        ...{ class: "btn btn-primary" },
    });
    // @ts-ignore
    [submitting,];
    (__VLS_ctx.submitting ? 'Guardando...' : 'Guardar');
    // @ts-ignore
    [submitting,];
}
/** @type {__VLS_StyleScopedClasses['comments-section']} */ ;
/** @type {__VLS_StyleScopedClasses['comments-title']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['verification-required']} */ ;
/** @type {__VLS_StyleScopedClasses['verification-message']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-comments']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['no-comments']} */ ;
/** @type {__VLS_StyleScopedClasses['comments-list']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-form']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        CommentItem: CommentItem,
        GuestPrompt: GuestPrompt,
        user: user,
        commentsWithReplies: commentsWithReplies,
        loading: loading,
        newCommentContent: newCommentContent,
        submitting: submitting,
        editingComment: editingComment,
        editContent: editContent,
        replyingTo: replyingTo,
        sendingVerification: sendingVerification,
        totalCommentsCount: totalCommentsCount,
        handleSubmitComment: handleSubmitComment,
        handleReply: handleReply,
        cancelReply: cancelReply,
        resendVerification: resendVerification,
        handleSubmitInlineReply: handleSubmitInlineReply,
        handleEdit: handleEdit,
        cancelEdit: cancelEdit,
        handleEditSubmit: handleEditSubmit,
        handleDelete: handleDelete,
        handleLike: handleLike,
        handleDislike: handleDislike,
    }),
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
