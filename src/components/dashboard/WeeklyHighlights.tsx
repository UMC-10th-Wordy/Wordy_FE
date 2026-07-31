import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?react'

interface HighlightItem {
  text: string
  source: string
}

interface WeeklyHighlightsProps {
  items: HighlightItem[]
  title?: string
  description?: string
}

export const WeeklyHighlights = ({
  items,
  title = '이번 주 성과 요약',
  description = '프로젝트 태그가 없는 업무의 성과를 요약했어요',
}: WeeklyHighlightsProps) => {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-[#DDDDFF] bg-(--color-bg-default) p-7 shadow-[0px_1px_5px_0px_#0000001A]">
      <div className="flex flex-col gap-1">
        <h2 className="[font-size:var(--font-size-body-1)] leading-[1.6] font-semibold text-(--color-text-default)">
          {title}
        </h2>
        <p className="[font-size:var(--font-size-body-2)] leading-[1.6] font-normal text-(--color-text-tertiary)">
          {description}
        </p>
      </div>
      <ol className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={item.text} className="flex items-baseline gap-3">
            <span className="[font-size:var(--font-size-body-2)] leading-[1.6] font-normal text-(--color-text-brand)">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="[font-size:var(--font-size-body-2)] leading-[1.6] font-normal text-(--color-text-default)">
              {item.text}
            </span>
            {/* TODO: 클릭 시 해당 일지 이동 — 스키마에 일지 id 부재로 기능 보류 (백엔드 확인 중) */}
            <span className="flex shrink-0 items-center gap-0.5 [font-size:var(--font-size-body-4)] font-medium text-(--color-text-tertiary)">
              {item.source}
              <ArrowLeftIcon width={16} height={16} className="rotate-180" />
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
