import { keepPreviousData, useQuery } from '@tanstack/react-query'

import {
  mapDailyEntriesSummary,
  mapDailyEntryDetail,
  mapDailyEntrySearchResult,
  mapMonthlyDiaryEntries,
  mapMonthlyDiaryRecords,
} from '@/utils/diary-list/diaryListMapper'

import {
  getDailyEntriesSummary,
  getDailyEntryDetail,
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
  details: () => [...diaryListQueryKeys.all, 'detail'] as const,
  detail: (dailyEntryId: string) => [...diaryListQueryKeys.details(), dailyEntryId] as const,
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
    placeholderData: keepPreviousData,
    enabled: params.query.trim().length > 0,
  })
}

export const useGetDailyEntryDetail = (dailyEntryId: string) => {
  return useQuery({
    queryKey: diaryListQueryKeys.detail(dailyEntryId),
    queryFn: () => getDailyEntryDetail(dailyEntryId),
    select: mapDailyEntryDetail,
    enabled: dailyEntryId.trim().length > 0,
  })
}
