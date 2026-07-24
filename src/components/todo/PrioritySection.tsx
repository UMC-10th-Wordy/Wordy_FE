import type { MouseEvent } from 'react'
import TaskCard from './TaskCard'
import { splitIntoColumns } from '@/utils/taskSection'
import type { Task, TaskDraftValues, TaskPriority, TaskResultValues } from '@/types/todo'

interface PrioritySectionProps {
  priorityKey: TaskPriority
  title: string
  description: string
  sectionTasks: Task[]
  draggingTask: Task | null
  startDrag: (id: string) => (event: MouseEvent<HTMLButtonElement>) => void
  isTaskExpanded: (id: string) => boolean
  onToggleTaskExpanded: (id: string) => void
  onDeleteTask: (id: string) => void
  onEditTask: (id: string, values: TaskDraftValues) => void
  onSaveResult: (id: string, values: TaskResultValues) => void
  onToggleComplete: (id: string) => void
}

/* 우선순위 섹션 (카드는 드래그 중에도 고정, 순서 변경은 드롭 시 반영) */
export function PrioritySection({
  priorityKey,
  title,
  description,
  sectionTasks,
  draggingTask,
  startDrag,
  isTaskExpanded,
  onToggleTaskExpanded,
  onDeleteTask,
  onEditTask,
  onSaveResult,
  onToggleComplete,
}: PrioritySectionProps) {
  const [leftColumn, rightColumn] = splitIntoColumns(sectionTasks)

  const renderEntry = (task: Task) => (
    <div
      key={task.id}
      data-flip-id={task.id}
      data-drag-row="true"
      data-drag-id={task.id}
      data-drag-section={task.priority}
      className={draggingTask?.id === task.id ? 'opacity-40' : ''}
    >
      <TaskCard
        task={task}
        isExpanded={isTaskExpanded(task.id)}
        onToggleExpanded={() => onToggleTaskExpanded(task.id)}
        onHandleMouseDown={startDrag(task.id)}
        onDelete={() => onDeleteTask(task.id)}
        onEdit={(values) => onEditTask(task.id, values)}
        onSaveResult={(values) => onSaveResult(task.id, values)}
        onToggleComplete={() => onToggleComplete(task.id)}
      />
    </div>
  )

  return (
    <div className="flex w-full flex-col gap-2" data-drag-section-outer={priorityKey}>
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
