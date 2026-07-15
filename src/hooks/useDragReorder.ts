import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { computeLineIndicator, type LineRect, type RowSnapshot } from '@/utils/dragLineIndicator'

export interface DragOverInfo {
  itemId: string | null
  insertAfter: boolean
  sectionKey: string | null
  line: LineRect | null
}

export interface DragPointer {
  x: number
  y: number
}

interface ColumnSnapshot {
  section: string
  rect: DOMRect
}

interface SectionBand {
  section: string
  top: number
  bottom: number
}

interface UseDragReorderOptions {
  onDrop: (draggedId: string, over: DragOverInfo) => void
}

const DRAG_START_THRESHOLD = 4
const EMPTY_OVER_INFO: DragOverInfo = {
  itemId: null,
  insertAfter: false,
  sectionKey: null,
  line: null,
}

function findSection(bands: SectionBand[], y: number): string | null {
  return bands.find((band) => y >= band.top && y < band.bottom)?.section ?? null
}

export function useDragReorder({ onDrop }: UseDragReorderOptions) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [pointer, setPointer] = useState<DragPointer | null>(null)
  const [overInfo, setOverInfo] = useState<DragOverInfo>(EMPTY_OVER_INFO)
  const overInfoRef = useRef(overInfo)
  const onDropRef = useRef(onDrop)
  useEffect(() => {
    overInfoRef.current = overInfo
    onDropRef.current = onDrop
  })
  const activeIdRef = useRef<string | null>(null)
  const rowsSnapshotRef = useRef<RowSnapshot[]>([])
  const columnsSnapshotRef = useRef<ColumnSnapshot[]>([])
  const sectionBandsRef = useRef<SectionBand[]>([])
  const lastPointerRef = useRef<DragPointer | null>(null)
  const startPointRef = useRef<DragPointer | null>(null)
  const hasPassedThresholdRef = useRef(false)

  const captureSnapshots = (excludeId: string) => {
    const rowElements = Array.from(document.querySelectorAll<HTMLElement>('[data-drag-row="true"]'))

    rowsSnapshotRef.current = rowElements
      .filter((el) => el.dataset.dragId !== excludeId)
      .map((el) => ({
        id: el.dataset.dragId ?? '',
        section: el.dataset.dragSection ?? '',
        rect: el.getBoundingClientRect(),
      }))

    columnsSnapshotRef.current = Array.from(
      document.querySelectorAll<HTMLElement>('[data-drag-section-drop]'),
    ).map((el) => ({
      section: el.dataset.dragSectionDrop ?? '',
      rect: el.getBoundingClientRect(),
    }))

    const sectionTops = Array.from(
      document.querySelectorAll<HTMLElement>('[data-drag-section-outer]'),
    )
      .map((el) => ({
        section: el.dataset.dragSectionOuter ?? '',
        top: el.getBoundingClientRect().top,
      }))
      .sort((a, b) => a.top - b.top)

    sectionBandsRef.current = sectionTops.map((entry, index) => ({
      section: entry.section,
      top: entry.top,
      bottom: sectionTops[index + 1]?.top ?? Infinity,
    }))
  }

  const evaluatePointer = (x: number, y: number) => {
    const sectionKey = findSection(sectionBandsRef.current, y)
    if (!sectionKey) {
      setOverInfo((prev) => (prev.sectionKey === null ? prev : EMPTY_OVER_INFO))
      return
    }

    const columnRects = columnsSnapshotRef.current
      .filter((s) => s.section === sectionKey)
      .map((s) => s.rect)
      .sort((a, b) => a.left - b.left)
    const rows = rowsSnapshotRef.current.filter((row) => row.section === sectionKey)

    const result = computeLineIndicator(rows, columnRects, x, y)
    setOverInfo({
      itemId: result.itemId,
      insertAfter: result.insertAfter,
      sectionKey,
      line: result.line,
    })
  }

  const startDrag = (id: string) => (event: ReactMouseEvent) => {
    event.preventDefault()

    captureSnapshots(id)

    setOverInfo(EMPTY_OVER_INFO)
    startPointRef.current = { x: event.clientX, y: event.clientY }
    lastPointerRef.current = { x: event.clientX, y: event.clientY }
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
        setDraggingId(activeIdRef.current)
      }

      lastPointerRef.current = { x: event.clientX, y: event.clientY }
      setPointer(lastPointerRef.current)
      evaluatePointer(event.clientX, event.clientY)
    }

    const handleScroll = () => {
      const id = activeIdRef.current
      const last = lastPointerRef.current
      if (!id || !last) return
      captureSnapshots(id)
      if (hasPassedThresholdRef.current) evaluatePointer(last.x, last.y)
    }

    const handleMouseUp = () => {
      const finishedId = activeIdRef.current
      const finalOver = overInfoRef.current
      if (finishedId && hasPassedThresholdRef.current && finalOver.sectionKey) {
        onDropRef.current(finishedId, finalOver)
      }
      setSessionId(null)
      setDraggingId(null)
      setOverInfo(EMPTY_OVER_INFO)
      setPointer(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [sessionId])

  return { draggingId, overInfo, pointer, startDrag }
}
