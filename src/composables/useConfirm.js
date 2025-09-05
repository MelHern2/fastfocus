import { ref } from 'vue';
// Estado global para el diálogo de confirmación
const globalConfirmState = {
    isVisible: ref(false),
    options: ref({
        message: '',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        type: 'warning'
    }),
    resolvePromise: null
};
export function useConfirm() {
    const confirm = (confirmOptions) => {
        return new Promise((resolve) => {
            globalConfirmState.options.value = {
                confirmText: 'Confirmar',
                cancelText: 'Cancelar',
                type: 'warning',
                ...confirmOptions
            };
            globalConfirmState.resolvePromise = resolve;
            globalConfirmState.isVisible.value = true;
        });
    };
    const handleConfirm = () => {
        globalConfirmState.isVisible.value = false;
        if (globalConfirmState.resolvePromise) {
            globalConfirmState.resolvePromise(true);
            globalConfirmState.resolvePromise = null;
        }
    };
    const handleCancel = () => {
        globalConfirmState.isVisible.value = false;
        if (globalConfirmState.resolvePromise) {
            globalConfirmState.resolvePromise(false);
            globalConfirmState.resolvePromise = null;
        }
    };
    return {
        isVisible: globalConfirmState.isVisible,
        options: globalConfirmState.options,
        confirm,
        handleConfirm,
        handleCancel
    };
}
