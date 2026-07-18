import type { DiarySearchTab } from '@/types/diarySearch'

interface DiarySearchResultTabsProps {
  activeTab: DiarySearchTab
  diaryCount: number
  projectTagCount: number
  onChange: (tab: DiarySearchTab) => void
}

interface SearchResultTabButtonProps {
  selected: boolean
  label: string
  count: number
  countUnit: '건' | '개'
  onClick: () => void
}

const SearchResultTabButton = ({
  selected,
  label,
  count,
  countUnit,
  onClick,
}: SearchResultTabButtonProps) => {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={[
        'flex h-[42px] items-center gap-[6px] rounded-(--scale-8) px-(--scale-12) py-(--scale-8)',
        'transition-colors duration-100',
        selected ? 'bg-(--color-bg-default) shadow-[0_1px_5px_rgba(0,0,0,0.1)]' : 'bg-transparent',
      ].join(' ')}
    >
      <span
        className={[
          '[font-size:var(--font-size-body-3)] leading-(--line-height-body)',
          'font-[var(--font-weight-medium)]',
          selected ? 'text-(--color-text-default)' : 'text-(--color-text-tertiary)',
        ].join(' ')}
      >
        {label}
      </span>

      <span
        className={[
          '[font-size:var(--font-size-caption-1)] leading-(--line-height-body)',
          'font-[var(--font-weight-semibold)]',
          selected ? 'text-(--color-text-brand)' : 'text-(--color-text-brand-subtle)',
        ].join(' ')}
      >
        {count}
        {countUnit}
      </span>
    </button>
  )
}

export const DiarySearchResultTabs = ({
  activeTab,
  diaryCount,
  projectTagCount,
  onChange,
}: DiarySearchResultTabsProps) => {
  return (
    <div
      role="tablist"
      aria-label="검색 결과 종류"
      className="flex h-[50px] w-fit items-center rounded-(--scale-8) bg-(--color-bg-brand-light) p-(--scale-4)"
    >
      <SearchResultTabButton
        selected={activeTab === 'diary'}
        label="업무 일지"
        count={diaryCount}
        countUnit="건"
        onClick={() => onChange('diary')}
      />

      <SearchResultTabButton
        selected={activeTab === 'projectTag'}
        label="프로젝트 태그"
        count={projectTagCount}
        countUnit="개"
        onClick={() => onChange('projectTag')}
      />
    </div>
  )
}
