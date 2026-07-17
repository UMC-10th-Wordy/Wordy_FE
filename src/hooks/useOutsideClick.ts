import { useEffect } from 'react'
import type { RefObject } from 'react'

/* 모달 바깥 클릭 시 닫히게 */
export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  onOutsideClick: () => void,
  enabled: boolean,
  excludeRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!enabled) return

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (excludeRef?.current?.contains(target)) return
      if (ref.current && !ref.current.contains(target)) {
        onOutsideClick()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [ref, onOutsideClick, enabled, excludeRef])
}
