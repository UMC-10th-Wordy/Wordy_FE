import {
  DAILY_ENTRIES_SUMMARY_RESPONSE_MOCK,
  DAILY_ENTRY_DETAIL_RESPONSE_MOCK_MAP,
  DAILY_ENTRY_SEARCH_ITEMS_MOCK,
  MONTHLY_DAILY_ENTRIES_RESPONSE_MOCK,
  MONTHLY_DAILY_ENTRY_RESPONSE_MOCK_MAP,
} from '@/mocks/diaryListApiMock'

import type {
  DailyEntriesSummaryResult,
  DailyEntryDeleteResponse,
  DailyEntryDeleteResult,
  DailyEntryDetailResult,
  DailyEntrySearchParams,
  DailyEntrySearchResponse,
  DailyEntrySearchResult,
  MonthlyDailyEntry,
  MonthlyDailyEntryRecord,
} from '@/types/api/diaryList'

const MOCK_API_DELAY = 300

const DELETED_DAILY_ENTRY_IDS = new Set<string>()

const wait = (milliseconds: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

const isDeletedDailyEntry = (dailyEntryId: string) => {
  return DELETED_DAILY_ENTRY_IDS.has(dailyEntryId)
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

  const entries = MONTHLY_DAILY_ENTRY_RESPONSE_MOCK_MAP[yearMonth]?.result ?? []

  return entries.filter((entry) => !isDeletedDailyEntry(entry.dailyEntryId))
}

export const searchDailyEntries = async ({
  query,
  sort,
}: DailyEntrySearchParams): Promise<DailyEntrySearchResult> => {
  await wait(MOCK_API_DELAY)

  const keyword = query.trim()
  const normalizedKeyword = keyword.toLocaleLowerCase()

  if (!normalizedKeyword) {
    const emptyResponse: DailyEntrySearchResponse = {
      success: true,
      code: 'S200',
      message: '조회에 성공했습니다.',
      result: {
        keyword: '',
        entryCount: 0,
        tagCount: 0,
        results: [],
      },
    }

    return emptyResponse.result
  }

  const searchableEntries = DAILY_ENTRY_SEARCH_ITEMS_MOCK.filter(
    (entry) => !isDeletedDailyEntry(entry.dailyEntryId),
  )

  const titleMatchedEntries = searchableEntries.filter((entry) =>
    entry.title.toLocaleLowerCase().includes(normalizedKeyword),
  )

  const matchedTagNames = new Set(
    searchableEntries.flatMap((entry) =>
      entry.tags
        .filter((tag) => tag.tagName.toLocaleLowerCase().includes(normalizedKeyword))
        .map((tag) => tag.tagName.toLocaleLowerCase()),
    ),
  )

  const matchedEntries = searchableEntries.filter((entry) => {
    const isTitleMatched = entry.title.toLocaleLowerCase().includes(normalizedKeyword)

    const isTagMatched = entry.tags.some((tag) =>
      tag.tagName.toLocaleLowerCase().includes(normalizedKeyword),
    )

    return isTitleMatched || isTagMatched
  })
  const sortedEntries = [...matchedEntries].sort((firstEntry, secondEntry) => {
    const firstEntryTime = new Date(firstEntry.entryDate).getTime()
    const secondEntryTime = new Date(secondEntry.entryDate).getTime()

    return sort === 'latest' ? secondEntryTime - firstEntryTime : firstEntryTime - secondEntryTime
  })

  const response: DailyEntrySearchResponse = {
    success: true,
    code: 'S200',
    message: '조회에 성공했습니다.',
    result: {
      keyword,
      entryCount: titleMatchedEntries.length,
      tagCount: matchedTagNames.size,
      results: sortedEntries,
    },
  }

  return response.result
}

export const getDailyEntryDetail = async (
  dailyEntryId: string,
): Promise<DailyEntryDetailResult> => {
  await wait(MOCK_API_DELAY)

  if (isDeletedDailyEntry(dailyEntryId)) {
    throw new Error('삭제된 업무 일지입니다.')
  }

  const response = DAILY_ENTRY_DETAIL_RESPONSE_MOCK_MAP[dailyEntryId]

  if (!response) {
    throw new Error('업무 일지를 찾을 수 없습니다.')
  }

  return response.result
}

export const deleteDailyEntry = async (dailyEntryId: string): Promise<DailyEntryDeleteResult> => {
  await wait(MOCK_API_DELAY)

  const detailResponse = DAILY_ENTRY_DETAIL_RESPONSE_MOCK_MAP[dailyEntryId]

  if (!detailResponse || isDeletedDailyEntry(dailyEntryId)) {
    throw new Error('삭제할 업무 일지를 찾을 수 없습니다.')
  }

  DELETED_DAILY_ENTRY_IDS.add(dailyEntryId)

  const response: DailyEntryDeleteResponse = {
    success: true,
    code: 'S200',
    message: '삭제에 성공했습니다.',
    result: {
      dailyEntryId,
    },
  }

  return response.result
}
