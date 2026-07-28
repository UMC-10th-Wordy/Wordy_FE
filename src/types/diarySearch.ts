import type { ProjectTagColor } from '@/components/todo/ProjectTag'
import type { DailyEntrySearchSort } from '@/types/api/diaryList'

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
