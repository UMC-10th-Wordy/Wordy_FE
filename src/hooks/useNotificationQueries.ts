import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getNotificationSettings,
  getNotifications,
  notificationQueryKeys,
  readNotification,
  updateNotificationSetting,
} from '@/api/notification/notification'
import type { NotificationSettingKey } from '@/types/notification'

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

    onSuccess: () => {
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
