import type { MouseEvent } from 'react'
import TaskCard from './TaskCard'
import { buildSectionPreview, splitIntoColumns, type PreviewEntry } from '@/utils/taskSection'
import type { DragOverInfo } from '@/hooks/useDragReorder'
import type { Task, TaskDraftValues, TaskPriority, TaskResultValues } from '@/types/todo'

interface PrioritySectionProps {
  priorityKey: TaskPriority
  title: string
  description: string
  sectionTasks: Task[]
  draggingTask: Task | null
  overInfo: DragOverInfo
  dragHeight: number
  startDrag: (id: string) => (event: MouseEvent<HTMLButtonElement>) => void
  onDeleteTask: (id: string) => void
  onEditTask: (id: string, values: TaskDraftValues) => void
  onSaveResult: (id: string, values: TaskResultValues) => void
  onToggleComplete: (id: string) => void
}

/* 우선순위 섹션 (+드래그 placeholder 렌더링) */
export function PrioritySection({
  priorityKey,
  title,
  description,
  sectionTasks,
  draggingTask,
  overInfo,
  dragHeight,
  startDrag,
  onDeleteTask,
  onEditTask,
  onSaveResult,
  onToggleComplete,
}: PrioritySectionProps) {
  const previewEntries = buildSectionPreview(sectionTasks, priorityKey, draggingTask, overInfo)
  const [leftColumn, rightColumn] = splitIntoColumns(previewEntries)

  const renderEntry = (entry: PreviewEntry) => {
    if (entry.kind === 'placeholder') {
      return (
        <div
          key="__placeholder__"
          data-flip-id="__placeholder__"
          style={{ height: dragHeight }}
          className="w-full shrink-0 rounded-lg bg-(--color-bg-tertiary)"
          aria-hidden
        />
      )
    }

    const { task } = entry
    return (
      <div
        key={task.id}
        data-flip-id={task.id}
        data-drag-row="true"
        data-drag-id={task.id}
        data-drag-section={task.priority}
      >
        <TaskCard
          task={task}
          onHandleMouseDown={startDrag(task.id)}
          onDelete={() => onDeleteTask(task.id)}
          onEdit={(values) => onEditTask(task.id, values)}
          onSaveResult={(values) => onSaveResult(task.id, values)}
          onToggleComplete={() => onToggleComplete(task.id)}
        />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div>
        <p className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-brand)">
          {title}
        </p>
        <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
          {description}
        </p>
      </div>
      <div className="flex w-full flex-wrap items-start gap-4">
        <div
          className="flex min-h-2 min-w-[718px] flex-1 flex-col gap-4"
          data-drag-section-drop={priorityKey}
        >
          {leftColumn.map(renderEntry)}
        </div>
        <div
          className="flex min-h-2 min-w-[718px] flex-1 flex-col gap-4"
          data-drag-section-drop={priorityKey}
        >
          {rightColumn.map(renderEntry)}
        </div>
      </div>
    </div>
  )
}
