import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'

export interface DragOverInfo {
  itemId: string | null
  insertAfter: boolean
  sectionKey: string | null
}

export interface DragPointer {
  x: number
  y: number
}

interface RowSnapshot {
  id: string
  section: string
  rect: DOMRect
}

interface SectionSnapshot {
  section: string
  rect: DOMRect
}

interface UseDragReorderOptions {
  onDrop: (draggedId: string, over: DragOverInfo) => void
}

const DRAG_START_THRESHOLD = 4

function findSection(sections: SectionSnapshot[], x: number, y: number): SectionSnapshot | null {
  let inside: SectionSnapshot | null = null
  let closest: SectionSnapshot | null = null
  let closestDistance = Infinity

  for (const section of sections) {
    const { rect } = section
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      inside = section
      break
    }
    if (x < rect.left || x > rect.right) continue
    const distance = y < rect.top ? rect.top - y : y - rect.bottom
    if (distance < closestDistance) {
      closestDistance = distance
      closest = section
    }
  }

  return inside ?? closest
}

function findClosestRowInSection(
  rows: RowSnapshot[],
  section: string,
  x: number,
  y: number,
): RowSnapshot | null {
  let inColumn: RowSnapshot | null = null
  let inColumnDistance = Infinity
  let any: RowSnapshot | null = null
  let anyDistance = Infinity

  for (const row of rows) {
    if (row.section !== section) continue
    const centerY = row.rect.top + row.rect.height / 2
    const distance = Math.abs(y - centerY)

    if (distance < anyDistance) {
      anyDistance = distance
      any = row
    }
    if (x >= row.rect.left && x <= row.rect.right && distance < inColumnDistance) {
      inColumnDistance = distance
      inColumn = row
    }
  }

  return inColumn ?? any
}

export function useDragReorder({ onDrop }: UseDragReorderOptions) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragHeight, setDragHeight] = useState(160)
  const [pointer, setPointer] = useState<DragPointer | null>(null)
  const [overInfo, setOverInfo] = useState<DragOverInfo>({
    itemId: null,
    insertAfter: false,
    sectionKey: null,
  })
  const overInfoRef = useRef(overInfo)
  const onDropRef = useRef(onDrop)
  useEffect(() => {
    overInfoRef.current = overInfo
    onDropRef.current = onDrop
  })
  const activeIdRef = useRef<string | null>(null)
  const rowsSnapshotRef = useRef<RowSnapshot[]>([])
  const sectionsSnapshotRef = useRef<SectionSnapshot[]>([])
  const startPointRef = useRef<DragPointer | null>(null)
  const hasPassedThresholdRef = useRef(false)

  const startDrag = (id: string) => (event: ReactMouseEvent) => {
    event.preventDefault()

    const rowElements = Array.from(document.querySelectorAll<HTMLElement>('[data-drag-row="true"]'))
    const draggedRow = rowElements.find((el) => el.dataset.dragId === id)

    rowsSnapshotRef.current = rowElements
      .filter((el) => el.dataset.dragId !== id)
      .map((el) => ({
        id: el.dataset.dragId ?? '',
        section: el.dataset.dragSection ?? '',
        rect: el.getBoundingClientRect(),
      }))

    sectionsSnapshotRef.current = Array.from(
      document.querySelectorAll<HTMLElement>('[data-drag-section-drop]'),
    ).map((el) => ({
      section: el.dataset.dragSectionDrop ?? '',
      rect: el.getBoundingClientRect(),
    }))

    const measuredHeight = draggedRow?.getBoundingClientRect().height
    setDragHeight(measuredHeight && measuredHeight > 0 ? measuredHeight : 160)
    setOverInfo({ itemId: null, insertAfter: false, sectionKey: null })
    startPointRef.current = { x: event.clientX, y: event.clientY }
    hasPassedThresholdRef.current = false
    activeIdRef.current = id
    setSessionId(id)
  }

  useEffect(() => {
    if (!sessionId) return

    const handleMouseMove = (event: MouseEvent) => {
      if (!hasPassedThresholdRef.current) {
        const start = startPointRef.current
        if (start) {
          const dx = event.clientX - start.x
          const dy = event.clientY - start.y
          if (Math.hypot(dx, dy) < DRAG_START_THRESHOLD) return
        }
        hasPassedThresholdRef.current = true
        /* 임계값 통과 후 드래그 상태 켜기 - coderabbit수정 */
        setDraggingId(activeIdRef.current)
      }

      setPointer({ x: event.clientX, y: event.clientY })

      const section = findSection(sectionsSnapshotRef.current, event.clientX, event.clientY)
      if (!section) {
        setOverInfo((prev) =>
          prev.itemId === null && prev.sectionKey === null
            ? prev
            : { itemId: null, insertAfter: false, sectionKey: null },
        )
        return
      }

      const closestRow = findClosestRowInSection(
        rowsSnapshotRef.current,
        section.section,
        event.clientX,
        event.clientY,
      )

      if (closestRow) {
        const isAfter = event.clientY > closestRow.rect.top + closestRow.rect.height / 2
        setOverInfo((prev) =>
          prev.itemId === closestRow.id &&
          prev.sectionKey === closestRow.section &&
          prev.insertAfter === isAfter
            ? prev
            : { itemId: closestRow.id, insertAfter: isAfter, sectionKey: closestRow.section },
        )
        return
      }

      setOverInfo((prev) =>
        prev.itemId === null && prev.sectionKey === section.section
          ? prev
          : { itemId: null, insertAfter: false, sectionKey: section.section },
      )
    }

    const handleMouseUp = () => {
      const finishedId = activeIdRef.current
      const finalOver = overInfoRef.current
      if (finishedId && hasPassedThresholdRef.current && finalOver.sectionKey) {
        onDropRef.current(finishedId, finalOver)
      }
      setSessionId(null)
      setDraggingId(null)
      setOverInfo({ itemId: null, insertAfter: false, sectionKey: null })
      setPointer(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [sessionId])

  return { draggingId, dragHeight, overInfo, pointer, startDrag }
}
