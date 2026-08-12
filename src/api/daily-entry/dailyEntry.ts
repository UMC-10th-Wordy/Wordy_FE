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

const getDailyEntriesPath = (workspaceId: string) =>
  `/workspaces/${encodeURIComponent(workspaceId)}/daily-entries`

/* 업무 일지 생성 */
// POST /workspaces/{workspaceId}/daily-entries

export const createDailyEntry = async (
  workspaceId: string,
  payload: CreateDailyEntryPayload,
): Promise<CreateDailyEntryResult> => {
  return request<CreateDailyEntryResult>(getDailyEntriesPath(workspaceId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/* 날짜별 일지 조회 */
// GET /workspaces/{workspaceId}/daily-entries?date=YYYY-MM-DD

export const getDailyEntryByDate = async (
  workspaceId: string,
  date: string,
): Promise<DailyEntryByDateResult | null> => {
  const searchParams = new URLSearchParams({ date })

  return request<DailyEntryByDateResult | null>(
    `${getDailyEntriesPath(workspaceId)}?${searchParams.toString()}`,
    {
      method: 'GET',
    },
  )
}

/* 일지 모아보기 요약 조회 */
// GET /workspaces/{workspaceId}/daily-entries/summary

export const getDailyEntriesSummary = async (
  workspaceId: string,
): Promise<DailyEntriesSummaryResult> => {
  return request<DailyEntriesSummaryResult>(`${getDailyEntriesPath(workspaceId)}/summary`, {
    method: 'GET',
  })
}

/* 월별 기록 목록 조회 */
// GET /workspaces/{workspaceId}/daily-entries/monthly

export const getMonthlyDailyEntries = async (
  workspaceId: string,
): Promise<MonthlyDailyEntryRecord[]> => {
  return request<MonthlyDailyEntryRecord[]>(`${getDailyEntriesPath(workspaceId)}/monthly`, {
    method: 'GET',
  })
}

/* 특정 월의 일자별 업무 일지 조회 */
// GET /workspaces/{workspaceId}/daily-entries/monthly/{yearMonth}

export const getMonthlyDailyEntriesByYearMonth = async (
  workspaceId: string,
  yearMonth: string,
): Promise<MonthlyDailyEntry[]> => {
  return request<MonthlyDailyEntry[]>(
    `${getDailyEntriesPath(workspaceId)}/monthly/${encodeURIComponent(yearMonth)}`,
    {
      method: 'GET',
    },
  )
}

/* 일지 검색 */
// GET /workspaces/{workspaceId}/daily-entries/search

export const searchDailyEntries = async (
  workspaceId: string,
  { query, sort }: DailyEntrySearchParams,
): Promise<DailyEntrySearchResult> => {
  const searchParams = new URLSearchParams({
    query: query.trim(),
    sort,
  })

  return request<DailyEntrySearchResult>(
    `${getDailyEntriesPath(workspaceId)}/search?${searchParams.toString()}`,
    {
      method: 'GET',
    },
  )
}

/* 업무 일지 상세 조회 */
// GET /workspaces/{workspaceId}/daily-entries/{dailyEntryId}

export const getDailyEntryDetail = async (
  workspaceId: string,
  dailyEntryId: string,
): Promise<DailyEntryDetailResult> => {
  return request<DailyEntryDetailResult>(
    `${getDailyEntriesPath(workspaceId)}/${encodeURIComponent(dailyEntryId)}`,
    {
      method: 'GET',
    },
  )
}

/* 일지 삭제 */
// DELETE /workspaces/{workspaceId}/daily-entries/{dailyEntryId}

export const deleteDailyEntry = async (
  workspaceId: string,
  dailyEntryId: string,
): Promise<DailyEntryDeleteResult> => {
  return request<DailyEntryDeleteResult>(
    `${getDailyEntriesPath(workspaceId)}/${encodeURIComponent(dailyEntryId)}`,
    {
      method: 'DELETE',
    },
  )
}

export const dailyEntryQueryKeys = {
  all: ['daily-entry'] as const,

  workspace: (workspaceId: string) => [...dailyEntryQueryKeys.all, workspaceId] as const,

  byDates: (workspaceId: string) =>
    [...dailyEntryQueryKeys.workspace(workspaceId), 'by-date'] as const,

  byDate: (workspaceId: string, date: string) =>
    [...dailyEntryQueryKeys.byDates(workspaceId), date] as const,

  summary: (workspaceId: string) =>
    [...dailyEntryQueryKeys.workspace(workspaceId), 'summary'] as const,

  monthlyRecords: (workspaceId: string) =>
    [...dailyEntryQueryKeys.workspace(workspaceId), 'monthly-records'] as const,

  monthlyEntries: (workspaceId: string) =>
    [...dailyEntryQueryKeys.workspace(workspaceId), 'monthly-entries'] as const,

  monthlyEntry: (workspaceId: string, yearMonth: string) =>
    [...dailyEntryQueryKeys.monthlyEntries(workspaceId), yearMonth] as const,

  searches: (workspaceId: string) =>
    [...dailyEntryQueryKeys.workspace(workspaceId), 'search'] as const,

  search: (workspaceId: string, params: DailyEntrySearchParams) =>
    [...dailyEntryQueryKeys.searches(workspaceId), params] as const,

  details: (workspaceId: string) =>
    [...dailyEntryQueryKeys.workspace(workspaceId), 'detail'] as const,

  detail: (workspaceId: string, dailyEntryId: string) =>
    [...dailyEntryQueryKeys.details(workspaceId), dailyEntryId] as const,
}
