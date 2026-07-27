import type { PerformancePreviewResultData } from '@/types/performancePreviewResult'
import type { Task } from '@/types/todo'

export interface DiaryDetailContentData {
  id: string
  date: string
  tasks: Task[]
  retrospective: string
  completedCount: number
  incompleteCount: number
}

export interface DiaryDetailData extends DiaryDetailContentData {
  performance: PerformancePreviewResultData
}
