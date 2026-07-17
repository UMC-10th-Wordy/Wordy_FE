import type { PerformancePreviewResultData } from '@/types/performancePreviewResult'
import type { Task } from '@/types/todo'

export interface DiaryDetailData {
  id: string
  date: string
  tasks: Task[]
  retrospective: string
  performance: PerformancePreviewResultData
}
