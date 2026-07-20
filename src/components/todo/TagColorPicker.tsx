import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import type { ProjectTagColor } from './ProjectTag'

export const COLOR_OPTIONS: { value: ProjectTagColor; label: string; bg: string }[] = [
  { value: 'black', label: '검정 (기본)', bg: 'bg-(--color-icon-secondary)' },
  { value: 'red', label: '빨강', bg: 'bg-(--color-tag-red-text)' },
  { value: 'orange', label: '주황', bg: 'bg-(--color-tag-orange-text)' },
  { value: 'yellow', label: '노랑', bg: 'bg-(--primitive-yellow-700)' },
  { value: 'green', label: '초록', bg: 'bg-(--color-tag-green-text)' },
  { value: 'blue', label: '파랑', bg: 'bg-(--color-tag-blue-text)' },
  { value: 'navy', label: '네이비', bg: 'bg-(--color-tag-navy-text)' },
  { value: 'pink', label: '핑크', bg: 'bg-(--color-tag-pink-text)' },
  { value: 'brown', label: '브라운', bg: 'bg-(--color-tag-brown-text)' },
]

interface TagColorPickerProps {
  anchorRef: React.RefObject<HTMLElement | null>
  value: ProjectTagColor
  onChange: (color: ProjectTagColor) => void
  onClose: () => void
}

const GAP = 12

export default function TagColorPicker({
  anchorRef,
  value,
  onChange,
  onClose,
}: TagColorPickerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useOutsideClick(ref, onClose, true, anchorRef)

  useLayoutEffect(() => {
    const calc = () => {
      if (!anchorRef.current || !ref.current) return
      const anchor = anchorRef.current.getBoundingClientRect()
      const pickerW = ref.current.offsetWidth
      const pickerH = ref.current.offsetHeight
      const vw = window.innerWidth
      const vh = window.innerHeight

      const spaceBelow = vh - anchor.bottom
      const top = spaceBelow >= pickerH + GAP ? anchor.bottom + GAP : anchor.top - pickerH - GAP

      const leftRaw = anchor.left - 20
      const left = Math.max(GAP, Math.min(leftRaw, vw - pickerW - GAP))

      setPos({ top, left })
    }
    calc()
    const ro = new ResizeObserver(calc)
    if (ref.current) ro.observe(ref.current)
    window.addEventListener('scroll', calc, true)
    window.addEventListener('resize', calc)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', calc, true)
      window.removeEventListener('resize', calc)
    }
  }, [anchorRef])

  return createPortal(
    <div
      ref={ref}
      style={{ top: pos.top, left: pos.left }}
      className="fixed z-70 w-48.5 rounded-(--scale-12) bg-(--color-bg-default) pb-5 pt-4 px-4 shadow-[0px_1px_15px_0px_rgba(0,0,0,0.1)]"
    >
      <p className="pb-1 pl-1 [font-size:var(--font-size-body-3)] font-semibold leading-(--line-height-body) text-(--color-text-tertiary)">
        태그 색상 선택
      </p>
      <div className="flex flex-col gap-1">
        {COLOR_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              onChange(opt.value)
              onClose()
            }}
            className={`flex h-10 w-full items-center gap-2 p-1 rounded-md transition-colors duration-100 ease-out hover:bg-(--color-bg-tertiary) ${value === opt.value ? 'bg-(--color-bg-tertiary)' : 'bg-(--color-bg-default)'}`}
          >
            <span className={`size-7 shrink-0 rounded-sm ${opt.bg}`} />
            <span className="[font-size:var(--font-size-body-2)] font-normal leading-(--line-height-body) text-(--color-text-secondary)">
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>,
    document.body,
  )
}
