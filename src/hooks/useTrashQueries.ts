import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { dailyEntryQueryKeys } from '@/api/daily-entry/dailyEntry'
import { homeQueryKeys } from '@/api/home/home'
import {
  deleteDailyEntryPermanently,
  getTrashDailyEntries,
  restoreDailyEntry,
  trashQueryKeys,
} from '@/api/trash/trash'

export const useGetTrashDailyEntries = () => {
  return useSuspenseQuery({
    queryKey: trashQueryKeys.lists(),
    queryFn: getTrashDailyEntries,
  })
}

export const useRestoreDailyEntry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: restoreDailyEntry,

    onSuccess: (_data, dailyEntryId) => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: trashQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: dailyEntryQueryKeys.all }),
        queryClient.resetQueries({ queryKey: dailyEntryQueryKeys.detail(dailyEntryId) }),
        queryClient.invalidateQueries({ queryKey: homeQueryKeys.all }),
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
