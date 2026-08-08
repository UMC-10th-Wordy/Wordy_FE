import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from '@tanstack/react-query'

import {
  createDailyEntry,
  deleteDailyEntry,
  dailyEntryQueryKeys,
  getDailyEntriesSummary,
  getDailyEntryByDate,
  getDailyEntryDetail,
  getMonthlyDailyEntries,
  getMonthlyDailyEntriesByYearMonth,
  searchDailyEntries,
} from '@/api/daily-entry/dailyEntry'
import { homeQueryKeys } from '@/api/home/home'
import {
  mapDailyEntriesSummary,
  mapDailyEntryDetail,
  mapDailyEntrySearchResult,
  mapMonthlyDiaryEntries,
  mapMonthlyDiaryRecords,
} from '@/utils/diary-list/diaryListMapper'
import type { DailyEntrySearchParams } from '@/types/diarySearch'

export const useGetDailyEntryByDate = (date: string) => {
  return useQuery({
    queryKey: dailyEntryQueryKeys.byDate(date),
    queryFn: () => getDailyEntryByDate(date),
  })
}

export const useGetDiaryListPageData = () => {
  const [summaryQuery, monthlyRecordsQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: dailyEntryQueryKeys.summary(),
        queryFn: getDailyEntriesSummary,
        select: mapDailyEntriesSummary,
      },
      {
        queryKey: dailyEntryQueryKeys.monthlyRecords(),
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
    queryKey: dailyEntryQueryKeys.monthlyEntry(yearMonth),
    queryFn: () => getMonthlyDailyEntriesByYearMonth(yearMonth),
    select: mapMonthlyDiaryEntries,
  })
}

export const useGetDailyEntrySearch = (params: DailyEntrySearchParams) => {
  return useSuspenseQuery({
    queryKey: dailyEntryQueryKeys.search(params),
    queryFn: () => searchDailyEntries(params),
    select: mapDailyEntrySearchResult,
  })
}

export const useGetDailyEntryDetail = (dailyEntryId: string) => {
  return useSuspenseQuery({
    queryKey: dailyEntryQueryKeys.detail(dailyEntryId),
    queryFn: () => getDailyEntryDetail(dailyEntryId),
    select: mapDailyEntryDetail,
    refetchOnMount: 'always',
  })
}

export const useCreateDailyEntry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDailyEntry,

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: dailyEntryQueryKeys.all,
      })
    },
  })
}

export const useDeleteDailyEntry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDailyEntry,

    onSuccess: () => {
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: homeQueryKeys.all,
        }),
      ])
    },
  })
}
