import { useQuery } from '@tanstack/react-query'

import {
  mapDailyEntriesSummary,
  mapDailyEntrySearchResult,
  mapMonthlyDiaryEntries,
  mapMonthlyDiaryRecords,
} from '@/utils/diary-list/diaryListMapper'

import {
  getDailyEntriesSummary,
  getMonthlyDailyEntries,
  getMonthlyDailyEntriesByYearMonth,
  searchDailyEntries,
} from './diary-list.api'

import type { DailyEntrySearchParams } from '@/types/api/diaryList'

export const diaryListQueryKeys = {
  all: ['diary-list'] as const,
  summary: () => [...diaryListQueryKeys.all, 'summary'] as const,
  monthlyRecords: () => [...diaryListQueryKeys.all, 'monthly-records'] as const,
  monthlyEntries: (yearMonth: string) =>
    [...diaryListQueryKeys.all, 'monthly-entries', yearMonth] as const,
  searches: () => [...diaryListQueryKeys.all, 'search'] as const,
  search: (params: DailyEntrySearchParams) => [...diaryListQueryKeys.searches(), params] as const,
}

export const useGetDailyEntriesSummary = () => {
  return useQuery({
    queryKey: diaryListQueryKeys.summary(),
    queryFn: getDailyEntriesSummary,
    select: mapDailyEntriesSummary,
  })
}

export const useGetMonthlyDailyEntries = () => {
  return useQuery({
    queryKey: diaryListQueryKeys.monthlyRecords(),
    queryFn: getMonthlyDailyEntries,
    select: mapMonthlyDiaryRecords,
  })
}

export const useGetMonthlyDailyEntriesByYearMonth = (yearMonth: string, enabled: boolean) => {
  return useQuery({
    queryKey: diaryListQueryKeys.monthlyEntries(yearMonth),
    queryFn: () => getMonthlyDailyEntriesByYearMonth(yearMonth),
    select: mapMonthlyDiaryEntries,
    enabled,
  })
}

export const useGetDailyEntrySearch = (params: DailyEntrySearchParams) => {
  return useQuery({
    queryKey: diaryListQueryKeys.search(params),
    queryFn: () => searchDailyEntries(params),
    select: mapDailyEntrySearchResult,
    enabled: params.query.trim().length > 0,
  })
}
