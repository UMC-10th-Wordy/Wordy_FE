import { INITIAL_TASK_MOCKS } from '@/mocks/taskApiMock'
import type { CreateTaskPayload, TaskDto } from '@/types/taskApi'
import { getTagDetail } from './tagApi'

let taskMockStore: TaskDto[] = [...INITIAL_TASK_MOCKS]

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
