import { useCallback, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export interface ToastQueueItem {
  id: string
  message: ReactNode
  isVisible: boolean
}

/* 노출 시간(2초) + 사라지는 모션 */
const TOAST_DURATION = 2000
const EXIT_DURATION = 200
/* 3개까지만 */
const MAX_TOASTS = 3

export function useToastQueue() {
  const [toasts, setToasts] = useState<ToastQueueItem[]>([])
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, isVisible: false } : toast)),
    )
    const exitTimer = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
      timersRef.current.delete(id)
    }, EXIT_DURATION)
    timersRef.current.set(id, exitTimer)
  }, [])

  const showToast = useCallback(
    (message: ReactNode) => {
      const id = crypto.randomUUID()

      setToasts((prev) => {
        const next = [...prev, { id, message, isVisible: false }]
        if (next.length <= MAX_TOASTS) return next

        /* 3개 초과 -> 교체 */
        const [oldest, ...rest] = next
        const oldestTimer = timersRef.current.get(oldest.id)
        if (oldestTimer) clearTimeout(oldestTimer)
        timersRef.current.delete(oldest.id)
        return rest
      })

      requestAnimationFrame(() => {
        setToasts((prev) =>
          prev.map((toast) => (toast.id === id ? { ...toast, isVisible: true } : toast)),
        )
      })

      const timer = setTimeout(() => dismiss(id), TOAST_DURATION)
      timersRef.current.set(id, timer)
    },
    [dismiss],
  )

  return { toasts, showToast }
}
