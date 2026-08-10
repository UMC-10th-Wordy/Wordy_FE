import { Toast } from './Toast'
import type { ToastItem } from '@/hooks/useToast'

interface ToastContainerProps {
  toasts: ToastItem[]
  align?: 'left' | 'right'
  /** true면 최근 위치한 조상 요소 기준으로 표시돼요 (뷰포트 전체가 아닌 해당 영역 안에서 표시할 때 사용) */
  contained?: boolean
}

export function ToastContainer({
  toasts,
  align = 'right',
  contained = false,
}: ToastContainerProps) {
  if (toasts.length === 0) return null

  const positionStyle =
    !contained && align === 'left' ? { left: 'calc(var(--sidebar-width) + 24px)' } : {}
  const positionClass =
    align === 'left' ? (contained ? 'left-6 items-start' : 'items-start') : 'right-6 items-end'

  return (
    <div
      className={`${contained ? 'absolute' : 'fixed'} bottom-8 flex flex-col gap-3 z-50 ${positionClass}`}
      style={positionStyle}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} exiting={toast.exiting} />
      ))}
    </div>
  )
}
