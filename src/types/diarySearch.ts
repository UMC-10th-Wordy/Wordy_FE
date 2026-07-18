import type { ProjectTagColor } from '@/components/todo/ProjectTag'

export type DiarySearchTab = 'diary' | 'projectTag'
export type DiarySearchSort = 'latest' | 'oldest'

export interface DiarySearchProjectTag {
  id: string
  name: string
  color: ProjectTagColor
}

export interface DiarySearchDiary {
  id: string
  createdAt: string
  displayDate: string
  title: string
  tag?: DiarySearchProjectTag
}

export interface DiarySearchTagResult {
  id: string
  name: string
  color: ProjectTagColor
  latestDiaryCreatedAt: string
  diaries: DiarySearchDiary[]
}
