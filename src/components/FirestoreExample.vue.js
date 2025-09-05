import { ref, onMounted, onUnmounted } from 'vue';
import { useFirestore } from '@/composables/useFirestore';
// Composable de Firestore
const { loading, error, getCollection, addDocument, deleteDocument, subscribeToCollection } = useFirestore();
// Estado reactivo
const documents = ref([]);
const newDocument = ref({
    name: '',
    email: ''
});
// Suscripción en tiempo real
let unsubscribe = null;
// Cargar documentos al montar el componente
onMounted(async () => {
    // Cargar documentos iniciales
    const initialDocs = await getCollection('users');
    documents.value = initialDocs;
    // Suscribirse a cambios en tiempo real
    unsubscribe = subscribeToCollection('users', (docs) => {
        documents.value = docs;
    });
});
// Limpiar suscripción al desmontar
onUnmounted(() => {
    if (unsubscribe) {
        unsubscribe();
    }
});
// Agregar nuevo documento
const addNewDocument = async () => {
    const docData = {
        ...newDocument.value,
        createdAt: new Date()
    };
    const docId = await addDocument('users', docData);
    if (docId) {
        // Limpiar formulario
        newDocument.value = {
            name: '',
            email: ''
        };
    }
};
// Eliminar documento
const deleteDocumentHandler = async (docId) => {
    const success = await deleteDocument('users', docId);
    if (success) {
        console.log('Documento eliminado correctamente');
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['document-info']} */ ;
/** @type {__VLS_StyleScopedClasses['document-info']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "firestore-example" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
__VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
    ...{ onSubmit: (__VLS_ctx.addNewDocument) },
});
// @ts-ignore
[addNewDocument,];
__VLS_asFunctionalElement(__VLS_elements.input)({
    placeholder: "Nombre",
    required: true,
});
(__VLS_ctx.newDocument.name);
// @ts-ignore
[newDocument,];
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "email",
    placeholder: "Email",
    required: true,
});
(__VLS_ctx.newDocument.email);
// @ts-ignore
[newDocument,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    type: "submit",
    disabled: (__VLS_ctx.loading),
});
// @ts-ignore
[loading,];
(__VLS_ctx.loading ? 'Agregando...' : 'Agregar');
// @ts-ignore
[loading,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "documents-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading" },
    });
}
else if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "error" },
    });
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
}
else if (__VLS_ctx.documents.length === 0) {
    // @ts-ignore
    [documents,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "no-data" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "documents-list" },
    });
    for (const [doc] of __VLS_getVForSourceType((__VLS_ctx.documents))) {
        // @ts-ignore
        [documents,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            key: (doc.id),
            ...{ class: "document-item" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "document-info" },
        });
        __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
        (doc.name);
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        (doc.email);
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "document-actions" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!!(__VLS_ctx.documents.length === 0))
                        return;
                    __VLS_ctx.deleteDocument(doc.id);
                    // @ts-ignore
                    [deleteDocument,];
                } },
            ...{ class: "delete-btn" },
        });
    }
}
/** @type {__VLS_StyleScopedClasses['firestore-example']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['documents-section']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['no-data']} */ ;
/** @type {__VLS_StyleScopedClasses['documents-list']} */ ;
/** @type {__VLS_StyleScopedClasses['document-item']} */ ;
/** @type {__VLS_StyleScopedClasses['document-info']} */ ;
/** @type {__VLS_StyleScopedClasses['document-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        loading: loading,
        error: error,
        deleteDocument: deleteDocument,
        documents: documents,
        newDocument: newDocument,
        addNewDocument: addNewDocument,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
