import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteDailyEntry } from './diaryList.api'
import { diaryListQueryKeys } from './diaryList.query'

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
