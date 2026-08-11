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
  extraTaskCount: number
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
}

export interface DiaryListApiResponse<T> {
  success: boolean
  code: string
  message: string
  result: T | null
}

export interface DailyEntryTag {
  tagName: string
  color: string
}

/* 업무 일지 생성 */
// POST /daily-entries

export interface CreateDailyEntryPayload {
  title?: string
  entryDate: string
  reflectionContent: string
}

export interface CreateDailyEntryResult {
  dailyEntryId: string
  title: string
  entryDate: string
  reflectionContent: string
  linkedTaskCount: number
  createdAt: string
}

export interface DailyEntryByDateResult {
  dailyEntryId: string
  entryDate: string
  reflectionContent: string
}

export type DailyEntryByDateResponse = DiaryListApiResponse<DailyEntryByDateResult>

/* 일지 모아보기 요약 조회: 이번 달 작성 수, 연속 작성, 최다 기록 카테고리 */
// GET /daily-entries/summary

export interface DailyEntriesMonthlyCount {
  count: number
  diffFromLastMonth: number
}

export interface DailyEntriesStreak {
  currentStreak: number
  maxStreak: number
}

export interface DailyEntriesTopCategory {
  tagName: string | null
  color: string | null
  percentage: number
}

export interface DailyEntriesSummaryResult {
  monthlyCount: DailyEntriesMonthlyCount
  streak: DailyEntriesStreak
  topCategory: DailyEntriesTopCategory
}

export type DailyEntriesSummaryResponse = DiaryListApiResponse<DailyEntriesSummaryResult>

/* 월별 기록 목록 조회: 월별 작성 일수, 상위 태그, 월간 요약 */
// GET /daily-entries/monthly

export interface MonthlyDailyEntryRecord {
  yearMonth: string
  year: number
  month: number
  totalDays: number
  tags: DailyEntryTag[]
  summary: string
}

export type MonthlyDailyEntriesResponse = DiaryListApiResponse<MonthlyDailyEntryRecord[]>

/* 특정 월의 일자별 업무 일지 조회: 대표 업무, 추가 업무 수, 성과 요약 */
// GET /daily-entries/monthly/{yearMonth}

export interface MonthlyDailyEntry {
  dailyEntryId: string
  entryDate: string
  day: number
  tags: DailyEntryTag[]
  mainTaskTitle: string
  extraTaskCount: number
  summary: string
}

export type MonthlyDailyEntriesDetailResponse = DiaryListApiResponse<MonthlyDailyEntry[]>

/* 일지 삭제 */
// DELETE /daily-entries/{dailyEntryId}
export interface DailyEntryDeleteResult {
  dailyEntryId: string
}

export type DailyEntryDeleteResponse = DiaryListApiResponse<DailyEntryDeleteResult>
