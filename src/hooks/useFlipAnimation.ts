import { useEffect, useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'

const TRANSITION_DURATION_MS = 320
const STAGGER_STEP_MS = 15
const MAX_STAGGER_MS = 150

/* 슬라이드 훅 */
export function useFlipAnimation(containerRef: RefObject<HTMLElement | null>, deps: unknown[]) {
  const prevRectsRef = useRef<Map<string, DOMRect>>(new Map())
  const pendingFramesRef = useRef<Map<string, number>>(new Map())
  const lastContainerRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const pendingFrames = pendingFramesRef.current

    if (container !== lastContainerRef.current) {
      pendingFrames.forEach((frameId) => cancelAnimationFrame(frameId))
      pendingFrames.clear()
      prevRectsRef.current = new Map()
      lastContainerRef.current = container
    }

    const prevRects = prevRectsRef.current
    const nextRects = new Map<string, DOMRect>()

    if (container) {
      const elements = Array.from(container.querySelectorAll<HTMLElement>('[data-flip-id]'))

      elements.forEach((el, index) => {
        const id = el.dataset.flipId
        if (!id) return

        const pendingFrame = pendingFrames.get(id)
        if (pendingFrame !== undefined) {
          cancelAnimationFrame(pendingFrame)
          pendingFrames.delete(id)
        }
        el.style.transition = 'none'
        el.style.transform = ''

        const newRect = el.getBoundingClientRect()
        nextRects.set(id, newRect)

        const oldRect = prevRects.get(id)
        if (!oldRect) return

        const deltaX = oldRect.left - newRect.left
        const deltaY = oldRect.top - newRect.top
        if (deltaX === 0 && deltaY === 0) return

        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`
        el.getBoundingClientRect()

        const delayMs = Math.min(index * STAGGER_STEP_MS, MAX_STAGGER_MS)
        const frameId = requestAnimationFrame(() => {
          el.style.transition = `transform ${TRANSITION_DURATION_MS}ms ease-out ${delayMs}ms`
          el.style.transform = ''
          pendingFrames.delete(id)
        })
        pendingFrames.set(id, frameId)
      })
    }

    prevRectsRef.current = nextRects
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps는 호출부에서 전달하는 의도된 동적 배열
  }, deps)

  useEffect(() => {
    const pendingFrames = pendingFramesRef.current
    return () => {
      pendingFrames.forEach((frameId) => cancelAnimationFrame(frameId))
      pendingFrames.clear()
    }
  }, [])
}
