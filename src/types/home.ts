import type { ApiEnvelope } from '@/types/api'
import type { ApiTaskPriority, ApiTaskStatus } from '@/types/task'

export type HomePlan = 'FREE' | 'PRO'

export interface HomeTaskTagDto {
  tagId: string
  tagName: string
  color: string
}

export interface HomeTaskDto {
  taskId: string
  title: string
  priority: ApiTaskPriority
  status: ApiTaskStatus
  tag: HomeTaskTagDto | null
}

export interface HomeWeekRecordDto {
  date: string
  hasRecord: boolean
  isConnected: boolean
}

export interface HomeWeekTaskDto {
  date: string
  tasks: HomeTaskDto[]
}

export interface HomeRecentRecordDto {
  date: string
  tasks: HomeTaskDto[]
}

export interface HomeLandingResult {
  screenType: 'landing'
  plan: HomePlan
}

export interface HomeDashboardResult {
  screenType: 'dashboard'
  plan: HomePlan
  userName: string
  todayTasks: HomeTaskDto[]
  streakDays: number
  weekRecords: HomeWeekRecordDto[]
  weekTasks: HomeWeekTaskDto[]
  recentRecord: HomeRecentRecordDto[]
}

export type HomeResult = HomeLandingResult | HomeDashboardResult

export type HomeResponse = ApiEnvelope<HomeResult>
