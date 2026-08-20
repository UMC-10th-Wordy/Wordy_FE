import { request } from '@/lib/httpClient'

import type {
  NotificationListResult,
  NotificationSettingKey,
  NotificationSettingsResult,
  NotificationStatusFilter,
  ReadNotificationResult,
  UpdateNotificationSettingResult,
} from '@/types/notification'

function withWorkspace(workspaceId: string, path: string): string {
  return `/workspaces/${encodeURIComponent(workspaceId)}${path}`
}

export const getNotifications = async (
  workspaceId: string,
  params?: { status?: NotificationStatusFilter; page?: number; size?: number },
): Promise<NotificationListResult> => {
  const searchParams = new URLSearchParams()
  if (params?.status) searchParams.set('status', params.status)
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.size) searchParams.set('size', String(params.size))
  const query = searchParams.toString()

  return request<NotificationListResult>(
    withWorkspace(workspaceId, `/notifications${query ? `?${query}` : ''}`),
    { method: 'GET' },
  )
}

export const readNotification = async (
  workspaceId: string,
  notificationId: string,
): Promise<ReadNotificationResult> => {
  return request<ReadNotificationResult>(
    withWorkspace(workspaceId, `/notifications/${encodeURIComponent(notificationId)}/read`),
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

  lists: (workspaceId: string) => [...notificationQueryKeys.all, 'list', workspaceId] as const,
  settings: () => [...notificationQueryKeys.all, 'settings'] as const,
}
