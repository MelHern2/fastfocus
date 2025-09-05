import { ref } from 'vue'

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info'
}

// Estado global para el diálogo de confirmación
const globalConfirmState = {
  isVisible: ref(false),
  options: ref<ConfirmOptions>({
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'warning'
  }),
  resolvePromise: null as ((value: boolean) => void) | null
}

export function useConfirm() {
  const confirm = (confirmOptions: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      globalConfirmState.options.value = {
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        type: 'warning',
        ...confirmOptions
      }
      
      globalConfirmState.resolvePromise = resolve
      globalConfirmState.isVisible.value = true
    })
  }
  
  const handleConfirm = () => {
    globalConfirmState.isVisible.value = false
    if (globalConfirmState.resolvePromise) {
      globalConfirmState.resolvePromise(true)
      globalConfirmState.resolvePromise = null
    }
  }
  
  const handleCancel = () => {
    globalConfirmState.isVisible.value = false
    if (globalConfirmState.resolvePromise) {
      globalConfirmState.resolvePromise(false)
      globalConfirmState.resolvePromise = null
    }
  }
  
  return {
    isVisible: globalConfirmState.isVisible,
    options: globalConfirmState.options,
    confirm,
    handleConfirm,
    handleCancel
  }
}
