import type { Task, TaskPriority } from '@/types/todo'
import type {
  ApiTaskPriority,
  CreateTaskPayload,
  ReorderTasksPayload,
  TaskDto,
  UpdateTaskPayload,
} from '@/types/task'
import { hexToTagColor } from './tagMapper'

const PRIORITY_TO_API: Record<TaskPriority, ApiTaskPriority> = {
  must: 'MUST_DO',
  should: 'SHOULD_DO',
  could: 'COULD_DO',
}

export const PRIORITY_FROM_API: Record<ApiTaskPriority, TaskPriority> = {
  MUST_DO: 'must',
  SHOULD_DO: 'should',
  COULD_DO: 'could',
}

export function mapTaskDtoToTask(dto: TaskDto): Task {
  return {
    id: dto.taskId,
    date: dto.taskDate.slice(0, 10),
    title: dto.title,
    memo: dto.memo || undefined,
    tag: {
      id: dto.tag.tagId,
      label: dto.tag.tagName,
      color: hexToTagColor(dto.tag.color),
    },
    priority: PRIORITY_FROM_API[dto.priority],
    isCompleted: dto.status === 'COMPLETED',
  }
}

export interface NewTaskDraft {
  title: string
  priority: TaskPriority
  date: string
  tagId: string
  memo?: string
}

export function mapDraftToCreateTaskPayload(draft: NewTaskDraft): CreateTaskPayload {
  return {
    title: draft.title,
    priority: PRIORITY_TO_API[draft.priority],
    taskDate: draft.date,
    tagId: draft.tagId,
    memo: draft.memo,
  }
}

export interface UpdateTaskDraft {
  title: string
  priority: TaskPriority
  date: string
  tagId: string
  memo?: string
  isCompleted: boolean
}

export function mapDraftToUpdateTaskPayload(draft: UpdateTaskDraft): UpdateTaskPayload {
  return {
    title: draft.title,
    priority: PRIORITY_TO_API[draft.priority],
    status: draft.isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
    taskDate: draft.date,
    tagId: draft.tagId,
    memo: draft.memo,
  }
}

export function mapTasksToReorderPayload(tasks: Task[]): ReorderTasksPayload {
  const counters: Record<TaskPriority, number> = { must: 0, should: 0, could: 0 }
  const items = tasks
    .filter((task) => task.tag?.id)
    .map((task) => {
      const sortOrder = counters[task.priority]
      counters[task.priority] += 1
      return {
        taskId: task.id,
        priority: PRIORITY_TO_API[task.priority],
        sortOrder,
      }
    })
  return { tasks: items }
}
