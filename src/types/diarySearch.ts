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
// GET /workspaces/{workspaceId}/daily-entries/search

export type DailyEntrySearchSort = 'latest' | 'oldest'

export interface DailyEntrySearchParams {
  query: string
  sort: DailyEntrySearchSort
}

/* 업무 일지 탭 결과 */
export interface DailyEntrySearchItem {
  dailyEntryId: string
  workspaceId: string
  entryDate: string
  tags: DailyEntryTag[]
  title: string
}

/* 프로젝트 태그 탭 내부 일지 */
export interface DailyEntryTagSearchDiary {
  dailyEntryId: string
  workspaceId: string
  entryDate: string
  title: string
}

/* 프로젝트 태그 탭 결과 */
export interface DailyEntryTagSearchItem {
  tagName: string
  color: string
  diaries: DailyEntryTagSearchDiary[]
}

export interface DailyEntryJournalSearchTabResult {
  count: number
  results: DailyEntrySearchItem[]
}

export interface DailyEntryTagSearchTabResult {
  count: number
  results: DailyEntryTagSearchItem[]
}

export interface DailyEntrySearchResult {
  keyword: string
  journalTab: DailyEntryJournalSearchTabResult
  tagTab: DailyEntryTagSearchTabResult
}

export type DailyEntrySearchResponse = DiaryListApiResponse<DailyEntrySearchResult>
