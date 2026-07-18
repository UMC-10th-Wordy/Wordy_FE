import { useRef, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import ScrollbarUpIcon from '@/assets/icons/scrollbar-up.svg?react'
import ScrollbarDownIcon from '@/assets/icons/scrollbar-down.svg?react'

export interface ScrollbarProps {
  children: ReactNode
  className?: string
}

export function Scrollbar({ children, className }: ScrollbarProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const [thumbHeight, setThumbHeight] = useState(0)
  const [thumbTop, setThumbTop] = useState(0)
  const [isScrollable, setIsScrollable] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [thumbState, setThumbState] = useState<'default' | 'hover' | 'pressed'>('default')

  const dragStartY = useRef(0)
  const dragStartScrollTop = useRef(0)
  const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const updateThumb = useCallback(() => {
    const el = contentRef.current
    const track = trackRef.current
    if (!el || !track) return

    const { scrollHeight, clientHeight, scrollTop } = el
    const trackHeight = track.clientHeight
    const ratio = clientHeight / scrollHeight
    const newThumbHeight = Math.min(Math.max(trackHeight * ratio, 32), trackHeight)
    const maxScroll = scrollHeight - clientHeight
    const maxThumbTop = trackHeight - newThumbHeight
    const newThumbTop = maxScroll > 0 && maxThumbTop > 0 ? (scrollTop / maxScroll) * maxThumbTop : 0

    setIsScrollable(scrollHeight > clientHeight)
    setThumbHeight(newThumbHeight)
    setThumbTop(newThumbTop)
  }, [])

  useEffect(() => {
    const el = contentRef.current
    const track = trackRef.current
    if (!el) return
    updateThumb()
    el.addEventListener('scroll', updateThumb)
    const ro = new ResizeObserver(updateThumb)
    ro.observe(el)
    if (track) ro.observe(track)
    if (innerRef.current) ro.observe(innerRef.current)
    return () => {
      el.removeEventListener('scroll', updateThumb)
      ro.disconnect()
    }
  }, [updateThumb])

  const scrollBy = useCallback((amount: number) => {
    contentRef.current?.scrollBy({ top: amount })
  }, [])

  const stopScrollInterval = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
      scrollIntervalRef.current = null
    }
  }, [])

  const startScrollInterval = useCallback(
    (amount: number) => {
      stopScrollInterval()
      scrollBy(amount)
      scrollIntervalRef.current = setInterval(() => scrollBy(amount), 100)
    },
    [scrollBy, stopScrollInterval],
  )

  useEffect(() => {
    return () => stopScrollInterval()
  }, [stopScrollInterval])

  const handleThumbMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setThumbState('pressed')
    dragStartY.current = e.clientY
    dragStartScrollTop.current = contentRef.current?.scrollTop ?? 0
  }, [])

  useEffect(() => {
    if (!isDragging) return

    const onMouseMove = (e: MouseEvent) => {
      const el = contentRef.current
      const track = trackRef.current
      if (!el || !track) return

      const delta = e.clientY - dragStartY.current
      const { scrollHeight, clientHeight } = el
      const trackHeight = track.clientHeight
      const thumbRange = trackHeight - thumbHeight
      if (thumbRange <= 0) return
      const scrollRatio = (scrollHeight - clientHeight) / thumbRange
      el.scrollTop = dragStartScrollTop.current + delta * scrollRatio
    }

    const onMouseUp = () => {
      setIsDragging(false)
      setThumbState('default')
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging, thumbHeight])

  const thumbColor =
    thumbState === 'pressed' || thumbState === 'hover'
      ? 'bg-(--color-icon-secondary)'
      : 'bg-(--color-icon-tertiary)'

  return (
    <div className={['flex gap-2 min-h-0 flex-1 w-full', className].filter(Boolean).join(' ')}>
      {/* 스크롤 콘텐츠 */}
      <div
        ref={contentRef}
        className="flex flex-col flex-1 min-w-0 overflow-y-scroll scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        <div ref={innerRef}>{children}</div>
      </div>

      {/* 커스텀 스크롤바 — 항상 렌더, 스크롤 불가 시 invisible */}
      <div
        className={[
          'flex flex-col items-center shrink-0 h-full',
          isScrollable ? '' : 'invisible',
        ].join(' ')}
      >
        {/* 위 버튼 */}
        <button
          type="button"
          className="shrink-0 flex items-center justify-center text-(--color-icon-tertiary) hover:text-(--color-icon-secondary) cursor-pointer transition-colors duration-100 ease-out"
          onMouseDown={() => startScrollInterval(-24)}
          onMouseUp={stopScrollInterval}
          onMouseLeave={stopScrollInterval}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && scrollBy(-24)}
          aria-label="위로 스크롤"
        >
          <ScrollbarUpIcon />
        </button>

        {/* 트랙 */}
        <div ref={trackRef} className="flex-1 relative flex items-start justify-center w-2 my-1">
          <div
            ref={thumbRef}
            className={[
              'absolute w-2 rounded-full cursor-pointer transition-colors duration-100 ease-out',
              thumbColor,
            ].join(' ')}
            style={{ height: thumbHeight, top: thumbTop }}
            onMouseDown={handleThumbMouseDown}
            onMouseEnter={() => !isDragging && setThumbState('hover')}
            onMouseLeave={() => !isDragging && setThumbState('default')}
          />
        </div>

        {/* 아래 버튼 */}
        <button
          type="button"
          className="shrink-0 flex items-center justify-center text-(--color-icon-tertiary) hover:text-(--color-icon-secondary) cursor-pointer transition-colors duration-100 ease-out"
          onMouseDown={() => startScrollInterval(24)}
          onMouseUp={stopScrollInterval}
          onMouseLeave={stopScrollInterval}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && scrollBy(24)}
          aria-label="아래로 스크롤"
        >
          <ScrollbarDownIcon />
        </button>
      </div>
    </div>
  )
}
