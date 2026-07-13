import ProjectTag from './ProjectTag'
import type { Task } from '@/types/todo'

interface DraggingTaskGhostProps {
  task: Task
  pointer: { x: number; y: number }
}

/* 드래그 중 커서를 따라다니는 업무 카드 미리보기 */
export function DraggingTaskGhost({ task, pointer }: DraggingTaskGhostProps) {
  return (
    <div
      style={{ position: 'fixed', top: pointer.y, left: pointer.x }}
      className="pointer-events-none z-50 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg border border-(--color-border-brand-subtle) bg-(--color-bg-default) px-4 py-3 opacity-90 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.2)]"
    >
      {task.tag && <ProjectTag label={task.tag.label} color={task.tag.color} />}
      <span className="max-w-[240px] truncate [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
        {task.title}
      </span>
    </div>
  )
}
