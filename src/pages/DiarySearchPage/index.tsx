import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { SearchInput } from '@/components/common/SearchInput/SearchInput'
import { DiarySearchBackButton } from '@/components/diary-search/DiarySearchBackButton'
import { DiarySearchEmptyState } from '@/components/diary-search/DiarySearchEmptyState'
import { DiarySearchHeader } from '@/components/diary-search/DiarySearchHeader'
import { DiarySearchList } from '@/components/diary-search/DiarySearchList'
import { DiarySearchSkeleton } from '@/components/diary-search/DiarySearchSkeleton'
import { TagSearchList } from '@/components/diary-search/TagSearchList'
import {
  MOCK_DIARY_SEARCH_RESULTS,
  MOCK_TAG_SEARCH_RESULTS,
} from '@/components/diary-search/diarySearchMock'
import { useRecentSearchKeywords } from '@/hooks/useRecentSearchKeywords'

import type { DiarySearchSort, DiarySearchTab } from '@/types/diarySearch'

interface SearchInputState {
  baseKeyword: string
  value: string
}

export const DiarySearchPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const searchedKeyword = searchParams.get('keyword') ?? ''

  const [searchInputState, setSearchInputState] = useState<SearchInputState>({
    baseKeyword: searchedKeyword,
    value: searchedKeyword,
  })

  const searchKeyword =
    searchInputState.baseKeyword === searchedKeyword ? searchInputState.value : searchedKeyword

  const [activeTab, setActiveTab] = useState<DiarySearchTab>('diary')
  const [sort, setSort] = useState<DiarySearchSort>('latest')
  const [showRecentDropdown, setShowRecentDropdown] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // TODO(#71): 검색 API 연결 후 실제 요청 상태로 교체 (스켈레톤)
  const isLoading = false

  const { recentKeywords, addRecentKeyword, removeRecentKeyword, clearRecentKeywords } =
    useRecentSearchKeywords()

  const searchedDiaries = useMemo(() => {
    const normalizedKeyword = searchedKeyword.trim().toLocaleLowerCase()

    if (!normalizedKeyword) {
      return []
    }

    const filteredDiaries = MOCK_DIARY_SEARCH_RESULTS.filter((diary) =>
      diary.title.toLocaleLowerCase().includes(normalizedKeyword),
    )

    return [...filteredDiaries].sort((firstDiary, secondDiary) => {
      const firstTime = new Date(firstDiary.createdAt).getTime()
      const secondTime = new Date(secondDiary.createdAt).getTime()

      return sort === 'latest' ? secondTime - firstTime : firstTime - secondTime
    })
  }, [searchedKeyword, sort])

  const searchedTagResults = useMemo(() => {
    const normalizedKeyword = searchedKeyword.trim().toLocaleLowerCase()

    if (!normalizedKeyword) {
      return []
    }

    return MOCK_TAG_SEARCH_RESULTS.filter((result) =>
      result.name.toLocaleLowerCase().includes(normalizedKeyword),
    ).sort(
      (firstResult, secondResult) =>
        new Date(secondResult.latestDiaryCreatedAt).getTime() -
        new Date(firstResult.latestDiaryCreatedAt).getTime(),
    )
  }, [searchedKeyword])

  const handleSearch = (keyword: string) => {
    const trimmedKeyword = keyword.trim()

    if (!trimmedKeyword) {
      return
    }

    setShowRecentDropdown(false)
    setSearchInputState({
      baseKeyword: trimmedKeyword,
      value: trimmedKeyword,
    })
    addRecentKeyword(trimmedKeyword)
    setSearchParams({ keyword: trimmedKeyword })

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }

  const handleClearRecentKeywords = () => {
    clearRecentKeywords()
    setShowRecentDropdown(false)
  }

  const handleBack = () => {
    navigate('/records')
  }

  const handleDetailClick = (diaryId: string) => {
    navigate(`/records/${diaryId}`)
  }

  const activeResultCount =
    activeTab === 'diary' ? searchedDiaries.length : searchedTagResults.length

  return (
    <main className="flex h-screen min-w-[900px] flex-col overflow-y-auto bg-(--color-bg-default) px-(--scale-40) pt-(--scale-40)">
      <DiarySearchBackButton onClick={handleBack} />

      <div className="mt-(--scale-48) flex min-h-0 flex-1 flex-col items-center">
        <div
          className="relative z-50 w-[580px]"
          onMouseDownCapture={(event) => {
            const target = event.target as HTMLElement

            if (target.closest('button')) {
              event.preventDefault()
            }
          }}
          onKeyDownCapture={(event) => {
            if (event.key === 'Enter' && event.nativeEvent.isComposing) {
              event.preventDefault()
              event.stopPropagation()
            }
          }}
        >
          <SearchInput
            value={searchKeyword}
            onChange={(event) =>
              setSearchInputState({
                baseKeyword: searchedKeyword,
                value: event.target.value,
              })
            }
            onFocus={() => {
              setIsSearchFocused(true)
              setShowRecentDropdown(true)
            }}
            onBlur={() => setIsSearchFocused(false)}
            onSearch={handleSearch}
            recentKeywords={recentKeywords}
            onRemoveKeyword={removeRecentKeyword}
            onClearAll={handleClearRecentKeywords}
            placeholder={isSearchFocused ? '' : '업무 내용 또는 키워드를 검색해 보세요'}
            aria-label="업무 일지 검색"
            className={[
              'w-full',
              '[&>div:nth-child(2)]:top-[calc(100%+12px)]',
              '[&>div:nth-child(2)]:left-1/2',
              '[&>div:nth-child(2)]:z-50',
              '[&>div:nth-child(2)]:w-[580px]',
              '[&>div:nth-child(2)]:-translate-x-1/2',
              !showRecentDropdown && '[&>div:nth-child(2)]:hidden',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </div>

        {isLoading ? (
          <DiarySearchSkeleton />
        ) : (
          <>
            <div className="mt-(--scale-48)">
              <DiarySearchHeader
                activeTab={activeTab}
                diaryCount={searchedDiaries.length}
                projectTagCount={searchedTagResults.length}
                onTabChange={setActiveTab}
              />
            </div>

            {activeResultCount === 0 ? (
              <DiarySearchEmptyState type={activeTab} />
            ) : activeTab === 'diary' ? (
              <DiarySearchList
                diaries={searchedDiaries}
                keyword={searchedKeyword}
                sort={sort}
                onSortChange={setSort}
                onDetailClick={handleDetailClick}
              />
            ) : (
              <TagSearchList
                results={searchedTagResults}
                keyword={searchedKeyword}
                onDetailClick={handleDetailClick}
              />
            )}
          </>
        )}
      </div>
    </main>
  )
}
