import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from '@tanstack/react-query'

import {
  createDailyEntry,
  deleteDailyEntry,
  dailyEntryQueryKeys,
  getDailyEntriesSummary,
  getDailyEntryDetail,
  getMonthlyDailyEntries,
  getMonthlyDailyEntriesByYearMonth,
  searchDailyEntries,
} from '@/api/daily-entry/dailyEntry'
import {
  mapDailyEntriesSummary,
  mapDailyEntryDetail,
  mapDailyEntrySearchResult,
  mapMonthlyDiaryEntries,
  mapMonthlyDiaryRecords,
} from '@/utils/diary-list/diaryListMapper'
import type { DailyEntrySearchParams } from '@/types/diarySearch'

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
          queryKey: dailyEntryQueryKeys.summary(),
        }),
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.monthlyRecords(),
        }),
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.monthlyEntries(),
        }),
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.searches(),
        }),
      ])
    },
  })
}
