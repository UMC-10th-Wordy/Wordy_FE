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
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragHeight, setDragHeight] = useState(42)
  const [pointerY, setPointerY] = useState<number | null>(null)
  const [overInfo, setOverInfo] = useState<VerticalDragOverInfo>({
    itemId: null,
    insertAfter: false,
  })
  const overInfoRef = useRef(overInfo)
  const draggingIdRef = useRef<string | null>(null)
  useEffect(() => {
    overInfoRef.current = overInfo
    draggingIdRef.current = draggingId
  })
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
    setPointerY(event.clientY)
    startYRef.current = event.clientY
    hasPassedThresholdRef.current = false
    setDraggingId(id)
  }

  useEffect(() => {
    if (!draggingId) return

    const handleMouseMove = (event: MouseEvent) => {
      setPointerY(event.clientY)

      if (!hasPassedThresholdRef.current) {
        const startY = startYRef.current
        if (startY !== null && Math.abs(event.clientY - startY) < DRAG_START_THRESHOLD) return
        hasPassedThresholdRef.current = true
      }

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
      const finishedId = draggingIdRef.current
      const finalOver = overInfoRef.current
      if (finishedId && hasPassedThresholdRef.current) {
        onDrop(finishedId, finalOver)
      }
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
  }, [draggingId, onDrop])

  return { draggingId, dragHeight, overInfo, pointerY, startDrag }
}
