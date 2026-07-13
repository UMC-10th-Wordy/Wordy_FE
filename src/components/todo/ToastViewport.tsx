import { Toast } from '@/components/common/Toast/Toast'
import type { ToastQueueItem } from '@/hooks/useToastQueue'

interface ToastViewportProps {
  toasts: ToastQueueItem[]
}

/* 화면 고정된 위치에 쌓기 */
export function ToastViewport({ toasts }: ToastViewportProps) {
  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed right-10 bottom-10 z-50 flex flex-col items-end gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`transition-all duration-200 ease-out ${
            toast.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <Toast message={toast.message} />
        </div>
      ))}
    </div>
  )
}
