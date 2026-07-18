import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SearchInput } from '@/components/common/SearchInput/SearchInput'
import { useRecentSearchKeywords } from '@/hooks/useRecentSearchKeywords'

export const DiaryListHeader = () => {
  const navigate = useNavigate()

  const [searchKeyword, setSearchKeyword] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const { recentKeywords, addRecentKeyword, removeRecentKeyword, clearRecentKeywords } =
    useRecentSearchKeywords()

  const handleSearch = (keyword: string) => {
    const trimmedKeyword = keyword.trim()

    if (!trimmedKeyword) {
      return
    }

    addRecentKeyword(trimmedKeyword)

    navigate(`/records/search?keyword=${encodeURIComponent(trimmedKeyword)}`)
  }

  return (
    <header className="relative z-50 flex w-full items-start justify-between">
      <div className="flex shrink-0 flex-col">
        <h1 className="[font-size:var(--font-size-heading-4)] leading-(--line-height-body) font-[var(--font-weight-bold)] text-(--color-text-default)">
          업무 일지 모아보기
        </h1>
        <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-regular)] text-(--color-text-tertiary)">
          지금까지 작성한 업무 일지를
          <br className="xl:hidden" />
          <span className="xl:ml-1">확인해 보세요</span>
        </p>
      </div>

      <div
        className="w-[580px] shrink-0"
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
          onChange={(event) => setSearchKeyword(event.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          onSearch={handleSearch}
          recentKeywords={recentKeywords}
          onRemoveKeyword={removeRecentKeyword}
          onClearAll={clearRecentKeywords}
          placeholder={isSearchFocused ? '' : '업무 내용 또는 키워드를 검색해 보세요'}
          aria-label="업무 일지 검색"
          className="w-full [&>div:nth-child(2)]:top-[calc(100%+12px)] [&>div:nth-child(2)]:left-1/2 [&>div:nth-child(2)]:z-50 [&>div:nth-child(2)]:w-[580px] [&>div:nth-child(2)]:-translate-x-1/2"
        />
      </div>
    </header>
  )
}
