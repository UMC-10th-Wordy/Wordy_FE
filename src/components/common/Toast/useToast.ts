import { useState, useRef, useCallback } from 'react'

export interface ToastItem {
  id: number
  message: string
  exiting?: boolean
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)
  const toastsRef = useRef<ToastItem[]>([])

  const update = useCallback((next: ToastItem[]) => {
    toastsRef.current = next
    setToasts(next)
  }, [])

  const addToast = useCallback(
    (message: string) => {
      const id = ++idRef.current
      const prev = toastsRef.current
      const activeToasts = prev.filter((t) => !t.exiting)

      if (activeToasts.length >= 3) {
        const evictId = activeToasts[0].id
        update([
          ...prev.map((t) => (t.id === evictId ? { ...t, exiting: true } : t)),
          { id, message },
        ])
        setTimeout(() => {
          update(toastsRef.current.filter((t) => t.id !== evictId))
        }, 300)
      } else {
        update([...prev, { id, message }])
      }

      setTimeout(() => {
        update(toastsRef.current.map((t) => (t.id === id ? { ...t, exiting: true } : t)))
        setTimeout(() => {
          update(toastsRef.current.filter((t) => t.id !== id))
        }, 300)
      }, 2000)
    },
    [update],
  )

  return { toasts, addToast }
}
