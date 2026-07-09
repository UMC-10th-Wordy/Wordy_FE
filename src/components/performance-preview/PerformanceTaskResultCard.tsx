import ProjectTag from '@/components/todo/ProjectTag'

import type { PerformanceTaskResult } from '@/types/performancePreviewResult'

import ErrorIcon from '@/assets/icons/error.svg?react'

interface PerformanceTaskResultCardProps {
  taskResult: PerformanceTaskResult
}

interface ResultSectionProps {
  title: 'OUTPUT' | 'IMPACT'
  content: string | string[]
  className?: string
}

export const PerformanceTaskResultCard = ({ taskResult }: PerformanceTaskResultCardProps) => {
  const outputItems = getResultItems(taskResult.output)
  const impactItems = getResultItems(taskResult.impact)

  const hasOutput = outputItems.length > 0
  const hasImpact = impactItems.length > 0
  const hasResultContent = hasOutput || hasImpact

  return (
    <article className="w-full rounded-(--scale-8) border-[0.5px] border-(--color-border-brand-subtle) bg-(--color-bg-default) px-(--scale-20) py-(--scale-12) shadow-[0_1px_5px_0_rgba(0,0,0,0.1)]">
      <div className="flex min-h-[34px] min-w-0 items-center gap-[9px]">
        {taskResult.tag && (
          <div className="shrink-0">
            <ProjectTag label={taskResult.tag.label} color={taskResult.tag.color} />
          </div>
        )}

        <h4 className="min-w-0 truncate [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-default)">
          {taskResult.title}
        </h4>
      </div>

      <div className="mt-(--scale-16)">
        {hasResultContent ? (
          <>
            {hasOutput && <ResultSection title="OUTPUT" content={outputItems} />}

            {hasImpact && (
              <ResultSection
                title="IMPACT"
                content={impactItems}
                className={hasOutput ? 'mt-(--scale-12)' : ''}
              />
            )}
          </>
        ) : (
          <div className="flex items-center gap-(--scale-4)">
            <span className="flex h-(--scale-24) w-(--scale-24) shrink-0 items-center justify-center">
              <ErrorIcon
                aria-hidden
                className="h-(--scale-24) w-(--scale-24) text-(--color-icon-brand)"
              />
            </span>

            <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-[var(--font-weight-medium)] text-(--color-text-tertiary)">
              내용이 충분하지 않아 성과를 정리하지 못했어요
            </p>
          </div>
        )}
      </div>
    </article>
  )
}

const ResultSection = ({ title, content, className = '' }: ResultSectionProps) => {
  const items = getResultItems(content)

  return (
    <section className={className}>
      <h5 className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-brand)">
        {title}
      </h5>

      <ul className="mt-(--scale-8) flex flex-col gap-(--scale-8)">
        {items.map((item) => (
          <li key={item} className="flex items-start">
            <span className="flex shrink-0 px-(--scale-8) py-[13px]">
              <span className="h-[3px] w-[3px] rounded-(--scale-1000) bg-(--color-icon-default)" />
            </span>

            <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-regular)] text-(--color-text-default)">
              {item}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

const getResultItems = (content?: string | string[]) => {
  if (!content) {
    return []
  }

  if (Array.isArray(content)) {
    return content.filter(Boolean)
  }

  return [content]
}
