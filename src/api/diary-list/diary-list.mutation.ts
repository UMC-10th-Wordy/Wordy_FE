import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteDailyEntry } from './diary-list.api'
import { diaryListQueryKeys } from './diary-list.query'

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
