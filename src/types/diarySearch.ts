import type { ProjectTagColor } from '@/components/todo/ProjectTag'
import type { DailyEntryTag, DiaryListApiResponse } from '@/types/diaryList'

export type DiarySearchTab = 'diary' | 'projectTag'
export type DiarySearchSort = DailyEntrySearchSort

export interface DiarySearchProjectTag {
  name: string
  color: ProjectTagColor
}

export interface DiarySearchDiary {
  id: string
  entryDate: string
  title: string
  tag?: DiarySearchProjectTag
}

export interface DiarySearchTagResult {
  name: string
  color: ProjectTagColor
  diaries: DiarySearchDiary[]
}

export interface DiarySearchResultData {
  keyword: string
  diaryCount: number
  projectTagCount: number
  diaries: DiarySearchDiary[]
  tagResults: DiarySearchTagResult[]
}

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
