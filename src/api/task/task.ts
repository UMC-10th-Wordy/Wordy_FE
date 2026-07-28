import { INITIAL_TASK_MOCKS } from '@/mocks/task/taskApiMock'
import type { CreateTaskPayload, TaskDto, UpdateTaskPayload } from '@/types/task'
import { getTagDetail } from '@/api/tag/tag'

let taskMockStore: TaskDto[] = [...INITIAL_TASK_MOCKS]

export const taskQueryKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  list: (date: string) => [...taskQueryKeys.lists(), date] as const,
}

export async function getTasks(date: string): Promise<TaskDto[]> {
  return taskMockStore.filter((task) => task.taskDate.slice(0, 10) === date)
}

export async function getTaskDetail(taskId: string): Promise<TaskDto | null> {
  return taskMockStore.find((task) => task.taskId === taskId) ?? null
}

export async function createTask(payload: CreateTaskPayload): Promise<TaskDto> {
  const tagDto = await getTagDetail(payload.tagId)
  if (!tagDto) throw new Error('TAG_NOT_FOUND')
  const now = new Date().toISOString()
  const created: TaskDto = {
    taskId: crypto.randomUUID(),
    title: payload.title,
    priority: payload.priority,
    memo: payload.memo ?? '',
    status: 'IN_PROGRESS',
    taskDate: `${payload.taskDate}T00:00:00.000Z`,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    userId: 'mock-user',
    tagId: payload.tagId,
    tag: {
      tagId: tagDto.tagId,
      tagName: tagDto.tagName,
      color: tagDto.color,
      projectName: tagDto.projectName,
    },
  }
  taskMockStore = [...taskMockStore, created]
  return created
}

export async function updateTask(taskId: string, payload: UpdateTaskPayload): Promise<TaskDto> {
  const existing = taskMockStore.find((task) => task.taskId === taskId)
  if (!existing) throw new Error('TASK_NOT_FOUND')
  const tagDto = await getTagDetail(payload.tagId)
  if (!tagDto) throw new Error('TAG_NOT_FOUND')
  const now = new Date().toISOString()
  const updated: TaskDto = {
    ...existing,
    title: payload.title,
    priority: payload.priority,
    memo: payload.memo ?? '',
    status: payload.status,
    taskDate: `${payload.taskDate}T00:00:00.000Z`,
    completedAt: payload.status === 'COMPLETED' ? now : null,
    updatedAt: now,
    tagId: payload.tagId,
    tag: {
      tagId: tagDto.tagId,
      tagName: tagDto.tagName,
      color: tagDto.color,
      projectName: tagDto.projectName,
    },
  }
  taskMockStore = taskMockStore.map((task) => (task.taskId === taskId ? updated : task))
  return updated
}

export async function deleteTask(taskId: string): Promise<void> {
  const exists = taskMockStore.some((task) => task.taskId === taskId)
  if (!exists) throw new Error('TASK_NOT_FOUND')
  taskMockStore = taskMockStore.filter((task) => task.taskId !== taskId)
}
