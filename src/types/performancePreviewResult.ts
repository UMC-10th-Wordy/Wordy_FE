import type { TaskPriority, TaskTag } from '@/types/todo'

export interface PerformanceIncompleteTask {
  id: string
  title: string
  priority: TaskPriority
  tag?: TaskTag
}

export interface PerformanceTaskResult {
  id: string
  taskId: string
  title: string
  tag?: TaskTag
  output?: string | string[]
  impact?: string | string[]
}

export interface PerformancePreviewResultData {
  totalTaskCount: number
  completedTaskCount: number
  incompleteTasks: PerformanceIncompleteTask[]
  summary: string
  insight: string
  nextTasks: string[]
  taskResults: PerformanceTaskResult[]
}
