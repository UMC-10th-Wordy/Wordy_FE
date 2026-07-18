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
        {/* TODO(#71): 검색 결과 빈 상태 일러스트 전달 후 에셋으로 교체 */}
        <div aria-hidden className="h-[129px] w-[253px]" />

        <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-medium)] text-(--color-text-secondary)">
          {description}
        </p>
      </div>
    </section>
  )
}
