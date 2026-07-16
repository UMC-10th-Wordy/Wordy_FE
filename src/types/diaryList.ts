import type { ProjectTagColor } from '@/components/todo/ProjectTag'

export interface DiarySummaryData {
  currentMonthCount: number
  previousMonthCount: number
  currentStreakDays: number
  bestStreakDays: number
  mostUsedTagName: string
  mostUsedTagRatio: number
}

export interface DiaryProjectTag {
  id: string
  label: string
  color: ProjectTagColor
}

export interface DiaryRepresentativeTask {
  id: string
  title: string
  projectTag?: DiaryProjectTag
}

export interface MonthlyDiaryEntry {
  id: string
  date: string
  day: number
  totalTaskCount: number
  representativeTask: DiaryRepresentativeTask
  performanceSummary: string
}

export interface MonthlyDiaryRecord {
  id: string
  year: number
  month: number
  diaryDayCount: number
  topProjectTags: DiaryProjectTag[]
  monthlySummary: string
  entries: MonthlyDiaryEntry[]
}
