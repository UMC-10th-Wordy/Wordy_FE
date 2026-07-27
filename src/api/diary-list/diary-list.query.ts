import { useQuery } from '@tanstack/react-query'

import {
  mapDailyEntriesSummary,
  mapMonthlyDiaryEntries,
  mapMonthlyDiaryRecords,
} from '@/utils/diary-list/diaryListMapper'

import {
  getDailyEntriesSummary,
  getMonthlyDailyEntries,
  getMonthlyDailyEntriesByYearMonth,
} from './diary-list.api'

export const diaryListQueryKeys = {
  all: ['diary-list'] as const,
  summary: () => [...diaryListQueryKeys.all, 'summary'] as const,
  monthlyRecords: () => [...diaryListQueryKeys.all, 'monthly-records'] as const,
  monthlyEntries: (yearMonth: string) =>
    [...diaryListQueryKeys.all, 'monthly-entries', yearMonth] as const,
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
