import { useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'

/* 슬라이드 훅 */
export function useFlipAnimation(containerRef: RefObject<HTMLElement | null>, deps: unknown[]) {
  const prevRectsRef = useRef<Map<string, DOMRect>>(new Map())

  useLayoutEffect(() => {
    const container = containerRef.current
    const prevRects = prevRectsRef.current
    const nextRects = new Map<string, DOMRect>()

    if (container) {
      const elements = Array.from(container.querySelectorAll<HTMLElement>('[data-flip-id]'))

      elements.forEach((el) => {
        const id = el.dataset.flipId
        if (!id) return
        const newRect = el.getBoundingClientRect()
        nextRects.set(id, newRect)

        const oldRect = prevRects.get(id)
        if (!oldRect) return

        const deltaX = oldRect.left - newRect.left
        const deltaY = oldRect.top - newRect.top
        if (deltaX === 0 && deltaY === 0) return

        el.style.transition = 'none'
        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`
        el.getBoundingClientRect()

        requestAnimationFrame(() => {
          el.style.transition = 'transform 200ms ease'
          el.style.transform = ''
        })
      })
    }

    prevRectsRef.current = nextRects
  }, deps)
}
