import { useState } from 'react'
import GenerateIcon from '@/assets/icons/generate.svg?react'
import ClipIcon from '@/assets/icons/clip.svg?react'
import type { ProjectTagColor } from '@/components/todo/ProjectTag'

const OVERVIEW_TAG_CLASS: Record<ProjectTagColor, string> = {
  black: 'bg-(--color-tag-black-bg) text-(--color-tag-black-text)',
  red: 'bg-(--color-tag-red-bg) text-(--color-tag-red-text)',
  orange: 'bg-(--color-tag-orange-bg) text-(--color-tag-orange-text)',
  yellow: 'bg-(--color-tag-yellow-bg) text-(--color-tag-yellow-text)',
  green: 'bg-(--color-tag-green-bg) text-(--color-tag-green-text)',
  blue: 'bg-(--color-tag-blue-bg) text-(--color-tag-blue-text)',
  navy: 'bg-(--color-tag-navy-bg) text-(--color-tag-navy-text)',
  pink: 'bg-(--color-tag-pink-bg) text-(--color-tag-pink-text)',
  brown: 'bg-(--color-tag-brown-bg) text-(--color-tag-brown-text)',
}

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
  period?: 'weekly' | 'monthly'
}

export const TagWorkflowSection = ({ tags, period = 'weekly' }: TagWorkflowSectionProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = tags.find((t) => t.id === selectedId) ?? tags[0]

  if (!selected) return null

  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-[#DDDDFF] bg-(--color-bg-default) p-7 shadow-[0px_1px_5px_0px_#0000001A]">
      <div className="flex flex-col gap-1">
        <h2 className="[font-size:var(--font-size-body-1)] leading-[1.6] font-semibold text-(--color-text-default)">
          태그별 업무 흐름 추적
        </h2>
        <p className="[font-size:var(--font-size-body-2)] leading-[1.6] font-normal text-(--color-text-tertiary)">
          프로젝트 태그별로 {period === 'monthly' ? '한 달' : '한 주'} 간 어떤 결과가 있었는지
          정리했어요
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
                'flex h-[45px] items-center gap-1 rounded-full whitespace-nowrap border px-4 py-2 [font-size:var(--font-size-body-4)] transition-colors duration-100 ease-out',
                active
                  ? 'border-[#5D5DF1] bg-[#DDDDFF] font-semibold text-(--color-text-brand)'
                  : 'border-(--color-border-subtle) bg-[#FAFAFA] text-(--color-text-secondary)',
              ].join(' ')}
            >
              {tag.name} ({tag.count})
            </button>
          )
        })}
      </div>

      {/* 오버뷰 */}
      <div className="flex flex-col gap-10 rounded-lg border border-(--color-border-subtle) p-5">
        <div className="flex flex-col gap-5">
          <span className="[font-size:var(--font-size-body-4)] text-(--color-text-secondary)">
            프로젝트 태그 오버뷰
          </span>
          <div className="self-start">
            <div
              className={`inline-flex h-[46px] items-center rounded-lg px-3 py-1 ${OVERVIEW_TAG_CLASS[selected.color]}`}
            >
              <span className="[font-size:var(--font-size-heading-4)] leading-[1.6] font-bold whitespace-nowrap">{`${selected.name}(${selected.count})`}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
            <div>
              <p className="mb-1 [font-size:var(--font-size-body-2)] leading-[1.6] font-semibold text-(--color-text-tertiary)">
                목적
              </p>
              <p className="min-w-0 [overflow-wrap:anywhere] [font-size:var(--font-size-body-3)] text-(--color-text-default)">
                {selected.purpose}
              </p>
            </div>
            <div>
              <p className="mb-1 [font-size:var(--font-size-body-2)] leading-[1.6] font-semibold text-(--color-text-tertiary)">
                기대 성과
              </p>
              <p className="min-w-0 [overflow-wrap:anywhere] [font-size:var(--font-size-body-3)] text-(--color-text-default)">
                {selected.expectedResult}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-3">
            <div>
              <p className="mb-1 [font-size:var(--font-size-body-2)] leading-[1.6] font-semibold text-(--color-text-tertiary)">
                관련 업무 수
              </p>
              <p className="min-w-0 [overflow-wrap:anywhere] [font-size:var(--font-size-body-3)] text-(--color-text-default)">
                {selected.taskCount}
              </p>
            </div>
            <div>
              <p className="mb-1 [font-size:var(--font-size-body-2)] leading-[1.6] font-semibold text-(--color-text-tertiary)">
                기록 기간
              </p>
              <p className="min-w-0 [overflow-wrap:anywhere] [font-size:var(--font-size-body-3)] text-(--color-text-default)">
                {selected.period}
              </p>
            </div>
            <div>
              <p className="mb-1 [font-size:var(--font-size-body-2)] leading-[1.6] font-semibold text-(--color-text-tertiary)">
                달성 현황
              </p>
              <p className="min-w-0 [overflow-wrap:anywhere] [font-size:var(--font-size-body-3)] text-(--color-text-default)">
                {selected.achievement}
              </p>
            </div>
          </div>
        </div>

        {/* 핵심 지표 */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="[font-size:var(--font-size-body-1)] leading-[1.6] font-semibold text-(--color-text-brand)">
              핵심 지표 진행 현황
            </p>
            <p className="[font-size:var(--font-size-body-2)] leading-[1.6] font-normal text-(--color-text-tertiary)">
              업무 기록을 바탕으로 설정한 평가 지표와 연결되어 도출돼요
            </p>
          </div>

          {selected.kpis.map((kpi) => (
            <div
              key={kpi.title}
              className="flex flex-col gap-3 rounded-xl bg-(--color-bg-secondary) p-6"
            >
              <div>
                <p className="[font-size:var(--font-size-body-1)] leading-[1.6] font-semibold text-(--color-text-default)">
                  {kpi.title}
                </p>
                <p className="[font-size:var(--font-size-body-2)] leading-[1.6] font-normal text-(--color-text-tertiary)">
                  {kpi.description}
                </p>
              </div>
              {kpi.highlights.map((line) => (
                <p
                  key={line}
                  className="flex min-w-0 items-start gap-2 [overflow-wrap:anywhere] [font-size:var(--font-size-body-4)] text-(--color-text-default)"
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
                  <div className="min-w-0 [overflow-wrap:anywhere] flex flex-wrap gap-3">
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
      </div>
    </section>
  )
}
