import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query'

import { dailyEntryQueryKeys } from '@/api/daily-entry/dailyEntry'
import { homeQueryKeys } from '@/api/home/home'
import {
  deleteDailyEntryPermanently,
  getTrashDailyEntries,
  getTrashDailyEntryDetail,
  restoreDailyEntry,
  trashQueryKeys,
} from '@/api/trash/trash'
import { useActiveWorkspaceId } from '@/hooks/useWorkspaceQueries'
import { mapDailyEntryDetail } from '@/utils/diary-list/diaryListMapper'

const TRASH_PAGE_SIZE = 10

export const useGetTrashDailyEntries = () => {
  return useSuspenseInfiniteQuery({
    queryKey: trashQueryKeys.lists(),
    queryFn: ({ pageParam }) => getTrashDailyEntries({ page: pageParam, size: TRASH_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
  })
}

export const useGetTrashDailyEntryDetail = (dailyEntryId: string) => {
  return useSuspenseQuery({
    queryKey: trashQueryKeys.detail(dailyEntryId),
    queryFn: () => getTrashDailyEntryDetail(dailyEntryId),
    select: mapDailyEntryDetail,
  })
}

export const useRestoreDailyEntry = () => {
  const queryClient = useQueryClient()
  const activeWorkspaceId = useActiveWorkspaceId()

  return useMutation({
    mutationFn: restoreDailyEntry,

    onSuccess: (_data, dailyEntryId) => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: trashQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: dailyEntryQueryKeys.all }),
        queryClient.resetQueries({
          queryKey: dailyEntryQueryKeys.detail(activeWorkspaceId, dailyEntryId),
        }),
        queryClient.invalidateQueries({ queryKey: homeQueryKeys.all(activeWorkspaceId) }),
      ])
    },
  })
}

export const useDeleteDailyEntryPermanently = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDailyEntryPermanently,

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: trashQueryKeys.lists() })
    },
  })
}
