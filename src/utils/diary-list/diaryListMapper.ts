import { hexToTagColor } from '@/utils/tagMapper'

import type {
  DailyEntriesSummaryResult,
  DailyEntryTag,
  DiaryProjectTag,
  DiarySummaryData,
  MonthlyDailyEntry,
  MonthlyDailyEntryRecord,
  MonthlyDiaryEntry,
  MonthlyDiaryRecord,
} from '@/types/diaryList'
import type {
  DailyEntryAttachment,
  DailyEntryDetailResult,
  DailyEntryDetailTask,
  DailyEntryTaskPriority,
  DiaryDetailContentData,
} from '@/types/diaryDetail'
import type {
  DailyEntrySearchItem,
  DailyEntrySearchResult,
  DiarySearchDiary,
  DiarySearchProjectTag,
  DiarySearchResultData,
  DiarySearchTagResult,
} from '@/types/diarySearch'
import type { Task, TaskPriority, TaskResultFile, TaskResultImage } from '@/types/todo'

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
    mostUsedTagName: result.topCategory.tagName ?? '',
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

      const existingTagResult = tagResultMap.get(normalizedTagName)
      const diary = mapDiarySearchDiary(entry, tag)

      if (existingTagResult) {
        existingTagResult.diaries.push(diary)
        return
      }

      tagResultMap.set(normalizedTagName, {
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

const mapDailyEntryTaskPriority = (priority: DailyEntryTaskPriority): TaskPriority => {
  const priorityMap: Record<DailyEntryTaskPriority, TaskPriority> = {
    MUST_DO: 'must',
    SHOULD_DO: 'should',
    COULD_DO: 'could',
  }

  return priorityMap[priority]
}

const createAttachmentId = (
  taskResultId: string,
  attachment: DailyEntryAttachment,
  index: number,
) => {
  return `${taskResultId}-${attachment.fileType}-${index}`
}

const mapDailyEntryResultFiles = (task: DailyEntryDetailTask): TaskResultFile[] => {
  const result = task.result

  if (!result) {
    return []
  }

  return result.attachments
    .filter((attachment) => attachment.fileType === 'file')
    .map((attachment, index) => ({
      id: createAttachmentId(result.taskResultId, attachment, index),
      name: attachment.fileName,
      url: attachment.fileUrl,
    }))
}

const mapDailyEntryResultImages = (task: DailyEntryDetailTask): TaskResultImage[] => {
  const result = task.result

  if (!result) {
    return []
  }

  return result.attachments
    .filter((attachment) => attachment.fileType === 'img')
    .map((attachment, index) => ({
      id: createAttachmentId(result.taskResultId, attachment, index),
      name: attachment.fileName,
      url: attachment.fileUrl,
    }))
}

const mapDailyEntryTaskResultContent = (task: DailyEntryDetailTask): string | undefined => {
  return task.result?.content.trim() || undefined
}

const mapDailyEntryDetailTask = (task: DailyEntryDetailTask, entryDate: string): Task => {
  const resultFiles = mapDailyEntryResultFiles(task)
  const resultImages = mapDailyEntryResultImages(task)
  const result = mapDailyEntryTaskResultContent(task)

  return {
    id: task.taskId,
    date: entryDate,
    title: task.title,
    memo: task.memo || undefined,
    tag: task.tag
      ? {
          label: task.tag.tagName,
          color: hexToTagColor(task.tag.color),
        }
      : undefined,
    priority: mapDailyEntryTaskPriority(task.priority),
    isCompleted: task.status === 'COMPLETED',
    result,
    resultFiles: resultFiles.length > 0 ? resultFiles : undefined,
    resultImages: resultImages.length > 0 ? resultImages : undefined,
  }
}

export const mapDailyEntryDetail = (result: DailyEntryDetailResult): DiaryDetailContentData => {
  return {
    id: result.dailyEntryId,
    date: result.entryDate,
    tasks: result.tasks.map((task) => mapDailyEntryDetailTask(task, result.entryDate)),
    retrospective: result.reflectionContent,
    completedCount: result.completedCount,
    incompleteCount: result.incompleteCount,
  }
}
