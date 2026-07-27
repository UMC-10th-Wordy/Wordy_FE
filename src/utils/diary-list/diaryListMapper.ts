import { hexToTagColor } from '@/utils/tagMapper'

import type {
  DailyEntriesSummaryResult,
  DailyEntryTag,
  MonthlyDailyEntry,
  MonthlyDailyEntryRecord,
} from '@/types/api/diaryList'
import type {
  DiaryProjectTag,
  DiarySummaryData,
  MonthlyDiaryEntry,
  MonthlyDiaryRecord,
} from '@/types/diaryList'

const mapDiaryProjectTag = (tag: DailyEntryTag, id: string): DiaryProjectTag => {
  return {
    id,
    label: tag.tagName,
    color: hexToTagColor(tag.color),
  }
}

export const mapDailyEntriesSummary = (result: DailyEntriesSummaryResult): DiarySummaryData => {
  const previousMonthCount = Math.max(
    result.monthlyCount.count - result.monthlyCount.diffFromLastMonth,
    0,
  )

  return {
    currentMonthCount: result.monthlyCount.count,
    previousMonthCount,
    currentStreakDays: result.streak.currentStreak,
    bestStreakDays: result.streak.maxStreak,
    mostUsedTagName: result.topCategory.tagName,
    mostUsedTagRatio: result.topCategory.percentage,
  }
}

export const mapMonthlyDiaryRecords = (
  records: MonthlyDailyEntryRecord[],
): MonthlyDiaryRecord[] => {
  return records.map((record) => ({
    id: record.yearMonth,
    year: record.year,
    month: record.month,
    diaryDayCount: record.totalDays,
    topProjectTags: record.tags.map((tag, index) =>
      mapDiaryProjectTag(tag, `${record.yearMonth}-${tag.tagName}-${index}`),
    ),
    monthlySummary: record.summary,
  }))
}

export const mapMonthlyDiaryEntries = (entries: MonthlyDailyEntry[]): MonthlyDiaryEntry[] => {
  return entries.map((entry) => {
    const representativeTag = entry.tags[0]

    return {
      id: entry.dailyEntryId,
      date: entry.entryDate,
      day: entry.day,
      extraTaskCount: entry.extraTaskCount,
      representativeTask: {
        id: `${entry.dailyEntryId}-main-task`,
        title: entry.mainTaskTitle,
        projectTag: representativeTag
          ? mapDiaryProjectTag(
              representativeTag,
              `${entry.dailyEntryId}-${representativeTag.tagName}`,
            )
          : undefined,
      },
      performanceSummary: entry.summary,
    }
  })
}
