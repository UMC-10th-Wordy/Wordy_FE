import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getNotificationSettings,
  getNotifications,
  notificationQueryKeys,
  readNotification,
  updateNotificationSetting,
} from '@/api/notification/notification'
import type { NotificationResult, NotificationSettingKey } from '@/types/notification'

export const useGetNotifications = () => {
  return useQuery({
    queryKey: notificationQueryKeys.lists(),
    queryFn: getNotifications,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 10 * 60 * 1000,
  })
}

export const useReadNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: readNotification,

    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationQueryKeys.lists() })

      const previousItem = queryClient
        .getQueryData<NotificationResult[]>(notificationQueryKeys.lists())
        ?.find((item) => item.notificationId === notificationId)

      queryClient.setQueryData<NotificationResult[]>(notificationQueryKeys.lists(), (old) =>
        old?.map((item) =>
          item.notificationId === notificationId ? { ...item, isRead: true } : item,
        ),
      )

      return { previousItem }
    },

    onError: (_error, notificationId, context) => {
      if (!context?.previousItem) return

      queryClient.setQueryData<NotificationResult[]>(notificationQueryKeys.lists(), (old) =>
        old?.map((item) => (item.notificationId === notificationId ? context.previousItem! : item)),
      )
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.lists() })
    },
  })
}

export const useGetNotificationSettings = () => {
  return useQuery({
    queryKey: notificationQueryKeys.settings(),
    queryFn: getNotificationSettings,
  })
}

export const useUpdateNotificationSetting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      settingKey,
      isEnabled,
    }: {
      settingKey: NotificationSettingKey
      isEnabled: boolean
    }) => updateNotificationSetting(settingKey, isEnabled),

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.settings() })
    },
  })
}
