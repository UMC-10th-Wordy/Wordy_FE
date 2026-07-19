import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ArrowLeftIcon from '@/assets/icons/Direction=left.svg?react'
import ArrowRightIcon from '@/assets/icons/Direction=right.svg?react'
import { IconButton } from '@/components/common/Button/IconButton'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { WEEKDAY_LABELS, getMonthGridDates, isSameDay } from '@/utils/calendar'

interface TagDatePickerProps {
  anchorRef: React.RefObject<HTMLElement | null>
  value: string
  onChange: (value: string) => void
  onClose: () => void
}

function parseDateString(s: string): Date | null {
  if (!s) return null
  const parts = s.split('.')
  if (parts.length < 3) return null
  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const day = parseInt(parts[2], 10)
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null
  return new Date(year, month, day)
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

const GAP = 10

export default function TagDatePicker({ anchorRef, value, onChange, onClose }: TagDatePickerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const parsed = parseDateString(value)
  const today = new Date()
  const [viewDate, setViewDate] = useState(
    () => new Date((parsed ?? today).getFullYear(), (parsed ?? today).getMonth(), 1),
  )
  useOutsideClick(ref, onClose, true, anchorRef)

  useLayoutEffect(() => {
    const calcPos = () => {
      if (!anchorRef.current || !ref.current) return
      const el = ref.current
      const anchor = anchorRef.current.getBoundingClientRect()
      const vh = window.innerHeight

      let scrollContainer: Element | null = anchorRef.current.parentElement
      while (scrollContainer) {
        const { overflowY } = getComputedStyle(scrollContainer)
        if (overflowY === 'scroll' || overflowY === 'auto') break
        scrollContainer = scrollContainer.parentElement
      }
      if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect()
        if (anchor.bottom < containerRect.top || anchor.top > containerRect.bottom) {
          el.style.visibility = 'hidden'
          return
        } else {
          el.style.visibility = 'visible'
        }
      }

      const pickerH = el.offsetHeight
      const pickerW = el.offsetWidth
      const vw = window.innerWidth

      const spaceBelow = vh - anchor.bottom
      const top = spaceBelow >= pickerH + GAP ? anchor.bottom + GAP : anchor.top - pickerH - GAP
      const left = Math.max(GAP, Math.min(anchor.left, vw - pickerW - GAP))

      el.style.top = `${top}px`
      el.style.left = `${left}px`
    }

    calcPos()
    const ro = new ResizeObserver(calcPos)
    if (ref.current) ro.observe(ref.current)
    window.addEventListener('scroll', calcPos, true)
    window.addEventListener('resize', calcPos)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', calcPos, true)
      window.removeEventListener('resize', calcPos)
    }
  }, [anchorRef, onClose])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const gridDates = getMonthGridDates(year, month)

  const handleSelect = (date: Date) => {
    onChange(formatDate(date))
    onClose()
  }

  return createPortal(
    <div
      ref={ref}
      className="fixed z-70 flex flex-col gap-4 rounded-(--scale-12) bg-(--color-bg-default) p-5 shadow-[0px_1px_7.5px_0px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-center justify-between">
        <p className="[font-size:var(--font-size-body-3)] font-semibold leading-(--line-height-body) text-(--color-text-default)">
          {year}년 {month + 1}월
        </p>
        <div className="flex items-center gap-1">
          <IconButton
            type="button"
            variant="text_neutral"
            size="small"
            aria-label="이전 달"
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            icon={<ArrowLeftIcon aria-hidden className="size-6" />}
          />
          <IconButton
            type="button"
            variant="text_neutral"
            size="small"
            aria-label="다음 달"
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            icon={<ArrowRightIcon aria-hidden className="size-6" />}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-7 gap-x-0.5 [font-size:var(--font-size-caption-1)] font-medium leading-(--line-height-body) text-(--color-text-tertiary)">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="flex h-5.25 size-10 items-center justify-center">
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-x-0.5 gap-y-2">
          {gridDates.map((date) => {
            const isCurrentMonth = date.getMonth() === month
            const isSelected = parsed ? isSameDay(date, parsed) : false
            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => handleSelect(date)}
                className={[
                  'flex size-10 items-center justify-center rounded-lg [font-size:var(--font-size-body-3)] leading-(--line-height-body)',
                  isSelected
                    ? 'bg-(--color-icon-brand) text-(--color-text-inverse) font-semibold'
                    : isCurrentMonth
                      ? 'text-(--color-text-default) hover:bg-(--color-chip-hover)'
                      : 'text-(--color-text-disabled)',
                ].join(' ')}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    </div>,
    document.body,
  )
}
