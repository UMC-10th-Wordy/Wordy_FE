import type { DiarySummaryData } from '@/types/diaryList'

export const DIARY_SUMMARY_MOCK: DiarySummaryData = {
  currentMonthCount: 4,
  previousMonthCount: 2,
  currentStreakDays: 12,
  bestStreakDays: 21,
  mostUsedTagName: '온보딩 리뉴얼',
  mostUsedTagRatio: 38,
}

export const EMPTY_DIARY_SUMMARY_MOCK: DiarySummaryData = {
  currentMonthCount: 0,
  previousMonthCount: 0,
  currentStreakDays: 0,
  bestStreakDays: 0,
  mostUsedTagName: '',
  mostUsedTagRatio: 0,
}
