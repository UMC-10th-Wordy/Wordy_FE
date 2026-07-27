import {
  DAILY_ENTRIES_SUMMARY_RESPONSE_MOCK,
  MONTHLY_DAILY_ENTRIES_RESPONSE_MOCK,
  MONTHLY_DAILY_ENTRY_RESPONSE_MOCK_MAP,
} from '@/mocks/diaryListApiMock'

import type {
  DailyEntriesSummaryResult,
  MonthlyDailyEntry,
  MonthlyDailyEntryRecord,
} from '@/types/api/diaryList'

const MOCK_API_DELAY = 300

const wait = (milliseconds: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

export const getDailyEntriesSummary = async (): Promise<DailyEntriesSummaryResult> => {
  await wait(MOCK_API_DELAY)

  return DAILY_ENTRIES_SUMMARY_RESPONSE_MOCK.result
}

export const getMonthlyDailyEntries = async (): Promise<MonthlyDailyEntryRecord[]> => {
  await wait(MOCK_API_DELAY)

  return MONTHLY_DAILY_ENTRIES_RESPONSE_MOCK.result
}

export const getMonthlyDailyEntriesByYearMonth = async (
  yearMonth: string,
): Promise<MonthlyDailyEntry[]> => {
  await wait(MOCK_API_DELAY)

  return MONTHLY_DAILY_ENTRY_RESPONSE_MOCK_MAP[yearMonth]?.result ?? []
}
