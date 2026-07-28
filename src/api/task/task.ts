import type { CreateTaskPayload, TaskDto, UpdateTaskPayload } from '@/types/task'
import { ApiError } from '@/api/tag/tag'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const TEMP_ACCESS_TOKEN = import.meta.env.DEV ? import.meta.env.VITE_TEMP_ACCESS_TOKEN : undefined

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(TEMP_ACCESS_TOKEN ? { Authorization: `Bearer ${TEMP_ACCESS_TOKEN}` } : {}),
      ...options?.headers,
    },
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new ApiError(data.message || `요청에 실패했습니다. (${response.status})`, response.status)
  }

  return data.result as T
}

export const taskQueryKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  list: (date: string) => [...taskQueryKeys.lists(), date] as const,
}

export async function getTasks(date: string): Promise<TaskDto[]> {
  return request<TaskDto[]>(`/tasks?date=${encodeURIComponent(date)}`)
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
