import { TextButton } from '@/components/common/Button/TextButton'
import ProjectTag from '@/components/todo/ProjectTag'

import type { PerformanceIncompleteTask } from '@/types/performancePreviewResult'

interface PerformanceIncompleteTaskListProps {
  tasks: PerformanceIncompleteTask[]
  movedTaskIds: string[]
  onMoveToTomorrow: (taskId: string) => void
  readOnly?: boolean
}

export const PerformanceIncompleteTaskList = ({
  tasks,
  movedTaskIds,
  onMoveToTomorrow,
  readOnly = false,
}: PerformanceIncompleteTaskListProps) => {
  if (tasks.length === 0) {
    return null
  }

  return (
    <section className="flex w-full flex-col">
      <p className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-tertiary)">
        미완료 업무가 <span className="text-(--color-text-brand)">{tasks.length}건</span> 있어요
      </p>

      <div className="mt-(--scale-8) flex w-full flex-col gap-(--scale-12)">
        {tasks.map((task) => {
          const isMoved = movedTaskIds.includes(task.id)

          return (
            <div key={task.id} className="flex w-full items-start justify-between gap-[9px]">
              <div className="flex min-w-0 flex-1 items-start gap-[9px]">
                {task.tag && (
                  <div className="shrink-0">
                    <ProjectTag label={task.tag.label} color={task.tag.color} />
                  </div>
                )}

                <p className="min-w-0 flex-1 [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-semibold)] break-words text-(--color-text-default)">
                  {task.title}
                </p>
              </div>
              {!readOnly && (
                <TextButton
                  type="button"
                  variant="text_only"
                  size="small"
                  disabled={isMoved}
                  onClick={() => onMoveToTomorrow(task.id)}
                  className="h-(--scale-32) w-(--scale-64) shrink-0 px-(--scale-8) py-[5px] [font-size:var(--font-size-body-4)] font-[var(--font-weight-medium)] underline underline-offset-2 text-(--color-button-default) disabled:text-(--color-text-disabled) disabled:pointer-events-none"
                >
                  내일하기
                </TextButton>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
