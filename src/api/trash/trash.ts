import { request } from '@/lib/httpClient'

import type {
  DeleteDailyEntryPermanentlyResult,
  RestoreDailyEntryResult,
  TrashDailyEntry,
} from '@/types/trash'

export const getTrashDailyEntries = async (): Promise<TrashDailyEntry[]> => {
  return request<TrashDailyEntry[]>('/trash/daily-entries', {
    method: 'GET',
  })
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
}
