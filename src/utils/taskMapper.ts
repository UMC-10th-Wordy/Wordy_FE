import type { Task, TaskPriority, TaskResultFile, TaskResultImage } from '@/types/todo'
import type {
  ApiTaskPriority,
  CreateTaskPayload,
  ReorderTasksPayload,
  TaskDto,
  TaskResultDto,
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
  const resultValues = dto.taskResult ? mapTaskResultDtoToValues(dto.taskResult) : null

  return {
    id: dto.taskId,
    date: dto.taskDate.slice(0, 10),
    title: dto.title,
    memo: dto.memo || undefined,
    tag: dto.tag
      ? {
          id: dto.tag.tagId,
          label: dto.tag.tagName,
          color: hexToTagColor(dto.tag.color),
        }
      : undefined,
    priority: PRIORITY_FROM_API[dto.priority],
    isCompleted: dto.status === 'COMPLETED',
    taskResultId: resultValues?.taskResultId,
    result: resultValues?.result,
    resultFiles: resultValues?.resultFiles,
    resultImages: resultValues?.resultImages,
  }
}

export interface NewTaskDraft {
  title: string
  priority: TaskPriority
  date: string
  tagId?: string | null
  memo?: string
  isCompleted?: boolean
}

export function mapDraftToCreateTaskPayload(draft: NewTaskDraft): CreateTaskPayload {
  return {
    title: draft.title,
    priority: PRIORITY_TO_API[draft.priority],
    taskDate: draft.date,
    tagId: draft.tagId ?? null,
    status: draft.isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
    memo: draft.memo,
  }
}

export interface UpdateTaskDraft {
  title: string
  priority: TaskPriority
  date: string
  tagId?: string | null
  memo?: string
  isCompleted: boolean
}

export function mapDraftToUpdateTaskPayload(draft: UpdateTaskDraft): UpdateTaskPayload {
  return {
    title: draft.title,
    priority: PRIORITY_TO_API[draft.priority],
    status: draft.isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
    taskDate: draft.date,
    tagId: draft.tagId ?? null,
    memo: draft.memo,
  }
}

export interface TaskResultDtoMapped {
  taskResultId: string
  result: string
  resultFiles: TaskResultFile[]
  resultImages: TaskResultImage[]
}

export function mapTaskResultDtoToValues(dto: TaskResultDto): TaskResultDtoMapped {
  const resultFiles: TaskResultFile[] = []
  const resultImages: TaskResultImage[] = []

  dto.attachments.forEach((attachment) => {
    const item = {
      id: attachment.attachmentId,
      name: attachment.fileName,
      url: attachment.fileUrl,
      attachmentId: attachment.attachmentId,
    }
    if (attachment.fileType === 'img') {
      resultImages.push(item)
    } else {
      resultFiles.push(item)
    }
  })

  return {
    taskResultId: dto.taskResultId,
    result: dto.content,
    resultFiles,
    resultImages,
  }
}

export function mapTasksToReorderPayload(tasks: Task[]): ReorderTasksPayload {
  const counters: Record<TaskPriority, number> = { must: 0, should: 0, could: 0 }
  const items = tasks.map((task) => {
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
