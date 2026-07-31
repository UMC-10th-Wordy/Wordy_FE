import type { PerformancePreviewResultData } from '@/types/performancePreviewResult'
import type { Task } from '@/types/todo'
import type { DailyEntryTag, DiaryListApiResponse } from '@/types/diaryList'

export interface DiaryDetailData extends DiaryDetailContentData {
  performance: PerformancePreviewResultData
}

/* 일지 상세 조회: 좌측 업무 일지 */
// GET /daily-entries/{dailyEntryId}

export type DailyEntryTaskPriority = 'MUST_DO' | 'SHOULD_DO' | 'COULD_DO'

export type DailyEntryTaskStatus = 'COMPLETED' | 'INCOMPLETE'

export type DailyEntryAttachmentFileType = 'FILE' | 'IMG'

export interface DailyEntryAttachment {
  fileType: DailyEntryAttachmentFileType
  fileUrl: string
  fileName: string
}

export interface DailyEntryTaskResult {
  taskResultId: string
  content: string
  attachments: DailyEntryAttachment[]
}

export interface DailyEntryDetailTask {
  taskId: string
  tag: DailyEntryTag | null
  title: string
  memo: string
  priority: DailyEntryTaskPriority
  status: DailyEntryTaskStatus
  result: DailyEntryTaskResult | null
}

export interface DailyEntryDetailResult {
  dailyEntryId: string
  dailyPerformanceId: string | null
  entryDate: string
  reflectionContent: string
  converted: boolean
  completedCount: number
  incompleteCount: number
  tasks: DailyEntryDetailTask[]
}

export interface DiaryDetailContentData {
  id: string
  dailyPerformanceId: string | null
  date: string
  tasks: Task[]
  retrospective: string
  completedCount: number
  incompleteCount: number
}

export type DailyEntryDetailResponse = DiaryListApiResponse<DailyEntryDetailResult>
