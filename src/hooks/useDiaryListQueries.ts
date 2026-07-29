import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from '@tanstack/react-query'

import {
  deleteDailyEntry,
  diaryListQueryKeys,
  getDailyEntriesSummary,
  getDailyEntryDetail,
  getMonthlyDailyEntries,
  getMonthlyDailyEntriesByYearMonth,
  searchDailyEntries,
} from '@/api/diary-list/diaryList'
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

export const useDeleteDailyEntry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDailyEntry,

    onSuccess: ({ dailyEntryId }) => {
      queryClient.removeQueries({
        queryKey: diaryListQueryKeys.detail(dailyEntryId),
      })

      void queryClient.invalidateQueries({
        queryKey: diaryListQueryKeys.all,
      })
    },
  })
}
