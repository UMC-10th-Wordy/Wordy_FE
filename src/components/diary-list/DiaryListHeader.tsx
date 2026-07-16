import { useState } from 'react'

import MagnifierIcon from '@/assets/icons/magnifier.svg?react'

export const DiaryListHeader = () => {
  const [searchKeyword, setSearchKeyword] = useState('')

  return (
    <header className="flex w-full items-start justify-between">
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

      {/* TODO(#29): 검색창 공용 컴포넌트 확정 후 현재 임시 UI 교체 */}
      <div className="flex h-14 w-[600px] shrink-0 items-center gap-3 rounded-xl border border-(--color-border-default) bg-(--color-bg-default) px-5">
        <MagnifierIcon aria-hidden className="size-6 shrink-0 text-(--color-text-default)" />
        <input
          type="search"
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          placeholder="업무 내용 또는 키워드를 검색해 보세요"
          className="w-full bg-transparent [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-regular)] text-(--color-text-tertiary) outline-none placeholder:text-(--color-text-tertiary)"
        />
      </div>
    </header>
  )
}
