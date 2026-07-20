import { Toast } from './Toast'
import type { ToastItem } from './useToast'

interface ToastContainerProps {
  toasts: ToastItem[]
  align?: 'left' | 'right'
}

export function ToastContainer({ toasts, align = 'right' }: ToastContainerProps) {
  if (toasts.length === 0) return null

  const positionStyle = align === 'left' ? { left: 'calc(var(--sidebar-width) + 24px)' } : {}
  const positionClass = align === 'left' ? 'items-start' : 'right-6 items-end'

  return (
    <div
      className={`fixed bottom-8 flex flex-col gap-3 z-50 ${positionClass}`}
      style={positionStyle}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} exiting={toast.exiting} />
      ))}
    </div>
  )
}
