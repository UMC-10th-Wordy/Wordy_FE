import type { HTMLAttributes } from 'react'
import { IconButton } from '@/components/common/Button/IconButton'
import ArrowRightIcon from '@/assets/icons/Property 1=top_right.svg?react'

export type TaskPriority = 'must' | 'should' | 'could'

export interface TodayTask {
  id: string
  project?: string
  projectColor?: string
  priority?: TaskPriority
  title: string
}

export interface TodayTaskCardProps extends HTMLAttributes<HTMLDivElement> {
  dateLabel: string
  tasks: TodayTask[]
  onNavigate?: () => void
}

const PRIORITY_STYLE: Record<TaskPriority, string> = {
  must: 'border-l-2 border-(--color-tag-green-text) bg-(--color-tag-green-bg)',
  should: 'border-l-2 border-(--color-tag-yellow-text) bg-(--color-tag-yellow-bg)',
  could: 'border-l-2 border-(--color-border-light) bg-(--color-bg-secondary)',
}

const PRIORITY_TEXT_STYLE: Record<TaskPriority, string> = {
  must: 'text-(--color-tag-green-text)',
  should: 'text-(--color-tag-yellow-text)',
  could: 'text-(--color-text-tertiary)',
}

export function TodayTaskCard({
  dateLabel,
  tasks,
  onNavigate,
  className,
  ...rest
}: TodayTaskCardProps) {
  return (
    <div
      className={[
        'flex flex-col gap-4.75 p-5 rounded-(--scale-20)',
        'border-[0.5px] border-(--color-border-brand-subtle)',
        'shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]',
        'bg-(--color-bg-default)',
        'h-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between shrink-0 w-full">
        <div className="flex flex-col">
          <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
            오늘의 업무
          </span>
          <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
            {dateLabel}
          </span>
        </div>
        <IconButton
          variant="icon_only"
          size="small"
          icon={<ArrowRightIcon className="size-8" />}
          onClick={onNavigate}
          aria-label="오늘의 업무 이동"
        />
      </div>

      {/* 업무 목록 */}
      {tasks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
            오늘의 업무가 없어요
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1 min-h-0">
          {tasks.map((task) => {
            const priorityStyle = task.priority
              ? PRIORITY_STYLE[task.priority]
              : 'border-l-2 border-(--color-border-light) bg-(--color-bg-secondary)'
            const projectTextStyle = task.priority
              ? PRIORITY_TEXT_STYLE[task.priority]
              : 'text-(--color-text-tertiary)'
            return (
              <div
                key={task.id}
                className={[
                  'flex flex-col justify-center h-15.25 pl-4 pr-2 py-2 shrink-0 w-full',
                  priorityStyle,
                ].join(' ')}
              >
                {task.project && (
                  <span
                    className={[
                      '[font-size:var(--font-size-caption-1)] leading-(--line-height-body) font-semibold overflow-hidden text-ellipsis whitespace-nowrap',
                      projectTextStyle,
                    ].join(' ')}
                  >
                    {task.project}
                  </span>
                )}
                <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-default) truncate">
                  {task.title}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
