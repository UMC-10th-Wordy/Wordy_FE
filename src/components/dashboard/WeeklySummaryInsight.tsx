import GenerateIcon from '@/assets/icons/generate.svg?react'

interface StatItem {
  label: string
  value: string
  unit: string
}

interface WeeklySummaryInsightProps {
  stats: StatItem[]
  aiSummary: string
}

export const WeeklySummaryInsight = ({ stats, aiSummary }: WeeklySummaryInsightProps) => {
  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-(--color-border-subtle) bg-(--color-bg-default) p-7">
      <h2 className="[font-size:var(--font-size-body-2)] font-bold text-(--color-text-default)">
        주간 요약 인사이트
      </h2>

      {/* 스탯 카드: width Fill (UI 업데이트 #1 반영) */}
      <div className="flex gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-1 flex-col items-center gap-2 rounded-xl bg-(--color-bg-secondary) py-6"
          >
            <span className="[font-size:var(--font-size-body-4)] text-(--color-text-secondary)">
              {stat.label}
            </span>
            <p className="text-(--color-text-default)">
              <span className="[font-size:var(--font-size-heading-3)] font-bold">{stat.value}</span>
              <span className="[font-size:var(--font-size-body-4)] text-(--color-text-tertiary)">
                {' '}
                {stat.unit}
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <span className="[font-size:var(--font-size-body-4)] font-medium text-(--color-text-secondary)">
          워디 AI 요약
        </span>
        {/* B1 RG (UI 업데이트 5.3.1 반영) */}
        <p className="flex items-start gap-2 [font-size:var(--font-size-body-1)] font-normal leading-(--line-height-body) text-(--color-text-default)">
          <GenerateIcon
            width={20}
            height={20}
            className="mt-1.5 shrink-0 text-(--color-button-default)"
          />
          {aiSummary}
        </p>
      </div>
    </section>
  )
}
