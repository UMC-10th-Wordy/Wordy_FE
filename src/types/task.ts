import type { ApiEnvelope } from '@/types/api'

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
  sortOrder: number
  completedAt: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  userId: string
  tagId: string | null
  tag: TaskTagSummaryDto | null
  taskResult: TaskResultDto | null
}

export interface CreateTaskPayload {
  title: string
  priority: ApiTaskPriority
  taskDate: string
  tagId?: string | null
  status?: ApiTaskStatus
  memo?: string
}

export interface UpdateTaskPayload {
  title: string
  priority: ApiTaskPriority
  status: ApiTaskStatus
  taskDate: string
  tagId?: string | null
  memo?: string
}

export interface ReorderTaskItem {
  taskId: string
  priority: ApiTaskPriority
  sortOrder: number
}

export interface ReorderTasksPayload {
  tasks: ReorderTaskItem[]
}

export interface ReorderTasksResult {
  updatedCount: number
}

export interface MoveTaskToTomorrowPayload {
  taskDate: string
}

export type TaskResultAttachmentFileType = 'file' | 'img'

export interface TaskResultAttachmentDto {
  attachmentId: string
  fileType: TaskResultAttachmentFileType
  fileUrl: string
  fileName: string
}

export interface TaskResultDto {
  taskResultId: string
  taskId: string
  content: string
  attachments: TaskResultAttachmentDto[]
  createdAt: string
  updatedAt: string
}

export interface SaveTaskResultPayload {
  content: string
  removedAttachmentIds?: string[]
  files?: File[]
}

export type TaskListResponse = ApiEnvelope<TaskDto[]>
export type TaskDetailResponse = ApiEnvelope<TaskDto>
export type CreateTaskResponse = ApiEnvelope<TaskDto>
export type UpdateTaskResponse = ApiEnvelope<TaskDto>
export type DeleteTaskResponse = ApiEnvelope<null>
export type ReorderTasksResponse = ApiEnvelope<ReorderTasksResult>
export type SaveTaskResultResponse = ApiEnvelope<TaskResultDto>
