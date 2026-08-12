import { request } from '@/lib/httpClient'

import type { DailyEntryDetailResult } from '@/types/diaryDetail'
import type {
  DeleteDailyEntryPermanentlyResult,
  RestoreDailyEntryResult,
  TrashDailyEntriesResult,
} from '@/types/trash'

export interface GetTrashDailyEntriesParams {
  page: number
  size: number
}

export const getTrashDailyEntries = async ({
  page,
  size,
}: GetTrashDailyEntriesParams): Promise<TrashDailyEntriesResult> => {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  })

  return request<TrashDailyEntriesResult>(`/trash/daily-entries?${searchParams.toString()}`, {
    method: 'GET',
  })
}

export const getTrashDailyEntryDetail = async (
  dailyEntryId: string,
): Promise<DailyEntryDetailResult> => {
  return request<DailyEntryDetailResult>(
    `/trash/daily-entries/${encodeURIComponent(dailyEntryId)}`,
    { method: 'GET' },
  )
}

export const restoreDailyEntry = async (dailyEntryId: string): Promise<RestoreDailyEntryResult> => {
  return request<RestoreDailyEntryResult>(
    `/trash/daily-entries/${encodeURIComponent(dailyEntryId)}/restore`,
    { method: 'PATCH' },
  )
}

export const deleteDailyEntryPermanently = async (
  dailyEntryId: string,
): Promise<DeleteDailyEntryPermanentlyResult> => {
  return request<DeleteDailyEntryPermanentlyResult>(
    `/trash/daily-entries/${encodeURIComponent(dailyEntryId)}`,
    { method: 'DELETE' },
  )
}

export const trashQueryKeys = {
  all: ['trash'] as const,

  lists: () => [...trashQueryKeys.all, 'list'] as const,

  details: () => [...trashQueryKeys.all, 'detail'] as const,

  detail: (dailyEntryId: string) => [...trashQueryKeys.details(), dailyEntryId] as const,
}
