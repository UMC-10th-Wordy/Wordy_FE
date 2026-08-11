import { Fragment } from 'react'
import type { HTMLAttributes } from 'react'
import type { TaskPriority } from '@/components/home/TodayTaskCard/TodayTaskCard'
import { WeeklyDayCell, PRIORITY_BG } from '@/components/home/WeeklyDayCell/WeeklyDayCell'
import type { WeeklyTask } from '@/components/home/WeeklyDayCell/WeeklyDayCell'

export type { WeeklyTask }

export interface WeeklyDay {
  date: number
  day: string
  fullDate: string
  hasRecord: boolean
  tasks: WeeklyTask[]
}

export interface WeeklyTaskRecordProps extends HTMLAttributes<HTMLDivElement> {
  days: WeeklyDay[]
  onDayClick?: (fullDate: string) => void
}

const LEGEND: { label: string; priority: TaskPriority }[] = [
  { label: 'Must do', priority: 'must' },
  { label: 'Should do', priority: 'should' },
  { label: 'Could do', priority: 'could' },
]

export function WeeklyTaskRecord({ days, onDayClick, className, ...rest }: WeeklyTaskRecordProps) {
  return (
    <div
      className={[
        'flex flex-col gap-5 p-5 rounded-(--scale-20)',
        'border-[0.5px] border-(--color-border-brand-subtle)',
        'shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]',
        'bg-(--color-bg-default)',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between shrink-0 w-full">
        <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
          이번 주 업무 기록
        </span>
        <div className="flex items-center gap-2">
          {LEGEND.map(({ label, priority }) => (
            <div key={label} className="flex items-center gap-1">
              <span
                className={['size-3.75 rounded-full shrink-0', PRIORITY_BG[priority]].join(' ')}
              />
              <span className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-semibold text-(--color-text-tertiary) whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7일 */}
      <div className="flex flex-1 items-end min-h-0 gap-px">
        {days.map((col, i) => (
          <Fragment key={col.date}>
            {i > 0 && <div className="h-50 w-px bg-(--color-border-brand-subtle) shrink-0" />}
            <WeeklyDayCell
              date={col.date}
              day={col.day}
              tasks={col.tasks}
              hasRecord={col.hasRecord}
              onClick={col.hasRecord ? () => onDayClick?.(col.fullDate) : undefined}
            />
          </Fragment>
        ))}
      </div>
    </div>
  )
}
