import ProjectTag from '@/components/todo/ProjectTag'
import { ResultAttachments } from '@/components/todo/ResultAttachments'

import type { Task } from '@/types/todo'

interface ReadOnlyTaskCardProps {
  task: Task
}

export const ReadOnlyTaskCard = ({ task }: ReadOnlyTaskCardProps) => {
  const hasResultFiles = (task.resultFiles?.length ?? 0) > 0
  const hasResultImages = (task.resultImages?.length ?? 0) > 0
  const hasAttachments = hasResultFiles || hasResultImages

  const hasResultContent = task.isCompleted && (Boolean(task.result?.trim()) || hasAttachments)

  return (
    <article className="flex w-full flex-col items-start gap-(--scale-16) rounded-(--scale-8) border-[0.5px] border-(--color-border-brand-subtle) bg-(--color-bg-default) p-(--scale-20) shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]">
      <div className="flex w-full min-w-0 items-start gap-[9px]">
        {task.tag && (
          <div className="shrink-0">
            <ProjectTag label={task.tag.label} color={task.tag.color} />
          </div>
        )}

        <p className="min-w-0 flex-1 [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-semibold)] break-words text-(--color-text-default)">
          {task.title}
        </p>
      </div>

      {task.memo && (
        <section className="flex w-full flex-col items-start gap-(--scale-4) pb-(--scale-8)">
          <p className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-tertiary)">
            메모
          </p>

          <p className="w-full [font-size:var(--font-size-body-3)] leading-(--line-height-body) font-[var(--font-weight-regular)] whitespace-pre-wrap text-(--color-text-secondary)">
            {task.memo}
          </p>
        </section>
      )}

      {hasResultContent && (
        <section className="flex w-full flex-col items-start gap-(--scale-16)">
          {task.result && (
            <div className="flex w-full flex-col items-start gap-(--scale-4)">
              <p className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-tertiary)">
                업무 결과
              </p>

              <p className="w-full [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-regular)] whitespace-pre-wrap text-(--color-text-default)">
                {task.result}
              </p>
            </div>
          )}

          {hasAttachments && (
            <ResultAttachments files={task.resultFiles ?? []} images={task.resultImages ?? []} />
          )}
        </section>
      )}
    </article>
  )
}
