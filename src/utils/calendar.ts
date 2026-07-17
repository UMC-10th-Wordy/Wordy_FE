import type { Task } from '@/types/todo'

export const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const

export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/* 주 단위(항상 7의 배수) */
export function getMonthGridDates(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1)
  const startOffset = firstOfMonth.getDay()
  const gridStart = new Date(year, month, 1 - startOffset)

  const lastOfMonth = new Date(year, month + 1, 0)
  const endOffset = 6 - lastOfMonth.getDay()
  const totalDays = startOffset + lastOfMonth.getDate() + endOffset

  return Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + i)
    return date
  })
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export type CalendarDayStatus = 'none' | 'all-done' | 'has-incomplete'

export function getCalendarDayStatus(tasks: Task[], date: Date): CalendarDayStatus {
  const dateKey = toDateKey(date)
  const tasksOnDate = tasks.filter((task) => task.date === dateKey)
  if (tasksOnDate.length === 0) return 'none'
  return tasksOnDate.every((task) => task.isCompleted) ? 'all-done' : 'has-incomplete'
}
