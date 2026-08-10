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
          <li key={item.text} className="flex flex-wrap items-baseline gap-3">
            <span className="[font-size:var(--font-size-body-2)] leading-[1.6] font-normal text-(--color-text-brand)">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0 break-words [font-size:var(--font-size-body-2)] leading-[1.6] font-normal text-(--color-text-default)">
              {item.text}
            </span>
            {item.dailyEntryId ? (
              <button
                type="button"
                onClick={() => item.dailyEntryId && navigate(`/records/${item.dailyEntryId}`)}
                className="flex h-8 shrink-0 items-center gap-1 rounded-md px-2 [font-size:var(--font-size-body-4)] leading-[1.6] font-medium text-(--color-text-tertiary)"
              >
                {item.source}
                <ArrowLeftIcon aria-hidden="true" width={20} height={20} className="rotate-180" />
              </button>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  )
}
