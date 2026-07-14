import { Fragment } from 'react'
import type { HTMLAttributes } from 'react'

export type TaskPriority = 'must' | 'should' | 'could'

export interface WeeklyTask {
  id: string
  title: string
  priority: TaskPriority
}

export interface WeeklyDay {
  date: number
  day: string
  tasks: WeeklyTask[]
}

export interface WeeklyTaskRecordProps extends HTMLAttributes<HTMLDivElement> {
  days: WeeklyDay[]
}

const PRIORITY_BG: Record<TaskPriority, string> = {
  must: 'bg-[var(--primitive-primary-300)]',
  should: 'bg-[var(--primitive-secondary-300)]',
  could: 'bg-(--color-bg-tertiary)',
}

const LEGEND: { label: string; color: string }[] = [
  { label: 'Must do', color: 'bg-[var(--primitive-primary-300)]' },
  { label: 'Should do', color: 'bg-[var(--primitive-secondary-300)]' },
  { label: 'Could do', color: 'bg-(--color-bg-tertiary)' },
]

export function WeeklyTaskRecord({ days, className, ...rest }: WeeklyTaskRecordProps) {
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
          {LEGEND.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1">
              <span className={['size-3.5 rounded-full shrink-0', color].join(' ')} />
              <span className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-semibold text-(--color-text-tertiary) whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7일 */}
      <div className="flex flex-1 items-start min-h-0">
        {days.map((col, i) => (
          <Fragment key={col.date}>
            {i > 0 && (
              <div className="flex flex-col self-stretch shrink-0">
                <div className="shrink-0" style={{ height: 26 }} />
                <div className="flex-1 w-px bg-(--color-border-brand-subtle)" />
              </div>
            )}
            <div className="flex flex-1 flex-col gap-2 h-full items-start min-w-0 overflow-hidden px-3">
              {/* 날짜 헤더 */}
              <div className="flex gap-2 items-start shrink-0">
                <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-default) whitespace-nowrap">
                  {col.date}일
                </span>
                <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
                  {col.day}
                </span>
              </div>

              {/* 업무 칩 */}
              <div className="flex flex-col gap-1.25 w-full">
                {col.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={[
                      'flex items-center h-9.25 px-2 py-1 rounded-lg shrink-0 w-full',
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
          </Fragment>
        ))}
      </div>
    </div>
  )
}
