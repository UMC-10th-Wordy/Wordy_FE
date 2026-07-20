import GenerateIcon from '@/assets/icons/generate.svg?react'
import ProjectTag from '@/components/todo/ProjectTag'
import type { ProjectTagColor } from '@/components/todo/ProjectTag'

interface StatItem {
  label: string
  value: string
  unit: string
}

interface FocusArea {
  label: string
  color: ProjectTagColor
}

interface WeeklySummaryInsightProps {
  title?: string
  stats: StatItem[]
  aiSummary: string
  monthlyHighlight?: string
  focusAreas?: FocusArea[]
}

export const WeeklySummaryInsight = ({
  title = '주간 요약 인사이트',
  stats,
  aiSummary,
  monthlyHighlight,
  focusAreas,
}: WeeklySummaryInsightProps) => {
  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-(--color-border-subtle) bg-(--color-bg-default) p-7">
      <h2 className="[font-size:var(--font-size-body-2)] font-bold text-(--color-text-default)">
        {title}
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
              <span className="[font-size:var(--font-size-heading-3)] font-bold tabular-nums">
                {stat.value}
              </span>
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
        {/* B1 RG (UI 업데이트 #18, #19 반영) */}
        <p className="flex items-start gap-2 [font-size:var(--font-size-body-1)] font-normal leading-(--line-height-body) text-(--color-text-default)">
          <GenerateIcon
            width={20}
            height={20}
            className="mt-1.5 shrink-0 text-(--color-button-default)"
          />
          {aiSummary}
        </p>
      </div>

      {(monthlyHighlight || focusAreas) && (
        <div className="grid grid-cols-2 gap-x-10">
          {monthlyHighlight && (
            <div className="flex flex-col gap-2">
              <span className="[font-size:var(--font-size-body-4)] text-(--color-text-secondary)">
                이번 달 주요 성과
              </span>
              <p className="[font-size:var(--font-size-body-1)] font-normal leading-(--line-height-body) text-(--color-text-default)">
                {monthlyHighlight}
              </p>
            </div>
          )}
          {focusAreas && focusAreas.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="[font-size:var(--font-size-body-4)] text-(--color-text-secondary)">
                가장 집중한 영역
              </span>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((area) => (
                  <ProjectTag key={area.label} label={area.label} color={area.color} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
