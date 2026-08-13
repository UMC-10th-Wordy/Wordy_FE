import { Suspense, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useActiveWorkspaceId } from '@/hooks/useWorkspaceQueries'

import { SearchInput } from '@/components/common/SearchInput/SearchInput'
import { DiarySearchBackButton } from '@/components/diary-search/DiarySearchBackButton'
import { DiarySearchSkeleton } from '@/components/diary-search/DiarySearchSkeleton'
import { DiarySearchResults } from '@/components/diary-search/DiarySearchResults'
import { useRecentSearchKeywords } from '@/hooks/useRecentSearchKeywords'

interface SearchInputState {
  baseKeyword: string
  value: string
}

export const DiarySearchPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeWorkspaceId = useActiveWorkspaceId()

  const searchedKeyword = searchParams.get('keyword') ?? ''

  const [searchInputState, setSearchInputState] = useState<SearchInputState>({
    baseKeyword: searchedKeyword,
    value: searchedKeyword,
  })

  const [showRecentDropdown, setShowRecentDropdown] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const searchKeyword =
    searchInputState.baseKeyword === searchedKeyword ? searchInputState.value : searchedKeyword

  const { recentKeywords, addRecentKeyword, removeRecentKeyword, clearRecentKeywords } =
    useRecentSearchKeywords()

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

  return (
    <main className="flex h-full min-h-0 w-full min-w-0 flex-col bg-(--color-bg-default)">
      <div className="flex min-h-full w-full flex-col px-(--scale-40) pt-(--scale-40) pb-15">
        <DiarySearchBackButton onClick={handleBack} />

        <div className="mt-(--scale-48) flex min-h-0 flex-1 flex-col items-center">
          <div
            className="relative z-50 w-full max-w-145"
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
                '[&>div:nth-child(2)]:-translate-x-1/2',
                !showRecentDropdown && '[&>div:nth-child(2)]:hidden',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          </div>

          {searchedKeyword.trim().length > 0 &&
            (!activeWorkspaceId ? (
              <DiarySearchSkeleton />
            ) : (
              <Suspense fallback={<DiarySearchSkeleton />}>
                <DiarySearchResults
                  key={searchedKeyword}
                  keyword={searchedKeyword}
                  onDetailClick={handleDetailClick}
                />
              </Suspense>
            ))}
        </div>
      </div>
    </main>
  )
}
