import type { HomeTaskDto, HomeWeekRecordDto, HomeWeekTaskDto } from '@/types/home'
import type { TodayTask } from '@/components/home/TodayTaskCard/TodayTaskCard'
import type { WeeklyTask, WeeklyDay } from '@/components/home/WeeklyTaskRecord/WeeklyTaskRecord'
import type { RecentRecordTask } from '@/components/home/RecentRecordCard/RecentRecordCard'
import type { DayRecord } from '@/components/home/StreakCard/StreakCard'
import { WEEK_DAYS } from '@/components/home/constants'
import { hexToTagColor } from './tagMapper'
import { PRIORITY_FROM_API } from './taskMapper'

const toLocalDate = (isoDate: string): Date => {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function mapHomeTaskToTodayTask(dto: HomeTaskDto): TodayTask {
  return {
    id: dto.taskId,
    title: dto.title,
    project: dto.tag?.tagName,
    projectColor: dto.tag ? hexToTagColor(dto.tag.color) : undefined,
  }
}

export function mapHomeTaskToWeeklyTask(dto: HomeTaskDto): WeeklyTask {
  return {
    id: dto.taskId,
    title: dto.title,
    priority: PRIORITY_FROM_API[dto.priority],
  }
}

export function mapHomeTaskToRecentRecordTask(dto: HomeTaskDto): RecentRecordTask {
  return {
    id: dto.taskId,
    title: dto.title,
    project: dto.tag?.tagName,
    projectColor: dto.tag ? hexToTagColor(dto.tag.color) : undefined,
  }
}

export function mapWeekTasksToWeeklyDays(
  weekTasks: HomeWeekTaskDto[],
  weekRecords: HomeWeekRecordDto[],
): WeeklyDay[] {
  const recordDates = new Set(weekRecords.filter((r) => r.hasRecord).map((r) => r.date))
  return weekTasks.map(({ date, tasks }) => ({
    date: toLocalDate(date).getDate(),
    day: WEEK_DAYS[toLocalDate(date).getDay()],
    fullDate: date,
    hasRecord: recordDates.has(date),
    tasks: tasks.map(mapHomeTaskToWeeklyTask),
  }))
}

export function mapWeekRecordsToDayRecords(records: HomeWeekRecordDto[]): DayRecord[] {
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  return records.map(({ date, hasRecord, isConnected }): DayRecord => {
    if (date > todayKey) return 'none'
    if (!hasRecord) return 'fail'
    return isConnected ? 'success' : 'success-dim'
  })
}

export function formatRecordDate(isoDate: string): string {
  const localDate = toLocalDate(isoDate)
  const [year, month, day] = isoDate.split('-').map(Number)
  return `${year}년 ${month}월 ${day}일 ${WEEK_DAYS[localDate.getDay()]}요일`
}
