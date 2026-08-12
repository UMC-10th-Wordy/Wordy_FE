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
import { trashQueryKeys } from '@/api/trash/trash'
import { useActiveWorkspaceId } from '@/hooks/useWorkspaceQueries'
import {
  mapDailyEntriesSummary,
  mapDailyEntryDetail,
  mapDailyEntrySearchResult,
  mapMonthlyDiaryEntries,
  mapMonthlyDiaryRecords,
} from '@/utils/diary-list/diaryListMapper'
import type { CreateDailyEntryPayload } from '@/types/diaryList'
import type { DailyEntrySearchParams } from '@/types/diarySearch'

export const useGetDailyEntryByDate = (date: string) => {
  const activeWorkspaceId = useActiveWorkspaceId()

  return useQuery({
    queryKey: dailyEntryQueryKeys.byDate(activeWorkspaceId, date),
    queryFn: () => getDailyEntryByDate(activeWorkspaceId, date),
    enabled: !!activeWorkspaceId,
  })
}

export const useGetDiaryListPageData = () => {
  const activeWorkspaceId = useActiveWorkspaceId()

  const [summaryQuery, monthlyRecordsQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: dailyEntryQueryKeys.summary(activeWorkspaceId),
        queryFn: () => getDailyEntriesSummary(activeWorkspaceId),
        select: mapDailyEntriesSummary,
      },
      {
        queryKey: dailyEntryQueryKeys.monthlyRecords(activeWorkspaceId),
        queryFn: () => getMonthlyDailyEntries(activeWorkspaceId),
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
  const activeWorkspaceId = useActiveWorkspaceId()

  return useSuspenseQuery({
    queryKey: dailyEntryQueryKeys.monthlyEntry(activeWorkspaceId, yearMonth),
    queryFn: () => getMonthlyDailyEntriesByYearMonth(activeWorkspaceId, yearMonth),
    select: mapMonthlyDiaryEntries,
  })
}

export const useGetDailyEntrySearch = (params: DailyEntrySearchParams) => {
  const activeWorkspaceId = useActiveWorkspaceId()

  return useSuspenseQuery({
    queryKey: dailyEntryQueryKeys.search(activeWorkspaceId, params),
    queryFn: () => searchDailyEntries(activeWorkspaceId, params),
    select: mapDailyEntrySearchResult,
  })
}

export const useGetDailyEntryDetail = (dailyEntryId: string) => {
  const activeWorkspaceId = useActiveWorkspaceId()

  return useSuspenseQuery({
    queryKey: dailyEntryQueryKeys.detail(activeWorkspaceId, dailyEntryId),
    queryFn: () => getDailyEntryDetail(activeWorkspaceId, dailyEntryId),
    select: mapDailyEntryDetail,
    refetchOnMount: 'always',
  })
}

export const useCreateDailyEntry = () => {
  const queryClient = useQueryClient()
  const activeWorkspaceId = useActiveWorkspaceId()

  return useMutation({
    mutationFn: (payload: CreateDailyEntryPayload) => {
      if (!activeWorkspaceId) {
        throw new Error('워크스페이스 ID가 없습니다.')
      }

      return createDailyEntry(activeWorkspaceId, payload)
    },

    onSuccess: () => {
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.workspace(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: homeQueryKeys.all,
        }),
      ])
    },
  })
}

export const useDeleteDailyEntry = () => {
  const queryClient = useQueryClient()
  const activeWorkspaceId = useActiveWorkspaceId()

  return useMutation({
    mutationFn: (dailyEntryId: string) => {
      if (!activeWorkspaceId) {
        throw new Error('워크스페이스 ID가 없습니다.')
      }

      return deleteDailyEntry(activeWorkspaceId, dailyEntryId)
    },

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: dailyEntryQueryKeys.byDates(activeWorkspaceId),
      })

      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.summary(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.monthlyRecords(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.monthlyEntries(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.searches(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: homeQueryKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: trashQueryKeys.lists(),
        }),
      ])
    },
  })
}
