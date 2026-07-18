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

  const addToast = useCallback((message: string) => {
    const id = ++idRef.current
    const prev = toastsRef.current

    if (prev.length >= 3) {
      const evictId = prev[0].id
      const next = [
        ...prev.map((t) => (t.id === evictId ? { ...t, exiting: true } : t)),
        { id, message },
      ]
      toastsRef.current = next
      setToasts(next)
      setTimeout(() => {
        setToasts((cur) => {
          const updated = cur.filter((t) => t.id !== evictId)
          toastsRef.current = updated
          return updated
        })
      }, 300)
    } else {
      const next = [...prev, { id, message }]
      toastsRef.current = next
      setToasts(next)
    }

    setTimeout(() => {
      setToasts((prev) => {
        const updated = prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
        toastsRef.current = updated
        return updated
      })
      setTimeout(() => {
        setToasts((prev) => {
          const updated = prev.filter((t) => t.id !== id)
          toastsRef.current = updated
          return updated
        })
      }, 300)
    }, 2000)
  }, [])

  return { toasts, addToast }
}
