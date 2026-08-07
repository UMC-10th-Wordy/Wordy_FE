import { request } from '@/lib/httpClient'

import type {
  CreateDailyEntryPayload,
  CreateDailyEntryResult,
  DailyEntriesSummaryResult,
  DailyEntryByDateResult,
  DailyEntryDeleteResult,
  MonthlyDailyEntry,
  MonthlyDailyEntryRecord,
} from '@/types/diaryList'
import type { DailyEntrySearchParams, DailyEntrySearchResult } from '@/types/diarySearch'
import type { DailyEntryDetailResult } from '@/types/diaryDetail'

export const createDailyEntry = async (
  payload: CreateDailyEntryPayload,
): Promise<CreateDailyEntryResult> => {
  return request<CreateDailyEntryResult>('/daily-entries', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export const getDailyEntryByDate = async (date: string): Promise<DailyEntryByDateResult | null> => {
  const searchParams = new URLSearchParams({ date })

  return request<DailyEntryByDateResult | null>(`/daily-entries?${searchParams.toString()}`, {
    method: 'GET',
  })
}

export const getDailyEntriesSummary = async (): Promise<DailyEntriesSummaryResult> => {
  return request<DailyEntriesSummaryResult>('/daily-entries/summary', {
    method: 'GET',
  })
}

export const getMonthlyDailyEntries = async (): Promise<MonthlyDailyEntryRecord[]> => {
  return request<MonthlyDailyEntryRecord[]>('/daily-entries/monthly', {
    method: 'GET',
  })
}

export const getMonthlyDailyEntriesByYearMonth = async (
  yearMonth: string,
): Promise<MonthlyDailyEntry[]> => {
  return request<MonthlyDailyEntry[]>(`/daily-entries/monthly/${encodeURIComponent(yearMonth)}`, {
    method: 'GET',
  })
}

export const searchDailyEntries = async ({
  query,
  sort,
}: DailyEntrySearchParams): Promise<DailyEntrySearchResult> => {
  const searchParams = new URLSearchParams({
    query: query.trim(),
    sort,
  })

  return request<DailyEntrySearchResult>(`/daily-entries/search?${searchParams.toString()}`, {
    method: 'GET',
  })
}

export const getDailyEntryDetail = async (
  dailyEntryId: string,
): Promise<DailyEntryDetailResult> => {
  return request<DailyEntryDetailResult>(`/daily-entries/${encodeURIComponent(dailyEntryId)}`, {
    method: 'GET',
  })
}

export const deleteDailyEntry = async (dailyEntryId: string): Promise<DailyEntryDeleteResult> => {
  return request<DailyEntryDeleteResult>(`/daily-entries/${encodeURIComponent(dailyEntryId)}`, {
    method: 'DELETE',
  })
}

export const dailyEntryQueryKeys = {
  all: ['daily-entry'] as const,

  byDate: (date: string) => [...dailyEntryQueryKeys.all, 'by-date', date] as const,

  summary: () => [...dailyEntryQueryKeys.all, 'summary'] as const,

  monthlyRecords: () => [...dailyEntryQueryKeys.all, 'monthly-records'] as const,

  monthlyEntries: () => [...dailyEntryQueryKeys.all, 'monthly-entries'] as const,
  monthlyEntry: (yearMonth: string) =>
    [...dailyEntryQueryKeys.monthlyEntries(), yearMonth] as const,

  searches: () => [...dailyEntryQueryKeys.all, 'search'] as const,
  search: (params: DailyEntrySearchParams) => [...dailyEntryQueryKeys.searches(), params] as const,

  details: () => [...dailyEntryQueryKeys.all, 'detail'] as const,
  detail: (dailyEntryId: string) => [...dailyEntryQueryKeys.details(), dailyEntryId] as const,
}
