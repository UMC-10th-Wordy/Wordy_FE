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

const getTrashDailyEntriesPath = (workspaceId: string) =>
  `/workspaces/${encodeURIComponent(workspaceId)}/trash/daily-entries`

export const getTrashDailyEntries = async (
  workspaceId: string,
  { page, size }: GetTrashDailyEntriesParams,
): Promise<TrashDailyEntriesResult> => {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  })

  return request<TrashDailyEntriesResult>(
    `${getTrashDailyEntriesPath(workspaceId)}?${searchParams.toString()}`,
    { method: 'GET' },
  )
}

export const getTrashDailyEntryDetail = async (
  workspaceId: string,
  dailyEntryId: string,
): Promise<DailyEntryDetailResult> => {
  return request<DailyEntryDetailResult>(
    `${getTrashDailyEntriesPath(workspaceId)}/${encodeURIComponent(dailyEntryId)}`,
    { method: 'GET' },
  )
}

export const restoreDailyEntry = async (
  workspaceId: string,
  dailyEntryId: string,
): Promise<RestoreDailyEntryResult> => {
  return request<RestoreDailyEntryResult>(
    `${getTrashDailyEntriesPath(workspaceId)}/${encodeURIComponent(dailyEntryId)}/restore`,
    { method: 'PATCH' },
  )
}

export const deleteDailyEntryPermanently = async (
  workspaceId: string,
  dailyEntryId: string,
): Promise<DeleteDailyEntryPermanentlyResult> => {
  return request<DeleteDailyEntryPermanentlyResult>(
    `${getTrashDailyEntriesPath(workspaceId)}/${encodeURIComponent(dailyEntryId)}`,
    { method: 'DELETE' },
  )
}

export const trashQueryKeys = {
  all: ['trash'] as const,

  workspace: (workspaceId: string) => [...trashQueryKeys.all, workspaceId] as const,

  lists: (workspaceId: string) => [...trashQueryKeys.workspace(workspaceId), 'list'] as const,

  details: (workspaceId: string) => [...trashQueryKeys.workspace(workspaceId), 'detail'] as const,

  detail: (workspaceId: string, dailyEntryId: string) =>
    [...trashQueryKeys.details(workspaceId), dailyEntryId] as const,
}
