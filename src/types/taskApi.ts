import type { ApiEnvelope } from './tagApi'

export type ApiTaskPriority = 'MUST_DO' | 'SHOULD_DO' | 'COULD_DO'
export type ApiTaskStatus = 'IN_PROGRESS' | 'COMPLETED'

export interface TaskTagSummaryDto {
  tagId: string
  tagName: string
  color: string
  projectName: string
}

export interface TaskDto {
  taskId: string
  title: string
  priority: ApiTaskPriority
  memo: string
  status: ApiTaskStatus
  taskDate: string
  completedAt: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  userId: string
  tagId: string
  tag: TaskTagSummaryDto
}

export interface CreateTaskPayload {
  title: string
  priority: ApiTaskPriority
  taskDate: string
  tagId: string
  memo?: string
}

export type TaskListResponse = ApiEnvelope<TaskDto[]>
export type TaskDetailResponse = ApiEnvelope<TaskDto>
export type CreateTaskResponse = ApiEnvelope<TaskDto>
