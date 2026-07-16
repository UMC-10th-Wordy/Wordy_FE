import { useState } from 'react'
import GenerateIcon from '@/assets/icons/generate.svg?react'
import ClipIcon from '@/assets/icons/clip.svg?react'
import ProjectTag from '@/components/todo/ProjectTag'
import type { ProjectTagColor } from '@/components/todo/ProjectTag'

export interface TagWorkflow {
  id: string
  name: string
  color: ProjectTagColor
  count: number
  purpose: string
  expectedResult: string
  taskCount: string
  period: string
  achievement: string
  kpis: {
    title: string
    description: string
    highlights: string[]
    files: string[]
  }[]
}

interface TagWorkflowSectionProps {
  tags: TagWorkflow[]
}

export const TagWorkflowSection = ({ tags }: TagWorkflowSectionProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = tags.find((t) => t.id === selectedId) ?? tags[0]

  if (!selected) return null

  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-(--color-border-subtle) bg-(--color-bg-default) p-7">
      <div className="flex flex-col gap-1">
        <h2 className="[font-size:var(--font-size-body-2)] font-bold text-(--color-text-default)">
          태그별 업무 흐름 추적
        </h2>
        <p className="[font-size:var(--font-size-body-4)] text-(--color-text-tertiary)">
          프로젝트 태그별로 한 주 간 어떤 결과가 있었는지 정리했어요
        </p>
      </div>

      {/* 태그 칩 */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = tag.id === selected.id
          return (
            <button
              key={tag.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedId(tag.id)}
              className={[
                'rounded-full px-4 py-2 [font-size:var(--font-size-body-4)] transition-colors',
                active
                  ? 'bg-(--primitive-primary-300) font-semibold text-(--color-text-brand)'
                  : 'border border-(--color-border-subtle) bg-(--color-bg-default) text-(--color-text-secondary)',
              ].join(' ')}
            >
              {tag.name} ({tag.count})
            </button>
          )
        })}
      </div>

      {/* 오버뷰 */}
      <div className="flex flex-col gap-5 rounded-xl border border-(--color-border-subtle) p-6">
        <span className="[font-size:var(--font-size-body-4)] font-semibold text-(--color-text-brand)">
          프로젝트 태그 오버뷰
        </span>
        <div className="self-start">
          <ProjectTag label={selected.name} color={selected.color} />
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-5">
          <div>
            <p className="mb-1 [font-size:var(--font-size-body-4)] text-(--color-text-tertiary)">
              목적
            </p>
            <p className="[font-size:var(--font-size-body-3)] text-(--color-text-default)">
              {selected.purpose}
            </p>
          </div>
          <div>
            <p className="mb-1 [font-size:var(--font-size-body-4)] text-(--color-text-tertiary)">
              기대 성과
            </p>
            <p className="[font-size:var(--font-size-body-3)] text-(--color-text-default)">
              {selected.expectedResult}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-10">
          <div>
            <p className="mb-1 [font-size:var(--font-size-body-4)] text-(--color-text-tertiary)">
              관련 업무 수
            </p>
            <p className="[font-size:var(--font-size-body-3)] text-(--color-text-default)">
              {selected.taskCount}
            </p>
          </div>
          <div>
            <p className="mb-1 [font-size:var(--font-size-body-4)] text-(--color-text-tertiary)">
              기록 기간
            </p>
            <p className="[font-size:var(--font-size-body-3)] text-(--color-text-default)">
              {selected.period}
            </p>
          </div>
          <div>
            <p className="mb-1 [font-size:var(--font-size-body-4)] text-(--color-text-tertiary)">
              달성 현황
            </p>
            <p className="[font-size:var(--font-size-body-3)] text-(--color-text-default)">
              {selected.achievement}
            </p>
          </div>
        </div>
      </div>

      {/* 핵심 지표 */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="[font-size:var(--font-size-body-4)] font-semibold text-(--color-text-brand)">
            핵심 지표 진행 현황
          </p>
          <p className="[font-size:var(--font-size-caption-1)] text-(--color-text-tertiary)">
            업무 기록을 바탕으로 설정한 평가 지표와 연결되어 도출돼요
          </p>
        </div>

        {selected.kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="flex flex-col gap-3 rounded-xl bg-(--color-bg-secondary) p-6"
          >
            <div>
              <p className="[font-size:var(--font-size-body-3)] font-bold text-(--color-text-default)">
                {kpi.title}
              </p>
              <p className="[font-size:var(--font-size-body-4)] text-(--color-text-tertiary)">
                {kpi.description}
              </p>
            </div>
            {kpi.highlights.map((line) => (
              <p
                key={line}
                className="flex items-start gap-2 [font-size:var(--font-size-body-4)] text-(--color-text-default)"
              >
                <GenerateIcon
                  width={16}
                  height={16}
                  className="mt-0.5 shrink-0 text-(--color-button-default)"
                />
                {line}
              </p>
            ))}
            {kpi.files.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="[font-size:var(--font-size-caption-1)] text-(--color-text-tertiary)">
                  관련 산출물·원문
                </p>
                <div className="flex flex-wrap gap-3">
                  {kpi.files.map((file) => (
                    <span
                      key={file}
                      className="flex items-center gap-1.5 rounded-lg border border-(--color-border-subtle) bg-(--color-bg-default) px-3 py-2 [font-size:var(--font-size-caption-1)] text-(--color-text-secondary)"
                    >
                      <ClipIcon width={14} height={14} />
                      {file}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
