import {
  DAILY_ENTRIES_SUMMARY_RESPONSE_MOCK,
  DAILY_ENTRY_SEARCH_ITEMS_MOCK,
  MONTHLY_DAILY_ENTRIES_RESPONSE_MOCK,
  MONTHLY_DAILY_ENTRY_RESPONSE_MOCK_MAP,
} from '@/mocks/diaryListApiMock'

import type {
  DailyEntriesSummaryResult,
  DailyEntrySearchParams,
  DailyEntrySearchResponse,
  DailyEntrySearchResult,
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

  const titleMatchedEntries = DAILY_ENTRY_SEARCH_ITEMS_MOCK.filter((entry) =>
    entry.title.toLocaleLowerCase().includes(normalizedKeyword),
  )

  const matchedTagNames = new Set(
    DAILY_ENTRY_SEARCH_ITEMS_MOCK.flatMap((entry) =>
      entry.tags
        .filter((tag) => tag.tagName.toLocaleLowerCase().includes(normalizedKeyword))
        .map((tag) => tag.tagName.toLocaleLowerCase()),
    ),
  )

  const matchedEntries = DAILY_ENTRY_SEARCH_ITEMS_MOCK.filter((entry) => {
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
