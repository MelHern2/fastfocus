import { computed, ref } from 'vue';
import { useComments } from '@/composables/useComments';
import { useAuth } from '@/composables/useAuth';
import { useAdmin } from '@/composables/useAdmin';
import { useToast } from '@/composables/useToast';
const props = defineProps();
const emit = defineEmits();
const replyContent = ref('');
const isReplyingToThis = ref(false);
const { user } = useAuth();
const { isAdmin } = useAdmin();
const { error: showError } = useToast();
const { canEditComment, canDeleteComment, getEditTimeRemaining, getDeleteTimeRemaining, createComment } = useComments();
const canEdit = computed(() => canEditComment(props.comment));
const canDelete = computed(() => canDeleteComment(props.comment));
// Debug: verificar si este comentario está siendo respondido
console.log(`CommentItem ${props.comment.id}: isBeingRepliedTo = ${props.isBeingRepliedTo}, isReplyingToThis = ${isReplyingToThis.value}, isNested = ${props.isNested}`);
// Manejar respuestas anidadas
const handleNestedReply = (comment) => {
    emit('reply', comment);
};
const handleReplyClick = () => {
    console.log('Botón Responder clickeado para comentario:', props.comment.id);
    isReplyingToThis.value = true;
    replyContent.value = '';
};
const handleSubmitReply = async () => {
    if (!replyContent.value.trim())
        return;
    try {
        await createComment({
            entryId: props.entryId,
            content: replyContent.value,
            parentId: props.comment.id
        });
        replyContent.value = '';
        isReplyingToThis.value = false;
    }
    catch (error) {
        console.error('Error al crear respuesta:', error);
        showError('Error al crear la respuesta: ' + error.message);
    }
};
const handleCancelReply = () => {
    isReplyingToThis.value = false;
    replyContent.value = '';
};
const formatDate = (date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInMinutes < 1) {
        return 'Ahora mismo';
    }
    else if (diffInMinutes < 60) {
        return `Hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
    }
    else if (diffInHours < 24) {
        return `Hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
    }
    else if (diffInDays < 7) {
        return `Hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;
    }
    else {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-reply']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-reply']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['replies-list']} */ ;
/** @type {__VLS_StyleScopedClasses['replies-list']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-reply']} */ ;
/** @type {__VLS_StyleScopedClasses['replies-list']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-reply']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-replies']} */ ;
/** @type {__VLS_StyleScopedClasses['replies-list']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-reply']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-reply']} */ ;
/** @type {__VLS_StyleScopedClasses['replies-list']} */ ;
/** @type {__VLS_StyleScopedClasses['replies-list']} */ ;
/** @type {__VLS_StyleScopedClasses['replies-list']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "comment-item" },
    id: (`comment-${__VLS_ctx.comment.id}`),
    ...{ class: ({ 'is-reply': __VLS_ctx.comment.parentId, 'is-being-replied-to': __VLS_ctx.isReplyingToThis }) },
    'data-comment-id': (__VLS_ctx.comment.id),
});
// @ts-ignore
[comment, comment, comment, isReplyingToThis,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "comment-content" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "comment-header" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "comment-author" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "author-name" },
});
(__VLS_ctx.comment.authorName);
// @ts-ignore
[comment,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "comment-date" },
});
(__VLS_ctx.formatDate(__VLS_ctx.comment.createdAt));
// @ts-ignore
[comment, formatDate,];
if (__VLS_ctx.comment.isEdited) {
    // @ts-ignore
    [comment,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "edited-badge" },
    });
}
if (__VLS_ctx.isReplyingToThis) {
    // @ts-ignore
    [isReplyingToThis,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "replying-indicator" },
    });
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "comment-body" },
});
if (__VLS_ctx.comment.parentId && __VLS_ctx.comment.replyingTo) {
    // @ts-ignore
    [comment, comment,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "reply-to-indicator" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "reply-to-text" },
    });
    (__VLS_ctx.comment.replyingTo.authorName);
    // @ts-ignore
    [comment,];
}
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "comment-text" },
});
(__VLS_ctx.comment.content);
// @ts-ignore
[comment,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "comment-actions" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "action-buttons" },
});
if (__VLS_ctx.user) {
    // @ts-ignore
    [user,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.user))
                    return;
                __VLS_ctx.$emit('like', __VLS_ctx.comment);
                // @ts-ignore
                [comment, $emit,];
            } },
        ...{ class: "action-btn" },
        ...{ class: ({ 'active': __VLS_ctx.comment.userLiked }) },
        title: "Me gusta",
    });
    // @ts-ignore
    [comment,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-icon" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-count" },
    });
    (__VLS_ctx.comment.likeCount);
    // @ts-ignore
    [comment,];
}
if (__VLS_ctx.user) {
    // @ts-ignore
    [user,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.user))
                    return;
                __VLS_ctx.$emit('dislike', __VLS_ctx.comment);
                // @ts-ignore
                [comment, $emit,];
            } },
        ...{ class: "action-btn" },
        ...{ class: ({ 'active': __VLS_ctx.comment.userDisliked }) },
        title: "No me gusta",
    });
    // @ts-ignore
    [comment,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-icon" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-count" },
    });
    (__VLS_ctx.comment.dislikeCount);
    // @ts-ignore
    [comment,];
}
if (!__VLS_ctx.user) {
    // @ts-ignore
    [user,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "guest-action-display" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-count-display" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-icon" },
    });
    (__VLS_ctx.comment.likeCount);
    // @ts-ignore
    [comment,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-count-display" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-icon" },
    });
    (__VLS_ctx.comment.dislikeCount);
    // @ts-ignore
    [comment,];
}
if (__VLS_ctx.user) {
    // @ts-ignore
    [user,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.handleReplyClick) },
        ...{ class: "action-btn" },
        title: "Responder",
    });
    // @ts-ignore
    [handleReplyClick,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-icon" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-text" },
    });
}
if (!__VLS_ctx.user) {
    // @ts-ignore
    [user,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "action-stats" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-stat" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-icon" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-count" },
    });
    (__VLS_ctx.comment.likeCount);
    // @ts-ignore
    [comment,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-stat" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-icon" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "action-count" },
    });
    (__VLS_ctx.comment.dislikeCount);
    // @ts-ignore
    [comment,];
}
if (__VLS_ctx.canEdit || __VLS_ctx.canDelete) {
    // @ts-ignore
    [canEdit, canDelete,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "comment-actions-owner" },
    });
    if (__VLS_ctx.canEdit) {
        // @ts-ignore
        [canEdit,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.canEdit || __VLS_ctx.canDelete))
                        return;
                    if (!(__VLS_ctx.canEdit))
                        return;
                    __VLS_ctx.$emit('edit', __VLS_ctx.comment);
                    // @ts-ignore
                    [comment, $emit,];
                } },
            ...{ class: "action-btn action-btn-edit" },
            title: (`Editar (${__VLS_ctx.getEditTimeRemaining(__VLS_ctx.comment)} min restantes)`),
        });
        // @ts-ignore
        [comment, getEditTimeRemaining,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "action-icon" },
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "action-text" },
        });
        if (__VLS_ctx.getEditTimeRemaining(__VLS_ctx.comment) > 0) {
            // @ts-ignore
            [comment, getEditTimeRemaining,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                ...{ class: "edit-time-remaining" },
            });
            (__VLS_ctx.getEditTimeRemaining(__VLS_ctx.comment));
            // @ts-ignore
            [comment, getEditTimeRemaining,];
        }
    }
    if (__VLS_ctx.canDelete) {
        // @ts-ignore
        [canDelete,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.canEdit || __VLS_ctx.canDelete))
                        return;
                    if (!(__VLS_ctx.canDelete))
                        return;
                    __VLS_ctx.$emit('delete', __VLS_ctx.comment);
                    // @ts-ignore
                    [comment, $emit,];
                } },
            ...{ class: "action-btn action-btn-delete" },
            ...{ class: ({ 'admin-delete': __VLS_ctx.isAdmin && __VLS_ctx.comment.authorId !== __VLS_ctx.user?.uid }) },
            title: (__VLS_ctx.isAdmin && __VLS_ctx.comment.authorId !== __VLS_ctx.user?.uid ? 'Eliminar como administrador' : `Eliminar (${__VLS_ctx.getDeleteTimeRemaining(__VLS_ctx.comment)} min restantes)`),
        });
        // @ts-ignore
        [comment, comment, comment, user, user, isAdmin, isAdmin, getDeleteTimeRemaining,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "action-icon" },
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "action-text" },
        });
        (__VLS_ctx.isAdmin && __VLS_ctx.comment.authorId !== __VLS_ctx.user?.uid ? 'Eliminar (Admin)' : 'Eliminar');
        // @ts-ignore
        [comment, user, isAdmin,];
        if (!__VLS_ctx.isAdmin && __VLS_ctx.getDeleteTimeRemaining(__VLS_ctx.comment) > 0) {
            // @ts-ignore
            [comment, isAdmin, getDeleteTimeRemaining,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
                ...{ class: "delete-time-remaining" },
            });
            (__VLS_ctx.getDeleteTimeRemaining(__VLS_ctx.comment));
            // @ts-ignore
            [comment, getDeleteTimeRemaining,];
        }
    }
}
if (__VLS_ctx.user && __VLS_ctx.isReplyingToThis) {
    // @ts-ignore
    [isReplyingToThis, user,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "inline-reply-form" },
    });
    __VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
        ...{ onSubmit: (__VLS_ctx.handleSubmitReply) },
        ...{ class: "reply-form-inline" },
    });
    // @ts-ignore
    [handleSubmitReply,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
        value: (__VLS_ctx.replyContent),
        placeholder: "Escribe tu respuesta...",
        rows: "2",
        ...{ class: "reply-textarea" },
        required: true,
    });
    // @ts-ignore
    [replyContent,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-actions" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.handleCancelReply) },
        type: "button",
        ...{ class: "btn btn-secondary btn-sm" },
    });
    // @ts-ignore
    [handleCancelReply,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        type: "submit",
        disabled: (!__VLS_ctx.replyContent.trim()),
        ...{ class: "btn btn-primary btn-sm" },
    });
    // @ts-ignore
    [replyContent,];
}
if (__VLS_ctx.comment.replies && __VLS_ctx.comment.replies.length > 0) {
    // @ts-ignore
    [comment, comment,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "comment-replies" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "replies-indicator" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "replies-line" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "replies-text" },
    });
    (__VLS_ctx.comment.replyCount);
    (__VLS_ctx.comment.replyCount !== 1 ? 's' : '');
    // @ts-ignore
    [comment, comment,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "replies-list" },
    });
    for (const [reply] of __VLS_getVForSourceType((__VLS_ctx.comment.replies))) {
        // @ts-ignore
        [comment,];
        const __VLS_0 = {}.CommentItem;
        /** @type {[typeof __VLS_components.CommentItem, ]} */ ;
        // @ts-ignore
        CommentItem;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            ...{ 'onReply': {} },
            ...{ 'onEdit': {} },
            ...{ 'onDelete': {} },
            ...{ 'onLike': {} },
            ...{ 'onDislike': {} },
            key: (reply.id),
            comment: (reply),
            entryId: (__VLS_ctx.entryId),
            isNested: (true),
        }));
        const __VLS_2 = __VLS_1({
            ...{ 'onReply': {} },
            ...{ 'onEdit': {} },
            ...{ 'onDelete': {} },
            ...{ 'onLike': {} },
            ...{ 'onDislike': {} },
            key: (reply.id),
            comment: (reply),
            entryId: (__VLS_ctx.entryId),
            isNested: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        let __VLS_4;
        let __VLS_5;
        const __VLS_6 = ({ reply: {} },
            { onReply: (__VLS_ctx.handleNestedReply) });
        const __VLS_7 = ({ edit: {} },
            { onEdit: (...[$event]) => {
                    if (!(__VLS_ctx.comment.replies && __VLS_ctx.comment.replies.length > 0))
                        return;
                    __VLS_ctx.$emit('edit', $event);
                    // @ts-ignore
                    [$emit, entryId, handleNestedReply,];
                } });
        const __VLS_8 = ({ delete: {} },
            { onDelete: (...[$event]) => {
                    if (!(__VLS_ctx.comment.replies && __VLS_ctx.comment.replies.length > 0))
                        return;
                    __VLS_ctx.$emit('delete', $event);
                    // @ts-ignore
                    [$emit,];
                } });
        const __VLS_9 = ({ like: {} },
            { onLike: (...[$event]) => {
                    if (!(__VLS_ctx.comment.replies && __VLS_ctx.comment.replies.length > 0))
                        return;
                    __VLS_ctx.$emit('like', $event);
                    // @ts-ignore
                    [$emit,];
                } });
        const __VLS_10 = ({ dislike: {} },
            { onDislike: (...[$event]) => {
                    if (!(__VLS_ctx.comment.replies && __VLS_ctx.comment.replies.length > 0))
                        return;
                    __VLS_ctx.$emit('dislike', $event);
                    // @ts-ignore
                    [$emit,];
                } });
        var __VLS_3;
    }
}
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-reply']} */ ;
/** @type {__VLS_StyleScopedClasses['is-being-replied-to']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-content']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-header']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-author']} */ ;
/** @type {__VLS_StyleScopedClasses['author-name']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-date']} */ ;
/** @type {__VLS_StyleScopedClasses['edited-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['replying-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-body']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-to-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-to-text']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-text']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-count']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-count']} */ ;
/** @type {__VLS_StyleScopedClasses['guest-action-display']} */ ;
/** @type {__VLS_StyleScopedClasses['action-count-display']} */ ;
/** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-count-display']} */ ;
/** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-text']} */ ;
/** @type {__VLS_StyleScopedClasses['action-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['action-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-count']} */ ;
/** @type {__VLS_StyleScopedClasses['action-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-count']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-actions-owner']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn-edit']} */ ;
/** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-text']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-time-remaining']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['action-text']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-time-remaining']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-reply-form']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-form-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-replies']} */ ;
/** @type {__VLS_StyleScopedClasses['replies-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['replies-line']} */ ;
/** @type {__VLS_StyleScopedClasses['replies-text']} */ ;
/** @type {__VLS_StyleScopedClasses['replies-list']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        replyContent: replyContent,
        isReplyingToThis: isReplyingToThis,
        user: user,
        isAdmin: isAdmin,
        getEditTimeRemaining: getEditTimeRemaining,
        getDeleteTimeRemaining: getDeleteTimeRemaining,
        canEdit: canEdit,
        canDelete: canDelete,
        handleNestedReply: handleNestedReply,
        handleReplyClick: handleReplyClick,
        handleSubmitReply: handleSubmitReply,
        handleCancelReply: handleCancelReply,
        formatDate: formatDate,
    }),
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
