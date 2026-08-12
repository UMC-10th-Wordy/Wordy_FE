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
import { ApiError } from '@/api/tag/tag'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const TEMP_ACCESS_TOKEN = import.meta.env.DEV ? import.meta.env.VITE_TEMP_ACCESS_TOKEN : undefined

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const isFormData = options?.body instanceof FormData
  const accessToken = localStorage.getItem('accessToken') ?? TEMP_ACCESS_TOKEN
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options?.headers,
    },
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : { success: response.ok, result: null }

  if (!response.ok || !data.success) {
    throw new ApiError(data.message || `요청에 실패했습니다. (${response.status})`, response.status)
  }

  return data.result as T
}

export const taskQueryKeys = {
  all: (workspaceId: string) => ['tasks', workspaceId] as const,
  lists: (workspaceId: string) => [...taskQueryKeys.all(workspaceId), 'list'] as const,
  list: (workspaceId: string, date: string) => [...taskQueryKeys.lists(workspaceId), date] as const,
  calendars: (workspaceId: string) => [...taskQueryKeys.all(workspaceId), 'calendar'] as const,
  calendar: (workspaceId: string, year: number, month: number) =>
    [...taskQueryKeys.calendars(workspaceId), year, month] as const,
}

function withWorkspace(workspaceId: string, path: string): string {
  return `/workspaces/${encodeURIComponent(workspaceId)}${path}`
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
