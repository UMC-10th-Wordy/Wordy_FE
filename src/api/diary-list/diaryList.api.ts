import type {
  DailyEntriesSummaryResult,
  DailyEntryDeleteResult,
  DailyEntryDetailResult,
  DailyEntrySearchParams,
  DailyEntrySearchResult,
  DiaryListApiResponse,
  MonthlyDailyEntry,
  MonthlyDailyEntryRecord,
} from '@/types/diaryListApi'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  const data: DiaryListApiResponse<T> = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(data.message || `요청에 실패했습니다. (${response.status})`)
  }

  if (data.result === null) {
    throw new Error(data.message || '응답 데이터가 없습니다.')
  }

  return data.result
}

export const getDailyEntriesSummary = async (): Promise<DailyEntriesSummaryResult> => {
  return request<DailyEntriesSummaryResult>('/daily-entries/summary')
}

export const getMonthlyDailyEntries = async (): Promise<MonthlyDailyEntryRecord[]> => {
  return request<MonthlyDailyEntryRecord[]>('/daily-entries/monthly')
}

export const getMonthlyDailyEntriesByYearMonth = async (
  yearMonth: string,
): Promise<MonthlyDailyEntry[]> => {
  return request<MonthlyDailyEntry[]>(`/daily-entries/monthly/${encodeURIComponent(yearMonth)}`)
}

export const searchDailyEntries = async ({
  query,
  sort,
}: DailyEntrySearchParams): Promise<DailyEntrySearchResult> => {
  const searchParams = new URLSearchParams({
    query: query.trim(),
    sort,
  })

  return request<DailyEntrySearchResult>(`/daily-entries/search?${searchParams.toString()}`)
}

export const getDailyEntryDetail = async (
  dailyEntryId: string,
): Promise<DailyEntryDetailResult> => {
  return request<DailyEntryDetailResult>(`/daily-entries/${encodeURIComponent(dailyEntryId)}`)
}

export const deleteDailyEntry = async (dailyEntryId: string): Promise<DailyEntryDeleteResult> => {
  return request<DailyEntryDeleteResult>(`/daily-entries/${encodeURIComponent(dailyEntryId)}`, {
    method: 'DELETE',
  })
}
