import { useState, useRef, useCallback } from 'react'

export interface ToastItem {
  id: number
  message: string
  exiting?: boolean
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const addToast = useCallback((message: string) => {
    const id = ++idRef.current

    setToasts((prev) => {
      if (prev.length >= 3) {
        const oldestId = prev[0].id
        setTimeout(() => {
          setToasts((cur) => cur.filter((t) => t.id !== oldestId))
        }, 300)
        return [
          ...prev.map((t) => (t.id === oldestId ? { ...t, exiting: true } : t)),
          { id, message },
        ]
      }
      return [...prev, { id, message }]
    })

    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)))
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 300)
    }, 2000)
  }, [])

  return { toasts, addToast }
}
