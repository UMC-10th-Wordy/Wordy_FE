import type { DiaryListApiResponse } from '@/types/diaryList'

/* 알림 목록 조회 */
// GET /notifications

export interface NotificationResult {
  notificationId: string
  type: string
  title: string
  content: string
  redirectUrl: string
  isRead: boolean
  createdAt: string
}

export type NotificationsResponse = DiaryListApiResponse<NotificationResult[]>

/* 알림 읽음 처리 */
// PATCH /notifications/{notificationId}/read

export interface ReadNotificationResult {
  notificationId: string
  isRead: boolean
  redirectUrl: string
}

export type ReadNotificationResponse = DiaryListApiResponse<ReadNotificationResult>

/* 알림 설정 조회 */
// GET /notification-settings

export interface NotificationSettingsResult {
  emailMarketing: boolean
  inboxMarketingPromotion: boolean
  dashboardCompleted: boolean
  dashboardInduce: boolean
}

export type NotificationSettingsResponse = DiaryListApiResponse<NotificationSettingsResult>

/* 알림 설정 항목 하나 수정 */
// PATCH /notification-settings/{settingKey}

export type NotificationSettingKey =
  'EMAIL_MARKETING' | 'INBOX_MARKETING_PROMOTION' | 'DASHBOARD_COMPLETED' | 'DASHBOARD_INDUCE'

export interface UpdateNotificationSettingRequest {
  isEnabled: boolean
}

export interface UpdateNotificationSettingResult {
  settingKey: NotificationSettingKey
  isEnabled: boolean
}

export type UpdateNotificationSettingResponse =
  DiaryListApiResponse<UpdateNotificationSettingResult>
