import { useState, useTransition } from 'react'

import { useGetDailyEntrySearch } from '@/hooks/useDiaryListQueries'
import { DiarySearchEmptyState } from '@/components/diary-search/DiarySearchEmptyState'
import { DiarySearchHeader } from '@/components/diary-search/DiarySearchHeader'
import { DiarySearchList } from '@/components/diary-search/DiarySearchList'
import { TagSearchList } from '@/components/diary-search/TagSearchList'

import type { DiarySearchSort, DiarySearchTab } from '@/types/diarySearch'

interface DiarySearchResultsProps {
  keyword: string
  onDetailClick: (diaryId: string) => void
}

export const DiarySearchResults = ({ keyword, onDetailClick }: DiarySearchResultsProps) => {
  const [activeTab, setActiveTab] = useState<DiarySearchTab>('diary')
  const [sort, setSort] = useState<DiarySearchSort>('latest')
  const [, startTransition] = useTransition()

  const { data: searchResult } = useGetDailyEntrySearch({
    query: keyword,
    sort,
  })

  const activeResultCount =
    activeTab === 'diary' ? searchResult.diaries.length : searchResult.tagResults.length

  const handleSortChange = (nextSort: DiarySearchSort) => {
    startTransition(() => {
      setSort(nextSort)
    })
  }

  return (
    <>
      <div className="mt-(--scale-48)">
        <DiarySearchHeader
          activeTab={activeTab}
          diaryCount={searchResult.diaryCount}
          projectTagCount={searchResult.projectTagCount}
          onTabChange={setActiveTab}
        />
      </div>

      {activeResultCount === 0 ? (
        <DiarySearchEmptyState type={activeTab} />
      ) : activeTab === 'diary' ? (
        <DiarySearchList
          diaries={searchResult.diaries}
          keyword={keyword}
          sort={sort}
          onSortChange={handleSortChange}
          onDetailClick={onDetailClick}
        />
      ) : (
        <TagSearchList
          results={searchResult.tagResults}
          keyword={keyword}
          onDetailClick={onDetailClick}
        />
      )}
    </>
  )
}
