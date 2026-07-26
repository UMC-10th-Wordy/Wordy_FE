import { hexToTagColor } from '@/utils/tagMapper'

import type {
  DailyEntrySearchItem,
  DailyEntrySearchResult,
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
import type {
  DiarySearchDiary,
  DiarySearchProjectTag,
  DiarySearchResultData,
  DiarySearchTagResult,
} from '@/types/diarySearch'

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
const mapDiarySearchProjectTag = (tag: DailyEntryTag): DiarySearchProjectTag => {
  return {
    name: tag.tagName,
    color: hexToTagColor(tag.color),
  }
}

const mapDiarySearchDiary = (
  entry: DailyEntrySearchItem,
  displayedTag?: DailyEntryTag,
): DiarySearchDiary => {
  const representativeTag = displayedTag ?? entry.tags[0]

  return {
    id: entry.dailyEntryId,
    entryDate: entry.entryDate,
    title: entry.title,
    tag: representativeTag ? mapDiarySearchProjectTag(representativeTag) : undefined,
  }
}

const mapDiarySearchTagResults = (result: DailyEntrySearchResult): DiarySearchTagResult[] => {
  const normalizedKeyword = result.keyword.trim().toLocaleLowerCase()
  const tagResultMap = new Map<string, DiarySearchTagResult>()

  result.results.forEach((entry) => {
    entry.tags.forEach((tag) => {
      const normalizedTagName = tag.tagName.toLocaleLowerCase()

      if (!normalizedTagName.includes(normalizedKeyword)) {
        return
      }

      const tagKey = `${normalizedTagName}-${tag.color.toLocaleLowerCase()}`
      const existingTagResult = tagResultMap.get(tagKey)
      const diary = mapDiarySearchDiary(entry, tag)

      if (existingTagResult) {
        existingTagResult.diaries.push(diary)
        return
      }

      tagResultMap.set(tagKey, {
        name: tag.tagName,
        color: hexToTagColor(tag.color),
        diaries: [diary],
      })
    })
  })

  return Array.from(tagResultMap.values())
}

export const mapDailyEntrySearchResult = (
  result: DailyEntrySearchResult,
): DiarySearchResultData => {
  const normalizedKeyword = result.keyword.trim().toLocaleLowerCase()

  const diaries = result.results
    .filter((entry) => entry.title.toLocaleLowerCase().includes(normalizedKeyword))
    .map((entry) => mapDiarySearchDiary(entry))

  const tagResults = mapDiarySearchTagResults(result)

  return {
    keyword: result.keyword,
    diaryCount: result.entryCount,
    projectTagCount: result.tagCount,
    diaries,
    tagResults,
  }
}
