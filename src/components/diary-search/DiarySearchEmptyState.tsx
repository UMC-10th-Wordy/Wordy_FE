import DiarySearchEmptyIllustration from '@/assets/icons/wordy-diary-search-empty.svg'

import type { DiarySearchTab } from '@/types/diarySearch'

interface DiarySearchEmptyStateProps {
  type: DiarySearchTab
}

export const DiarySearchEmptyState = ({ type }: DiarySearchEmptyStateProps) => {
  const description =
    type === 'diary' ? '관련된 업무 일지를 찾을 수 없어요' : '관련된 프로젝트 태그를 찾을 수 없어요'

  return (
    <section className="flex min-h-0 w-[800px] flex-1 items-center justify-center pb-[60px]">
      <div className="flex flex-col items-center gap-(--scale-12)">
        <img
          src={DiarySearchEmptyIllustration}
          alt=""
          aria-hidden
          className="h-[140px] w-[175px]"
        />

        <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-medium)] text-(--color-text-secondary)">
          {description}
        </p>
      </div>
    </section>
  )
}
