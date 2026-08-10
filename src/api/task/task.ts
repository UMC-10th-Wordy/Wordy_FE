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
  all: ['tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  list: (date: string) => [...taskQueryKeys.lists(), date] as const,
  calendars: () => [...taskQueryKeys.all, 'calendar'] as const,
  calendar: (year: number, month: number) => [...taskQueryKeys.calendars(), year, month] as const,
}

export const moveTaskToTomorrow = async (
  taskId: string,
  payload: MoveTaskToTomorrowPayload,
): Promise<TaskDto> => {
  return request<TaskDto>(`/tasks/${encodeURIComponent(taskId)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function getTasks(date: string): Promise<TaskDto[]> {
  return request<TaskDto[]>(`/tasks?date=${encodeURIComponent(date)}`)
}

export async function getTasksCalendar(
  startDate: string,
  endDate: string,
): Promise<TaskCalendarEntryDto[]> {
  const searchParams = new URLSearchParams({ startDate, endDate })
  return request<TaskCalendarEntryDto[]>(`/tasks/calendar?${searchParams.toString()}`)
}

export async function getTaskDetail(taskId: string): Promise<TaskDto | null> {
  try {
    return await request<TaskDto>(`/tasks/${encodeURIComponent(taskId)}`)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

export async function createTask(payload: CreateTaskPayload): Promise<TaskDto> {
  return request<TaskDto>('/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateTask(taskId: string, payload: UpdateTaskPayload): Promise<TaskDto> {
  return request<TaskDto>(`/tasks/${encodeURIComponent(taskId)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteTask(taskId: string): Promise<void> {
  await request<null>(`/tasks/${encodeURIComponent(taskId)}`, {
    method: 'DELETE',
  })
}

export async function reorderTasks(payload: ReorderTasksPayload): Promise<ReorderTasksResult> {
  return request<ReorderTasksResult>('/tasks/reorder', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function saveTaskResult(
  taskId: string,
  payload: SaveTaskResultPayload,
): Promise<TaskResultDto> {
  const formData = new FormData()
  formData.append('content', payload.content)
  if (payload.removedAttachmentIds && payload.removedAttachmentIds.length > 0) {
    formData.append('removedAttachmentIds', JSON.stringify(payload.removedAttachmentIds))
  }
  payload.files?.forEach((file) => formData.append('files', file))

  return request<TaskResultDto>(`/tasks/${encodeURIComponent(taskId)}/result`, {
    method: 'PUT',
    body: formData,
  })
}
