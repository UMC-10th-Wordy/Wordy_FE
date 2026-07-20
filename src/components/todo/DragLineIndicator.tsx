import type { LineRect } from '@/utils/dragLineIndicator'

interface DragLineIndicatorProps {
  rect: LineRect
}

/* 드래그 드롭 위치를 나타내는 표시선 */
export function DragLineIndicator({ rect }: DragLineIndicatorProps) {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }}
      className="pointer-events-none z-40 rounded-full bg-(--color-border-brand-subtle)"
    />
  )
}
