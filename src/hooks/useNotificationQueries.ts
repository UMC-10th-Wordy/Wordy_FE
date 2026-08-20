import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getNotificationSettings,
  getNotifications,
  notificationQueryKeys,
  readNotification,
  updateNotificationSetting,
} from '@/api/notification/notification'
import { useActiveWorkspaceId } from '@/hooks/useWorkspaceQueries'
import type { NotificationListResult, NotificationSettingKey } from '@/types/notification'

// 서버가 허용하는 size 최댓값. 사이드바 배지 카운트는 totalCount를 쓰므로 이 값과 무관하게 정확함
const UNREAD_NOTIFICATION_LIST_SIZE = 50

export const useGetNotifications = () => {
  const workspaceId = useActiveWorkspaceId()

  return useQuery({
    queryKey: notificationQueryKeys.lists(workspaceId),
    queryFn: () =>
      getNotifications(workspaceId, { status: 'unread', size: UNREAD_NOTIFICATION_LIST_SIZE }),
    enabled: Boolean(workspaceId),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 10 * 60 * 1000,
  })
}

export const useReadNotification = () => {
  const queryClient = useQueryClient()
  const workspaceId = useActiveWorkspaceId()

  return useMutation({
    mutationFn: (notificationId: string) => readNotification(workspaceId, notificationId),

    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationQueryKeys.lists(workspaceId) })

      const previousData = queryClient.getQueryData<NotificationListResult>(
        notificationQueryKeys.lists(workspaceId),
      )

      queryClient.setQueryData<NotificationListResult>(
        notificationQueryKeys.lists(workspaceId),
        (old) => {
          if (!old) return old
          if (!old.items.some((item) => item.notificationId === notificationId)) return old

          return {
            ...old,
            items: old.items.filter((item) => item.notificationId !== notificationId),
            totalCount: Math.max(old.totalCount - 1, 0),
          }
        },
      )

      return { previousData }
    },

    onError: (_error, _notificationId, context) => {
      if (!context?.previousData) return

      queryClient.setQueryData(notificationQueryKeys.lists(workspaceId), context.previousData)
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.lists(workspaceId) })
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
