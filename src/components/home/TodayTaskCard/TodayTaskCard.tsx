import type { HTMLAttributes } from 'react'
import { IconButton } from '@/components/common/Button/IconButton'
import ArrowRightIcon from '@/assets/icons/Property 1=top_right.svg?react'
import type { ProjectTagColor } from '@/components/todo/ProjectTag'

export type TaskPriority = 'must' | 'should' | 'could'

export interface TodayTask {
  id: string
  project?: string
  projectColor?: ProjectTagColor
  title: string
}

export interface TodayTaskCardProps extends HTMLAttributes<HTMLDivElement> {
  dateLabel: string
  tasks: TodayTask[]
  onNavigate?: () => void
}

const TAG_ROW_STYLE: Record<ProjectTagColor, string> = {
  black: 'border-l-2 border-(--color-tag-black-text) bg-(--color-tag-black-bg)',
  red: 'border-l-2 border-(--color-tag-red-text) bg-(--color-tag-red-bg)',
  orange: 'border-l-2 border-(--color-tag-orange-text) bg-(--color-tag-orange-bg)',
  yellow: 'border-l-2 border-(--color-tag-yellow-text) bg-(--color-tag-yellow-bg)',
  green: 'border-l-2 border-(--color-tag-green-text) bg-(--color-tag-green-bg)',
  blue: 'border-l-2 border-(--color-tag-blue-text) bg-(--color-tag-blue-bg)',
  navy: 'border-l-2 border-(--color-tag-navy-text) bg-(--color-tag-navy-bg)',
  pink: 'border-l-2 border-(--color-tag-pink-text) bg-(--color-tag-pink-bg)',
  brown: 'border-l-2 border-(--color-tag-brown-text) bg-(--color-tag-brown-bg)',
}

const TAG_TEXT_STYLE: Record<ProjectTagColor, string> = {
  black: 'text-(--color-tag-black-text)',
  red: 'text-(--color-tag-red-text)',
  orange: 'text-(--color-tag-orange-text)',
  yellow: 'text-(--color-tag-yellow-text)',
  green: 'text-(--color-tag-green-text)',
  blue: 'text-(--color-tag-blue-text)',
  navy: 'text-(--color-tag-navy-text)',
  pink: 'text-(--color-tag-pink-text)',
  brown: 'text-(--color-tag-brown-text)',
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
        'h-full min-h-0 overflow-hidden',
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
          size="medium"
          iconClassName="size-8"
          icon={<ArrowRightIcon />}
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
        <div className="flex flex-col gap-3">
          {tasks.slice(0, 3).map((task) => {
            const rowStyle = task.projectColor
              ? TAG_ROW_STYLE[task.projectColor]
              : 'border-l-2 border-(--color-border-light) bg-(--color-bg-secondary)'
            const projectTextStyle = task.projectColor
              ? TAG_TEXT_STYLE[task.projectColor]
              : 'text-(--color-text-tertiary)'
            return (
              <div
                key={task.id}
                className={[
                  'flex flex-col justify-center h-15 shrink-0 pl-4 pr-2 py-2 w-full',
                  rowStyle,
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
