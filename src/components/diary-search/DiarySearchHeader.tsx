import { DiarySearchResultTabs } from './DiarySearchResultTabs'

import type { DiarySearchTab } from '@/types/diarySearch'

interface DiarySearchHeaderProps {
  activeTab: DiarySearchTab
  diaryCount: number
  projectTagCount: number
  onTabChange: (tab: DiarySearchTab) => void
}

export const DiarySearchHeader = ({
  activeTab,
  diaryCount,
  projectTagCount,
  onTabChange,
}: DiarySearchHeaderProps) => {
  const isDiaryTab = activeTab === 'diary'
  const count = isDiaryTab ? diaryCount : projectTagCount

  return (
    <div className="flex w-[800px] items-center justify-between">
      <p className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-default)">
        총{' '}
        <span className="text-(--color-text-brand)">
          {count}
          {isDiaryTab ? '건' : '개'}
        </span>
        {isDiaryTab ? '의 업무 일지를 찾았어요' : '의 프로젝트 태그를 찾았어요'}
      </p>

      <DiarySearchResultTabs
        activeTab={activeTab}
        diaryCount={diaryCount}
        projectTagCount={projectTagCount}
        onChange={onTabChange}
      />
    </div>
  )
}
