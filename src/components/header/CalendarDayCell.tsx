import type { CalendarDayStatus } from '@/utils/calendar'

interface CalendarDayCellProps {
  date: Date
  status: CalendarDayStatus
  isCurrentMonth: boolean
  isSelected: boolean
  onSelect: (date: Date) => void
}

export function CalendarDayCell({
  date,
  status,
  isCurrentMonth,
  isSelected,
  onSelect,
}: CalendarDayCellProps) {
  const squareClassName =
    status === 'all-done'
      ? isCurrentMonth
        ? 'bg-(--color-button-default) text-(--color-text-inverse)'
        : 'bg-(--color-border-light) text-(--color-text-inverse)'
      : status === 'has-incomplete'
        ? isCurrentMonth
          ? 'bg-(--color-chip-hover) text-(--color-text-default)'
          : 'bg-(--color-bg-disabled) text-(--color-text-disabled)'
        : isCurrentMonth
          ? 'bg-(--color-bg-default) text-(--color-text-default)'
          : 'bg-(--color-bg-default) text-(--color-text-disabled)'

  const borderClassName = isSelected
    ? isCurrentMonth
      ? 'border border-(--color-border-brand)'
      : 'border border-(--color-border-light)'
    : ''

  return (
    <div
      className={`flex items-center justify-center rounded-[11px] p-[3px] transition-colors duration-100 ease-out ${borderClassName} ${
        isCurrentMonth ? 'hover:bg-(--color-bg-brand-light)' : ''
      }`}
    >
      <button
        type="button"
        disabled={!isCurrentMonth}
        onClick={() => onSelect(date)}
        aria-label={`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`}
        aria-pressed={isSelected}
        className={`flex size-[40px] shrink-0 items-center justify-center rounded-(--scale-8) [font-size:var(--font-size-body-3)] leading-(--line-height-body) font-normal disabled:cursor-default ${squareClassName}`}
      >
        {date.getDate()}
      </button>
    </div>
  )
}
