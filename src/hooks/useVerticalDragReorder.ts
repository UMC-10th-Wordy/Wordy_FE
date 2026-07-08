import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'

/* 태그 목록 움직이기(useDragReorder와 분리함) */
export interface VerticalDragOverInfo {
  itemId: string | null
  insertAfter: boolean
}

interface RowSnapshot {
  id: string
  top: number
  height: number
}

interface UseVerticalDragReorderOptions {
  onDrop: (draggedId: string, over: VerticalDragOverInfo) => void
}

const DRAG_START_THRESHOLD = 4

export function useVerticalDragReorder({ onDrop }: UseVerticalDragReorderOptions) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragHeight, setDragHeight] = useState(42)
  const [pointerY, setPointerY] = useState<number | null>(null)
  const [overInfo, setOverInfo] = useState<VerticalDragOverInfo>({
    itemId: null,
    insertAfter: false,
  })
  const overInfoRef = useRef(overInfo)
  const onDropRef = useRef(onDrop)
  useEffect(() => {
    overInfoRef.current = overInfo
    onDropRef.current = onDrop
  })
  const activeIdRef = useRef<string | null>(null)
  const rowsSnapshotRef = useRef<RowSnapshot[]>([])
  const startYRef = useRef<number | null>(null)
  const hasPassedThresholdRef = useRef(false)

  const startDrag = (id: string) => (event: ReactMouseEvent) => {
    event.preventDefault()

    const rowElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-vdrag-row="true"]'),
    )
    const draggedRow = rowElements.find((el) => el.dataset.vdragId === id)

    rowsSnapshotRef.current = rowElements
      .filter((el) => el.dataset.vdragId !== id)
      .map((el) => {
        const rect = el.getBoundingClientRect()
        return { id: el.dataset.vdragId ?? '', top: rect.top, height: rect.height }
      })

    const measuredHeight = draggedRow?.getBoundingClientRect().height
    setDragHeight(measuredHeight && measuredHeight > 0 ? measuredHeight : 42)
    setOverInfo({ itemId: null, insertAfter: false })
    startYRef.current = event.clientY
    hasPassedThresholdRef.current = false
    activeIdRef.current = id
    setSessionId(id)
  }

  useEffect(() => {
    if (!sessionId) return

    const handleMouseMove = (event: MouseEvent) => {
      if (!hasPassedThresholdRef.current) {
        const startY = startYRef.current
        if (startY !== null && Math.abs(event.clientY - startY) < DRAG_START_THRESHOLD) return
        hasPassedThresholdRef.current = true
        /* 임계값 통과 후 드래그 상태 켜기 - coderabbit수정 */
        setDraggingId(activeIdRef.current)
      }

      setPointerY(event.clientY)

      let closest: RowSnapshot | null = null
      let closestDistance = Infinity
      for (const row of rowsSnapshotRef.current) {
        const centerY = row.top + row.height / 2
        const distance = Math.abs(event.clientY - centerY)
        if (distance < closestDistance) {
          closestDistance = distance
          closest = row
        }
      }

      if (closest) {
        const isAfter = event.clientY > closest.top + closest.height / 2
        setOverInfo((prev) =>
          prev.itemId === closest.id && prev.insertAfter === isAfter
            ? prev
            : { itemId: closest.id, insertAfter: isAfter },
        )
      } else {
        setOverInfo((prev) => (prev.itemId === null ? prev : { itemId: null, insertAfter: false }))
      }
    }

    const handleMouseUp = () => {
      const finishedId = activeIdRef.current
      const finalOver = overInfoRef.current
      if (finishedId && hasPassedThresholdRef.current) {
        onDropRef.current(finishedId, finalOver)
      }
      setSessionId(null)
      setDraggingId(null)
      setOverInfo({ itemId: null, insertAfter: false })
      setPointerY(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [sessionId])

  return { draggingId, dragHeight, overInfo, pointerY, startDrag }
}
