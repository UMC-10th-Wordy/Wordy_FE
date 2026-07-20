import type { HTMLAttributes } from 'react'
import ProjectTag from '@/components/todo/ProjectTag'
import type { ProjectTagColor } from '@/components/todo/ProjectTag'

export interface RecentRecordTask {
  id: string
  project?: string
  projectColor?: ProjectTagColor
  title: string
}

export interface RecentRecordCardProps extends HTMLAttributes<HTMLDivElement> {
  date: string
  totalCount: number
  tasks: RecentRecordTask[]
}

export function RecentRecordCard({
  date,
  totalCount,
  tasks,
  className,
  ...rest
}: RecentRecordCardProps) {
  return (
    <div
      className={[
        'flex flex-col gap-4 p-4 rounded-(--scale-16)',
        'border-[0.5px] border-(--color-border-brand-subtle)',
        'drop-shadow-[0px_1px_2.5px_rgba(0,0,0,0.1)]',
        'bg-(--color-bg-default) hover:bg-(--color-bg-secondary)',
        'transition-colors duration-100 cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-(--color-border-brand-subtle) pb-4 shrink-0 w-full whitespace-nowrap">
        <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-medium text-(--color-text-default)">
          {date}
        </span>
        <span className="[font-size:var(--font-size-caption-1)] leading-(--line-height-body) font-semibold text-(--color-text-tertiary)">
          전체 {totalCount}건
        </span>
      </div>

      {/* 업무 목록 */}
      <div className="flex flex-col gap-3.75">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-2.25 h-8.5 shrink-0 w-full">
            {task.project && (
              <ProjectTag label={task.project} color={task.projectColor ?? 'green'} />
            )}
            <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default) truncate min-w-0 flex-1">
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
