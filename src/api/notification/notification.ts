import { request } from '@/lib/httpClient'

import type {
  NotificationResult,
  NotificationSettingKey,
  NotificationSettingsResult,
  ReadNotificationResult,
  UpdateNotificationSettingResult,
} from '@/types/notification'

export const getNotifications = async (): Promise<NotificationResult[]> => {
  return request<NotificationResult[]>('/notifications', {
    method: 'GET',
  })
}

export const readNotification = async (notificationId: string): Promise<ReadNotificationResult> => {
  return request<ReadNotificationResult>(
    `/notifications/${encodeURIComponent(notificationId)}/read`,
    { method: 'PATCH' },
  )
}

export const getNotificationSettings = async (): Promise<NotificationSettingsResult> => {
  return request<NotificationSettingsResult>('/notification-settings', {
    method: 'GET',
  })
}

export const updateNotificationSetting = async (
  settingKey: NotificationSettingKey,
  isEnabled: boolean,
): Promise<UpdateNotificationSettingResult> => {
  return request<UpdateNotificationSettingResult>(`/notification-settings/${settingKey}`, {
    method: 'PATCH',
    body: JSON.stringify({ isEnabled }),
  })
}

export const notificationQueryKeys = {
  all: ['notification'] as const,

  lists: () => [...notificationQueryKeys.all, 'list'] as const,
  settings: () => [...notificationQueryKeys.all, 'settings'] as const,
}
