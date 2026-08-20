import type {
  CreateTaskPayload,
  ReorderTasksPayload,
  ReorderTasksResult,
  SaveTaskResultPayload,
  TaskCalendarEntryDto,
  TaskDto,
  TaskResultDto,
  UpdateTaskPayload,
  MoveTaskToTomorrowPayload,
} from '@/types/task'
import { ApiError, request, withWorkspace } from '@/lib/httpClient'

export const taskQueryKeys = {
  all: (workspaceId: string) => ['tasks', workspaceId] as const,
  lists: (workspaceId: string) => [...taskQueryKeys.all(workspaceId), 'list'] as const,
  list: (workspaceId: string, date: string) => [...taskQueryKeys.lists(workspaceId), date] as const,
  calendars: (workspaceId: string) => [...taskQueryKeys.all(workspaceId), 'calendar'] as const,
  calendar: (workspaceId: string, year: number, month: number) =>
    [...taskQueryKeys.calendars(workspaceId), year, month] as const,
}

export const moveTaskToTomorrow = async (
  workspaceId: string,
  taskId: string,
  payload: MoveTaskToTomorrowPayload,
): Promise<TaskDto> => {
  return request<TaskDto>(withWorkspace(workspaceId, `/tasks/${encodeURIComponent(taskId)}`), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function getTasks(workspaceId: string, date: string): Promise<TaskDto[]> {
  return request<TaskDto[]>(withWorkspace(workspaceId, `/tasks?date=${encodeURIComponent(date)}`))
}

export async function getTasksCalendar(
  workspaceId: string,
  startDate: string,
  endDate: string,
): Promise<TaskCalendarEntryDto[]> {
  const searchParams = new URLSearchParams({ startDate, endDate })
  return request<TaskCalendarEntryDto[]>(
    withWorkspace(workspaceId, `/tasks/calendar?${searchParams.toString()}`),
  )
}

export async function getTaskDetail(workspaceId: string, taskId: string): Promise<TaskDto | null> {
  try {
    return await request<TaskDto>(
      withWorkspace(workspaceId, `/tasks/${encodeURIComponent(taskId)}`),
    )
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

export async function createTask(
  workspaceId: string,
  payload: CreateTaskPayload,
): Promise<TaskDto> {
  return request<TaskDto>(withWorkspace(workspaceId, '/tasks'), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateTask(
  workspaceId: string,
  taskId: string,
  payload: UpdateTaskPayload,
): Promise<TaskDto> {
  return request<TaskDto>(withWorkspace(workspaceId, `/tasks/${encodeURIComponent(taskId)}`), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteTask(workspaceId: string, taskId: string): Promise<void> {
  await request<null>(withWorkspace(workspaceId, `/tasks/${encodeURIComponent(taskId)}`), {
    method: 'DELETE',
  })
}

export async function reorderTasks(
  workspaceId: string,
  payload: ReorderTasksPayload,
): Promise<ReorderTasksResult> {
  return request<ReorderTasksResult>(withWorkspace(workspaceId, '/tasks/reorder'), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function saveTaskResult(
  workspaceId: string,
  taskId: string,
  payload: SaveTaskResultPayload,
): Promise<TaskResultDto> {
  const formData = new FormData()
  formData.append('content', payload.content)
  if (payload.removedAttachmentIds && payload.removedAttachmentIds.length > 0) {
    formData.append('removedAttachmentIds', JSON.stringify(payload.removedAttachmentIds))
  }
  payload.files?.forEach((file) => formData.append('files', file))

  return request<TaskResultDto>(
    withWorkspace(workspaceId, `/tasks/${encodeURIComponent(taskId)}/result`),
    {
      method: 'PUT',
      body: formData,
    },
  )
}
