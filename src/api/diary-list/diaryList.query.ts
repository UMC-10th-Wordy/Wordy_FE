import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query'

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
} from './diaryList.api'

import type { DailyEntrySearchParams } from '@/types/diaryListApi'

export const diaryListQueryKeys = {
  all: ['diary-list'] as const,

  summary: () => [...diaryListQueryKeys.all, 'summary'] as const,

  monthlyRecords: () => [...diaryListQueryKeys.all, 'monthly-records'] as const,

  monthlyEntries: () => [...diaryListQueryKeys.all, 'monthly-entries'] as const,
  monthlyEntry: (yearMonth: string) => [...diaryListQueryKeys.monthlyEntries(), yearMonth] as const,

  searches: () => [...diaryListQueryKeys.all, 'search'] as const,
  search: (params: DailyEntrySearchParams) => [...diaryListQueryKeys.searches(), params] as const,

  details: () => [...diaryListQueryKeys.all, 'detail'] as const,
  detail: (dailyEntryId: string) => [...diaryListQueryKeys.details(), dailyEntryId] as const,
}

export const useGetDiaryListPageData = () => {
  const [summaryQuery, monthlyRecordsQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: diaryListQueryKeys.summary(),
        queryFn: getDailyEntriesSummary,
        select: mapDailyEntriesSummary,
      },
      {
        queryKey: diaryListQueryKeys.monthlyRecords(),
        queryFn: getMonthlyDailyEntries,
        select: mapMonthlyDiaryRecords,
      },
    ],
  })

  return {
    summary: summaryQuery.data,
    records: monthlyRecordsQuery.data,
  }
}

export const useGetMonthlyDailyEntriesByYearMonth = (yearMonth: string) => {
  return useSuspenseQuery({
    queryKey: diaryListQueryKeys.monthlyEntry(yearMonth),
    queryFn: () => getMonthlyDailyEntriesByYearMonth(yearMonth),
    select: mapMonthlyDiaryEntries,
  })
}

export const useGetDailyEntrySearch = (params: DailyEntrySearchParams) => {
  return useSuspenseQuery({
    queryKey: diaryListQueryKeys.search(params),
    queryFn: () => searchDailyEntries(params),
    select: mapDailyEntrySearchResult,
  })
}

export const useGetDailyEntryDetail = (dailyEntryId: string) => {
  return useSuspenseQuery({
    queryKey: diaryListQueryKeys.detail(dailyEntryId),
    queryFn: () => getDailyEntryDetail(dailyEntryId),
    select: mapDailyEntryDetail,
  })
}
