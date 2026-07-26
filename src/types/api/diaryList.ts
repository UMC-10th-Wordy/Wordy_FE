export interface DiaryListApiResponse<T> {
  success: boolean
  code: string
  message: string
  result: T
}

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
  tagName: string
  color: string
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

export interface DailyEntryTag {
  tagName: string
  color: string
}

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

/* 일지 검색 */
// GET /daily-entries/search

export type DailyEntrySearchSort = 'latest' | 'oldest'

export interface DailyEntrySearchParams {
  query: string
  sort: DailyEntrySearchSort
}

export interface DailyEntrySearchItem {
  dailyEntryId: string
  entryDate: string
  tags: DailyEntryTag[]
  title: string
}

export interface DailyEntrySearchResult {
  keyword: string
  entryCount: number
  tagCount: number
  results: DailyEntrySearchItem[]
}

export type DailyEntrySearchResponse = DiaryListApiResponse<DailyEntrySearchResult>
