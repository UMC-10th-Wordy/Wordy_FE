import type { Task, TaskPriority } from '@/types/todo'
import type { ApiTaskPriority, CreateTaskPayload, TaskDto } from '@/types/taskApi'
import { hexToTagColor } from './tagMapper'

const PRIORITY_TO_API: Record<TaskPriority, ApiTaskPriority> = {
  must: 'MUST_DO',
  should: 'SHOULD_DO',
  could: 'COULD_DO',
}

const PRIORITY_FROM_API: Record<ApiTaskPriority, TaskPriority> = {
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
