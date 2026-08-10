import type { HTMLAttributes } from 'react'
import type { TaskPriority } from '@/components/home/TodayTaskCard/TodayTaskCard'

export interface WeeklyTask {
  id: string
  title: string
  priority: TaskPriority
}

export interface WeeklyDayCellProps extends HTMLAttributes<HTMLDivElement> {
  date: number
  day: string
  tasks: WeeklyTask[]
  hasRecord?: boolean
}

export const PRIORITY_BG: Record<TaskPriority, string> = {
  must: 'bg-[var(--primitive-primary-300)]',
  should: 'bg-[var(--primitive-secondary-300)]',
  could: 'bg-(--color-bg-tertiary)',
}

const MAX_TASKS = 4

export function WeeklyDayCell({
  date,
  day,
  tasks,
  hasRecord,
  className,
  ...rest
}: WeeklyDayCellProps) {
  return (
    <div
      className={[
        'group flex flex-1 flex-col gap-2 h-50 items-start min-w-0 overflow-hidden p-1',
        hasRecord ? 'cursor-pointer' : 'cursor-default',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {/* 날짜 헤더 */}
      <div className="flex gap-2 items-start shrink-0 px-1 w-full rounded-(--scale-4) transition-colors duration-100 ease-out group-hover:bg-(--color-bg-brand-subtle)">
        <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-default) whitespace-nowrap">
          {date}일
        </span>
        <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
          {day}
        </span>
      </div>

      {/* 업무 칩 */}
      <div className="flex flex-col gap-1.75 w-full px-1">
        {tasks.slice(0, MAX_TASKS).map((task) => (
          <div
            key={task.id}
            className={[
              'flex items-center h-8.5 px-2 py-1 rounded-lg shrink-0 w-full',
              PRIORITY_BG[task.priority],
            ].join(' ')}
          >
            <span className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-medium text-(--color-text-default) truncate">
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
