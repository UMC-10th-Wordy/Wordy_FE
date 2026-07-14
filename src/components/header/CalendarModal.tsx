import { useId, useState } from 'react'
import ArrowLeftIcon from '@/assets/icons/Direction=left.svg?react'
import ArrowRightIcon from '@/assets/icons/Direction=right.svg?react'
import { IconButton } from '@/components/common/Button/IconButton'
import { CalendarDayCell } from './CalendarDayCell'
import {
  WEEKDAY_LABELS,
  getCalendarDayStatus,
  getMonthGridDates,
  isSameDay,
} from '@/utils/calendar'
import type { Task } from '@/types/todo'

interface CalendarModalProps {
  selectedDate: Date
  tasks: Task[]
  onSelectDate: (date: Date) => void
}

export function CalendarModal({ selectedDate, tasks, onSelectDate }: CalendarModalProps) {
  const [viewDate, setViewDate] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  )
  const titleId = useId()
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const gridDates = getMonthGridDates(year, month)

  const goToPrevMonth = () =>
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  const goToNextMonth = () =>
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))

  return (
    <div
      role="dialog"
      aria-labelledby={titleId}
      className="absolute top-full right-[-12px] z-20 mt-4 flex w-[362px] flex-col gap-4 rounded-(--scale-12) bg-(--color-bg-default) p-5 shadow-[0px_1px_15px_0px_rgba(0,0,0,0.1)]"
    >
      <div className="flex w-full items-center justify-between">
        <p
          id={titleId}
          className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-semibold text-(--color-text-default)"
        >
          {year}년 {month + 1}월
        </p>
        <div className="flex items-center gap-1">
          <IconButton
            type="button"
            variant="text_neutral"
            size="small"
            aria-label="이전 달"
            onClick={goToPrevMonth}
            icon={<ArrowLeftIcon aria-hidden className="size-6" />}
          />
          <IconButton
            type="button"
            variant="text_neutral"
            size="small"
            aria-label="다음 달"
            onClick={goToNextMonth}
            icon={<ArrowRightIcon aria-hidden className="size-6" />}
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-[4px]">
        <div className="flex w-full items-center [font-size:var(--font-size-caption-1)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="flex h-[21px] w-[46px] shrink-0 flex-col justify-center text-center"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid w-full grid-cols-7 gap-y-[8px]">
          {gridDates.map((date) => (
            <CalendarDayCell
              key={date.toISOString()}
              date={date}
              status={getCalendarDayStatus(tasks, date)}
              isCurrentMonth={date.getMonth() === month}
              isSelected={isSameDay(date, selectedDate)}
              onSelect={onSelectDate}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
