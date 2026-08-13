import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?react'
import { useNavigate } from 'react-router-dom'

interface HighlightItem {
  text: string
  source: string
  dailyEntryId?: string
}

interface WeeklyHighlightsProps {
  items: HighlightItem[]
  title?: string
  description?: string
}

export const WeeklyHighlights = ({
  items,
  title = '기타 업무 성과',
  description = '프로젝트 태그가 없는 업무의 성과를 요약했어요',
}: WeeklyHighlightsProps) => {
  const navigate = useNavigate()
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-(--color-border-brand-subtle) bg-(--color-bg-default) p-7 shadow-[0px_1px_5px_0px_#0000001A]">
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
            <span className="shrink-0 [font-size:var(--font-size-body-2)] leading-[1.6] font-normal text-(--color-text-brand)">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0 break-words [font-size:var(--font-size-body-2)] leading-[1.6] font-normal text-(--color-text-default)">
              {item.text}
              {item.dailyEntryId ? (
                <button
                  type="button"
                  onClick={() => navigate(`/records/${item.dailyEntryId}`)}
                  className="ml-2 inline-flex h-8 items-center gap-1 rounded-md px-2 align-middle [font-size:var(--font-size-body-4)] leading-[1.6] font-medium text-(--color-text-tertiary)"
                >
                  {item.source}
                  <ArrowLeftIcon aria-hidden="true" width={20} height={20} className="rotate-180" />
                </button>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
