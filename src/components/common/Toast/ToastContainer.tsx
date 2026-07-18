import { Toast } from './Toast'
import type { ToastItem } from './useToast'

interface ToastContainerProps {
  toasts: ToastItem[]
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-3 items-end z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} exiting={toast.exiting} />
      ))}
    </div>
  )
}
