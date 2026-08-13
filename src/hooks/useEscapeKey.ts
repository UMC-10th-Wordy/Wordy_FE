import { useEffect, useId, useRef } from 'react'

/* 중첩된 모달/오버레이 중 가장 나중에 마운트된(최상단) 것만 Escape를 처리하도록 하는 스택 */
const escapeStack: string[] = []

/* 모달/오버레이 닫기용 공용 훅 */
export function useEscapeKey(onEscape: () => void) {
  const id = useId()
  const onEscapeRef = useRef(onEscape)

  useEffect(() => {
    onEscapeRef.current = onEscape
  })

  useEffect(() => {
    escapeStack.push(id)
    return () => {
      const index = escapeStack.indexOf(id)
      if (index !== -1) escapeStack.splice(index, 1)
    }
  }, [id])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (escapeStack[escapeStack.length - 1] !== id) return
      onEscapeRef.current()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [id])
}
