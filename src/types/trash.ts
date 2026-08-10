import type { DiaryListApiResponse } from '@/types/diaryList'

/* 휴지통 목록 조회 */
// GET /trash/daily-entries

export interface TrashDailyEntry {
  dailyEntryId: string
  entryDate: string
  reflectionContent: string
  deletedAt: string
}

export interface TrashDailyEntriesResult {
  items: TrashDailyEntry[]
  page: number
  size: number
  totalCount: number
  totalPages: number
  hasNext: boolean
}

export type TrashDailyEntriesResponse = DiaryListApiResponse<TrashDailyEntriesResult>

/* 일지 복원 */
// PATCH /trash/daily-entries/{dailyEntryId}/restore

export interface RestoreDailyEntryResult {
  dailyEntryId: string
}

export type RestoreDailyEntryResponse = DiaryListApiResponse<RestoreDailyEntryResult>

/* 일지 영구 삭제 */
// DELETE /trash/daily-entries/{dailyEntryId}

export interface DeleteDailyEntryPermanentlyResult {
  dailyEntryId: string
}

export type DeleteDailyEntryPermanentlyResponse =
  DiaryListApiResponse<DeleteDailyEntryPermanentlyResult>
