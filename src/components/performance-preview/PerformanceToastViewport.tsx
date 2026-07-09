import { Toast } from '@/components/common/Toast/Toast'

import type { PerformanceToast } from '@/types/performancePreviewResult'

interface PerformanceToastViewportProps {
  toasts: PerformanceToast[]
}

export const PerformanceToastViewport = ({ toasts }: PerformanceToastViewportProps) => {
  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="pointer-events-none fixed right-(--scale-24) bottom-(--scale-32) z-50 flex flex-col items-end gap-(--scale-12)">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} />
      ))}
    </div>
  )
}
