import { DiarySummaryCard } from './DiarySummaryCard'

import type { DiarySummaryData } from '@/types/diaryList'

interface DiarySummarySectionProps {
  summary: DiarySummaryData
}

export const DiarySummarySection = ({ summary }: DiarySummarySectionProps) => {
  const mostUsedTagName = summary.mostUsedTagName.trim() || '-'

  return (
    <section className="mt-(--scale-48) flex w-full flex-col">
      <h2 className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-default)">
        나의 요약
      </h2>

      <div className="mt-(--scale-12) grid w-full grid-cols-1 gap-[var(--scale-20)] lg:grid-cols-3">
        <DiarySummaryCard
          variant="monthly"
          title="이번 달 작성 일지"
          value={summary.currentMonthCount}
          unit="개"
          currentMonthCount={summary.currentMonthCount}
          previousMonthCount={summary.previousMonthCount}
        />

        <DiarySummaryCard
          variant="streak"
          title="연속 작성"
          value={summary.currentStreakDays}
          unit="일 째"
          bestStreakDays={summary.bestStreakDays}
        />

        <DiarySummaryCard
          variant="tag"
          title="최다 기록 카테고리"
          value={mostUsedTagName}
          mostUsedTagRatio={summary.mostUsedTagRatio}
        />
      </div>
    </section>
  )
}
